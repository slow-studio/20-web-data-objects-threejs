// add title and heading to sketch's html page.
document.title = 'mugs | inside cube'
document.getElementById('sketch_title').innerHTML = 'Mugs'
document.getElementById('sketch_description').innerHTML = 'Here we place the mugs inside a cube, user can control the light settings accordingly'

/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO

//creating the 3d scene
const scene=new THREE.Scene();
const gui=new dat.GUI();

//adding the gltf objects
var gltfObj1=getGLTFLoader('../assets/cup1.glb',-1.5,0.5,1.5);
var gltfObj2=getGLTFLoader('../assets/cup2.glb',0,0.23,0);
var gltfObj3=getGLTFLoader('../assets/cup3.glb',2,0.45,1.4);

//adding the objects
var cubeBox=getCube(20,7,20,0xCCCCBE);
      

//adding the lights
var hemiLight=getHemiLight(0xffffff,0xffffff,0.45)
var directLight1=getDirectionalLight(0xffffcc,0.5);
var directLight2=getDirectionalLight(0xffffff,0.5);
var ambientLight=getAmbientLight(0xffffff,0.5)


/*--------------------setting up the object positions-------------------------*/
//setting up cubeBox positions
cubeBox.position.set(0,3,0)


//setting up the light positions
 directLight1.position.set(-2.3,1.5,-1)
 directLight2.position.set(-12.2,11.5,12)

//adding the elements to the scene
scene.add(cubeBox)
cubeBox.add(ambientLight)
cubeBox.add(hemiLight)
cubeBox.add(directLight1)
cubeBox.add(directLight2)

//set default light visibility
hemiLight.visible=false;
directLight1.visible=false

/*------------adding the light controls-----------------*/

//toggle hemi light, ambient light on and off
gui.add(ambientLight,'visible').name('ambient light')
gui.add(hemiLight,'visible').name('hemi light')

//adding the GUI controls for the point light
const directLightGUI1=gui.addFolder('direct light 1')
const directLightGUI2=gui.addFolder('direct light 2')

//adding the GUI controls for direct light 1
directLightGUI1.add(directLight1, 'visible')
directLightGUI1.add(directLight1, 'intensity').min(0).max(10).step(0.01);
directLightGUI1.add(directLight1.position, 'x').min(-50).max(50).step(0.01);
directLightGUI1.add(directLight1.position, 'y').min(0).max(50).step(0.01);
directLightGUI1.add(directLight1.position, 'z').min(-50).max(50).step(0.01);

//adding the GUI controls for direct light 2
directLightGUI2.add(directLight2, 'visible')
directLightGUI2.add(directLight2, 'intensity').min(0).max(10).step(0.01);
directLightGUI2.add(directLight2.position, 'x').min(-100).max(100).step(0.01);
directLightGUI2.add(directLight2.position, 'y').min(-100).max(100).step(0.01);
directLightGUI2.add(directLight2.position, 'z').min(-100).max(100).step(0.01);

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    45,                                         
    ASPECT_RATIO,     
    1,                                        
    1000                                        
);

//set camera positions
camera.position.set(0,1.5,4);


//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    antialias:true,
    depth: true
});                     
 //enabling shadow in render
renderer.shadowMap.enabled = true;        
 //adding shadow type as soft shadow                 
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
//setting up the size of the renderer         
renderer.setSize(CANVAS_WIDTH,CANVAS_HEIGHT);   

document.getElementById('content').appendChild( renderer.domElement);


//setting up orbit controls
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
Orbcontrols.enableZoom = false;
Orbcontrols.enablePan = false;
//prevent orbit controls from going below the ground
Orbcontrols.maxPolarAngle = Math.PI/2.1; 
//damping     
Orbcontrols.enableDamping = true;   
//damping inertia
Orbcontrols.dampingFactor = 0.25;   


//--function to call the GLTF Loader----the obj location and positions are passed as parameters in the function call
function getGLTFLoader(assetLocation,positionX,positionY,positionZ){
    const loader=new THREE.GLTFLoader();
loader.load( assetLocation, function ( gltf ) {
    model=gltf.scene;

    const newMaterial = new THREE.MeshStandardMaterial({
                                    color: 0xffcc00,                                 
                                    roughness: 80,
                                    
                        });
						model.traverse((o) => {
						if (o.isMesh) o.material = newMaterial;
						}); 
 
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
    const material=new THREE.MeshStandardMaterial({      
        color: colour,
        roughness:1,
        transparent: true,
        opacity:1
    });

    //allow the inside to have color, recieve color and shaodw
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
    //set this to true to allow the object to recieve the shadow
    mesh.receiveShadow = true;      
    return mesh;
}


/*--declaring the lights-------------------------------*/

//function to get an ambient light
function getAmbientLight(color,intensity){
    const light=new THREE.AmbientLight(color,intensity);
    return light;
}

//function to add a hemi light
function getHemiLight(color, groundColor,intensity){
    const light=new THREE.HemisphereLight(color, groundColor, intensity)
    return light;
}

//function to add a direcitonal light
function getDirectionalLight(color,intensity){
    const light = new THREE.DirectionalLight( color, intensity );
    light.castShadow=true;
    light.target.position.set(0,0,0)
    
    light.shadow.bias=-0.001;

    light.shadow.mapSize.width=1024
    light.shadow.mapSize.height=1024

    light.shadow.camera.near=0.1;
    light.shadow.camera.far=200.0;
    light.shadow.camera.left=-100;
    light.shadow.camera.right=100;
    light.shadow.camera.top=50;
    light.shadow.camera.bottom=-40;

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
