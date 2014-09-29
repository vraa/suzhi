define(['util', 'colors'], function(util,colors){

	var coords = util.sprites;

	var config = {
		smiley : {
			coords : coords.smiley,
			value : 5,
			tX : 15,
			tY : 10,
			color: colors.goody
		}, laughy : {
			coords : coords.laughy,
			value : 50,
			tX : 13,
			tY : 12,
			color: colors.goody
		}, holy : {
			coords : coords.holy,
			value : 200,
			tX : 10,
			tY : 12,
			color: colors.goody
		}, geary : {
			coords : coords.geary['1'],
			value : -5,
			tX : 15,
			tY : 10,
			color: colors.baddie
		}, sunny : {
			coords : coords.sunny['1'],
			value : -50,
			tX : 13,
			tY : 12,
			color: colors.baddie
		}, rady : {
			coords : coords.rady['1'],
			value : -100,
			tX : 10,
			tY : 12,
			color: colors.baddie
		}
	}, margin = 30;

	function Thingy(options){
		this.type = options.type;
		this.value = config[this.type].value;
		this.coords = config[this.type].coords;
		this.color = config[this.type].color;
		this.x = options.position.x;
		this.y = options.position.y;
		this.tX = config[this.type].tX;
		this.tY = config[this.type].tY;
		this.xVelocity = 1;
		this.yVelocity = 1;
		this.cH = options.canvas.height;
		this.cW = options.canvas.width;
		this.lifeTime = 500;
		this.sprite = options.sprite;
	}

	Thingy.prototype = {

		_hitTheWall : function(){
			if(this.x <= 0){
				this.xVelocity = Math.abs(this.xVelocity);
			}
			if(this.x >= (this.cW - margin)){
				this.xVelocity = -Math.abs(this.xVelocity);
			}
			if(this.y <= margin){
				this.yVelocity = Math.abs(this.yVelocity);
			}
			if(this.y >= (this.cH - margin)){
				this.yVelocity = -Math.abs(this.yVelocity);
			}
		},

		_randomMotion : function(frames){
			if(frames % 100 == 0){
				if(util.randomNumber(10,50) > 25){
					this.xVelocity = -this.xVelocity;
				}else{
					this.yVelocity = -this.yVelocity;
				}	
			}
		},

		_isCollided : function(suzhi){
			var pos = suzhi.position(),
				o1 = {
					x : this.x - 18, // bounding box
					y : this.y - 15, // bouding box
					h : 20,
					w : 20
				}, o2 = {
					x : pos.left,
					y : pos.top,
					h : pos.bottom - pos.top,
					w : pos.right - pos.left
				};
			if(util.collided(o1, o2)){
				suzhi.gotThingy(this.value);
				this.isCollided = true;
				this.lifeTime = 30;
			}
		},

		update : function(frames, suzhi){
			this.x += this.xVelocity;
			this.y += this.yVelocity;			
			this._randomMotion(frames);
			this._hitTheWall();
			if(!this.isCollided){
				this._isCollided(suzhi);
			}
			this.lifeTime -= 1;
			if(this.lifeTime <= 30){
				this.isDying = true;
			}
			if(this.lifeTime <=0){
				this.isCaptured = true;
				this.lifeTime = 0;
			}
		},
		draw : function(ctx){
			var fontSize;
			ctx.save();

			util.drawSprite(ctx, this.sprite, this.coords, this.x, this.y);
			/*
			if(! (this.isDying || this.isCollided)){
				ctx.font = '7pt Arial';
				var sign = this.value < 0 ? '' : '+';
				ctx.fillText(sign + this.value, this.x + this.tX, this.y+this.tY);
			}*/
			/*ctx.beginPath();
			ctx.fillStyle = 'rgba(255,255,255,.5)';
			ctx.arc(this.x + 18,this.y - 15,20, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.closePath();
			*/
			ctx.restore();


		}
	}

	return Thingy;

});