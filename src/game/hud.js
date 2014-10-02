define(['util', 'colors'], function(util, colors){

	var cW, cH;

	function Hud(options){
		this.init(options.canvas);
	}

	Hud.prototype = {
		init : function(canvas){
			cW = canvas.width;
			cH = canvas.height;
			this.score = 0;
			this.health = 100;
			this.ammo = 0;
		},
		update : function(options){
			this.score = options.score;
			this.health = options.health;
			this.ammo = options.ammo;
		},
		draw : function(ctx){
			ctx.save();
			ctx.restore();

		}
	}

	return Hud;

});