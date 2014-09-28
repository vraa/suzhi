define(['util', 'colors', 'suzhi'], function(util, colors, Suzhi){

	var canvas,
		ctx,
		width,
		height,
		frames = 0,
		suzhi,
		barks = [],
		env;

	return {

		init : function(options){
			env = options.env;
			this.setupCanvas();
			this.initObjects();
			this.run();
		},

		initObjects : function(){
			suzhi = new Suzhi({env:env, canvas: canvas});
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
			var suziAt;

			frames+=1;

			suzhi.update();
			suziAt = suzhi.position();
			if(suziAt.bottom >= canvas.height){
				suzhi.stop();
			}
			if(suziAt.top <= 0){
				suzhi.yVelocity = -suzhi.yVelocity;
			}
			if(suziAt.left <= 0 || suziAt.right >= canvas.width){
				suzhi.xVelocity = -suzhi.xVelocity;
			}
		},

		render : function(){
			this.clearCanvas();
			ctx.fillStyle = colors.bg;
			ctx.fillRect(0,0,width,height);
			suzhi.draw(ctx);
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
		},

		handleClickStart : function(evt){
			suzhi.jump(util.getMouseAt(evt, canvas));	
		}

	};

});