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

	function Goody(type, position, canvas){
		this.type = type;
		this.value = config[type].value;
		this.face = config[type].face;
		this.x = position.x;
		this.y = position.y;
		this.tX = config[type].tX;
		this.tY = config[type].tY;
		this.xVelocity = 1;
		this.yVelocity = 1;
		this.cH = canvas.height;
		this.cW = canvas.width;
	}

	Goody.prototype = {
		update : function(frames){
			this.x += this.xVelocity;
			this.y += this.yVelocity;
			if(frames % 100 == 0){
				if(util.randomNumber(10,50) > 25){
					this.xVelocity = -this.xVelocity;
				}else{
					this.yVelocity = -this.yVelocity;
				}	
			}
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
		draw : function(ctx){

			ctx.save();
			ctx.font = '30pt Arial';
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.fillText(this.face, this.x,this.y);
			ctx.font = '7pt Arial';
			ctx.fillText(this.value, this.x + this.tX, this.y+this.tY);
			ctx.restore();


		}
	}

	return Goody;

});