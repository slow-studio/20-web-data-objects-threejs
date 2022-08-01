//creating the scene
const scene = new THREE.Scene();

//caling each individual function
var cube1=getCube(1,1,1);
var cube2=getCube(1.5,1.5,1.5);
var ambLight=getAmbientLight();

//setting position of the objects in the 3d plane
cube2.position.set(-2.5,0);  //(position on x axis, position on y axis, position on z axis)

//adding the elements to the scene
scene.add(cube1);
scene.add(cube2);
scene.add(ambLight);


//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    75,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(-1,0,5);


//setting up the renderer and creating an instance of it
const renderer=new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});   

renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
document.body.appendChild( renderer.domElement);

//function to display a sphere
function getSphere(radius,widthSegment,heightSegment){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshPhongMaterial({
        color: 0x44aa88
    });
    const mesh=new THREE.Mesh(geometry,material);
    return mesh;
}

//function to display a box cube
function getCube(width,height,depth){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshNormalMaterial({
        });
    const mesh=new THREE.Mesh(geometry,material);    
    return mesh;
}

//function to get an Ambient Light
function getAmbientLight(){
    const light=new THREE.AmbientLight(0x404040);
    return light;
}

//animating the scene    
function animate() {
    requestAnimationFrame( animate );
   
    //cube 1
    cube1.rotation.x += 0.0025;		//rotate the cube in the x axis
    cube1.rotation.y += 0.0025;		//rotate the cube in the y axis

    //cube 2
    cube2.rotation.x += 0.0025;		//rotate the cube in the x axis
    cube2.rotation.y += 0.0025;		//rotate the cube in the y axis

    renderer.render( scene, camera );
    }
    animate();



