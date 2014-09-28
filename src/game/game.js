define(['util', 'colors', 'suzhi', 'goody'], 
	function(util, colors, Suzhi, Goody){

	var canvas,
		ctx,
		width,
		height,
		frames = 0,
		suzhi,
		goodies = [],
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
			for(i=0; i<=3;i++){
				goodies.push(new Goody('smiley', util.randomPoint(canvas, 100), canvas));
			}
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
			var i, gCount = goodies.length;
			frames+=1;
			suzhi.update();
			for(i=0; i < gCount; i++){
				goodies[i].update(frames);
			}
		},

		render : function(){
			var i, gCount = goodies.length;
			this.clearCanvas();
			ctx.fillStyle = colors.bg;
			ctx.fillRect(0,0,width,height);
			suzhi.draw(ctx);
			for(i=0; i < gCount; i++){
				goodies[i].draw(ctx);
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