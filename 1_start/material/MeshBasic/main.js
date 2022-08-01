/* MeshBasic materials don't react to light, so no light has been added to the scene*/

//creating the scene
const scene = new THREE.Scene();

//calling the individual functions
var cube=getCube(1,1,1);

//adding elements to the scene
scene.add(cube);


//adding a perspective camera to the scene
var camera=new THREE.PerspectiveCamera(
    75,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    0.1,                                        //near
    1000                                        //far
);

//set camera positions on the x,y,z coordinates
camera.position.set(-1,0,5);


//setting up the renderer
const renderer=new THREE.WebGLRenderer(
    {
        antialias: true,
        alpha: true
    }
);   //creating an instance of the renderer

renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
document.body.appendChild( renderer.domElement);

//function to display a box cube
function getCube(width,height,depth){
    const geometry=new THREE.BoxGeometry(width,height,depth);
    const material=new THREE.MeshBasicMaterial({
        color: 0xffcc00
        });
    const mesh=new THREE.Mesh(geometry,material);    
    return mesh;
}

//animating the scene    
function animate() {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.0025;		//rotate the cube in the x axis
    cube.rotation.y += 0.0025;		//rotate the cube in the y axis
    renderer.render( scene, camera );
    }
    animate();



