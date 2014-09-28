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
		}
	}

});