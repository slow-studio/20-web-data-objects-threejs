// add title and heading to sketch's html page.
document.title = 'Loight | direct '
document.getElementById('sketch_title').innerHTML = 'Directional Light'
document.getElementById('sketch_description').innerHTML = ''

/*---declaring camera parameters------*/
var cameraPositionX=-5, cameraPositionY=9,cameraPositionZ=5;
var FOV=35,nearSight=0.1,farSight=1000;

/*--declaring object pararmet---*/
//declaring cube 1 parameters
var cube1Width=1.5,cube1Height=1.5,cube1Depth=1.5, cube1Color=0xffbb00;
var cube1PositionX=-0,cube1PositionY=0,cube1PositionZ=0;

/*---delaring the light parameters---*/
//direct light
var directLightColor=0xffffff, directLightIntensity=7
var directLightPositionX=10,directLightPositionY=05,directLightPositionZ=10;
var directLightTargetPositionX=0, directLightTargetPositionY=0,directLightTargetPositionZ=0;

/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


//declaring objects to bring in the elements to the scene
var cube1=getCube(cube1Width,cube1Height,cube1Depth,cube1Color)
var directLight=getDirectionalLight(directLightIntensity,directLightColor)

/*--creating the scene----*/
const scene = new THREE.Scene();

//adding elements to the scene
scene.add(cube1)
scene.add(directLight)

/*-----setting up object positions----------------*/
cube1.position.set(cube1PositionX,cube1PositionY,cube1PositionZ);
//setting up light positions
directLight.position.set(directLightPositionX,directLightPositionY,directLightPositionZ)
directLight.target.position.set(directLightTargetPositionX,directLightTargetPositionY,directLightTargetPositionZ)


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
//function to add a directional light
function getDirectionalLight(color,intensity){
    const light=new THREE.DirectionalLight(color,intensity);
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
    
