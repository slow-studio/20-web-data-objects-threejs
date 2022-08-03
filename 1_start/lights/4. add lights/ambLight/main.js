// add title and heading to sketch's html page.
document.title = 'Loight | ambient '
document.getElementById('sketch_title').innerHTML = 'Ambient Light'
document.getElementById('sketch_description').innerHTML = ''

/*---declaring camera parameters------*/
var cameraPositionX=-5, cameraPositionY=8,cameraPositionZ=5;
var FOV=35,nearSight=0.1,farSight=1000;

/*--declaring object pararmet---*/
//declaring cube 1 parameters
var cube1Width=1.5,cube1Height=1.5,cube1Depth=1.5, cube1Color=0xffbb00;
var cube1PositionX=-0,cube1PositionY=0,cube1PositionZ=0;

/*---delaring the light parameters---*/
//ambient light
var ambientLightColor=0xffffff, ambientLightIntensity=1

/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


//declaring objects to bring in the elements to the scene
var cube1=getCube(cube1Width,cube1Height,cube1Depth,cube1Color)
var ambientLight=getAmbientLight(ambientLightIntensity,ambientLightColor)

/*--creating the scene----*/
const scene = new THREE.Scene();

//adding elements to the scene
scene.add(cube1)
scene.add(ambientLight)

/*-----setting up object positions----------------*/
cube1.position.set(cube1PositionX,cube1PositionY,cube1PositionZ);
//setting up light positions


/*-----declaring the camera and the renderer--*/

//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    FOV,
    ASPECT_RATIO,     
    nearSight,
    farSight
    );

//set camera positions
camera.position.set(cameraPositionX,cameraPositionY,cameraPositionZ);

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    antialias: true,
    });   

 //setting up the size of the renderer
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);  
renderer.setClearColor(new THREE.Color('#b9b7bd'),0.45)
//adding renderer to the DOM
document.getElementById('content').appendChild( renderer.domElement);


//setting up Orbit Controls
controls = new THREE.OrbitControls(camera,renderer.domElement);


//function to display a box cube
function getCube(width,height,depth, color){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshPhongMaterial({
        color: color
        });
    const mesh=new THREE.Mesh(geometry,material);    
    return mesh;
}


/*-----function declarations to add lights----*/
//function to get an Ambient Light
function getAmbientLight(intensity,color){
    const light=new THREE.AmbientLight(color);
    light.intensity=intensity;
    return light;
}




//function to animate the scene    
animate();
function animate() {   
        
    requestAnimationFrame( animate );  
    render();
    }    
function render() {       
    renderer.render( scene, camera );
    }
    
