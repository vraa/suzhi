define([], function(){

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
	}

	function Goody(type, position){
		this.type = type;
		this.value = config[type].value;
		this.face = config[type].face;
		this.x = position.x;
		this.y = position.y;
		this.tX = config[type].tX;
		this.tY = config[type].tY;
	}

	Goody.prototype = {
		update : function(){

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