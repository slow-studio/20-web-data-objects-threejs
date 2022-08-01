//creating the scene
const scene = new THREE.Scene();

//calling the functions of each individual element
var cube=getCube(1,1,1);            //adding a cube to the scene
var pointLight=getPointLight(3);    //adding a point light,the variable passes the light intensity
var lightSource=getSphere(0.05);    //adding the light source

//adding elements to the scene
scene.add(cube);
scene.add(pointLight);
pointLight.add(lightSource);

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    45,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(0,0,5);

//setting the position of the pointLight on the x,y,z coordinates
pointLight.position.set(-1,1.5,0.5);

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true
});   //creating an instance of the renderer

renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
document.body.appendChild( renderer.domElement);

//function to display a box cube
function getCube(width,height,depth){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshPhongMaterial({
        color: 0x44aa88
        });
    const mesh=new THREE.Mesh(geometry,material);    
    return mesh;
}

//function to add a PointLight
function getPointLight(intensity){
    const light = new THREE.PointLight(0xffffff, intensity);
    return light;
}

//function to get a sphere
function getSphere(size) {
	var geometry = new THREE.SphereGeometry(size, 24, 24);
	var material = new THREE.MeshBasicMaterial({
		color: 0xffffff
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
	return mesh;
}

//animating the scene    
function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.0025;		//rotate the cube in the x axis
    cube.rotation.y += 0.0025;		//rotate the cube in the y axis
    renderer.render( scene, camera );
}
animate();



