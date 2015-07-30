

//@TODO try merging faces
//@TODO try making a loader
//@TODO try making table for cube version. That could be baked too but shrug.




var C3D = {};

C3D.canvas = document.createElement("canvas")
C3D.ctx = C3D.canvas.getContext("2d");

C3D.faces = [
	new THREE.Face3(0, 1, 2),
	new THREE.Face3(0, 2, 3),
	new THREE.Face3(5, 4, 6),
	new THREE.Face3(4, 7, 6),
	new THREE.Face3(1, 5, 6),
	new THREE.Face3(1, 6, 2),
	new THREE.Face3(4, 0, 3),
	new THREE.Face3(4, 3, 7),
	new THREE.Face3(3, 2, 7),
	new THREE.Face3(2, 6, 7),
	new THREE.Face3(4, 5, 1),
	new THREE.Face3(4, 1, 0)
]

C3D.fromImage = function (image, props) {
	var canvas = this.canvas, ctx = this.ctx, faces = this.faces;

	props = props || {};

	var isSolid = props.isSolid || function (r, g, b, a) {
		return a !== 0;
	}

	var cull = props.optimize || false;
	var object = props.object || new THREE.Object3D();

	canvas.width = image.width;
	canvas.height = image.height;
	ctx.drawImage(image, 0, 0, image.width, image.height);

	var pixels = ctx.getImageData(0, 0, image.width, image.height).data;
	var grid = [];
	for(var x = 0; x < image.width;x++){
		grid[x] = [];
		for(var y = 0; y < image.height;y++){
			var index = (x * 4) + (y * (image.width * 4))
			grid[x][image.height - 1 - y] = {
				isSolid : isSolid(pixels[index], pixels[index+1], pixels[index+2], pixels[index+3], x, y),
				color : new THREE.Color(pixels[index+0]/255, pixels[index+1]/255, pixels[index+2]/255)
			};
		}
	}


	var scale = props.scale || 1; //assumes perfectly square images for now. 
	var scaleZ = props.scaleZ || 1;//I know weird. 

	var pw = 1/image.width * scale;
	var ph = 1/image.width * scale;
	var pz = pw * scaleZ;

	var vertices  = [
		new THREE.Vector3(pw/2, ph/2, pz/2),
		new THREE.Vector3(-pw/2, ph/2, pz/2),
		new THREE.Vector3(-pw/2, -ph/2, pz/2),
		new THREE.Vector3(pw/2, -ph/2, pz/2),

		new THREE.Vector3(pw/2, ph/2, -pz/2),
		new THREE.Vector3(-pw/2, ph/2, -pz/2),
		new THREE.Vector3(-pw/2, -ph/2, -pz/2),
		new THREE.Vector3(pw/2, -ph/2, -pz/2)
	]

	
	if(cull){//@maybe make all the faces the same and just push indices in? would be a lot faster actuall. 
		var colors = {};
		var colorTable = {}
		for(var x = 0; x < image.width;x++){
			for(var y = 0; y < image.height;y++){
				var data = grid[x][y]

				if(!data.isSolid) continue;

				var geom = new THREE.Geometry();
				var offset = new THREE.Vector3(x * pw - image.width/2 * pw, y * ph - image.height/2 * ph, 0);
					geom.vertices = vertices.slice();
				
					geom.faces.push(faces[0]);
					geom.faces.push(faces[1]);
					geom.faces.push(faces[2]);
					geom.faces.push(faces[3]);


					if(x == 0 || !grid[x-1][y].isSolid){
						geom.faces.push(faces[4]);
						geom.faces.push(faces[5]);
					}

					if(x == image.width -1 || !grid[x+1][y].isSolid){
						geom.faces.push(faces[6]);
						geom.faces.push(faces[7]);
					}

					if(y == 0 || !grid[x][y-1].isSolid){
						geom.faces.push(faces[8]);
						geom.faces.push(faces[9]);
		
					}

					if(y == image.height -1 || !grid[x][y+1].isSolid){
						geom.faces.push(faces[10]);
						geom.faces.push(faces[11]);

					}


					var hex = data.color.getHexString();
				
					if(colors[hex]) {
						var matrix = new THREE.Matrix4();
							matrix.setPosition(offset);

						colors[hex].merge(geom, matrix);

					}else {
						geom.vertices = geom.vertices.map(function(vertex) {
							return vertex.clone().add(offset)
						})
						colors[hex] = geom;
						colorTable[hex] = data.color;
					} 

			}
		}

		for(var hex in colors){
			var material = new THREE.MeshBasicMaterial({ color : colorTable[hex]});
			colors[hex].computeFaceNormals();
			object.add(new THREE.Mesh(colors[hex], material));
		}  

	}else{
		var geom = new THREE.BoxGeometry(pw, ph, pz);//make a table for known materials as well. @TODO
		var colorTable = {};
		for(var x = 0; x < image.width;x++){
			for(var y = 0; y < image.height;y++){
				var data = grid[x][y]
				if(!data.isSolid) continue;
				
				var hex = data.color.getHexString();
				if(!colorTable[hex]){
					colorTable[hex] = new THREE.MeshBasicMaterial({ color : data.color })
				}
				var mat = colorTable[hex];
				var mesh = new THREE.Mesh(geom, mat);
					mesh.position.x = x * pw - image.width/2 * pw;
					mesh.position.y = y * ph - image.height/2 * ph;
				object.add(mesh);
			}
		}
	}

	return object;
}


C3D.fromUrl = function (url, props, cb) {
	props = Object.create(props || {});
	if(!props.object) props.object = new THREE.Object3D();

	var image = new Image();
		image.onload = function () {
			C3D.fromImage(this, props);
			if(cb) cb();
		}
		image.src = url;
	return props.object;
}

C3D.fromUrls = function(urls, props, cb) {
	var loaded = 0, toLoad = urls.length
	return urls.map(function(url) {
		return C3D.fromUrl(url, props, function () {
			if(toLoad == ++loaded && cb) cb();
		});
	})
}

C3D.createJSONFromUrl = function () {

}

C3D.createJSONFromUrls = function () {

}



/*

	C3D.loadFromUrl


	C3D.loadFromUrls

	C3D.loadFromFile


	C3D.createJSONFromUrl

	C3D.createJSONFromUrls */
