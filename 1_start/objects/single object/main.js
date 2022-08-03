/*---------single object in the scene--------------*/
// add title and heading to sketch's html page.
document.title = 'place objects | single object'
document.getElementById('sketch_title').innerHTML = 'a single object in 3d space'
document.getElementById('sketch_description').innerHTML = ''

/*---declaring camera parameters------*/
var cameraPositionX=0, cameraPositionY=0,cameraPositionZ=5;
var FOV=75,nearSight=0.1,farSight=1000;

/*------declaring the object paramters------*/
//declaring the sphere parameters
var sphereRadius=1, sphereWidthSegments=32, sphereHeightSegments=16, sphereColor=0xffcc66;
var sphereRadiusPositionX=0,sphereRadiusPositionY=0,sphereRadiusPositionZ=0;

/*---delaring the light parameters---*/
//point light parameters
var PointLight1Color=0xffffff, pointLight1Intensity=0.5;
var pointLight1PositionX=-100;pointLight1PositionY=100;pointLight1PositionZ=50;
//hemi light
var HemiLightColor=0xffffee, HemiLightGroundColor=0xffffee, HemiLightIntensity=0.5;

/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


/*-----object declaration-----*/
//declaring objects to bring in the elements to the scene
var sphere=getSphere(sphereRadius,sphereWidthSegments,sphereHeightSegments,sphereColor);
var pointLight1=getPointLight(PointLight1Color, pointLight1Intensity);
var HemiLight=getHemiLight(HemiLightColor,HemiLightGroundColor,HemiLightIntensity)

    
/*-----creating the scene----*/
const scene = new THREE.Scene();

//adding all the elements to the scene
scene.add(sphere);
scene.add(pointLight1);
scene.add(HemiLight)


/*----setting up the object positions------*/
sphere.position.set(sphereRadiusPositionX,sphereRadiusPositionY,sphereRadiusPositionZ)
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
renderer.setClearColor(new THREE.Color('#b9b7bd'),0.45)
//adding renderer to the DOM
document.getElementById('content').appendChild( renderer.domElement);


/*----function declarations to add objects--------*/

//function to add a sphere
function getSphere(sphereRadius,sphereWidthSegments,sphereHeightSegments,color){
    const geometry=new THREE.SphereGeometry(sphereRadius,sphereWidthSegments,sphereHeightSegments);
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
    
