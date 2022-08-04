/* info */

// add title and heading to sketch's html page.
document.title = 'place objects | multiple objects'
document.getElementById('sketch_title').innerHTML = 'multiple objects in 3d space'
document.getElementById('sketch_description').innerHTML = ''


/* useful variables and constants */

// canvas & aspect-ratio
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO

// for the camera
var cposX=-1, 
    cposY=0,
    cposZ=5,
    FOV=30,
    nearSight=0.1,
    farSight=1000;

// for the objects:

var sphereradius=0.35, sphereWidthSegments=32, sphereHeightSegments=16, sphereColor=0x0099ff;
var spherePositionX=-2,spherePositionY=0,spherePositionZ=0;
var cube1Width=0.5,cube1Height=0.5,cube1Depth=0.5, cube1Color=0xff3300;
var cube1PositionX=-0,cube1PositionY=0,cube1PositionZ=0;
var cube2Width=0.5,cube2Height=0.5,cube2Depth=0.5, cube2Color=0xffdd66;
var cube2PositionX=-0.8,cube2PositionY=0.5,cube2PositionZ=0;
var PointLight1Color=0xffffff, pointLight1Intensity=0.5;
var pointLight1PositionX=-100;pointLight1PositionY=100;pointLight1PositionZ=50;
var hemisphericalLightColor=0xffffee, hemisphericalLightGroundColor=0xffffee, hemisphericalLightIntensity=0.5;


/* start of sketch */

// creating (initialising) the 3d-scene
const scene = new THREE.Scene();

// place a camera:
// we add a perspective camera to the scene...
var camera=new THREE.PerspectiveCamera(
    // field of view ( ~ aperture?)
    FOV,
    // !important: this aspect raio has to match the aspect ratio of the renderer
    ASPECT_RATIO,     
    // anything closer or further away from nearSight and farSight will get clipped, and not be seen
    nearSight,
    farSight
    );
// ... and set its position.
camera.position.set(cposX,cposY,cposZ);


// setup a renderer, so that any objects can get rendered.
// (we're using the webgl renerer)
const renderer=new THREE.WebGLRenderer({
    antialias: true,
    });   
// !important: the aspect-ratio of the renderer is the same as for the camera
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT); 
// set background colour (of the renderer)
renderer.setClearColor(
    /*hue*/
    new THREE.Color('#eeeeee'),
    /*opacity*/
    .5
    )
//adding renderer to the DOM
document.getElementById('content').appendChild( renderer.domElement);

// create objects (solids, lights, etc):
// declaring objects to bring in the elements to the scene
// note: each variable holds one object, and each variable (object) can only be added to the scene ones
var cube1=getCube(cube1Width,cube1Height,cube1Depth,cube1Color)
var cube2=getCube(cube2Width,cube2Height,cube2Depth,cube2Color)
var sphere=getSphere(sphereradius,sphereWidthSegments,sphereHeightSegments,sphereColor);
var pointLight1=getPointLight(PointLight1Color, pointLight1Intensity);
var hemisphericalLight=gethemisphericalLight(hemisphericalLightColor,hemisphericalLightGroundColor,hemisphericalLightIntensity);

// place them in space
sphere.position.set(spherePositionX,spherePositionY,spherePositionZ) 
cube1.position.set(cube1PositionX,cube1PositionY,cube1PositionZ);
cube2.position.set(cube2PositionX,cube2PositionY, cube2PositionZ);
pointLight1.position.set(pointLight1PositionX,pointLight1PositionY,pointLight1PositionZ);

// add objects to the scene, so that they are visible
scene.add(cube1);
scene.add(cube2);
scene.add(sphere);
scene.add(pointLight1);
scene.add(hemisphericalLight);

// animate (and render) the scene
animate();

/* —— end of sketch */


/* functions/helpers */

function getSphere(sphereRadius,sphereWidthSegments,sphereHeightSegments,color){
    // declare the geometry
    const geometry=new THREE.SphereGeometry(sphereRadius,sphereWidthSegments,sphereHeightSegments);
    // declare the material
    const material=new THREE.MeshPhongMaterial({
        color: color
        });
    // fuse the geometry and material into one
    const mesh=new THREE.Mesh(geometry,material);    
    // this mesh is sent to the variable that
    return mesh;
}

function getCube(width,height,depth, color){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshPhongMaterial({
        color: color
        });
    const mesh=new THREE.Mesh(geometry,material);    
    return mesh;
}

function getPointLight(color, intensity){
    const light = new THREE.PointLight(color, intensity);
    return light;
}

function gethemisphericalLight(color, groundColor,intensity){
    const light=new THREE.HemisphereLight(color, groundColor, intensity)
    return light;
}

function animate() {           
    requestAnimationFrame( animate );  

    // decide what animations happen
    cube1.rotation.x += 0.0025;		//rotate the cube in the x axis
    cube1.rotation.y += 0.0025;		//rotate the cube in the y axis    
    cube2.rotation.y -= 0.004;		//rotate the cube in the x axis
    cube2.rotation.x -= 0.004;		//rotate the cube in the y axis 
    
    // and then, render the scene.
    // note: render() needs to sit inside the animate() function to work.
    renderer.render( scene, camera );
}    
