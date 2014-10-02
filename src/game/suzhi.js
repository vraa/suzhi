define(['util','colors'], function(util,colors){

	var GRAVITY = 0.25,
		X_THRUST = 10,
		MINIMAL_THRUST = 8,
		Y_THRUST = 50,
		MAX_Y_VELOCITY = 7,
		TIME_TO_FLASH = 20,
		KEYS = util.keys,
		BOLT_ENERGY = 50;

	function Suzhi(options){
		this.x = 0;
		this.y = 0;
		this.size = 47;
		this.lifelineSize = (this.size / 2) + 2;
		this.yVelocity = 0;
		this.sprite = options.sprite;
		this.coords = util.sprites.suzhi;
		this.moods = {
			normal : util.sprites.suzhi,
			hurt : util.sprites.suzhiHurt,
			happy : util.sprites.suzhiHappy
		};
		this.init(options.canvas);
		this.bolts = [];
	}

	Suzhi.prototype = {
		init : function(canvas){
			this.x = canvas.width / 2;
			this.y = canvas.height / 2;
			this.cH = canvas.height;
			this.cW = canvas.width;
			this.score = 0;
			this.mood = 'normal';
			this.health = 100,
			this.ammo = 5,
			this.flashMood = 0;
		},
		actOn : function(keyCode){
			if(keyCode === KEYS.UP){
				this.jump();
			}else if(keyCode === KEYS.LEFT){
				this.move('left');
			}else if(keyCode === KEYS.RIGHT){
				this.move('right');
			}else if(keyCode === KEYS.DOWN){
				this.fall();
			}else if(keyCode === KEYS.SPACE){
				this.fire();
			}
		},

		move : function(direction){
			var xy = this.xy(),
				dX = direction === 'left' ? 100 : -100;
			xy.x += dX;
			this.jump(xy, 2, .1);
		},

		fire : function(){
			if(this.ammo > 0){
				var mid = this.mid();
				this.bolts.push({
					x : mid.x,
					y : mid.y,
					fired : true,
					energy : BOLT_ENERGY,
					size : this.size - 10
				});
				this.ammo -= 1;
				this.jump();
			}
			
		},

		isBolted : function(baddie){
			var o1 = {
				x : baddie.x,
				y : baddie.y,
				h : baddie.height,
				w : baddie.width
			}, o2,
				b,
				bolt, 
				boltsCount = this.bolts.length;
			for(b=0; b<boltsCount; b++){
				bolt = this.bolts[b];
				o2 = {
					x : bolt.x - bolt.size,
					y : bolt.y - bolt.size,
					h : 2 * bolt.size - 20 ,
					w : 2 * bolt.size - 20
				};

				if(util.collided(o2, o1)){
					this.score += Math.abs(baddie.value);
					return true;
				}
			}
		},

		fall : function(){
			this.yVelocity = Math.abs(this.yVelocity);
			this.xVelocity = 0;
		},

		jump : function(forcePoint, xForcePush, yForcePush){
			forcePoint = forcePoint || this.xy();
			xForcePush = xForcePush || 1;
			yForcePush = yForcePush || 1;
			var xForce, yForce, xVel, yVel;
			yForce = forcePoint.y - this.y;
			xForce = forcePoint.x - this.x;

			xVel = xForcePush * ( (X_THRUST * xForce) / this.cW );
			yVel = yForcePush * Y_THRUST;
			
			this.xVelocity = -xVel;
			this.yVelocity = -Math.min(yVel, MAX_Y_VELOCITY);
			this.inMotion = true;
		},
		stop : function(){
			this.inMotion = false;
			this.isDead = true;
			this.mood = 'hurt';
			this.health = 0;
		},
		update : function(){
			var pos = this.position(), 
				b,
				bolt, 
				boltsCount = this.bolts.length;

			if(this.inMotion){
				this.yVelocity += GRAVITY;
				this.y += this.yVelocity;
				this.x += this.xVelocity;
			}
			if(this.health <= 0 || pos.bottom >= (this.cH - 17)){
				this.stop();
			}
			if(pos.top <= 30 && this.yVelocity < 0){
				this.yVelocity = Math.abs(this.yVelocity);
			}
			if(pos.left <= 0 && this.xVelocity < 0){
				this.xVelocity = Math.abs(this.xVelocity);
			}
			if(pos.right >= this.cW && this.xVelocity > 0){
				this.xVelocity = this.xVelocity * -1;
			}
			if(this.flashMood > 0){
				this.flashMood -= 1;
			}
			if(this.flashMood == 0 && !this.isDead){
				this.mood = 'normal';
			}

			for(b = 0; b < boltsCount; b++){
				bolt = this.bolts[b];
				if(bolt.energy <= 0){
					this.bolts.splice(b, 1);
					boltsCount -= 1;
				}else{
					bolt.energy -= 1;
					bolt.size += 2;
				}
			}
		},
		draw : function(ctx){
			var mid = this.mid(),
				llEnd = (this.health * 359 / 100)*(Math.PI/180);
				ctx.save();
			ctx.strokeStyle = this.health > 50 ? colors.lifelineGood : colors.lifelineBad;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(mid.x, mid.y, this.lifelineSize, 0, llEnd, false);
			ctx.stroke();
			ctx.closePath();
			util.drawSprite(ctx, this.sprite, this.moods[this.mood], this.x, this.y);
			this.drawBolts(ctx);
			ctx.restore();
		},
		drawBolts : function(ctx){
			var b,
				bolt, 
				boltsCount = this.bolts.length;
			for(b=0; b<boltsCount; b++){
				bolt = this.bolts[b];
				ctx.save();
				ctx.beginPath();
				ctx.strokeStyle = colors.boltColor;
				ctx.arc(bolt.x, bolt.y, bolt.size, 0, 2*Math.PI, false);
				ctx.stroke();
				ctx.closePath();
			}
		},
		mid : function(){
			return {
				x : this.x + (this.size / 2),
				y : this.y + (this.size / 2)
			}
		},
		xy : function(){
			return {
				x : this.x,
				y : this.y
			}
		},
		position : function(){
			return {
				top : this.y,
				bottom : this.y + this.size,
				left : this.x,
				right : this.x + this.size
			}
		},
		gotThingy : function(thingy){
			this.score += thingy.value;
			if(this.score < 0){
				this.score = 0;
			}
			this.mood = thingy.value < 0 ? 'hurt' : 'happy';
			this.flashMood = TIME_TO_FLASH;
			if(thingy.role === 'baddie'){
				this.health -= Math.abs(( (100 * thingy.value) / 950));
				this.health = this.health < 0 ? 0 : this.health;
			}
			if(thingy.category === 'health'){
				this.health += thingy.value;
				this.health = this.health > 100 ? 100 : this.health;
			}else if(thingy.category === 'ammo'){
				this.ammo += thingy.value;
			}
		}
	}

	return Suzhi;

});