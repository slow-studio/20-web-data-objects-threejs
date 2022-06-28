//creating the 3d scene
const scene=new THREE.Scene();
const gui=new dat.GUI();

//calling the declared functions
var plane=getPlane();
var ambLight=getAmbientLight(0.4);
var hemiLight=getHemiLight(0.4);
var pointLight1=getPointLight(0.2);
var spotLight1=getSpotLight(0.5);
var gltfObj1=getGLTFLoader('./assets/roun.glb',-0.5,0,1);        //here we are passing the obj location and positions as the parameter

//adding elements to the scene
scene.add(plane);
scene.add(hemiLight);
scene.add(spotLight1);

//rotating the plan on the x axis to use it as a floor
plane.rotateX( - Math.PI / 2);

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    55,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(-3,3,4);
spotLight1.position.set(30,20,25);

//add the light source as a child of the camera to make the camera as the soure of the light
camera.add(pointLight1);

//we need to add the camera to the scene as we created a child of it
scene.add(camera)

//adding the GUI controls for each element
const spotLightGUI=gui.addFolder('SpotLight Controls')
spotLightGUI.add(spotLight1, 'intensity').min(0).max(10).step(0.01);
spotLightGUI.add(spotLight1.position, 'x').min(-50).max(100).step(0.01);
spotLightGUI.add(spotLight1.position, 'y').min(-50).max(100).step(0.01);
spotLightGUI.add(spotLight1.position, 'z').min(-50).max(100).step(0.01);

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true,
    depth: true
});   //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
renderer.setClearColor(new THREE.Color('#ffffff'),0.45)
document.body.appendChild( renderer.domElement);


//setting up Orbit Controls
controls = new THREE.OrbitControls(camera,renderer.domElement);
//controls.enableRotate=false;

//function to get an Ambient Light-------------------
function getAmbientLight(intensity){
    const light=new THREE.AmbientLight(0xffffee);
    light.intensity=intensity;
    return light;
}

//function to add a hemi light
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
    return light;
}

//function to add a PointLight-----------------------
function getPointLight(intensity){
    const light = new THREE.PointLight(0xffffff, intensity);
    light.castShadow=true;
    // light.shadow.radius = 5;
    return light;
}


//function to add a spotlight
function getSpotLight(intensity){
    const light=new THREE.SpotLight(0xffffff,intensity);
    light.castShadow=true;
    
    light.shadow.bias= -0.00001;
    light.shadow.mapSize.width=1024*2;
    light.shadow.mapSize.height=1024*2;
    return light;
}

//function to add a plan-------------------------------
function getPlane(){
    const geometry=new THREE.PlaneGeometry(30,30);
    const material=new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = true;      //set this to true to allow the object to recieve the shadow
    return mesh;
}

//function to call the GLTF Loader----the obj location and positions are passed as parameters in the function call
function getGLTFLoader(assetLocation,positionX,positionY,positionZ){
    const loader=new THREE.GLTFLoader();
loader.load( assetLocation, function ( gltf ) {
    model=gltf.scene;

    const newMaterial = new THREE.MeshStandardMaterial({
                                    color: 0xffcc00,
                                   // wireframe: true,
                                    roughness: 0,
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


//animating the scene    
function animate() {
    requestAnimationFrame( animate );
    model.rotation.y += 0.0025;
    renderer.render( scene, camera );
}
animate();
