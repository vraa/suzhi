define(['util','colors'], function(util,colors){

	var GRAVITY = 0.25,
		THRUST = 4.6;

	function Suzhi(options){
		this.x = 0;
		this.y = 0;
		this.size = 20;
		this.yVelocity = 0;
		this.init(options.canvas);
	}

	Suzhi.prototype = {
		init : function(canvas){
			this.x = canvas.width / 2;
			this.y = canvas.height / 2;
			this.cH = canvas.height;
			this.cW = canvas.width;
		},
		jump : function(forcePoint){
			var xForce, yForce;
			yForce = forcePoint.y - this.y;
			xForce = forcePoint.x - this.x;

			if(yForce >= 0){
				this.yVelocity = -THRUST;
				this.xVelocity = -( (10 * xForce) / this.cW );
				this.inMotion = true;
			}
		},
		stop : function(){
			this.inMotion = false;
		},
		update : function(){
			if(this.inMotion){
				this.yVelocity += GRAVITY;
				this.y += this.yVelocity;
				this.x += this.xVelocity;
			}
		},
		draw : function(ctx){
			ctx.save();
			ctx.fillStyle = colors.suzhi;
			ctx.arc(this.x,this.y,this.size, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.restore();
		},
		position : function(){
			return {
				top : this.y - this.size,
				bottom : this.y + this.size,
				left : this.x - this.size,
				right : this.x + this.size
			}
		}
	}

	return Suzhi;

});