// add title and heading to sketch's html page.
document.title = 'place objects | multiple objects'
document.getElementById('sketch_title').innerHTML = 'multiple objects in 3d space'
document.getElementById('sketch_description').innerHTML = ''


/*---declaring camera parameters------*/
var cameraPositionX=-1, cameraPositionY=0,cameraPositionZ=5;
var FOV=30,nearSight=0.1,farSight=1000;

/*------declaring the object paramters------*/
//declaring the sphere parameters
var sphere1Radius=0.35, sphere1WidthSegments=32, sphere1HeightSegments=16, sphere1Color=0xffcc66;
var sphere1PositionX=-2,sphere1PositionY=0,sphere1PositionZ=0;
//declaring cube 1 parameters
var cube1Width=0.5,cube1Height=0.5,cube1Depth=0.5, cube1Color=0xffcc00;
var cube1PositionX=-0,cube1PositionY=0,cube1PositionZ=0;
//declaring cube 2 parameters
var cube2Width=0.5,cube2Height=0.5,cube2Depth=0.5, cube2Color=0xffdd66;
var cube2PositionX=-0.8,cube2PositionY=0.5,cube2PositionZ=0;


/*---delaring the light parameters---*/
//point light parameters
var PointLight1Color=0xffffff, pointLight1Intensity=0.5;
var pointLight1PositionX=-100;pointLight1PositionY=100;pointLight1PositionZ=50;
//hemi light
var hemiLightColor=0xffffee, hemiLightGroundColor=0xffffee, hemiLightIntensity=0.5;

/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


/*-----object declaration-----*/
//declaring objects to bring in the elements to the scene
var cube1=getCube(cube1Width,cube1Height,cube1Depth,cube1Color)
var cube2=getCube(cube2Width,cube2Height,cube2Depth,cube2Color)
var sphere1=getSphere(sphere1Radius,sphere1WidthSegments,sphere1HeightSegments,sphere1Color);
var pointLight1=getPointLight(PointLight1Color, pointLight1Intensity);
var hemiLight=getHemiLight(hemiLightColor,hemiLightGroundColor,hemiLightIntensity)


/*--creating the scene----*/
const scene = new THREE.Scene();

//adding elements to the scene
scene.add(cube1);
scene.add(cube2);
scene.add(sphere1);
scene.add(pointLight1);
scene.add(hemiLight)


//setting position of the objects in the 3d plane
sphere1.position.set(sphere1PositionX,sphere1PositionY,sphere1PositionZ) 
cube1.position.set(cube1PositionX,cube1PositionY,cube1PositionZ);
cube2.position.set(cube2PositionX,cube2PositionY, cube2PositionZ);
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
    
    cube1.rotation.x += 0.0025;		//rotate the cube in the x axis
    cube1.rotation.y += 0.0025;		//rotate the cube in the y axis    
    cube2.rotation.y += 0.004;		//rotate the cube in the x axis
    cube2.rotation.x += 0.004;		//rotate the cube in the y axis 

    render();
    }    
function render() {       
    renderer.render( scene, camera );
    }
    
