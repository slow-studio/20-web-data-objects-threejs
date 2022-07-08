console.log("external objecr script running")

//creating the scene
const scene=new THREE.Scene();
const gui=new dat.GUI()

//adding the objects to this array for interactivity
var objects=[];

//creating a group
var gltfGrop=new THREE.Group();

//creating the scene mesh
var sceneMeshes = []
// sceneMeshes=new THREE.Mesh

const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

//adding a grid helper to the scene
const gridHelper=new THREE.GridHelper(10,10,0x000000,0xffffff);
// gridHelper.position.y =-0.5
// scene.add(gridHelper);


//object to call the external assets
rgbeLoader=getRGBLoader('./images/img3_4k.hdr') 
var gltfObj1=getGLTFLoader('./assets/roun.glb',0,-1,0,0xffcc00);        //here we are passing the obj location and positions as the parameter


//adding elements to the scene

//adding the spheres
for(let i=0;i<150;i++){
    console.log(i)
    var color=Math.random() * 0xffffff;
    var rad=Math.random()*0.3;
    var object=getSphere(rad,32,16,color);

    //setting position for the object in random across the screen
    object.position.x = (Math.random()) * 7-4;
    object.position.y = Math.random() * 3;
    object.position.z = (Math.random()) * 4-2;
    scene.add( object );
    objects.push( object );
}


//creaitng parent container 1
var parentContainer1=new THREE.Mesh();
scene.add(parentContainer1);
    for(let j=0;j<50;j++){
        parentContainer1.add(objects[j])
    }

//creaitng parent container 2
var parentContainer2=new THREE.Mesh();
scene.add(parentContainer2);
for(let j=30;j<100;j++){
    parentContainer2.add(objects[j])
}

//creaitng parent container 3
var parentContainer3=new THREE.Mesh();
scene.add(parentContainer3);
for(let j=60;j<150;j++){
    parentContainer3.add(objects[j])
}   

//setting up perspective camera
var camera=new THREE.PerspectiveCamera(
    40,                                      	 			//camera FOV
    window.innerWidth/window.innerHeight,    	 			//camera aspectRatio
    1,                                     	 				//nearSight
    1000                                     		 		//farSight
);

//set camera positions
camera.position.set(0,3,10);    	 	//set the camera position on on x,y,z axes
camera.lookAt(0,0,0)            	//makes the camera look at the center of the object

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true,
    depth: true
});                     //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
renderer.setClearColor(new THREE.Color('#ffffff'),0.45)

//used to appx appearence of hdr o ndevice monitor
renderer.toneMapping=THREE.ACESFilmicToneMapping;

//exposure level of tonemapping, def=1
renderer.toneMappingExposure=0.6;

//interpolating color gradients
renderer.outputEncoding=THREE.sRGBEncoding;

document.body.appendChild( renderer.domElement);


//setting up orbit controls
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
Orbcontrols.maxDistance=12;    //set max zoom(dolly) out distance for perspective camera, default=infinity
// controls.minDistance=0.75
//Orbcontrols.maxPolarAngle = Math.PI/2.1;     //prevent orbit controls from going below the ground
Orbcontrols.enableDamping = true;   //damping 
Orbcontrols.dampingFactor = 0.25;   //damping inertia

//setting up drag controls to drag an object around the screen
const dControls = new THREE.DragControls( objects, camera, renderer.domElement );
dControls.addEventListener( 'drag', render );

//disabling orbit controls when drag controls are started
dControls.addEventListener('dragstart',function(event){
	Orbcontrols.enabled=false;
})
dControls.addEventListener('dragend',function(event){
	Orbcontrols.enabled=true;
})

//drag hoverON
dControls.addEventListener("hoveron", function(event){
    console.log(event.object)
    event.object.scale.x*=1.2
    event.object.scale.y*=1.2
    event.object.scale.z*=1.2
    event.object.material.opacity=0.5
   // event.object.material.color.setHex( Math.random() * 0xffffff );
})

//drag hoverOFF
dControls.addEventListener("hoveroff", function(event){
    console.log(event.object)
    event.object.scale.x/=1.2
    event.object.scale.y/=1.2
    event.object.scale.z/=1.2
    event.object.material.opacity=1
   // event.object.material.color.setHex( Math.random() * 0xffffff );
})

//declaring the functions

//adding the RGBE Loader
function getRGBLoader(assetLocation){
    const RGBELoader=new THREE.RGBELoader();
    RGBELoader.load(assetLocation,function(texture){
        texture.mapping=THREE.EquirectangularReflectionMapping;
        scene.background=texture;
        scene.environment=texture;
        });
}

//function to call the GLTF Loader----the obj location and positions are passed as parameters in the function call
function getGLTFLoader(assetLocation,positionX,positionY,positionZ,clr){
    const loader=new THREE.GLTFLoader();
    
    let modelGroup= new THREE.Group
    let modelDragBox=new THREE.Mesh

loader.load( assetLocation, function ( gltf ) {
    model1=gltf.scene;

    const newMaterial = new THREE.MeshStandardMaterial({
                                    color: clr,
                                    transparent: true,
                                    opacity: 1
                                   // wireframe: true,
                                   // roughness: 0,
                                   // emissive: 0x000000,                     
                        });
						model1.traverse((o) => {
						if (o.isMesh) o.material = newMaterial;
						}); 

                        //model.wireframe=true    
                        model1.castShadow = true;
                        model1.traverse(function (node) {
                          if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                          }
                        });

    model1.scale.x*=1.5
    model1.scale.y*=1.5
    model1.scale.z*=1.5
    model1.position.set(positionX,positionY,positionZ);        
   
    scene.add(model1);
    sceneMeshes.push(model1)
    return model1; 
	
}, undefined, function ( error ) {
	console.error( error );
} );
}

//function to get a sphere-----------------------------
function getSphere(radius,widthSegment,heightSegment,color){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshStandardMaterial({      
        color: color,
        metalness:0.1,
        roughness:0.5,
        transparent: true,
        opacity:1
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.receiveShadow=true;
    mesh.castShadow=true;    
    return mesh;
}

//adding windows resize functionalities-------------
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // render();
}

//function to animate the scene------
animate();
function animate() {   
   // TWEEN.update();
    requestAnimationFrame( animate );
   //  model1.rotation.y += 0.0025;

     parentContainer1.rotation.x+=0.0025;
     parentContainer2.rotation.y+=0.0025;
     parentContainer3.rotation.z+=0.0025;
     
   // camera.lookAt( scene.position );
    render();
}
function render() {
    renderer.render( scene, camera );
}
