define(['util', 'colors', 'suzhi', 'thingy', 'hud'], 
	function(util, colors, Suzhi, Thingy, Hud){

	var canvas,
		ctx,
		width,
		height,
		frames = 0,
		suzhi,
		hud,
		thingies = [],
		thornHeight = 20,
		thornWidth = 10,
		cH = 0,
		cW = 0,
		env,
		states = {
			intro : 1,
			game : 2,
			over : 3
		},
		currentState = states.intro,
		sprite,
		game, 
		okayBtn;

	return {

		init : function(options){
			env = options.env;
			sprite = options.sprite;
			this.setupCanvas();
			this.setupHandlers();
			this.initObjects();
			this.run();
			okayBtn = {
				x : cW/2 - util.sprites.okayBtn[2]/2,
				y : cH/2 + 50,
				w : util.sprites.okayBtn[2],
				h : util.sprites.okayBtn[3]
			}
			game = this;
		},

		initObjects : function(){
			suzhi = new Suzhi({env:env, canvas: canvas, sprite: sprite});
			hud = new Hud({canvas: canvas, sprite: sprite});
			thingies = [];
		},

		start : function(){
			this.initObjects();
			currentState = states.game;
			frames = 0;
		},

		run : function(){
			var game = this,
				loop = function(){
					game.update();
					game.render();
					window.requestAnimFrame(loop);
				}
			window.requestAnimFrame(loop);
		},

		update : function(){
			var i, gCount, thingy;
			frames+=1;

			if(currentState === states.intro){
			}
			if(currentState === states.game){
				if(suzhi.isDead){
					currentState = states.over;
				}else{
					this.updateGameWorld();	
				}
			}
			if(currentState === states.over){
			}
			
		},

		makeThingy : function(type){
			return new Thingy({
							type : type,
							position :  util.randomPoint(canvas,20),
							canvas : canvas,
							sprite : sprite
						}
					);
		},

		updateGameWorld : function(){
			if(frames % 200 == 0){
				thingies.push(this.makeThingy(util.randomGoody()));
			}
			if(frames % 750 == 0){
				thingies.push(this.makeThingy(util.randomAddon()));
			}
			suzhi.update();
			hud.update({
				score : suzhi.score,
				health : suzhi.health,
				ammo : suzhi.ammo
			});

			for(i=0, gCount = thingies.length; i < gCount; i++){
				thingy = thingies[i];
				if(thingy.isDead){
					thingies.splice(i,1);
					gCount--;
				}else{
					if(thingy.role === 'baddie' &&  !thingy.isZombie && suzhi.isBolted(thingy)){
						thingy.dropDead();
					}
					thingies[i].update(frames, suzhi);
				}
			}
		},

		render : function(){
			
			this.clearCanvas();
			ctx.fillStyle = colors.bg;
			ctx.fillRect(0,0,width,height);

			if(currentState === states.intro){
				this.drawIntro(ctx);
				//util.spriteTest(ctx, sprite);
			}
			if(currentState === states.game){
				this.renderGameWorld(ctx);
			}
			if(currentState === states.over){
				this.renderGameWorld(ctx);
				this.drawGameOver(ctx);
			}
			
			this.drawFireBed(ctx);
		},

		drawIntro : function(ctx){
			var title = util.sprites.suzhiTitle,
				ready = util.sprites.getReady,
				play = util.sprites.playBtn;
			util.drawSprite(ctx, sprite, title, (cW/2 - title[2]/2), 50);
			util.drawSprite(ctx, sprite, play, cW/2 - play[2]/2 , 380);
			util.drawSprite(ctx, sprite, ready, (cW/2 - ready[2]/2), 430);
		},

		drawGameOver : function(ctx){
			var go = util.sprites.gameOver,
				ok = util.sprites.okayBtn,
				sc = util.sprites.score;
			util.drawSprite(ctx, sprite, go, cW/2 - go[2]/2, 100);
			util.drawSprite(ctx, sprite, sc, cW/2 - sc[2]/2, 150);
			ctx.font = '30pt Audiowide';
			ctx.fillStyle = colors.suzhi;
			ctx.textAlign = 'center';
			ctx.fillText(suzhi.score, cW/2, 230);
			util.drawSprite(ctx, sprite, ok, okayBtn.x, okayBtn.y);
		},

		renderGameWorld : function(ctx){
			var i, gCount = thingies.length;
			suzhi.draw(ctx);
			for(i=0; i < gCount; i++){
				thingies[i].draw(ctx);
			}
			hud.draw(ctx);
		},


		drawFireBed : function(ctx){
			var fire = '',
				fH = 35,
				fW = 18,
				tx = 0,
				ty = cH-fH,
				frm = frames;

			while(tx <= cW){
				fire = util.sprites.fire[frm % 16];
				frm++;
				util.drawSprite(ctx, sprite, fire, tx, ty);
				tx += (2*fW);
			}
		},

		clearCanvas : function(){
			ctx.save();

			// Use the identity matrix while clearing the canvas
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();

			// Restore the transform
			ctx.restore();
		},

		setupCanvas : function(){
			var evt = env.canTouch ? 'touchstart' : 'mousedown';
			canvas = document.createElement('canvas');

			ctx = canvas.getContext &&  canvas.getContext('2d');
			width = env.viewport.width;
			height = env.viewport.height;
			
			if(width >= 500){
				width = 600;
				height = 600;
			}
			canvas.width = width;
			canvas.height = height;
			//canvas.addEventListener(evt, this.handleClickStart);

			
			document.getElementById('game').appendChild(canvas);
			cH = canvas.height;
			cW = canvas.width;
		},

		setupHandlers : function(){
			window.addEventListener('keydown', function(evt){
				if(util.isAGameKey(evt.keyCode)){
					evt.stopImmediatePropagation();
					evt.preventDefault();
					game.handleKey(evt.keyCode);
				}
			});
		},

		handleKey : function(keyCode){
			if(currentState === states.intro){
				game.start();
			}else if(currentState === states.game){
				suzhi.actOn(keyCode);
			}else if(currentState === states.over){
				if(keyCode === util.keys.ENTER){
					game.start();	
				}
			}
		},

		handleClickStart : function(evt){
			if(currentState === states.intro){
				game.initObjects();
				currentState = states.game;
			}else if(currentState === states.game){
				suzhi.jump(util.getMouseAt(evt, canvas));		
			}else if(currentState === states.over){
				var m = util.getMouseAt(evt, canvas),
					ok = {
						x1 : okayBtn.x,
						x2 : okayBtn.x + okayBtn.w,
						y1 : okayBtn.y,
						y2 : okayBtn.y + okayBtn.h
					};
				if(util.isPointInsideBox(ok,m)){
					game.initObjects();
					currentState = states.game;
				}
			}
		}

	};

});