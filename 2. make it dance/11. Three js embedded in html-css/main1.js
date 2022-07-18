console.log("dynamic canvas 1")
var objects = [];
var count=0;

//creating the scene
const scene=new THREE.Scene();
const gui=new dat.GUI()

//calling objects
const sphere=getSphere(0.3,32,16,0xffffff);

//object to call the external assets
rgbeLoader=getRGBLoader('./images/img_4k.hdr') 

//adding the spheres
for(let i=0;i<30;i++){
      var color=Math.random() * 0xffffff;
    var rad=Math.random()*0.3;
    var object=getSphere(rad,32,16,color);

    //setting position for the object in random across the screen
    object.position.x = (Math.random()) * 7-4;
    object.position.y = Math.random() *4-2;
    object.position.z = (Math.random()) * 4-2;
    scene.add( object );
    objects.push( object );
}

//creaitng parent container 1
var parentContainer1=new THREE.Mesh();
scene.add(parentContainer1);
    for(let j=0;j<10;j++){
        parentContainer1.add(objects[j])
    }

//creaitng parent container 2
var parentContainer2=new THREE.Mesh();
scene.add(parentContainer2);
    for(let j=11;j<20;j++){
        parentContainer2.add(objects[j])
    }

//creaitng parent container 3
var parentContainer3=new THREE.Mesh();
scene.add(parentContainer3);
    for(let j=21;j<30;j++){
        parentContainer3.add(objects[j])
    }   

//adding elements to the scene


//info
info = document.createElement( 'div' );
info.style.position = 'relative';
info.style.top = '30px';
info.style.width = '100%';
info.style.textAlign = 'center';
info.style.color = '#f00';
info.style.backgroundColor = 'transparent';
info.style.zIndex = '1';
info.style.fontFamily = 'Monospace';
info.innerHTML = 'INTERSECT Count: ' + count;
document.getElementById('canvas1').appendChild( info );

//declaring the container element

var canvas1;
CANVAS_WIDTH=640,
CANVAS_HEIGHT=480;

//setting up perspective camera
var camera=new THREE.PerspectiveCamera(
    40,                                      	 			//camera FOV
    CANVAS_WIDTH/CANVAS_HEIGHT,    	 		            	//camera aspectRatio
    1,                                     	 				//nearSight
    1000                                     		 		//farSight
);

//set camera positions
camera.position.set(0,0,10);    	 	//set the camera position on on x,y,z axes
camera.lookAt(0,0,0)            	//makes the camera look at the center of the object


//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    // canvas: document.querySelector("canvas"),
    alpha:true,
    antialias:true,
    depth: true
});                     //creating an instance of the renderer


renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);   //setting up the size of the renderer

renderer.setClearColor(new THREE.Color('#ffffff'),0.45)

//used to appx appearence of hdr o ndevice monitor
renderer.toneMapping=THREE.ACESFilmicToneMapping;

//exposure level of tonemapping, def=1
renderer.toneMappingExposure=0.6;

//interpolating color gradients
renderer.outputEncoding=THREE.sRGBEncoding;

document.getElementById('canvas1').appendChild( renderer.domElement );
// document.body.appendChild( renderer.domElement);


//setting up orbit controls
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
Orbcontrols.maxDistance=12;    //set max zoom(dolly) out distance for perspective camera, default=infinity
Orbcontrols.minDistance=3
//Orbcontrols.maxPolarAngle = Math.PI/2.1;     //prevent orbit controls from going below the ground
Orbcontrols.enableDamping = true;   //damping 
Orbcontrols.dampingFactor = 0.25;   //damping inertia

/*--adding drag controls-----------------------------*/
//setting up drag controls to drag an object around the screen
const dControls = new THREE.DragControls( objects, camera, renderer.domElement );
dControls.addEventListener( 'drag', render );

//adding windows resize functionalities-------------
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
    camera.aspect = CANVAS_WIDTH/CANVAS_HEIGHT;
    camera.updateProjectionMatrix();
    
    renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
}

// find intersections
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
// mouse listener
document.addEventListener( 'mousedown', function( event ) {
    
    // For the following method to work correctly, set the canvas position *static*; margin > 0 and padding > 0 are OK
    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.clientHeight ) * 2 + 1;
    
    // For this alternate method, set the canvas position *fixed*; set top > 0, set left > 0; padding must be 0; margin > 0 is OK
    //mouse.x = ( ( event.clientX - container.offsetLeft ) / container.clientWidth ) * 2 - 1;
    //mouse.y = - ( ( event.clientY - container.offsetTop ) / container.clientHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

    intersects = raycaster.intersectObjects( objects );

    if ( intersects.length > 0 ) {
        
        info.innerHTML = 'INTERSECT Count: ' + ++count;
        console.log(intersects)
    }

}, false );

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

//adding the RGBE Loader
function getRGBLoader(assetLocation){
    const RGBELoader=new THREE.RGBELoader();
    RGBELoader.load(assetLocation,function(texture){
        texture.mapping=THREE.EquirectangularReflectionMapping;
        scene.background=texture;
        scene.environment=texture;
        });
}


//function to animate the scene------
animate();
function animate() { 
      
    requestAnimationFrame( animate );
    parentContainer1.rotation.x+=0.0025;
    parentContainer2.rotation.y+=0.0025;
    parentContainer3.rotation.z+=0.0025;
    render();
}
function render() {
    renderer.render( scene, camera );
}
