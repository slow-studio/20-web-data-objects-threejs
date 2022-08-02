// add title and heading to sketch's html page.
document.title = 'Transform controls'
document.getElementById('sketch_title').innerHTML = 'Transform Controls: scale & rotation'
document.getElementById('sketch_description').innerHTML = ''


/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO

//defining clock as a global variable
var clock = new THREE.Clock;   

//declaring the scene
const scene=new THREE.Scene();

//objects to call the declared elements
var ambientLight=getambientLight(0.5);
var spotLight=getSpotLight(0.5);
var sphere1=getSphere(0.35,32,16,0x3290FF); 
var sphere2=getSphere(0.3,32,16,0xffcc00)
var sphere3=getSphere(0.3,32,16,0xffcc00)

var plane=getPlane(10,10);
//this is a shadow plan which is cast on top of the original plan
var shadowPlane=getShadowPlane()                

//function call to get keyboard controls
getKeyboardMovement(sphere1)

//console.log(sphere1)

//setting up positions of objects   
sphere2.position.x=-2;
sphere3.position.x=+2;

//setting up light positions
spotLight.position.set(10,20,20);   

//adding the elements to the scene
scene.add(ambientLight);
scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
scene.add(plane);
scene.add(shadowPlane)
scene.add(spotLight);


//setting the position of the spheres with respect to the y axis on top of the plan
sphere1.position.y = sphere1.geometry.parameters.radius;
sphere2.position.y = sphere2.geometry.parameters.radius;
sphere3.position.y = sphere3.geometry.parameters.radius;

//rotating the plan on the x axis to use it as a floor
plane.rotateX( - Math.PI / 2);
//rotating the shadow plan to align with the original plan
shadowPlane.rotateX( - Math.PI / 2);    


//setting up ther perspective camera
var camera=new THREE.PerspectiveCamera(
    50,                                       
    ASPECT_RATIO,     
    0.1,                                     
    1000                                     
);

//set camera positions
camera.position.set(0,3,4); 
//makes the camera look at the center of the object    
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
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);   
document.getElementById('content').appendChild( renderer.domElement);

//setting up orbit controls
controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.maxDistance=12;  
//set max zoom(dolly) out distance for perspective camera, default=infinity
controls.minDistance=0.75
//prevent orbit controls from going below the ground
controls.maxPolarAngle = Math.PI/2.1;  
//damping    
controls.enableDamping = true;   
//damping inertia
controls.dampingFactor = 0.25;  


//function to add a hemi light-------------------------
function getambientLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
    return light;
}

//function to add a spotlight----------------
function getSpotLight(intensity){
    const light=new THREE.SpotLight(0xffffff,intensity);
    light.castShadow=true;
    
    light.shadow.bias= -0.00001;
    light.shadow.mapSize.width=1024*4;
    light.shadow.mapSize.height=1024*4;
    return light;
}

//function to add a plan-------------------------------
function getPlane(breadth,length){
    const geometry=new THREE.PlaneGeometry(breadth,length);
    const material=new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = false;      
    return mesh;
}

//function to add a shadow plan---
//--a shadow plan is used for casting dynamic shadows---------------
function getShadowPlane(){
    const material = new THREE.ShadowMaterial();
	material.opacity = 0.2;
    const mesh = new THREE.Mesh( plane.geometry, material );
    mesh.receiveShadow = true;

    //the shadow plan will copy its position from the original plan
    mesh.position.copy( plane.position );   
    return mesh;    
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



//function to add keyboard movement
function getKeyboardMovement(object){
    document.onkeydown=function(e){
        if(e.keyCode===37){
            object.position.x-=0.05;
        }
        if(e.keyCode===39){
            object.position.x+=0.05;
        }
        if(e.keyCode===38){
            object.position.z-=0.05;
        }
        if(e.keyCode===40){
            object.position.z+=0.05;
        }    
    }    
}


//creating a bounding box around the sphere to for collission detection
let sphereBB1=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
sphereBB1.setFromObject(sphere1);

//-------------creating bounding box for the obstacle sphers
let sphereBB2=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
sphereBB2.setFromObject(sphere2);

let sphereBB3=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
sphereBB3.setFromObject(sphere3);


//function declaration to check if a collision has taken place
function checkCollisions(){

	//collision intersects
	if(sphereBB1.intersectsBox(sphereBB2) || sphereBB1.intersectsBox(sphereBB3) ){
		animationOnCollision(sphere1);
	}else{
		sphere1.material.opacity=1.0;
	}
	
	//collision containsBox
    if(sphereBB1.containsBox(sphereBB2)){
		sphere2.scale.x=2;
		sphere2.scale.y=2;
		sphere2.scale.z=2;
	}else{
		sphere2.scale.x=1;
		sphere2.scale.y=1;
		sphere2.scale.z=1;
	}
 }

//function declaration for animation sequence when collision occurs
function animationOnCollision(obj){
	obj.material.transparent=true;
	obj.material.opacity=0.5;
	obj.material.color= new THREE.Color(Math.random()*0xffffff);
    
}

    
//function to animate the scene------
animate();
function animate() {
    //update position of bounding box every time
    sphereBB1.copy(sphere1.geometry.boundingBox).applyMatrix4(sphere1.matrixWorld)   
    //ccheck for collisions    
    checkCollisions();
    requestAnimationFrame( animate );
    render();
}
function render() {
    renderer.render( scene, camera );
}

