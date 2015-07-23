
var scene
var buildChar = function (image, object, full) {
	var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
	var ctx = canvas.getContext("2d");
		ctx.drawImage(image, 0, 0, image.width, image.height);

	var pixels = ctx.getImageData(0, 0, image.width, image.height).data;
	var grid = [];
	for(var x = 0; x < image.width;x++){
		grid[x] = [];
		for(var y = 0; y < image.height;y++){
			var index = (x * 4) + (y * (image.width * 4))
			grid[x][image.height - 1 - y] = {
				isSolid : pixels[index+3] !== 0,
				color : new THREE.Color(pixels[index+0]/255, pixels[index+1]/255, pixels[index+2]/255)
			};
		}
	}


	var scale = 1;
	var pw = 1/image.width * scale;
	var ph = 1/image.width * scale;
	var pz = pw * 4;


	var vertices = [
		new THREE.Vector3(pw/2, ph/2, pz),
		new THREE.Vector3(-pw/2, ph/2, pz),
		new THREE.Vector3(-pw/2, -ph/2, pz),
		new THREE.Vector3(pw/2, -ph/2, pz),

		new THREE.Vector3(pw/2, ph/2, -pz),
		new THREE.Vector3(-pw/2, ph/2, -pz),
		new THREE.Vector3(-pw/2, -ph/2, -pz),
		new THREE.Vector3(pw/2, -ph/2, -pz)
	]

	

	if(!full){
		var colors = {};
		var colorTable = {}
		for(var x = 0; x < image.width;x++){
			for(var y = 0; y < image.height;y++){
				var data = grid[x][y]
				if(!data.isSolid) continue;

				var geom = new THREE.Geometry();
				var offset = new THREE.Vector3(x * pw - image.width/2 * pw, y * ph - image.height/2 * ph, 0);
					geom.vertices = vertices.slice();
				
					geom.faces.push(new THREE.Face3(0, 1, 2));
					geom.faces.push(new THREE.Face3(0, 2, 3));

					geom.faces.push(new THREE.Face3(5, 4, 6));
					geom.faces.push(new THREE.Face3(4, 7, 6));


					if(x == 0 || !grid[x-1][y].isSolid){
						geom.faces.push(new THREE.Face3(1, 5, 6));
						geom.faces.push(new THREE.Face3(1, 6, 2));
					}

					if(x == image.width -1 || !grid[x+1][y].isSolid){
						geom.faces.push(new THREE.Face3(4, 0, 3));
						geom.faces.push(new THREE.Face3(4, 3, 7));
					}

					if(y == 0 || !grid[x][y-1].isSolid){
						geom.faces.push(new THREE.Face3(3, 2, 7));
						geom.faces.push(new THREE.Face3(2, 6, 7));
		
					}

					if(y == image.height -1 || !grid[x][y+1].isSolid){
						geom.faces.push(new THREE.Face3(4, 5, 1));
						geom.faces.push(new THREE.Face3(4, 1, 0));

					}

					//geom.computeFaceNormals(); //if I want lighting I need to do that. 

				//get the color. 
				var hex = data.color.getHexString();
				var matrix = new THREE.Matrix4();
					matrix.setPosition(offset);

					//geom.applyMatrix(matrix)

				colorTable[hex] = data.color;
				if(colors[hex]) {
					colors[hex].merge(geom, matrix);
				}else {
					geom.vertices = geom.vertices.map(function(vertex) {
						return vertex.clone().add(offset)
					})
					colors[hex] = geom;
				} 

			}


			//temp just do it hre. 
		}	
		
			for(var hex in colors){
				var material = new THREE.MeshBasicMaterial({ color : colorTable[hex]});
				object.add(new THREE.Mesh(colors[hex], material));
			}  


	}else{
		for(var x = 0; x < image.width;x++){
			for(var y = 0; y < image.height;y++){
				var data = grid[x][y]
				if(!data.isSolid) continue;

				var geom = new THREE.BoxGeometry(pw, ph, pz * 2);

				var mat = new THREE.MeshBasicMaterial({ color : data.color })
				var mesh = new THREE.Mesh(geom, mat);
					mesh.position.x = x * pw - image.width/2 * pw;
					mesh.position.y = y * ph - image.height/2 * ph;
				object.add(mesh);
			}
		}
	}
}

var dude;
//TODO somthing in the build function might be a little messed up. oops. 
var loadUrl = function (url) {
	var object = new THREE.Object3D();
	var image = new Image();
		image.onload = function () {
			buildChar(this, object, false);
		}
		image.src = url;
	return object;

}
var main = function () {
	
	var stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '20px';
	stats.domElement.style.top = '20px';
	stats.domElement.zIndex = 1;
	document.body.appendChild(stats.domElement)



	scene = new THREE.Scene();
	var camera =  new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1, 100);
		camera.position.z = 2;
		camera.position.y = 2;
		scene.add(camera);


	var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 1), new THREE.MeshBasicMaterial({color : new THREE.Color("rgb(139,69,19)")}));
		plane.material.side = THREE.DoubleSide;
		plane.position.y = -.53;
		plane.rotation.x = Math.PI/2;
		scene.add(plane);
	var renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	var raycaster = new THREE.Raycaster();


	var sanics = [];
	for(var i = 1; i <= 8;i++){
		var sanic = loadUrl("sanic/sanic_" + i + ".png");
			sanic.visible = false;
			scene.add(sanic);
		sanics.push(sanic);
	}


	var frame = 0;
	setInterval(function() {
		sanics[frame].visible = false;
		frame++;//@TODO learn ++sanic vs sanic++. my head hurts and im sick 
		if(frame == sanics.length){
			frame = 0;
		}
		sanics[frame].visible = true;

	}, 30)


	setInterval(function(){
		var rock = new THREE.Mesh(new THREE.BoxGeometry(.10, .10, .10), new THREE.MeshBasicMaterial({color : new THREE.Color("rgb(255,235,205)")}));
			rock.position.z = (Math.random() - Math.random()) * .5;
			rock.position.x= 10;
			rock.position.y = -.5;
		scene.add(rock);

		var last = Date.now();
		var interval = setInterval(function(){
			var now = Date.now();
			var dt = now - last;
				last = now;


			rock.position.x -= dt * .05;

			if(rock.position.x < -10){
				scene.remove(rock);
				clearInterval(interval);
			}


		}, 17)


	}, 200)


	var render = function () {
		stats.begin();
		renderer.render(scene ,camera);
		stats.end();

		requestAnimationFrame(render);
	}

	render();


}


/* lights
	setInterval(function(){
		var now = Date.now();
		light0.position.x = Math.cos(now/2000) * 10;
		light0.position.z = Math.sin(now/2000) * 10
		light0.position.y = 5;
	}) */



	/* breaking stuff was fun
	window.addEventListener("mousedown", function (e) {
		if(e.which == 1){
			var mouse = new THREE.Vector2( (e.pageX / window.innerWidth)*2-1, -(e.pageY / window.innerHeight)*2+1 );
			raycaster.setFromCamera(mouse, camera);

			var intersects = raycaster.intersectObjects(scene.children, false);
			var first = intersects[0];
			if(first){
				var dude = scene.children[0];
				dude.children.forEach(function(child){
					child.veloctiy = new THREE.Vector3(
						(Math.random() - Math.random())/30, 
						Math.random()/30,
						(Math.random() - Math.random())/30)
				})

				var center = new THREE.Vector3(0, 0, 0);
				setInterval(function(){
					dude.children.forEach(function(child){
						child.position.add(child.veloctiy)
						child.veloctiy.y -= .001;
						child.veloctiy.x *= .99;
						child.veloctiy.z *= .99;
						child.veloctiy.y *= .99;

						//move
						
						//var dif = center.clone().sub(child.position);
						//var len = dif.length();
						//	dif.normalize();
						//child.veloctiy.add(dif.multiplyScalar(.1) ); 


					})
				}, 17)
				console.log("clicked object")
			}
		}
		
	}) */