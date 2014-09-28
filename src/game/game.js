define(['util', 'colors', 'suzhi', 'goody'], 
	function(util, colors, Suzhi, Goody){

	var canvas,
		ctx,
		width,
		height,
		frames = 0,
		suzhi,
		goody,
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
			goody = new Goody('smiley', util.randomPoint(canvas, 100));
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
			var suzhiPos;

			frames+=1;

			suzhi.update();
			suzhiPos = suzhi.position();
			if(suzhiPos.bottom >= canvas.height){
				suzhi.stop();
			}
			if(suzhiPos.top <= 0){
				suzhi.yVelocity = -suzhi.yVelocity;
			}
			if(suzhiPos.left <= 0 || suzhiPos.right >= canvas.width){
				suzhi.xVelocity = -suzhi.xVelocity;
			}
		},

		render : function(){
			this.clearCanvas();
			ctx.fillStyle = colors.bg;
			ctx.fillRect(0,0,width,height);
			suzhi.draw(ctx);
			goody.draw(ctx);
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