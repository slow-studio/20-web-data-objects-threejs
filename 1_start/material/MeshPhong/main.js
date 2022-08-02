// add title and heading to sketch's html page.
document.title = 'Materials | Phong '
document.getElementById('sketch_title').innerHTML = 'Mesh Phong Material'
document.getElementById('sketch_description').innerHTML = ''

/*---declaring camera parameters------*/
var cameraPositionX=-5, cameraPositionY=2,cameraPositionZ=6;
var FOV=45,nearSight=0.1,farSight=1000;

/*--declaring object pararmet---*/
//declaring cube 1 parameters
var cube1Width=1.5,cube1Height=1.5,cube1Depth=1.5, cube1Color=0xffcc00;
var cube1PositionX=-0,cube1PositionY=0,cube1PositionZ=0;

/*---delaring the light parameters---*/
//point light parameters
var PointLight1Color=0xffffff, pointLight1Intensity=0.5;
var pointLight1PositionX=-20;pointLight1PositionY=25;pointLight1PositionZ=50;
//hemi light
var hemiLightLightColor=0xffffff, hemiLightLightGroundColor=0xffffff, hemiLightLightIntensity=0.5


/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


//declaring objects to bring in the elements to the scene
var cube1=getCube(cube1Width,cube1Height,cube1Depth,cube1Color)
var pointLight1=getPointLight(PointLight1Color, pointLight1Intensity);
var hemiLight=getHemiLight(hemiLightLightColor,hemiLightLightGroundColor,hemiLightLightIntensity)


/*--creating the scene----*/
const scene = new THREE.Scene();

//adding elements to the scene
scene.add(cube1)
scene.add(pointLight1)
scene.add(hemiLight)


/*-----setting up object positions----------------*/
cube1.position.set(cube1PositionX,cube1PositionY,cube1PositionZ);
//setting up light positions
pointLight1.position.set(pointLight1PositionX,pointLight1PositionY,pointLight1PositionZ)



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
//function to get PointLight
function getPointLight(color, intensity){
    const light = new THREE.PointLight(color, intensity);
    light.castShadow=true;
    return light;
}

//function to add a hemi light-------------------------
function getHemiLight(color, groundColor,intensity){
    const light=new THREE.HemisphereLight(color, groundColor, intensity)
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
    
