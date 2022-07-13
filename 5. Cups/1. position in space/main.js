console.log("initiating cups")

//creating the 3d scene
const scene=new THREE.Scene();
const gui=new dat.GUI();

//adding the gltf objects
var gltfObj1=getGLTFLoader('../assets/cup1.glb',-1.5,0.5,1.5);
var gltfObj2=getGLTFLoader('../assets/cup2.glb',0.6,-0.32,-1);
var gltfObj3=getGLTFLoader('../assets/cup3.glb',2,0.45,1.4);

//adding the objects
var cubeBox=getCube(20,7,20,0xCCCCBE);
var plane1=getPlane(15,10,0xffffff);
var shadowPlane1=getShadowPlane()         

//adding the lights
var hemiLight=getHemiLight(0.45)
var directLight1=getDirectionalLight(0xffffcc,0.5);
var directLight2=getDirectionalLight(0xffffff,0.5);
var ambientLight=getAmbientLight(0xffffff,0.5)

//rotating the plan on the x axis to use it as a floor
plane1.rotateX( - Math.PI / 2);

/*--------------------setting up the object positions-------------------------*/
//setting up cubeBox positions
cubeBox.position.set(0,3,0)

shadowPlane1.position.set(0,-0.5)
shadowPlane1.rotateX( - Math.PI / 2);    //rotating the shadow plan to align with the original plan

//setting up the light positions
 directLight1.position.set(-2.3,1.5,-1)
 directLight2.position.set(-12.2,11.5,12)

//adding the elements to the scene
scene.add(cubeBox)
scene.add( shadowPlane1 );
cubeBox.add(hemiLight)
// scene.add(ambientLight)
cubeBox.add(directLight1)
cubeBox.add(directLight2)

/*------------adding the light controls-----------------*/
//adding the GUI controls for the point light
const directLightGUI1=gui.addFolder('direct light 1')
const directLightGUI2=gui.addFolder('direct light 2')

//adding the GUI controls for direct light 1
directLightGUI1.add(directLight1, 'intensity').min(0).max(10).step(0.01);
directLightGUI1.add(directLight1.position, 'x').min(-50).max(50).step(0.01);
directLightGUI1.add(directLight1.position, 'y').min(0).max(50).step(0.01);
directLightGUI1.add(directLight1.position, 'z').min(-50).max(50).step(0.01);

//adding the GUI controls for direct light 1
directLightGUI2.add(directLight2, 'intensity').min(0).max(10).step(0.01);
directLightGUI2.add(directLight2.position, 'x').min(-50).max(50).step(0.01);
directLightGUI2.add(directLight2.position, 'y').min(0).max(100).step(0.01);
directLightGUI2.add(directLight2.position, 'z').min(-50).max(50).step(0.01);

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    45,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(0,1.5,4);

//adding a grid helper to the scene
const gridHelper=new THREE.GridHelper(10,10,0x000000,0xffffff);
// scene.add(gridHelper);
gridHelper.position.set(0,-0.5,0);

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true,
    depth: true
});                     //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
renderer.setClearColor(new THREE.Color('#808080'),0.45)
document.body.appendChild( renderer.domElement);

//setting up orbit controls
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
// Orbcontrols.maxDistance=12;    //set max zoom(dolly) out distance for perspective camera, default=infinity
// controls.minDistance=0.75
Orbcontrols.maxPolarAngle = Math.PI/2.1;     //prevent orbit controls from going below the ground
Orbcontrols.enableDamping = true;   //damping 
Orbcontrols.dampingFactor = 0.25;   //damping inertia

//--function to call the GLTF Loader----the obj location and positions are passed as parameters in the function call
function getGLTFLoader(assetLocation,positionX,positionY,positionZ){
    const loader=new THREE.GLTFLoader();
loader.load( assetLocation, function ( gltf ) {
    model=gltf.scene;

    const newMaterial = new THREE.MeshStandardMaterial({
                                    color: 0xffcc00,
                                   // wireframe: true,
                                    roughness: 100,
                                    emissive: 0x000000,
                                    
                        });
						model.traverse((o) => {
						if (o.isMesh) o.material = newMaterial;
						}); 

                        //model.wireframe=true    
                        model.castShadow = true;
                        model.traverse(function (node) {
                          if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                          }
                        });
    model.position.set(positionX,positionY,positionZ);                        
	scene.add(model);
}, undefined, function ( error ) {
	console.error( error );
} );
}

//function to add a box---------------
function getCube(width,height,depth,colour){
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const material = new THREE.MeshPhongMaterial({
        color: colour
    });
    material.side = THREE.BackSide; 
    const mesh = new THREE.Mesh( geometry, material );
    mesh.receiveShadow = true;
    return mesh;  
}


//function to add a plan-------------------------------
function getPlane(length,breadth,colour){
    const geometry=new THREE.PlaneGeometry(length,breadth);
    const material=new THREE.MeshPhongMaterial({
        color: colour,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = true;      //set this to true to allow the object to recieve the shadow
    return mesh;
}

/*function to add a shadow plan---
----------------a shadow plan is used for casting dynamic shadows---------------*/
function getShadowPlane(){
    const material = new THREE.ShadowMaterial();
	material.opacity = 0.2;
    const mesh = new THREE.Mesh( plane1.geometry, material );
    mesh.receiveShadow = true;
    mesh.position.copy( plane1.position );   //the shadow plan will copy its position from the original plan
    return mesh;    
}
    

/*--declaring the lights-------------------------------*/

//function to get an ambient light
function getAmbientLight(color,intensity){
    const light=new THREE.AmbientLight(color,intensity);
    return light;
}

//function to add a hemi light
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xCCCCBE,0xffffee, intensity)
    return light;
}

//function to add a direcitonal light
function getDirectionalLight(color,intensity){
    const light = new THREE.DirectionalLight( color, intensity );
    light.castShadow=true;
    return light;
}

//adding windows resize functionalities-------------
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//animating the scene    
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();
