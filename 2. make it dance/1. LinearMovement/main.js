console.log("hello world")

//creating the 3d scene
const scene=new THREE.Scene();
const gui=new dat.GUI();


//objets to call the elements
var plane=getPlane();
var sphere=getSphere(0.35,32,16);
var hemiLight=getHemiLight(0.5);
var spotLight=getSpotLight(0.5);


//adding elements to the scene
scene.add(plane);
scene.add(sphere);
scene.add(hemiLight);
scene.add(spotLight);

//setting up the perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    45,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(0,2,5);
camera.lookAt(0,0,0)
spotLight.position.set(30,30,30);



//set the plane as the surface
plane.rotateX( - Math.PI / 2);


//setting the position of the sphere with respect to the y axis on top of the plan
sphere.position.y = sphere.geometry.parameters.radius;

//adding the GUI controls for each element
const spotLightGUI=gui.addFolder('SpotLight Controls')
spotLightGUI.add(spotLight, 'intensity').min(0).max(10).step(0.01);



//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true,
    depth: true
});   //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
renderer.setClearColor(new THREE.Color('#ffffff'),0.45)
document.body.appendChild( renderer.domElement);

//setting up orbit controls
controls = new THREE.OrbitControls(camera,renderer.domElement);

//function to get a sphere
function getSphere(radius,widthSegment,heightSegment){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshStandardMaterial({

        metalness:0.3,
        roughness:0.1,
        opacity:0.5,
        color:  0xffcc00
        
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.castShadow=true;
    return mesh;
}

//funciton to get a plane
function getPlane(){
    const geometry=new THREE.PlaneGeometry(10,10);
    const material=new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = true;      //set this to true to allow the object to recieve the shadow
    return mesh;
}

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
    light.shadow.mapSize.width=1024*2;
    light.shadow.mapSize.height=1024*2;
    return light;
}

// function getLinearMovement(){
//    while(true){
//     var spherePosition=0;
//     for(i=0;i<0.05;i++){
//         spherePosition=spherePosition+0.005;
//         console.log(spherePosition)    
//         return spherePosition;

//    }}
// }

function getMovement(){

    while(1){
        sphere.position.x+=0.0025;
        return sphere.position.x;
    }
}

//animating the scene    
function animate() {
    requestAnimationFrame( animate );
    
        // sphere.rotation.x += 0.0025;
        // sphere.position.y = sphere.position.y+0.0025;
        getMovement()
        renderer.render( scene, camera );
    }
    animate();

