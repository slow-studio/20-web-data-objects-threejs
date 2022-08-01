const scene = new THREE.Scene();
//const gui=new dat.GUI();

var plane=getPlane(20);
var cube1=getCube(0.5,0.5,0.5);
var cube2=getCube(0.4,0.4,0.4);
var sphere1=getSphere(0.35,32,16);
var pointLight1=getPointLight(7);
var pointLight1=getPointLight(7);


//setting position of the objects in the 3d plane
sphere1.position.set(-2,0);  //(position on x axis, position on y axis)
cube2.position.set(-0.8,-0.5);

plane.name = 'plane1';

plane.rotation.x = Math.PI/2;

//adding elements to the scene
scene.add(cube1);
scene.add(cube2);
scene.add(sphere1);
scene.add(pointLight1);
scene.add(plane);

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    30,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(-0.5,0,5);

//setting the position of the pointLight on the x,y,z coordinates
pointLight1.position.set(-1,1.2,1);

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    antialias: true,
});   //creating an instance of the renderer

renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
document.body.appendChild( renderer.domElement);

//function to display a sphere
function getSphere(radius,widthSegment,heightSegment){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshBasicMaterial({
        color: 0x44aa88
    });
    const mesh=new THREE.Mesh(geometry,material);
    return mesh;
}

//function to display a box cube
function getCube(width,height,depth){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshPhongMaterial({
        color: 0x44aa88
        });
    const mesh=new THREE.Mesh(geometry,material);    
    return mesh;
}

//function to add a plane
function getPlane(size) {
	var geometry = new THREE.PlaneGeometry(size, size);
	var material = new THREE.MeshPhongMaterial({
		color: 'rgb(164, 202, 224)',
		side: THREE.DoubleSide
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
	mesh.receiveShadow = true;
	return mesh;
}

//function to get PointLight
function getPointLight(intensity){
    const light = new THREE.PointLight(0xfae64b, intensity);
    return light;
}

//animating the scene    
function animate() {
    requestAnimationFrame( animate );
    cube1.rotation.x += 0.0025;		//rotate the cube in the x axis
    cube1.rotation.y += 0.0025;		//rotate the cube in the y axis
    
    cube2.rotation.y += 0.004;		//rotate the cube in the x axis
    cube2.rotation.x += 0.004;		//rotate the cube in the y axis


    renderer.render( scene, camera );
    }
    animate();
