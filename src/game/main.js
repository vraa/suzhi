require(['game','util'], function(Game, util){

	var sprite = new Image();
	sprite.onload = function(){

		Game.init({
			env : util.env(),
			sprite : this
		});
	}
	sprite.src = 'assets/img/sprite.png';

});