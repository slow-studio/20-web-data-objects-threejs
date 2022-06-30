console.log("scale and rotation")
var clock = new THREE.Clock;    //defining clock as a global variable

const scene=new THREE.Scene();
const gui=new dat.GUI()

//objects to call elements
cube1=getCube(0.5,0.5,0.5,0xffcc00);        //pass the color of the cube as a parameter with the function call
cube2=getCube(0.5,0.5,0.5,0x3D9D9B);        //pass the color of the cube as a parameter with the function call
sphere1=getSphere(0.35,32,16,0x3290FF) 
torus1=getTorus(0x3D9D9B);
cube3=getCube(0.8,0.8,0.8,0x3290FF);
hemiLight=getHemiLight(0.5);
spotLight=getSpotLight(0.5);
plane=getPlane(10,10);
shadowPlane=getShadowPlane()                //this is a shadow plan which is cast on top of the original plan

//creating a grid
const gridHelper=new THREE.GridHelper(10,10,0x000000,0xffffff);
gridHelper.position.y = - 1;
scene.add(gridHelper);

//setting position and scale
plane.position.set(0,-1)
shadowPlane.position.set(0,-1)
cube1.scale.set( 1, 1, 1 );
torus1.position.set(-1.5,0,0);
sphere1.position.set(1.5,0,0);
cube2.position.set(0,0,-2.5);
spotLight.position.set(10,30,30);       //setting position of spotlight


//adding elements to the scene
scene.add(plane);
scene.add( shadowPlane );

scene.add(cube1);
scene.add(torus1);
scene.add(sphere1);
scene.add(cube2);
scene.add(hemiLight);
scene.add(spotLight);

//rotating the plan on the x axis to use it as a floor
plane.rotateX( - Math.PI / 2);
shadowPlane.rotateX( - Math.PI / 2);    //rotating the shadow plan to align with the original plan

//adding GUI controls
const cubeScale=gui.addFolder('Scale cube')     //----scaling the cube------------
cubeScale.add(cube1.scale, 'x').min(0.1).max(10).step(0.01).name('width');
cubeScale.add(cube1.scale, 'y').min(0.1).max(10).step(0.01).name('height');
cubeScale.add(cube1.scale, 'z').min(0.1).max(10).step(0.01).name('depth');

const torusRotate=gui.addFolder('Rotate torus')     //----rotating the cube------------
torusRotate.add(torus1.rotation, 'x').min(0.1).max(10).step(0.01).name('roatation x');
torusRotate.add(torus1.rotation, 'y').min(0.1).max(10).step(0.01).name('roatation y');
torusRotate.add(torus1.rotation, 'z').min(0.1).max(10).step(0.01).name('roatation z');

const sphereOpacity=gui.addFolder('Sphere Opacity') //----changing the opacity of the object-------
sphereOpacity.add(sphere1.material,'opacity').min(0.2).max(1).step(0.001).name('opacity');

//setting up ther perspective camera
var camera=new THREE.PerspectiveCamera(
    40,                                       //camera FOV
    window.innerWidth/window.innerHeight,     //camera aspectRatio
    0.1,                                      //nearSight
    1000                                      //farSight
);

//set camera positions
camera.position.set(0,1,4);     //set the camera position on on x,y,z axes
camera.lookAt(0,0,0)            //makes the camera look at the center of the object

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true,
    depth: true
});                     //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
renderer.setClearColor(new THREE.Color('#ffffff'),0.45)
document.body.appendChild( renderer.domElement);

//setting up orbit controls
controls = new THREE.OrbitControls(camera,renderer.domElement);
controls.maxPolarAngle = Math.PI/2;     //prevent orbit controls from going below the ground
controls.enableDamping = true;   //damping 
controls.dampingFactor = 0.25;   //damping inertia


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
    light.shadow.mapSize.width=1024*4;
    light.shadow.mapSize.height=1024*4;
    return light;
}


//function to add a plan-------------------------------
function getPlane(breadth,length){
    const geometry=new THREE.PlaneGeometry(breadth,length);
    const material=new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = false;      //set this to true to allow the object to recieve the shadow
    return mesh;
}

//function to add a shadow plan---
//--a shadow plan is used for casting dynamic shadows---------------
function getShadowPlane(){
    const material = new THREE.ShadowMaterial();
	material.opacity = 0.2;
    const mesh = new THREE.Mesh( plane.geometry, material );
    mesh.receiveShadow = true;
    mesh.position.copy( plane.position );   //the shadow plan will copy its position from the original plan
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
    const material=new THREE.MeshPhongMaterial({
        color: color
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    return mesh;
}

//function to get a sphere-----------------------------
function getSphere(radius,widthSegment,heightSegment,color){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshPhongMaterial({      
        color: color,
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
   
    var t = clock.getElapsedTime();
    if (t >= 6.0)
    {
        clock = new THREE.Clock;
        object.scale.set(2,2,2);
    }else
    {
        //scaling the object
        object.scale.x=1-(t/6.0);
        object.scale.y=1-(t/6.0);
        object.scale.z=1-(t/6.0);
        
        //changing the object visibility
        object.material.opacity= 1-(t/6.0); 
        
        //rotating the object
        object.rotation.x=1+(t/2.0);
        object.rotation.y=1+(t/2.0);
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