define([], function(){

	return {
		log : console.log.bind(console),

		/* detects the running environment. */
		env : function(){
			return {
				viewport : {
					width: window.innerWidth,
					height: window.innerHeight
				},
				canTouch : this.canTouch()
			}
		},

		canTouch : function(){
			var el = document.createElement('div'),
				canTouch = ('ontouchstart' in el);

			if(!canTouch){
				el.setAttribute('ontouchstart', 'return;');
				canTouch = typeof el['ontouchstart'] == 'function';
			}
			el = null;
			return canTouch;
		},

		getMouseAt : function(evt, canvas){
			var x, y;
			if(evt.x && evt.y){
				x = evt.x - canvas.offsetLeft;
				y = evt.y - canvas.offsetTop;
			}else{
				x = evt.clientX + 
					document.body.scrollLeft + 
					document.documentElement.scrollLeft -
					canvas.offsetLeft;
				y = evt.clientY +
					document.body.scrollTop +
					document.documentElement.scrollTop -
					canvas.offsetTop;
			}
			return {
				x : x,
				y : y
			}
		},

		randomPoint : function(canvas, pad){
			pad = pad || 10;
			return {
				x : Math.random() * ( (canvas.width - pad) - pad) + pad,
				y : Math.random() * ( (canvas.height - pad) - pad) + pad,
			}
		},

		randomNumber : function(max,min){
			return Math.floor(Math.random() * (max - min)) + min;
		},

		randomGoody : function(){
			var goodies = ['smiley', 'laughy', 'holy', 'geary', 'sunny', 'rady', 'dizzy'];
			return goodies[Math.floor(Math.random() * goodies.length)];
		},

		collided : function(o1,o2){
			var l1,l2,r1,r2,t1,t2,b1,b2;

			l1 = o1.x;
			r1 = o1.x + o1.w;
			t1 = o1.y;
			b1 = o1.y + o1.h;

			l2 = o2.x;
			r2 = o2.x + o2.w;
			t2 = o2.y;
			b2 = o2.y + o2.h;

			return !(l1 > r2 || l2 > r1 || t1 > b2 || t2 > b1);
		}
	}

});