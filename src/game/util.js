define([], function(){

	var goodies = ['smiley', 'laughy', 'holy', 'geary', 'sunny', 'rady'];
	var baddies = ['geary', 'sunny', 'rady'];
	var addons = ['hearty', 'bolty'];

	return {

		keys : {
			SPACE : 32,
			LEFT : 37,
			UP : 38,
			RIGHT : 39,
			DOWN : 40,
			ENTER : 13,
		},

		isAGameKey : function(keyCode){
			for(key in this.keys){
				if(keyCode === this.keys[key]){
					return true;
				}
			}
			return false;
		},

		// x,y,w,h
		sprites : {
			suzhiTitle : [0, 60, 100, 30],
			gameOver : [0, 0, 210, 25],
			getReady : [0, 33, 200, 25],
			tapHelp : [0, 100, 180, 165],
			howTo : [10, 365, 265, 225],
			suzhi : [253, 0, 47, 47],
			suzhiHappy : [299, 0, 47, 47],
			suzhiHurt : [345, 0, 47, 47],
			smiley : [211, 59, 36, 36],
			laughy : [202, 106, 48, 48],
			holy : [190, 160, 70, 70],
			geary : {
				'1' : [257, 60, 35, 35],
				'2' : [306, 60, 35, 35]
 			},
 			sunny : {
 				'1' : [255, 105, 47, 47],
 				'2' : [313, 105, 47, 47]
 			},
 			rady : {
 				'1' : [258, 170, 53, 53],
 				'2' : [313, 170, 53, 53]
 			},
 			fire : [
 				[377, 315, 18, 35],
 				[360, 315, 18, 35],
 				[334, 315, 18, 35],
 				[308, 315, 18, 35],
 				[278, 315, 18, 35],
 				[248, 315, 18, 35],
 				[219, 315, 18, 35],
 				[194, 315, 18, 35],
 				[166, 315, 18, 35],
 				[141, 315, 18, 35],
 				[117, 315, 18, 35],
 				[97, 315, 18, 35],
 				[75, 315, 18, 35],
 				[52, 315, 18, 35],
 				[25, 315, 18, 35],
 				[0, 315, 18, 35],
 			],
 			okayBtn : [0, 270, 62, 20],
 			playBtn : [0, 292, 62, 20],
 			score : [111, 65, 83, 20],
 			heart : [144, 240, 20, 18],
 			bigHeart : [76, 240, 68, 66],
 			bigBolt : [203, 245, 38, 55],
 			bolt : [255, 245, 13, 18],
 			lblPress : [5, 370, 91, 20],
 			lblToStart : [228, 370, 137, 20],
 			lblAnyKey : [102, 370, 120, 20],
 			lblEnterKey : [5, 396, 151, 20],
 			lblMove : [44, 549, 52, 15],
 			lblControls : [182, 467, 115, 18],
 			lblFire : [222, 549, 41, 15],
 			arrowKeys : [5, 450, 135, 95],
 			spacebar : [145, 500, 200, 42]
		},

		spriteTest : function(ctx, sprite){
			var sp = this.sprites.spacebar;
			this.drawSprite(ctx, sprite, sp, 100, 100);
			ctx.strokeStyle = 'white';
			ctx.strokeRect(100, 100, sp[2], sp[3]);
		},

		drawSprite : function(ctx, sprite, pt, x, y, resize){
			resize = 0;
			ctx.drawImage(sprite, pt[0], pt[1], pt[2], pt[3], x, y, pt[2]-resize, pt[3]-resize);
		},

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

		//Math.random() * (max - min) + min;
		randomPointInBox : function(x1,y1, x2,y2){
			return {
				x : Math.random() *  (x2 - x1) + x1,
				y : Math.random() *  (y2 - y1) + y1
			}
		},

		randomNumber : function(max,min){
			return Math.floor(Math.random() * (max - min)) + min;
		},

		randomGoody : function(){
			return goodies[Math.floor(Math.random() * goodies.length)];
		},

		randomBaddie : function(){
			return baddies[Math.floor(Math.random() * baddies.length)];
		},

		randomAddon : function(){
			return addons[Math.floor(Math.random() * addons.length)];
		},

		getAllGoodies : function(){
			return goodies;
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
		},

		isPointInsideBox : function(box, point){
			return (box.x1 <= point.x 
				&& box.x2 >= point.x 
				&& box.y1 <= point.y 
				&& box.y2 >= point.y);
		}
	}

});