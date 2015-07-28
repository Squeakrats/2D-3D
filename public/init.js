
var stats, scene, camera, renderer, controls, raycaster, render;

var init = function (ground) {
	
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '20px';
	stats.domElement.style.top = '20px';
	stats.domElement.zIndex = 1;
	document.body.appendChild(stats.domElement)



	scene = new THREE.Scene();

	camera =  new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, .01, 100);
	camera.position.z = 2;
	camera.position.y = 2;

	//scene.add(camera);


	if(ground){
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 1), new THREE.MeshBasicMaterial({color : new THREE.Color("rgb(139,69,19)")}));
		plane.material.side = THREE.DoubleSide;
		plane.position.y = -.57;
		plane.rotation.x = Math.PI/2;
		scene.add(plane);
	}
	

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xfffff, 1)
	renderer.setSize(window.innerWidth, window.innerHeight)

	document.body.appendChild(renderer.domElement);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	raycaster = new THREE.Raycaster();


	window.addEventListener("mousedown", function (e) {
		if(e.which == 1){
			var mouse = new THREE.Vector2( (e.pageX / window.innerWidth)*2-1, -(e.pageY / window.innerHeight)*2+1 );
			raycaster.setFromCamera(mouse, camera);

			var intersects = raycaster.intersectObjects(scene.children, true);
			var first = intersects[0];
			if(first){

				var dude = first.object.parent;
				if(!dude.isKill) return;
			
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
						//child.velocity.add(diff);

					})
				}, 17)
				console.log("clicked object")
			}
		}
		
	})



}

var render = function () {
	var loop = function () {
		stats.begin();
		renderer.render(scene ,camera);
		stats.end();
		requestAnimationFrame(loop);
	}
	loop(); 
}