
var stats, scene, camera, renderer, controls, raycaster, render;

var init = function (ground) {
	
	



	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xffffff, 1)
	renderer.setSize(window.innerWidth, window.innerHeight)

	camera =  new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, .01, 100);
	
	camera.position.z = 3;
	camera.position.y = 0;


	controls = new THREE.OrbitControls(camera, renderer.domElement);
	//scene.add(camera);


	if(ground){
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 1), new THREE.MeshBasicMaterial({color : new THREE.Color(0xffd500)}));
		plane.material.side = THREE.DoubleSide;
		plane.position.y = -.57;
		plane.rotation.x = Math.PI/2;
		plane.scale.y = 500
		plane.scale.x = 500;
		scene.add(plane);
	}
	

	

	document.body.appendChild(renderer.domElement);

	
	raycaster = new THREE.Raycaster();


}

var render = function () {
	var loop = function () {
		renderer.render(scene ,camera);
		requestAnimationFrame(loop);
	}
	loop(); 
}