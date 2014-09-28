define(['util'], function(util){

	var config = {
		smiley : {
			face : '☺',
			value : 5,
			tX : 15,
			tY : 10,
			color: 'rgb(1,255,112)'
		}, laughy : {
			face : '😃',
			value : 50,
			tX : 13,
			tY : 12,
			color: 'rgb(1,255,112)'
		}, holy : {
			face : '😇',
			value : 100,
			tX : 10,
			tY : 12,
			color: 'rgb(1,255,112)'
		}, geary : {
			face : '⚙',
			value : -5,
			tX : 15,
			tY : 10,
			color: 'rgb(255,65,54)'
		}, sunny : {
			face : '☀',
			value : -50,
			tX : 13,
			tY : 12,
			color: 'rgb(255,65,54)'
		}, rady : {
			face : '☢',
			value : -500,
			tX : 10,
			tY : 12,
			color: 'rgb(255,65,54)'
		}, dizzy : {
			face : '😵',
			value : -1000,
			tX : 10,
			tY : 12,
			color: 'rgb(255,65,54)'
		}
	}, margin = 30;

	function Thingy(options){
		this.type = options.type;
		this.value = config[this.type].value;
		this.face = config[this.type].face;
		this.color = config[this.type].color;
		this.x = options.position.x;
		this.y = options.position.y;
		this.tX = config[this.type].tX;
		this.tY = config[this.type].tY;
		this.xVelocity = 1;
		this.yVelocity = 1;
		this.cH = options.canvas.height;
		this.cW = options.canvas.width;
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
					x : this.x,
					y : this.y,
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
				this.lifeTime = 9;
			}
		},

		update : function(frames, suzhi){
			this.x += this.xVelocity;
			this.y += this.yVelocity;			
			this._randomMotion(frames);
			this._hitTheWall();
			if(!this.isCollided){
				this._isCollided(suzhi);
			}else{
				this.lifeTime -= 1;
			}
			if(this.lifeTime <=0){
				this.isCaptured = true;
				this.lifeTime = 0;
			}
		},
		draw : function(ctx){
			ctx.save();
			ctx.font = '30pt Arial';
			ctx.fillStyle = this.color;
			if(this.isCollided){
				ctx.fillStyle = 'rgba(0,0,0,.' +  this.lifeTime + ')';
			}
			ctx.fillText(this.face, this.x,this.y);
			ctx.font = '7pt Arial';
			var sign = this.value < 0 ? '' : '+';
			ctx.fillText(sign + this.value, this.x + this.tX, this.y+this.tY);
			ctx.restore();


		}
	}

	return Thingy;

});