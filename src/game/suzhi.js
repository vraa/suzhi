define(['util','colors'], function(util,colors){

	var GRAVITY = 0.25,
		X_THRUST = 10,
		Y_THRUST = 50,
		MAX_Y_VELOCITY = 7,
		TIME_TO_FLASH = 20;

	function Suzhi(options){
		this.x = 0;
		this.y = 0;
		this.size = 47;
		this.yVelocity = 0;
		this.sprite = options.sprite;
		this.coords = util.sprites.suzhi;
		this.moods = {
			normal : util.sprites.suzhi,
			hurt : util.sprites.suzhiHurt,
			happy : util.sprites.suzhiHappy
		};
		this.init(options.canvas);
	}

	Suzhi.prototype = {
		init : function(canvas){
			this.x = canvas.width / 2;
			this.y = canvas.height / 2;
			this.cH = canvas.height;
			this.cW = canvas.width;
			this.score = 0;
			this.mood = 'normal';
			this.flashMood = 0;
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
			this.isDead = true;
			this.mood = 'hurt';
		},
		update : function(){
			if(this.inMotion){
				this.yVelocity += GRAVITY;
				this.y += this.yVelocity;
				this.x += this.xVelocity;
			}
			var pos = this.position();
			if(pos.bottom >= (this.cH - 17)){
				this.stop();
			}
			if(pos.top <= 0){
				this.yVelocity = -this.yVelocity;
			}
			if(pos.left <= 0 || pos.right >= this.cW){
				this.xVelocity = - this.xVelocity;
			}
			if(this.flashMood > 0){
				this.flashMood -= 1;
			}
			if(this.flashMood == 0 && !this.isDead){
				this.mood = 'normal';
			}
		},
		draw : function(ctx){
			ctx.save();
			util.drawSprite(ctx, this.sprite, this.moods[this.mood], this.x, this.y);
			if(!this.isDead){
				this.drawScore(ctx);
			}
			ctx.restore();
		},
		drawScore : function(ctx){
			ctx.save();
			ctx.font = '11pt Audiowide';
			ctx.fillStyle = colors.suzhi;
			ctx.fillText(this.score, 20, 20);
			ctx.restore();
		},
		position : function(){
			return {
				top : this.y,
				bottom : this.y + this.size,
				left : this.x,
				right : this.x + this.size
			}
		},
		gotThingy : function(value){
			this.score += value;
			this.mood = value < 0 ? 'hurt' : 'happy';
			this.flashMood = TIME_TO_FLASH;
		}
	}

	return Suzhi;

});