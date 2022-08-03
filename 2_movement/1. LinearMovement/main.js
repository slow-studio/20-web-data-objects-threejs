/*-----------new section-----------*/
// add title and heading to sketch's html page.
document.title = 'Movement | Linear '
document.getElementById('sketch_title').innerHTML = 'Linear movement'
document.getElementById('sketch_description').innerHTML = ''


/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


var clock = new THREE.Clock;    //defining clock as a global variable

//creating the 3d scene
const scene=new THREE.Scene();


//objets to call the elements
var plane=getPlane();
var sphere=getSphere(0.35,32,16);
var HemiLight=getHemiLight(0.5);
var spotLight=getSpotLight(0.5);


//setting up positions
spotLight.position.set(10,30,50);       //setting position of spotlight
//adding elements to the scene
scene.add(plane);
scene.add(sphere);
scene.add(HemiLight);
scene.add(spotLight);




//setting up the perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    45,                                         //FOV
    ASPECT_RATIO,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(0,2,4.5);
camera.lookAt(0,0,0)
spotLight.position.set(30,30,30);



//set the plane as the surface
plane.rotateX( - Math.PI / 2);


//setting the position of the sphere with respect to the y axis on top of the plan
sphere.position.y = sphere.geometry.parameters.radius;


//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    antialias:true,
    depth: true
});   

//enabling shadow in render
renderer.shadowMap.enabled = true;      
 //adding shadow type as soft shadow                    
renderer.shadowMap.type = THREE.PCFSoftShadowMap;          
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT); 
renderer.setClearColor(new THREE.Color('#b9b7bd'),0.45)  
//adding renderer to the DOM
document.getElementById('content').appendChild( renderer.domElement);

//setting up orbit controls
controls = new THREE.OrbitControls(camera,renderer.domElement);
//prevent orbit controls from going below the ground
controls.maxPolarAngle = Math.PI/2.05;  
//damping    
controls.enableDamping = true;   
//damping inertia
controls.dampingFactor = 0.25;   

//function to get a sphere
function getSphere(radius,widthSegment,heightSegment){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshStandardMaterial({

        metalness:0,
        roughness:0.75,
        opacity:1,
        color:  0xffcc00
        
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.castShadow=true;
    return mesh;
}

//funciton to get a plane
function getPlane(){
    const geometry=new THREE.PlaneGeometry(10,10);
    const material=new THREE.MeshPhongMaterial({
        color: 0xddeeff,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = true;      
    return mesh;
}

//function to add a hemi light
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
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

//function to set linear movement
function getMovement(object){
    var t = clock.getElapsedTime();
    var position;
    if (t >= 6.0){
        clock = new THREE.Clock;
        object.position.x=1;
    }else if(t<3.0){
        object.position.x=1+(t/3.0);
        position=position+object.position.x;
    }else{
        object.position.x=position;
        object.position.x=3-(t/3.0);
        
    }
}

//function to animate the scene------
animate();
function animate() {
    requestAnimationFrame( animate );    
    render();
}

function render() {
    
    getMovement(sphere)
    renderer.render( scene, camera );
}