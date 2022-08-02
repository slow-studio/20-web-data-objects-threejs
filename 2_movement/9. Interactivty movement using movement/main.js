// add title and heading to sketch's html page.
document.title = 'interactivty | mouse'
document.getElementById('sketch_title').innerHTML = 'Interactivity using a mouse: Drag Controls'
document.getElementById('sketch_description').innerHTML = 'we use drag controls in this sketch use the mouse to control the elemnts on the screen'


/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
//this doesn't seems to be woking, canvas width
// const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_WIDTH = 640;  
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO

//declaring the scene
const scene=new THREE.Scene();

//all the objects are stored here to make them interactive
var objects=[];         
    

/*----calling objects to initiate the elements--------*/
//calling the rbg loader to load the hdr image
rgbeLoader=getRGBLoader('./images/img_4k.hdr') 


//adding all the spheres to the scene
for(let i=0;i<90;i++){
		var color=Math.random() * 0xffffff;
		var rad=Math.random()*0.3;
		var object=getSphere(rad,32,16,color);
	
        //setting position for the object in random across the screen
		object.position.x = (Math.random()) * 7-5;
		object.position.y = Math.random() * 3;
		object.position.z = (Math.random()) * 4-2;

        scene.add( object );
        //push the spheres to the object array
		objects.push( object );
	
	}


/*-------we store all the spheres in three sperate parent containers---------*/    
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




//setting up ther perspective camera
var camera=new THREE.PerspectiveCamera(
    40,                                      	 		
    ASPECT_RATIO,   	 			
    1,                                     	 				
    1000                                     		 		
);

//set camera positions
camera.position.set(0,1,10);    	 	
camera.lookAt(0,0,0)            	

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    antialias:true,
    depth: true
});                     

renderer.shadowMap.enabled = true;              
 //adding shadow type as soft shadow            
renderer.shadowMap.type = THREE.PCFSoftShadowMap;     
//setting up the size of the renderer     
renderer.setSize( CANVAS_WIDTH,CANVAS_HEIGHT); 

//used to appx appearence of hdr o ndevice monitor
renderer.toneMapping=THREE.ACESFilmicToneMapping;
//exposure level of tonemapping, def=1
renderer.toneMappingExposure=0.6;
//interpolating color gradients
renderer.outputEncoding=THREE.sRGBEncoding;

document.getElementById('content').appendChild( renderer.domElement);


/*--------setting up orbit controls-------*/
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
//set max zoom(dolly) out distance for perspective camera, default=infinity
Orbcontrols.maxDistance=12;             
Orbcontrols.minDistance=3
//prevent orbit controls from going below the ground
Orbcontrols.maxPolarAngle = Math.PI/2.1;    
//enablel damping
Orbcontrols.enableDamping = true;           
Orbcontrols.dampingFactor = 0.25;         


/*-------------defining the drag controls-----------*/
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
    event.object.scale.x*=2
    event.object.scale.y*=2
    event.object.scale.z*=2
    event.object.material.color.setHex( Math.random() * 0xffffff );
})

//drag hoverOFF
dControls.addEventListener("hoveroff", function(event){
    event.object.scale.x/=2
    event.object.scale.y/=2
    event.object.scale.z/=2
    event.object.material.color.setHex( Math.random() * 0xffffff );
})

//drag Start
dControls.addEventListener("dragstart", function(event){
    event.object.material.opacity=0.5;
})

//drag end
dControls.addEventListener("dragend", function(event){
    console.log(event.object)
    event.object.material.opacity=1;
})


/*---function declarations to add elements------*/
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


/*----adding event listeers---*/
//adding windows resize functionalities-------------
window.addEventListener( 'resize', onWindowResize );

/*---declaring function for event listeners--*/
//funciton declaration for window resize
function onWindowResize() {
    camera.aspect = ASPECT_RATIO;
    camera.updateProjectionMatrix();
    renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );
}

//adding the RGBE Loader to load the HDR image
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
