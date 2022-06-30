console.log("initiate cycle movement")

const scene=new THREE.Scene();
const gui=new dat.GUI()

//objects to call the elements
var cube1=getCube(0.8,0.8,0.8);
var sphere1=getSphere(0.35,32,16,0x3D9D9B)
var sphere2=getSphere(0.35,32,16,0x3D9D9B)
var sphere3=getSphere(0.2,32,16,0x3290FF)
var sphere4=getSphere(0.2,32,16,0x3290FF)

var hemiLight=getHemiLight(0.5);
var spotLight=getSpotLight(0.5);

//creating a grid
const gridHelper=new THREE.GridHelper(50,10,0x000000,0xffffff);
scene.add(gridHelper);


//adding elements to the scene
scene.add(cube1);
scene.add(hemiLight);
scene.add(spotLight);
scene.add(sphere1,sphere2,sphere3,sphere4);

//creating a parent container
var parentContainer1 = new THREE.Mesh();
scene.add(parentContainer1);
parentContainer1.add(sphere1,sphere2,sphere3,sphere4);

//setting up ther perspective camera
var camera=new THREE.PerspectiveCamera(
    50,                                       //camera FOV
    window.innerWidth/window.innerHeight,     //camera aspectRatio
    0.1,                                      //nearSight
    1000                                      //farSight
);

//set camera positions
camera.position.set(0,2,5);     //set the camera position on on x,y,z axes
camera.lookAt(0,0,0)            //makes the camera look at the center of the object

//setting up the element positions
spotLight.position.set(20,20,30);
sphere1.position.set(-1.5,0,0);
sphere2.position.set(1.5,0,0);
sphere3.position.set(0,1.5,0);
sphere4.position.set(0,-1.5,0);


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

//function to add a hemi light
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
    return light;
}

//function to add a spotLight
function getSpotLight(intensity){
    const light=new THREE.SpotLight(0xffffff,intensity);
    light.castShadow=true;
    light.shadow.bias= -0.00001;
    light.shadow.mapSize.width=1024*2;
    light.shadow.mapSize.height=1024*2;
    return light;
}

//function to get a cube
function getCube(width,height,depth){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshPhongMaterial({
        color: 0xffcc00
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    return mesh;
}

//function to get a sphere
function getSphere(radius,widthSegment,heightSegment,color){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshPhongMaterial({      
        // color:  0x3D9D9B
        color: color       
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.receiveShadow=true;
    mesh.castShadow=true;    
    return mesh;

}

//function to animate the scene
function animate(){
    requestAnimationFrame(animate);
    cube1.rotation.x+=0.0025;
    cube1.rotation.y-=0.0025;
    
    //rotating the parent container to rotate the spheres a whole in the z,y axes
    parentContainer1.rotation.z-=0.01;   
    parentContainer1.rotation.y-=0.01; 
    renderer.render(scene,camera);
}
animate();
