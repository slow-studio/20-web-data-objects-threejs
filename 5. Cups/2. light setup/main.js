console.log("initiate shpere position")

console.log("initiating cups")

//creating the 3d scene
const scene=new THREE.Scene();
const gui=new dat.GUI();

//adding the gltf objects
var gltfObj1=getGLTFLoader('./assets/cup1.glb',-1.5,0.5,1.5);
// var gltfObj2=getGLTFLoader('../assets/cup2.glb',0.6,-0.32,-1);
var gltfObj2=getGLTFLoader('./assets/cup2.glb',0.6,-0.4,-1);
var gltfObj3=getGLTFLoader('./assets/cup3.glb',2,0.45,1.4);

//adding the objects
var cubeBox=getCube(20,7,20,0xCCCCBE);
var sphericalBox=getSphere(12,32,16,0xffffff);
var plane1=getPlane(15,10,0xffffff);
var shadowPlane1=getShadowPlane()         

//adding the lights
var hemiLight=getHemiLight(0.7)
var rectLight=getRectArLight(2,0xffffff,10,10);
var pointLight1=getPointLight(0xffffff,0.5);
var directLight1=getDirectionalLight(0xffffcc,0.65);
var directLight2=getDirectionalLight(0xffffff,0.5);
var ambientLight=getAmbientLight(0xffffff,0.5)

//rotating the plan on the x axis to use it as a floor
rectLight.rotateX( - Math.PI / 2);  

/*--------------------setting up the object positions-------------------------*/
//setting up cubeBox positions
cubeBox.position.set(0,3,0)
// sphericalBox.position.set(0,9.42,0)
sphericalBox.position.set(0,11.4,0)


// shadowPlane1.position.set(0,-0.5)
shadowPlane1.rotateX( - Math.PI / 2);    //rotating the shadow plan to align with the original plan

//setting up the light positions
rectLight.position.set(-2,4,5)
//  directLight1.position.set(-2.3,1.5,-1)
directLight1.position.set(-0.97,1.96,1.23)
 directLight2.position.set(-12.2,11.5,12)
 pointLight1.position.set(-5,5,5);

//adding the elements to the scene
// scene.add(cubeBox);
scene.add(sphericalBox);
// sphericalBox.add( shadowPlane1 );
scene.add(hemiLight)
scene.add(rectLight);
scene.add(ambientLight)
scene.add(directLight1)
scene.add(directLight2)
scene.add(pointLight1);

//set ambient light and direct light 2 to invisible by default
// hemiLight.visible = false
rectLight.visible = false
ambientLight.visible = false
directLight1.visible = false

/*------------adding the light controls-----------------*/

//toggle hemi light, ambient light on and off
gui.add(hemiLight,'visible').name('hemi light')
gui.add(ambientLight,'visible').name('ambient light')
gui.add(rectLight,'visible').name('rect area light')
gui.add(pointLight1,'visible').name('Point light')
gui.add(directLight1, 'visible').name('Direct Light')


//adding the GUI controls for the point light
const directLightGUI1=gui.addFolder('direct light 1')
const pointLighttGUI1=gui.addFolder('Point light 1')
// const directLightGUI2=gui.addFolder('direct light 2')

//adding the GUI controls for direct light 1
directLightGUI1.add(directLight1, 'intensity').min(0).max(10).step(0.01);
directLightGUI1.add(directLight1.position, 'x').min(-50).max(50).step(0.01);
directLightGUI1.add(directLight1.position, 'y').min(0).max(50).step(0.01);
directLightGUI1.add(directLight1.position, 'z').min(-50).max(50).step(0.01);

// adding the GUI controls for point light1
pointLighttGUI1.add(pointLight1, 'intensity').min(0).max(10).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'x').min(-100).max(100).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'y').min(-100).max(100).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'z').min(-100).max(100).step(0.01);

//adding the GUI controls for direct light 2
// directLightGUI2.add(directLight2, 'visible')
// directLightGUI2.add(directLight2, 'intensity').min(0).max(10).step(0.01);
// directLightGUI2.add(directLight2.position, 'x').min(-100).max(100).step(0.01);
// directLightGUI2.add(directLight2.position, 'y').min(-100).max(100).step(0.01);
// directLightGUI2.add(directLight2.position, 'z').min(-100).max(100).step(0.01);

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    40,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    // win_width/win_height,
    1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(0,1.2,4);
camera.lookAt(0,0,0)

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
// renderer.setSize( 1024/720);
renderer.setClearColor(new THREE.Color('#808080'),0.45)
// document.body.appendChild( renderer.domElement);
document.getElementById('canvas1').appendChild( renderer.domElement );

// gui.add(renderer.shadowMap,'enabled').name('shadow')

//setting up orbit controls
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
Orbcontrols.enableZoom = false;
Orbcontrols.enablePan = false;
// Orbcontrols.maxDistance=12;      //set max zoom(dolly) out distance for perspective camera, default=infinity
// Orbcontrols.minDistance=0
Orbcontrols.maxPolarAngle = Math.PI/2.2;     //prevent orbit controls from going below the ground
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
                                   metalness:0.2,
                                    roughness: 70,
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

//function to add a cubical box---------------
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

//function to get a spherical box-----------------------------
function getSphere(radius,widthSegment,heightSegment,color){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshStandardMaterial({      
        color: color,
        metalness:0.5,
        roughness:40,
        transparent: true,
        opacity:1
    });
    material.side = THREE.BackSide;     //allow the inside to have color, recieve color and shaodw
    const mesh=new THREE.Mesh(geometry,material);
    mesh.receiveShadow=true;
    mesh.castShadow=true;    
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
    const mesh = new THREE.Mesh( sphericalBox.geometry, material );
    mesh.receiveShadow = true;
    mesh.position.copy( sphericalBox.position );   //the shadow plan will copy its position from the original plan
    return mesh;    
}    

/*--declaring the lights-------------------------------*/

//function to get an ambient light
function getAmbientLight(color,intensity){
    const light=new THREE.AmbientLight(color,intensity);
    return light;
}

//function to add a point light
function getPointLight(color,intensity){
    const light=new THREE.PointLight(color,intensity);
    light.castShadow=true;

    light.shadow.mapSize.width=1024
    light.shadow.mapSize.height=1024
    light.shadow.camera.near=0.1;
    light.shadow.camera.far=500.0;

    return light;
}

//function to add a hemi light
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xCCCCBE,0xffffee, intensity)
    return light;
}

//function to add a rectangualr area light
function getRectArLight(intensity,colour,width,height){
    const light=new THREE.RectAreaLight(colour,intensity,width,height);
    return light;
}

//function to add a direcitonal light
function getDirectionalLight(color,intensity){
    const light = new THREE.DirectionalLight( color, intensity );
    light.castShadow=true;
    light.shadow.bias=-0.001;
    light.shadow.mapSize.width=1024
    light.shadow.mapSize.height=1024

    light.shadow.camera.near=0.1;
    light.shadow.camera.far=500.0;
    light.shadow.camera.left=-50;
    light.shadow.camera.right=30;
    light.shadow.camera.top=30;
    light.shadow.camera.bottom=-50;
    return light;
}

//adding windows resize functionalities-------------
 window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.setSize( window.innerWidth, window.innerHeight );
}

//animating the scene    
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();
