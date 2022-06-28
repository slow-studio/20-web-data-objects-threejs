//creating the 3d scene
const scene=new THREE.Scene();
const gui=new dat.GUI();


//calling the declared functions
var plane=getPlane();
var ambLight=getAmbientLight(0.35);
var pointLight1=getPointLight(0.5);
var pointLight2=getPointLight(0.1);

//adding elements to the scene
scene.add(plane);
scene.add(ambLight);
scene.add(pointLight1);
scene.add(pointLight2);

//rotating the plan on the x axis to use it as a floor
plane.rotateX( - Math.PI / 2);

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    45,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(-3,5,3);
pointLight1.position.set(5,12,5);
pointLight2.position.set(-10,20,-5);



//add the light source as a child of the camera to make the camera as the soure of the light
//camera.add(pointLight);

//we need to add the camera to the scene as we created a child of it
//scene.add(camera)

//adding the GUI controls for the point light
const pointLightGUI=gui.addFolder('point light intensity')
//adding the GUI controls
pointLightGUI.add(pointLight1, 'intensity').min(0).max(10).step(0.01);

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true
});   //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
document.body.appendChild( renderer.domElement);


//setting up Orbit Controls
controls = new THREE.OrbitControls(camera,renderer.domElement);

//function to get an Ambient Light-------------------
function getAmbientLight(intensity){
    const light=new THREE.AmbientLight(0xffffee);
    light.intensity=intensity;
    return light;
}

//function to add a PointLight-----------------------
function getPointLight(intensity){
    const light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow=true;
    return light;
}


//function to add a plan-------------------------------
function getPlane(){
    const geometry=new THREE.PlaneGeometry(400,400);
    const material=new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = true;      //set this to true to allow the object to recieve the shadow
    return mesh;
}
//function to call the GLTF Loader
const loader=new THREE.GLTFLoader();
loader.load( './assets/roun.glb', function ( gltf ) {
    model=gltf.scene;

    const newMaterial = new THREE.MeshPhongMaterial({color: 0xffcc00   
                        });
						model.traverse((o) => {
						if (o.isMesh) o.material = newMaterial;
						}); 

                        model.castShadow = true;
                        model.traverse(function (node) {
                          if (node.isMesh) {
                            node.castShadow = true;
                            //node.receiveShadow = true;
                          }
                        });
	scene.add(model);
}, undefined, function ( error ) {
	console.error( error );
} );



//animating the scene    
function animate() {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();
