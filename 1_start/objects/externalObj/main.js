// add title and heading to sketch's html page.
document.title = 'place objects | external object'
document.getElementById('sketch_title').innerHTML = 'external object in 3d space'
document.getElementById('sketch_description').innerHTML = ''


/*---declaring camera parameters------*/
var cameraPositionX=0, cameraPositionY=2,cameraPositionZ=6;
var FOV=35,nearSight=0.1,farSight=1000;

/*--declaring object pararmet---*/
//plane parameters
var planeLength=10,planeBredth=10, planeColor=0xffffff;
var planePositionX=0,planePositionY=-1,planePositionZ=0;
//external object parameters
var externObjectPositionX=0,externObjectPositionY=-1,externObjectPositionZ=0;
var externalObjectColor=0xffcc44; 

/*---delaring the light parameters---*/
//point light parameters
var PointLight1Color=0xffffff, pointLight1Intensity=0.5;
var pointLight1PositionX=-20;pointLight1PositionY=15;pointLight1PositionZ=15.5;
//hemi light
var ambientLightColor=0xffffee, ambientLightGroundColor=0xffffee, ambientLightIntensity=0.5;


/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


/*-----object declaration-----*/
//declaring objects to bring in the elements to the scene
var plane=getPlane(planeLength, planeBredth, planeColor)
var pointLight1=getPointLight(PointLight1Color, pointLight1Intensity);
var ambientLight=getambientLight(ambientLightColor,ambientLightGroundColor,ambientLightIntensity)

//external object,here we are passing the obj location and positions as the parameter
var gltfObj1=getGLTFLoader('./assets/roun.glb',externObjectPositionX,externObjectPositionY,externObjectPositionZ, externalObjectColor);        

/*--creating the scene----*/
const scene = new THREE.Scene();

//adding elements to the scene
scene.add(plane);
scene.add(pointLight1)
scene.add(ambientLight)


/*--setting positions of the objects in the 3d plane---*/
//rotating the plan on the x axis to use it as a floor
plane.rotateX( - Math.PI / 2);


/*-----setting up object positions----------------*/
plane.position.set(planePositionX,planePositionY,planePositionZ)
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
renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
//adding renderer to the DOM
document.getElementById('content').appendChild( renderer.domElement);


//setting up Orbit Controls
controls = new THREE.OrbitControls(camera,renderer.domElement);

//function to add a plan-------------------------------
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

/*---function to load external objects-----*/
//function to call the GLTF Loader----the obj location and positions are passed as parameters in the function call
function getGLTFLoader(assetLocation,positionX,positionY,positionZ, color){
    const loader=new THREE.GLTFLoader();
loader.load( assetLocation, function ( gltf ) {
    model=gltf.scene;

    const newMaterial = new THREE.MeshStandardMaterial({
                                    color: color,
                                    roughness: 0.8
                                                                       
                        });
						model.traverse((o) => {
						if (o.isMesh) o.material = newMaterial;
						}); 

                        //model.wireframe=true    
                        model.castShadow = true;
                        model.traverse(function (node) {
                          if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                          }
                        });
    model.position.set(positionX,positionY,positionZ);                        
	scene.add(model);
}, undefined, function ( error ) {
	console.error( error );
} );
}


/*-----function declarations to add lights----*/
//function to get PointLight
function getPointLight(color, intensity){
    const light = new THREE.PointLight(color, intensity);
    light.castShadow=true;
    return light;
}

//function to add a hemi light-------------------------
function getambientLight(color, groundColor,intensity){
    const light=new THREE.HemisphereLight(color, groundColor, intensity)
    return light;
}

//function to get an Ambient Light-------------------
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
    
