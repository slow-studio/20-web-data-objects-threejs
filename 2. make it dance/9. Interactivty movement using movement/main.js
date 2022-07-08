console.log("script running")

const scene=new THREE.Scene();
const gui=new dat.GUI()

var objects=[];         //all the objects are stored here to make them interactive
const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();       //adding raycaster to control the objects using the mouse


//calling objects to initiate the elements
rgbeLoader=getRGBLoader('./images/img_4k.hdr') 
hemiLight=getHemiLight(0.5);
spotLight=getSpotLight(0.5);

//adding elements to the scene
scene.add(hemiLight);
// scene.add(spotLight);

//adding the spheres
for(let i=0;i<90;i++){
		console.log(i)
		var color=Math.random() * 0xffffff;
		var rad=Math.random()*0.3;
		var object=getSphere(rad,32,16,color);
	
        //setting position for the object in random across the screen
		object.position.x = (Math.random()) * 7-5;
		object.position.y = Math.random() * 3;
		object.position.z = (Math.random()) * 4-2;

        scene.add( object );
		objects.push( object );
	
	}

//creaitng parent container 1
    var parentContainer1=new THREE.Mesh();
    scene.add(parentContainer1);
        for(let j=0;j<30;j++){
            parentContainer1.add(objects[j])
        }

//creaitng parent container 2
var parentContainer2=new THREE.Mesh();
scene.add(parentContainer2);
    for(let j=30;j<60;j++){
        parentContainer2.add(objects[j])
    }

//creaitng parent container 3
var parentContainer3=new THREE.Mesh();
scene.add(parentContainer3);
    for(let j=60;j<90;j++){
        parentContainer3.add(objects[j])
    }    

     	
// //setting up light positions
spotLight.position.set(10,300,1000)

//creating a grid
// const gridHelper=new THREE.GridHelper(10,10,0x000000,0xffffff);
// gridHelper.position.y =-0.5
// scene.add(gridHelper);

//setting up ther perspective camera
var camera=new THREE.PerspectiveCamera(
    50,                                      	 			//camera FOV
    window.innerWidth/window.innerHeight,    	 			//camera aspectRatio
    1,                                     	 				//nearSight
    1000                                     		 		//farSight
);

//set camera positions
camera.position.set(0,1,10);    	 	//set the camera position on on x,y,z axes
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
Orbcontrols.maxDistance=12;                 //set max zoom(dolly) out distance for perspective camera, default=infinity
Orbcontrols.minDistance=3
Orbcontrols.maxPolarAngle = Math.PI/2.1;    //prevent orbit controls from going below the ground
Orbcontrols.enableDamping = true;           //damping 
Orbcontrols.dampingFactor = 0.25;           //damping inertia

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

//adding eventListeners
//document.addEventListener( 'click', onClick );

//drag hoverON
dControls.addEventListener("hoveron", function(event){
    console.log(event.object)
    event.object.scale.x*=2
    event.object.scale.y*=2
    event.object.scale.z*=2
    event.object.material.color.setHex( Math.random() * 0xffffff );
})

//drag hoverOFF
dControls.addEventListener("hoveroff", function(event){
    console.log(event.object)
    event.object.scale.x/=2
    event.object.scale.y/=2
    event.object.scale.z/=2
    event.object.material.color.setHex( Math.random() * 0xffffff );
})

//drag Start
dControls.addEventListener("dragstart", function(event){
    console.log(event.object)
  
    event.object.material.opacity=0.5;
    //event.object.material.opacity=1;
})

dControls.addEventListener("dragend", function(event){
    console.log(event.object)
  
    event.object.material.opacity=1;
    //event.object.material.opacity=1;
})

window.addEventListener( 'keydown', onKeyDown );
window.addEventListener( 'keyup', onKeyUp );


//function to add a hemi light-------------------------
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
    return light;
}

//function to add a spotlight
function getSpotLight(intensity){
    const light=new THREE.SpotLight(0xffffff,intensity);
    light.castShadow=true;
    light.shadow.bias= -0.00001;
    light.shadow.mapSize.width=1024*4;
    light.shadow.mapSize.height=1024*4;
    return light;
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


//defining the mouseDown function
function onClick(event){
    console.log("intitate on click")
    console.log(event)
	
    event.preventDefault();
    var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,   
                                    -( event.clientY / window.innerHeight ) * 2 + 1,  
                                    0.5 );   
    var raycaster=new THREE.Raycaster();
    raycaster.setFromCamera(mouse3D,camera);
    
    var intersects=raycaster.intersectObjects(objects);
    
    console.log(intersects)

    if(intersects.length>0){
        
        intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
    }
	// render();
}

// function onClick(event){
//     console.log(event.object);
// }

//function onKeyDown
function onKeyDown( event ) {
	enableSelection = ( event.keyCode === 16 ) ? true : false;
}

//function onKeyUp
function onKeyUp() {
	enableSelection = false;
}



//adding windows resize functionalities-------------
window.addEventListener( 'resize', onWindowResize );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // render();
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
   // TWEEN.update();
    requestAnimationFrame( animate );

  
    parentContainer1.rotation.x+=0.0025;
    parentContainer2.rotation.y+=0.0025;
    parentContainer3.rotation.z+=0.0025;
    
 

   // camera.lookAt( scene.position );
    render();
}
function render() {
    renderer.render( scene, camera );
}
