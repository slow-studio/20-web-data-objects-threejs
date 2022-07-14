console.log("dynamic canvas 2")

//calling objects
const sphere1=getSphere(0.2,32,16,0xffffff);
sphere1.position.set(0,0,0)

scene.add(sphere1)

//declaring the container element
CANVAS_WIDTH=640,
CANVAS_HEIGHT=480;


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

document.getElementById('canvas2').appendChild( renderer2.domElement );

//function to animate the scene------
