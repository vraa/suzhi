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
			return {
				x : Math.random() * ( (canvas.width - pad) - pad) + pad,
				y : Math.random() * ( (canvas.height - pad) - pad) + pad,
			}
		},

		randomNumber : function(max,min){
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}

});