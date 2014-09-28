define(['util','colors'], function(util,colors){

	var GRAVITY = 0.25,
		X_THRUST = 10,
		Y_THRUST = 50,
		MAX_Y_VELOCITY = 7,
		MAX_FAT = 10;

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
			this.fat = 0;
		},
		jump : function(forcePoint){
			var xForce, yForce, xVel, yVel;
			yForce = forcePoint.y - this.y;
			xForce = forcePoint.x - this.x;

			yVel = Y_THRUST;
			xVel = ( (X_THRUST * xForce) / this.cW );
			this.xVelocity = -xVel;
			this.yVelocity = -Math.min(yVel, MAX_Y_VELOCITY);
			this.inMotion = true;
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
			var pos = this.position();
			if(pos.bottom >= this.cH){
				this.stop();
			}
			if(pos.top <= 0){
				this.yVelocity = -this.yVelocity;
			}
			if(pos.left <= 0 || pos.right >= this.cW){
				this.xVelocity = -this.xVelocity;
			}
			if(this.enFat){
				if(this.fat >= MAX_FAT){
					this.enFat = false;
					this.deFat = true;
				}else{
					this.fat += 1;
				}
			}
			if(this.deFat){
				if(this.fat <= 0){
					this.deFat = false;
					this.fat = 0;
				}else{
					this.fat -= 1;
				}
			}
		},
		draw : function(ctx){
			ctx.save();
			ctx.fillStyle = colors.suzhi;
			ctx.arc(this.x,this.y,this.size + this.fat, 0, Math.PI * 2, true);
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
		},
		gotThingy : function(value){
			this.enFat = true;
		}
	}

	return Suzhi;

});