define(['util', 'colors'], function(util, colors){

	var cW, cH, sprite, heart, bolt, hudH = 30, hX, hY, bX, bY;

	function Hud(options){
		this.init(options.canvas);
		sprite = options.sprite;
	}

	Hud.prototype = {
		init : function(canvas){
			cW = canvas.width;
			cH = canvas.height;
			this.score = 0;
			this.health = 100;
			this.ammo = 0;
			
			heart = util.sprites.heart;
			bolt = util.sprites.bolt;
			hX = cW/2 - heart[2]/2 - 14;
			hY = hudH/2 - heart[3]/2;
			bX = cW - 50;
			bY = hudH/2 - bolt[3]/2;
		},
		update : function(options){
			this.score = options.score;
			this.health = options.health;
			this.ammo = options.ammo;
		},
		draw : function(ctx){
			ctx.save();
			ctx.beginPath();
			
			ctx.fillStyle = colors.hudColor;
			ctx.fillRect(0,0, cW, hudH);
			
			util.drawSprite(ctx, sprite, heart, hX, hY);
			util.drawSprite(ctx, sprite, bolt, bX, bY);

			ctx.font = "10pt Audiowide";
			ctx.fillStyle = colors.hudText;
			ctx.textAlign = 'left';
			ctx.fillText(Math.floor(this.health), hX + 27, hY + 13);
			ctx.fillText(this.ammo, bX + 20, hY + 13);
			ctx.fillText(this.score, 20, hY+13);


			ctx.closePath();
			ctx.restore();
		}
	}

	return Hud;

});