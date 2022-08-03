/*-----------new section-----------*/
// add title and heading to sketch's html page.
document.title = 'Light | camera to light '
document.getElementById('sketch_title').innerHTML = 'Camera attached to light'
document.getElementById('sketch_description').innerHTML = ''

/*---declaring camera parameters------*/
var cameraPositionX=-5, cameraPositionY=6,cameraPositionZ=5;
var FOV=35,nearSight=0.1,farSight=1000;

/*--declaring object pararmet---*/
//declaring cube 1 parameters
var cube1Width=1,cube1Height=1,cube1Depth=1, cube1Color=0xffbb00;
var cube1PositionX=-0,cube1PositionY=0,cube1PositionZ=0;
//plane parameters
var planeLength=3, planeBreadth=3,planeColor=0xddeeff;

/*---delaring the light parameters---*/
//hemi light
var hemiLightLightColor=0xffffff, hemiLightLightGroundColor=0xffcc00, hemiLightLightIntensity=0.3
//point light
var pointLightColor=0xffffff, pointLightIntensity=0.5;
var pointLightPositionX=0, pointLightPositionY=5, pointLightPositionZ=0;


/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


//declaring objects to bring in the elements to the scene
var cube1=getCube(cube1Width,cube1Height,cube1Depth,cube1Color);
var plane=getPlane(planeLength,planeBreadth,planeColor);
// var hemiLight=getHemiLight(hemiLightLightColor,hemiLightLightGroundColor,hemiLightLightIntensity)
var pointLight=getPointLight(pointLightColor,pointLightIntensity);
var hemiLight=getHemiLight(hemiLightLightColor,hemiLightLightGroundColor,hemiLightLightIntensity)
var lightSphere=getSphere(0.1,16,16,0xffcc66);

/*--creating the scene----*/
const scene = new THREE.Scene();

//adding elements to the scene
scene.add(cube1)
scene.add(plane)
scene.add(hemiLight)


/*-----setting up object positions----------------*/
cube1.position.set(cube1PositionX,cube1PositionY,cube1PositionZ);
plane.rotateX( - Math.PI / 2 );
plane.position.set(0,-cube1Height/2,0)
//setting up light positions
pointLight.position.set(pointLightPositionX,pointLightPositionY,pointLightPositionZ)


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
    // alpha:true,
    antialias: true
    });   

//setting up the size of the renderer
renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);  
renderer.setClearColor(new THREE.Color('#b9b7bd'),0.45)
//adding renderer to the DOM
document.getElementById('content').appendChild( renderer.domElement);


//setting up Orbit Controls
controls = new THREE.OrbitControls(camera,renderer.domElement);

//declaring GUI
const gui=new dat.GUI();
//adding the GUI controls for the point light
const pointLightGUI=gui.addFolder('point light')
pointLightGUI.add(pointLight, 'intensity').min(0).max(10).step(0.01);
pointLightGUI.add(pointLight.position, 'x').min(-1).max(3).step(0.01);
pointLightGUI.add(pointLight.position, 'y').min(1.48).max(5).step(0.01);
pointLightGUI.add(pointLight.position, 'z').min(-1).max(3).step(0.01);


/*-adding the point light as a child of the camera--------*/
camera.add(pointLight)
scene.add(camera)

//function to display a box cube
function getCube(width,height,depth, color){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshPhongMaterial({
        color: color
        });
    const mesh=new THREE.Mesh(geometry,material);  
    mesh.castShadow=true;  
    return mesh;
}

//function to add a plan
function getPlane(length,breadth,color){
    const geometry=new THREE.PlaneGeometry(length,breadth);
    const material=new THREE.MeshPhongMaterial({
        color: color,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = true;      //set this to true to allow the object to recieve the shadow
    return mesh;
}

//function to get a sphere
function getSphere(radius,widthSegments,heightSegments,color) {
	var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
	var material = new THREE.MeshBasicMaterial({
		color: color
	});
	var mesh = new THREE.Mesh(
		geometry,
		material 
	);
	return mesh;
}

//function to add a hemi light-------------------------
function getHemiLight(color, groundColor,intensity){
    const light=new THREE.HemisphereLight(color, groundColor, intensity)
    return light;
}


/*-----function declarations to add lights----*/
//function to add a PointLight
function getPointLight(color,intensity){
    const light = new THREE.PointLight(color, intensity);
    light.castShadow=true;
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
    
