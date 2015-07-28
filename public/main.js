
var runningManSolid = function (r, g, b, a, _x, _y) {
	var x = _x - 118;
	var y = _y - 118;
	var d = (Math.sqrt(x*x + y*y));
	return !(r == 255 && g == 255 && b == 255) && a!=0 && d < 110;
}


//should make an animated 3dSprite class so I can play/pause stuff idk. 
var loadAnimated = function(config) {
	config = Object.create(config || {})//this is pure lazy

	if(config.time === undefined) config.time = 30; //could do a better check but yolo
	if(config.optimize === undefined) config.optimize = true;
	if(config.scaleZ === undefined) config.scaleZ = 6;
	if(config.update === undefined) config.update = function (wrapper, props) {}//need some kind of dt
	//this is temp until I make an animated sprite class or somthing. 



	var urls = [], prefix = config.prefix;
	for(var i = config.range[0]; i < config.range[1];i++){
		urls.push(prefix + i + ".png");
	}

	var wrapper = new THREE.Object3D();
	var frames = C3D.fromUrls(urls, config);

	frames.forEach(function(frame) {
		wrapper.add(frame);
		frame.visible = false;
	})

	var frame = 0;
	var last = Date.now();
	setInterval(function() {
		var now = Date.now();
		var dt = now - last;

		frame = Math.floor(dt/config.time);
		frame %= frames.length;
		frames.forEach(function(frame){
			frame.visible = false;
		})
		frames[frame].visible = true;

		config.update(wrapper, config);
	}, 17);


	return wrapper;
}

var main = function () {
	
	init(true);
	////wrapper.position.y = props.y + Math.sin(Date.now()/200)/5;

	//makeAnimated("running_man/");
	//scene.add(makeAnimated("running_man/sprite_", 1, 8, new THREE.Vector3(0, 0, 0), 100)) ;
	//scene.add(makeAnimated("pushups/sprite_-", 1, 4, new THREE.Vector3(0, -.4, 0), 200));

	var man = loadAnimated({
		prefix : "running/sprite_",
		range : [1, 8],
		time : 100
	})
		man.position.y = -.06;
	scene.add(man)

	/*
	scene.add(loadAnimated({
		prefix : "sanic/sprite_",
		range : [1, 8],
		isSolid : undefined
	})); */

	scene.add(loadAnimated({
		prefix : "tails/sprite_",
		range : [1, 8],
		y : 1.5,
		update : function (wrapper, props) {
			wrapper.position.y = props.y + Math.sin(Date.now()/200)/5;
		}
	}))


	render();

}



