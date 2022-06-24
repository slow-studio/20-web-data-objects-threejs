//creating the scene
const scene=new THREE.Scene();
const gui=new dat.GUI();

//calling the declared function
var cube=getCube(1,1,1);            //adding a cube to the scene
var pointLight=getPointLight(3);    //adding a point light,the variable passes the light intensity
var lightSource=getSphere(0.05);    //adding the light source
var plane=getPlane();               //adding the plane

//adding the individual objects to the scene
scene.add(cube);
scene.add(pointLight);
pointLight.add(lightSource);
scene.add(plane);

//rotating the plan on the x axis to use it as a floor
plane.rotateX( - Math.PI / 2);

const pointLightGUI=gui.addFolder('point light')

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    55,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(3,3,3);

//setting the position of the pointLight on the x,y,z coordinates
pointLight.position.set(0,1.9,0);

//setting the position of the box with respect to the y ais on top of the plan
cube.position.y = cube.geometry.parameters.height/2;  

//adding the GUI controls
pointLightGUI.add(pointLight, 'intensity').min(0).max(10).step(0.01);
pointLightGUI.add(pointLight.position, 'x').min(-1).max(3).step(0.01);
pointLightGUI.add(pointLight.position, 'y').min(1.48).max(5).step(0.01);
pointLightGUI.add(pointLight.position, 'z').min(-1).max(3).step(0.01);

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true
});   //creating an instance of the renderer

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
document.body.appendChild( renderer.domElement);

//setting up controls for orbit control
controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.rotateSpeed = 0.75;              

//function to display a box cube
function getCube(width,height,depth){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshPhongMaterial({
        color: 0x44aa88
        });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.castShadow = true;           //set this to true to allow the object to cast shadow
    return mesh;
}

//function to add a plan
function getPlane(){
    const geometry=new THREE.PlaneGeometry(3,3);
    const material=new THREE.MeshPhongMaterial({
        color: 0xffff00,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = true;      //set this to true to allow the object to recieve the shadow
    return mesh;
}

//function to add a PointLight
function getPointLight(intensity){
    const light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow=true;
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
    renderer.render( scene, camera );
}
animate();

