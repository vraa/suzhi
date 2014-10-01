require(['game','util'], function(Game, util){

	// shim layer with setTimeout fallback
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame    ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

	var sprite = new Image();
	sprite.onload = function(){

		Game.init({
			env : util.env(),
			sprite : this
		});
	}
	sprite.src = 'assets/img/sprite.png';

});