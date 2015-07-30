
var runningManSolid = function (r, g, b, a, _x, _y) {
	var x = _x - 118;
	var y = _y - 118;
	var d = (Math.sqrt(x*x + y*y));
	return !(r == 255 && g == 255 && b == 255) && a!=0 && d < 110;
}


//should make an animated 3dSprite class so I can play/pause stuff idk. 
var loadAnimated = function(config, animate, cb) {
	if(animate === undefined) animate = true;
	config = Object.create(config || {})//this is pure lazy

	if(config.time === undefined) config.time = 30; //could do a better check but yolo
	if(config.optimize === undefined) config.optimize = true;
	if(config.scaleZ === undefined) config.scaleZ = 6;
	if(config.update === undefined) config.update = function (wrapper, props) {}//need some kind of dt
	//this is temp until I make an animated sprite class or somthing. 



	var urls = [], prefix = config.prefix;
	for(var i = config.range[0]; i <= config.range[1];i++){
		urls.push(prefix + i + ".png");
	}

	var wrapper = new THREE.Object3D();
	var frames = C3D.fromUrls(urls, config, cb);

	frames.forEach(function(frame) {
		wrapper.add(frame);
	})

	if(animate){
		makeAnimated(frames, config);
	}

	
	return wrapper;
}

var createInstanceAnimated = function (instance, config) {
	//var mesh = new THREE.Mesh()
	var copy = instance.clone();
	makeAnimated(copy.children, config);
	return copy;
}
var makeAnimated = function (frames, config) {

	frames.forEach(function(frame) {
		frame.visible = false;
	})



	var frame = 0;
	var last = Date.now();

	setInterval(function() {
		var now = Date.now();
		var dt = now - last;

		frame = Math.floor(dt/config.time);
		frame %= (frames.length);
		frames.forEach(function(frame){
			frame.visible = false;
		})
		frames[frame].visible = true;
	}, 17);


}
var main = function () {
	
	init(true);
	////wrapper.position.y = props.y + Math.sin(Date.now()/200)/5;

	//makeAnimated("running_man/");
	//scene.add(makeAnimated("running_man/sprite_", 1, 8, new THREE.Vector3(0, 0, 0), 100)) ;
	//scene.add(makeAnimated("pushups/sprite_-", 1, 4, new THREE.Vector3(0, -.4, 0), 200));
///*

	var man = loadAnimated({
		prefix : "running/sprite_",
		range : [1, 8],
		time : 100
	})
	man.position.y = -.06; 
	man.velocity = new THREE.Vector3(0,0,0);
	scene.add(man) 

	//var tree = C3D.fromUrl("tree1.png", {optimize:true});

	var srcTree = loadAnimated({
		prefix : "tree2_",
		range : [1, 1],
		time : 200
	}, true, function () {
		//loaded the tree in all its async glory. ffs this async is what killed me. 
		srcTree.scale.set(6, 6, 1);
		srcTree.position.y = 1.5;

		var trees = [];
		for(var i = 0; i < 50;i++){
			var copy = createInstanceAnimated(srcTree, { time : 200} );
				copy.position.x  = 8 + Math.random() * Math.random() * 20 * 2;
				copy.position.z = -10 + Math.random() * 20;
			scene.add(copy);
			trees.push(copy);
		} 

		var last = Date.now();
		setInterval(function(){
			var now = Date.now();
			var dt = now - last;
			last = now;

			trees.forEach(function(tree){
				tree.position.x -= .015 * dt;
				if(tree.position.x < -20){
					tree.position.x = 15 + Math.random() * 10;
				} 
			})


			man.velocity.y -= .0002 * dt;
			man.position.add(man.velocity.clone().multiplyScalar(dt));

			if(man.position.y < -.06){
				man.position.y = -.06;
			}


		}, 17) 


		window.addEventListener("keydown", function() {
			man.velocity.y = .03;
		})

		window.addEventListener("touchstart", function() {
			man.velocity.y = .03;
		})

	});

	//scene.add(srcTree);

	//console.log(scene.children)

/*
	

/*
	var tree = loadAnimated({
		prefix : "tree/sprite_",
		range : [1, 3],
		time : 200
	})

	setInterval(function() {
		tree.position.x -= .10;
		if(tree.position.x < -8){
			tree.position.x = 8;
		} 
	}, 17) */

	
	//scene.add(tree);

	/*
	scene.add(loadAnimated({
		prefix : "sanic/sprite_",
		range : [1, 8],
		isSolid : undefined
	})); */

	/*
	scene.add(loadAnimated({
		prefix : "tails/sprite_",
		range : [1, 8],
		y : 1.5,
		update : function (wrapper, props) {
			wrapper.position.y = props.y + Math.sin(Date.now()/200)/5;
		}
	})) */

	var light = new THREE.PointLight(0xffffff, 1.2, 100)
		light.position.set(1, 20, 5);
		//scene.add(light);

		setInterval(function() {
			var now = Date.now();
			light.position.x = Math.cos(now/1000) * 2
			light.position.z = Math.sin(now/1000) * 2
		}, 17)

		//scene.add(new THREE.AmbientLight( (new THREE.Color(.7, .7, .7) ) .getHex()  ))
	render();

}



