console.log("script running")

const scene=new THREE.Scene();
const gui=new dat.GUI()

var objects=[];

//calling objects to initiate the elements
hemiLight=getHemiLight(0.5);
sphere1=getSphere(0.35,32,16,0x3290FF); 
sphere2=getSphere(0.2,32,16,0x3290FF); 

//adding elements to the scene
scene.add(hemiLight);
scene.add(sphere1);
scene.add(sphere2);

//adding elemnts to the objects array
objects.push(sphere1)
objects.push(sphere2)

//setting up object positions
sphere1.position.y = sphere1.geometry.parameters.radius;      //setting up sphere position wrt y axis
sphere2.position.set(2,sphere2.geometry.parameters.radius,0)

//creating a grid
const gridHelper=new THREE.GridHelper(10,10,0x000000,0xffffff);
// gridHelper.position.y =-0.5
scene.add(gridHelper);

//setting up ther perspective camera
var camera=new THREE.PerspectiveCamera(
    50,                                       //camera FOV
    window.innerWidth/window.innerHeight,     //camera aspectRatio
    0.1,                                      //nearSight
    1000                                      //farSight
);

//set camera positions
camera.position.set(0,1,4);     //set the camera position on on x,y,z axes
//camera.lookAt(0,0,0)            //makes the camera look at the center of the object

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
controls.maxDistance=12;    //set max zoom(dolly) out distance for perspective camera, default=infinity
// controls.minDistance=0.75
controls.maxPolarAngle = Math.PI/2.1;     //prevent orbit controls from going below the ground
controls.enableDamping = true;   //damping 
controls.dampingFactor = 0.25;   //damping inertia

//function to add a hemi light-------------------------
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
    return light;
}

//function to get a sphere-----------------------------
function getSphere(radius,widthSegment,heightSegment,color){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshBasicMaterial({      
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

//calling the mousedown through addEventListener
document.addEventListener('mousedown',onDocumentMouseDown);

//defining the mouseDown function
function onDocumentMouseDown(event){
    event.preventDefault();
    var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,   
                                    -( event.clientY / window.innerHeight ) * 2 + 1,  
                                    0.5 );   
    var raycaster=new THREE.Raycaster();
    raycaster.setFromCamera(mouse3D,camera);
    
    var intersects=raycaster.intersectObjects(objects);
    console.log(intersects)

    if(intersects.length>0){
        intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
    }
}

//function to animate the scene------
animate();
function animate() {   
   // TWEEN.update();
    requestAnimationFrame( animate );
   // camera.lookAt( scene.position );
    render();
}
function render() {
    renderer.render( scene, camera );
}


