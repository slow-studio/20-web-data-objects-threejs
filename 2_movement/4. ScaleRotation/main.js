/*-----------new section-----------*/

// add title and heading to sketch's html page.
document.title = 'Transform controls'
document.getElementById('sketch_title').innerHTML = 'Transform Controls: scale & rotation'
document.getElementById('sketch_description').innerHTML = ''


/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO

//global variables
var clock = new THREE.Clock;   

//declaring the scene
const scene=new THREE.Scene();
const gui=new dat.GUI()

//objects to call elements
cube1=getCube(0.5,0.5,0.5,0xffcc00);        
cube2=getCube(0.5,0.5,0.5,0x3D9D9B);        
sphere1=getSphere(0.35,32,16,0x3290FF) 
torus1=getTorus(0x3D9D9B);
cube3=getCube(0.8,0.8,0.8,0x3290FF);
HemiLight=getHemiLight(0.5);
spotLight=getSpotLight(0.75);
plane=getPlane(10,10);

//this is a shadow plan which is cast on top of the original plan
shadowPlane=getShadowPlane()                


//setting position of the objects
plane.position.set(0,-1)
shadowPlane.position.set(0,-1)
torus1.position.set(-1.5,0,0);
sphere1.position.set(1.5,0,0);
cube2.position.set(0,0,-2.5);


//setting position of the light
spotLight.position.set(10,30,50);       


//adding elements to the scene
scene.add(plane);
scene.add( shadowPlane );
scene.add(cube1);
scene.add(torus1);
scene.add(sphere1);
scene.add(cube2);
scene.add(HemiLight);
scene.add(spotLight);

//rotating the plan on the x axis to use it as a floor
plane.rotateX( - Math.PI / 2);
//rotating the shadow plan to align with the original plan
shadowPlane.rotateX( - Math.PI / 2);    


/*---adding GUI controls--------*/
//----scaling the cube------------
const cubeScale=gui.addFolder('Scale cube')     
cubeScale.add(cube1.scale, 'x').min(0.1).max(10).step(0.01).name('width');
cubeScale.add(cube1.scale, 'y').min(0.1).max(10).step(0.01).name('height');
cubeScale.add(cube1.scale, 'z').min(0.1).max(10).step(0.01).name('depth');

//----rotating the cube------------
const torusRotate=gui.addFolder('Rotate torus')     
torusRotate.add(torus1.rotation, 'x').min(0.1).max(10).step(0.01).name('roatation x');
torusRotate.add(torus1.rotation, 'y').min(0.1).max(10).step(0.01).name('roatation y');
torusRotate.add(torus1.rotation, 'z').min(0.1).max(10).step(0.01).name('roatation z');

//----changing the opacity of the object-------
const sphereOpacity=gui.addFolder('Sphere Opacity') 
sphereOpacity.add(sphere1.material,'opacity').min(0.2).max(1).step(0.001).name('opacity');

//setting up ther perspective camera
var camera=new THREE.PerspectiveCamera(
    40,                                       //camera FOV
    ASPECT_RATIO,                              //camera aspectRatio
    0.1,                                      //nearSight
    1000                                      //farSight
);

//set camera positions
camera.position.set(0,1,4);     
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
renderer.setSize( CANVAS_WIDTH,CANVAS_HEIGHT);  
renderer.setClearColor(new THREE.Color('#b9b7bd'),0.45)
document.getElementById('content').appendChild( renderer.domElement);

//setting up orbit controls
controls = new THREE.OrbitControls(camera,renderer.domElement);
//prevent orbit controls from going below the ground
controls.maxPolarAngle = Math.PI/2;
//damping      
controls.enableDamping = true;   
 //damping inertia
controls.dampingFactor = 0.25;  


//function to add a hemi light
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffcc00, intensity)
    return light;
}

//function to add a spotlight
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
        color: 0xddeeff,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    // we dont want the normal plan to receive a shadow,
    // because the shadows look really ugly. 
    // instead, we created a shadowMaterial,
    // and it looks better for shadows
    mesh.receiveShadow = false;     
    return mesh;
}

//function to add a shadow plan---
//--a shadow plan is used for casting dynamic shadows---------------
function getShadowPlane(){
    const material = new THREE.ShadowMaterial();
	material.opacity = .2;
    const mesh = new THREE.Mesh( plane.geometry, material );
    mesh.receiveShadow = true;

    //the shadow plan will copy its position from the original plan
    mesh.position.copy( plane.position );   
    return mesh;    
}
    
   
//function to add a tourous
function getTorus(color){
    const geometry=new THREE.TorusGeometry( 0.25,0.15, 16, 100);
    const material=new THREE.MeshPhongMaterial({
        color:color
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.receiveShadow=true;
    mesh.castShadow=true;
    return mesh;
}

//function to get a cube---------------------------
function getCube(width,height,depth,color){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshStandardMaterial({
        color: color,
        metalness:0.2,
        roughness:0.3,
        transparent: true,
        opacity:1
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
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

//function animateSphere2
function getAnimateObject(object){
    var t=clock.getElapsedTime()
    object.scale.set(2,2,2);
    
    //rotate the obj
    object.rotation.x=1+(t/3.0);
    object.rotation.y=1+(t/3.0);
    
    if(t<3.0){
        object.scale.x=1-(t/3.0);
        object.scale.y=1-(t/3.0);
        object.scale.z=1-(t/3.0);
        object.material.opacity= 1-(t/3.0);
    }else if(t>=3.0 && t<6.0){
        object.scale.set(0,0,0);
        object.scale.x=0+(t/3.0);
        object.scale.y=0+(t/3.0);
        object.scale.z=0+(t/3.0);
        object.material.opacity= 1+(t/3.0);
    }
    else{
        clock=new THREE.Clock()    
    }
}


//function to animate the scene------
animate();
function animate() {
    requestAnimationFrame( animate );    
    render();
}

function render() {

    getAnimateObject(cube2);
    renderer.render( scene, camera );
}