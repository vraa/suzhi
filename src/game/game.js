define(['util', 'colors', 'suzhi', 'thingy'], 
	function(util, colors, Suzhi, Thingy){

	var canvas,
		ctx,
		width,
		height,
		frames = 0,
		suzhi,
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
			thingies = [];
			/*
			for(var i=1; i<=5; i++){
				thingies.push(new Thingy({
							type : util.randomGoody(),
							position :  util.randomPoint(canvas,20),
							canvas : canvas
						}
					));
			}*/
		},

		run : function(){
			var game = this,
				loop = function(){
					game.update();
					game.render();
					window.requestAnimationFrame(loop);
				}
			window.requestAnimationFrame(loop);
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

		updateGameWorld : function(){
			if(frames % 200 == 0){
				thingies.push(new Thingy({
							type : util.randomGoody(),
							position :  util.randomPoint(canvas,20),
							canvas : canvas,
							sprite : sprite
						}
					));
			}
			suzhi.update();

			for(i=0, gCount = thingies.length; i < gCount; i++){
				thingy = thingies[i];
				if(thingy.isDead){
					thingies.splice(i,1);
					gCount--;
				}else{
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
				play = util.sprites.playBtn,
				tap = util.sprites.tapHelp;
			util.drawSprite(ctx, sprite, title, (cW/2 - title[2]/2), 50);
			util.drawSprite(ctx, sprite, tap, cW/2-tap[2]/2, 130);
			util.drawSprite(ctx, sprite, play, cW/2 - play[2]/2 , 290);
			util.drawSprite(ctx, sprite, ready, (cW/2 - ready[2]/2), 350);
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
			width = env.viewport.width;
			height = env.viewport.height;
			
			if(width >= 500){
				width = 500;
				height = 480;
			}
			canvas.width = width;
			canvas.height = height;
			canvas.addEventListener(evt, this.handleClickStart);

			ctx = canvas.getContext('2d');
			document.body.appendChild(canvas);
			cH = canvas.height;
			cW = canvas.width;
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