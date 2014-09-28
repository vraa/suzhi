define(['util','colors'], function(util,colors){

	var GRAVITY = 0.25,
		THRUST = 4.6;

	function Suzhi(options){
		this.x = 0;
		this.y = 0;
		this.size = 20;
		this.velocity = 0;
		this.init(options.canvas);
	}

	Suzhi.prototype = {
		init : function(canvas){
			this.x = canvas.width / 2;
			this.y = canvas.height - this.size;
			this.cH = canvas.height;
			this.cW = canvas.width;
		},
		jump : function(){
			this.velocity = -THRUST;
			this.inMotion = true;
		},
		stop : function(){
			this.inMotion = false;
		},
		update : function(){
			console.log
			if(this.inMotion){
				this.velocity += GRAVITY;
				this.y += this.velocity;
			}
		},
		draw : function(ctx){
			ctx.save();
			ctx.fillStyle = colors.suzhi;
			ctx.arc(this.x,this.y,this.size, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.restore();
		}
	}

	return Suzhi;

});