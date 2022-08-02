let scene, 
camera, 
controls,
renderer,
height = window.innerHeight,
width = window.innerWidth;

//functon to create the scene
function createScene () {

let grid;
scene = new THREE.Scene();

renderer = new THREE.WebGLRenderer({ 
antialias: true,
alpha: true
});
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

grid = new THREE.GridHelper(100, 5);
scene.add(grid);
}

function createCamera () {
camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);

//change the camera positions as required, it is necessary that you change atleast one axis as by default the camera is at (0,0,0).               
camera.position.x = 0;
camera.position.z = 50;     
camera.position.y = 13;

// camera.up = new THREE.Vector3(0,3,0);
// camera.lookAt(new THREE.Vector3(0,13,0));

controls = new THREE.OrbitControls(camera,renderer.domElement);

//disable pan and rotate
controls.enablePan = false;
controls.enableRotate=false;

//--enable the commands below to strict rotation around the y axis
// controls.minPolarAngle = Math.PI/2;
// controls.maxPolarAngle = Math.PI/2;

// controls.target = new THREE.Vector3(0, 13, 0);
controls.addEventListener('change', render);
}

//function to create lights
function createLights () {
let directionalLight, ambientLight;

directionalLight = new THREE.DirectionalLight(0x404040, 4);
directionalLight.position.set(0, 2000, 2000);
directionalLight.target.position.set(0, 2, 0);
scene.add(directionalLight);

ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);
}

//function to create a cube
function createCube(width,height,depth){
cubeGeom=new THREE.BoxGeometry(10,10,10);
cubeMaterial=new THREE.MeshNormalMaterial({

});
cube=new THREE.Mesh(cubeGeom,cubeMaterial); 
cube.position.y=(0);   
scene.add(cube);
}


//funciton to call the renderer and render the scene
function render () {
renderer.render(scene, camera);
}


//funciton to animate the frame
function animate() {
requestAnimationFrame( animate );
controls.update();
render();
}


createScene();
createCamera();
createLights();
createCube();                            
render();
animate();
</script> 
</body>
</html> 

