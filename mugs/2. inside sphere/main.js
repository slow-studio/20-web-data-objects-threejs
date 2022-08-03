// add title and heading to sketch's html page.
document.title = 'mugs | inside cube'
document.getElementById('sketch_title').innerHTML = 'Mugs'
document.getElementById('sketch_description').innerHTML = 'Here we place the cups inside a sphere'


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
var gltfObj2=getGLTFLoader('../assets/cup2.glb',0,0.25,0);
var gltfObj3=getGLTFLoader('../assets/cup3.glb',2,0.45,1.4);

//adding the objects
var sphericalBox=getSphere(12,32,16,0xCCCCBE);
        

//adding the lights
var hemiLight=getHemiLight(0.45)
var directLight1=getDirectionalLight(0xffffcc,0.5);


/*--------------------setting up the object positions-------------------------*/
sphericalBox.position.set(0,11.4,0)


//setting up the light positions
directLight1.position.set(-0.97,1.96,1.23)

//adding the elements to the scene
scene.add(sphericalBox);
scene.add(hemiLight)
scene.add(directLight1)


//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    45,                                         
    ASPECT_RATIO,     
    1,                                        
    1000                                        
);

//set camera positions
camera.position.set(0,1.2,4);
camera.lookAt(0,0,0)


//setting up the renderer
const renderer=new THREE.WebGLRenderer({ 
    antialias:true,
});                     
//enabling shadow in render
renderer.shadowMap.enabled = true;               
 //adding shadow type as soft shadow           
renderer.shadowMap.type = THREE.PCFSoftShadowMap;          
//setting up the size of the renderer
renderer.setSize( CANVAS_WIDTH,CANVAS_HEIGHT);   
document.getElementById('content').appendChild( renderer.domElement);


//setting up orbit controls
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
Orbcontrols.enableZoom = false;
Orbcontrols.enablePan = false;
//prevent orbit controls from going below the ground
Orbcontrols.maxPolarAngle = Math.PI/2.2; 
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
                                    roughness: 1,                                   
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
    });
}


//function to get a spherical box-----------------------------
function getSphere(radius,widthSegment,heightSegment,color){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshStandardMaterial({      
        color: color,
        roughness:1,
        transparent: true,
        opacity:1
    });
    //allow the inside to have color, recieve color and shaodw
    material.side = THREE.BackSide;     
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
    //set this to true to allow the object to recieve the shadow
    mesh.receiveShadow = true;      
    return mesh;
}



/*--declaring the lights-------------------------------*/

//function to add a hemi light
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xffffff,0xffcc00, intensity)
    return light;
}


//function to add a direcitonal light
function getDirectionalLight(color,intensity){
    const light = new THREE.DirectionalLight( color, intensity );
    light.castShadow=true;
    light.shadow.bias=-0.001;
    light.shadow.mapSize.width=1024;
    light.shadow.mapSize.height=1024;
    return light;
}

//adding windows resize functionalities-------------
window.addEventListener( 'resize', onWindowResize );

//declaring function for onwindowresize
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
