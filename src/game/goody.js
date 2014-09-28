define(['util'], function(util){

	var config = {
		smiley : {
			face : '☺',
			value : 5,
			tX : 18,
			tY : 10

		}, laughy : {
			face : '😃',
			value : 50,
			tX : 16,
			tY : 12
		}, holy : {
			face : '😇',
			value : 100,
			tX : 13,
			tY : 12
		}
	}, margin = 30;

	function Goody(options){
		this.type = options.type;
		this.value = config[this.type].value;
		this.face = config[this.type].face;
		this.x = options.position.x;
		this.y = options.position.y;
		this.tX = config[this.type].tX;
		this.tY = config[this.type].tY;
		this.xVelocity = 1;
		this.yVelocity = 1;
		this.cH = options.canvas.height;
		this.cW = options.canvas.width;
	}

	Goody.prototype = {

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

		_isCollided : function(pos){
			var o1 = {
				x : this.x,
				y : this.y,
				h : 20,
				w : 20
			}, o2 = {
				x : pos.left,
				y : pos.top,
				h : pos.bottom - pos.top,
				w : pos.right - pos.left
			}
			if(util.collided(o1, o2)){
				this.isCollided = true;
				this.lifeTime = 9;
			}
		},

		update : function(frames, suzhiPos){
			this.x += this.xVelocity;
			this.y += this.yVelocity;			
			this._randomMotion(frames);
			this._hitTheWall();
			if(!this.isCollided){
				this._isCollided(suzhiPos);
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
			ctx.fillStyle = 'rgba(0,0,0,1)';
			/*if(this.isCollided){
				ctx.fillStyle = 'rgba(0,0,0,.' +  this.lifeTime + ')';
			}*/
			ctx.fillText(this.face, this.x,this.y);
			ctx.font = '7pt Arial';
			ctx.fillText(this.value, this.x + this.tX, this.y+this.tY);
			ctx.restore();


		}
	}

	return Goody;

});