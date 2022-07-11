console.log("dynamic canvas 2")

//calling objects
const sphere1=getSphere(0.3,32,16,0xffffff);
scene.add(sphere1)

//declaring the container element
var canvas2;
CANVAS_WIDTH=640,
CANVAS_HEIGHT=480;
canvas2=document.getElementById('canvas2');
document.body.appendChild(canvas2);

//set camera positions
camera.position.set(0,0,10);    	 	//set the camera position on on x,y,z axes
camera.lookAt(0,0,0)            	//makes the camera look at the center of the object


//setting up the renderer
const renderer2=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true,
    depth: true
});                     //creating an instance of the renderer

renderer2.shadowMap.enabled = true;                          //enabling shadow in render
renderer2.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer2.setSize( CANVAS_WIDTH, CANVAS_HEIGHT);   //setting up the size of the renderer

canvas2.appendChild( renderer2.domElement);

//function to animate the scene------
