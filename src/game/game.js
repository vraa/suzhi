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
		game;

	return {

		init : function(options){
			env = options.env;
			this.setupCanvas();
			this.initObjects();
			this.run();
			game = this;
		},

		initObjects : function(){
			suzhi = new Suzhi({env:env, canvas: canvas});
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
				if(thingies.length < 6){
					var allThingieNames = util.getAllGoodies();
					gc = allThingieNames.length;
					for(i=0; i<gc; i++){
						thingies.push(new Thingy({
									type : allThingieNames[i],
									position :  util.randomPointInBox(20, cH/2, cW, cH),
									canvas : canvas
								}
							));
					}
				}
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
							canvas : canvas
						}
					));
			}
			suzhi.update();

			for(i=0, gCount = thingies.length; i < gCount; i++){
				thingy = thingies[i];
				if(thingy.isCaptured){
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
			}
			if(currentState === states.game){
				this.renderGameWorld(ctx);
			}
			if(currentState === states.over){
				this.renderGameWorld(ctx);
				this.drawGameOver(ctx);
			}
			
			this.drawThornBed(ctx);
		},

		drawIntro : function(ctx){
			var i, gCount = thingies.length;
			ctx.save();
			ctx.fillStyle = colors.title;
			ctx.font = '30pt Audiowide';
			ctx.textAlign = 'center';
			ctx.fillText('suzhi', cW/2, 100);
			suzhi.y = 150;
			suzhi.draw(ctx);
			for(i=0; i < gCount; i++){
				thingies[i].draw(ctx);
			}
			ctx.restore();

		},

		drawGameOver : function(ctx){
			ctx.save();
			ctx.fillStyle = colors.title;
			ctx.font = '30pt Audiowide';
			ctx.textAlign = 'center';
			ctx.fillText('GAME OVER', cW/2, cH/2);
			ctx.restore();
		},

		renderGameWorld : function(ctx){
			var i, gCount = thingies.length;
			suzhi.draw(ctx);
			for(i=0; i < gCount; i++){
				thingies[i].draw(ctx);
			}
		},


		drawThornBed : function(ctx){
			var turtle = 0;
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = colors.baddie;
			while(turtle <= cW){
				ctx.moveTo(turtle, cH);
				ctx.lineTo(turtle + thornWidth, cH - thornHeight);
				ctx.lineTo(turtle + (2 * thornWidth), cH);

				turtle += (2 * thornWidth);
			}
			ctx.fill();
			ctx.closePath();
			ctx.restore();
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
				width = 320;
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
			if(currentState === states.intro || currentState === states.over){
				game.initObjects();
				currentState = states.game;
			}else if(currentState === states.game){
				suzhi.jump(util.getMouseAt(evt, canvas));		
			}
		}

	};

});