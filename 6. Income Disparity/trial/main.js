console.log("trail run")

let balls=[]

/*----declaring the scene-------*/
const scene=new THREE.Scene();

/*---------set camera variables--------------------*/
//set the camera parameters
var camera_FOV=30, cameraAspectRatio=(window.innerWidth/window.innerHeight),camera_NearSight=0.1,camera_FarSight=1500
//declaring camera position
cameraPosition_x=10, cameraPosition_y=50,cameraPosition_z=10;
//declaring camera lookat
cameraLookAt_x=0,cameraLookAt_y=0,cameraLookAt_z=0;

/*----light variables, make changes as required----------*/
//intensity of lghts
intensity_AmbientLight=0.5

//color of lights
color_AmbientLight=0xffffff
    

/*----setting up the light-------*/
var ambientLight=getAmbientLight(color_AmbientLight,intensity_AmbientLight)

/*---setting up the elements----*/
//adding the skyBox
// var skyBox=getSkyBox()



/*--adding elements to the scene-------------*/
//adding the lights
scene.add(ambientLight)

//adding the other elements
// scene.add(skyBox)
// scene.add(cube)

//adding a perspective camera to the scene-------------------------------------------
var camera=new THREE.PerspectiveCamera(
    camera_FOV,                                         
    cameraAspectRatio,    
    camera_NearSight,                                       
    camera_FarSight                                        
);

//set camera positions
camera.position.set(cameraPosition_x,cameraPosition_y,cameraPosition_z);
camera.lookAt(cameraLookAt_x,cameraLookAt_y,cameraLookAt_z)

//setting up the renderer
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true,
    depth: true
});                     //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
renderer.setClearColor(new THREE.Color('#808080'),0.45)
renderer.outputEncoding=THREE.sRGBEncoding;
document.getElementById('canvas1').appendChild( renderer.domElement );
// document.body.appendChild( renderer.domElement);

/*--------setting up orbit controls---------*/
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
// Orbcontrols.enableZoom = false;
Orbcontrols.enablePan = false;
// Orbcontrols.enableRotate = false;
// Orbcontrols.maxPolarAngle = Math.PI/2.2;     //prevent orbit controls from going below the ground
Orbcontrols.enableDamping = true;   //damping 
Orbcontrols.dampingFactor = 0.25;   //damping inertia
Orbcontrols.maxDistance=1000

/*--declaring the lights-------------------------------*/
//function to get an ambient light
function getAmbientLight(color,intensity){
    const light=new THREE.AmbientLight(color,intensity);
    return light;
}

/*--------calling all functions------------*/
initBalls()
animate()

// function getSkyBox(){
// 	scene.background=new THREE.CubeTextureLoader().setPath('./cubeTexture/')
// 	.load([
// 		'interstellar_rt.tga',		//right
// 		'interstellar_lf.tga',		//left
// 		'interstellar_up.tga', 	    //top
// 		'interstellar_dn.tga',  	//bottom
// 		'interstellar_rt.tga',		//front
// 		'interstellar_bk.tga'		//back
// 	]);
// }

function initBalls(){
	
	// disposeMeshes();
	createContainer();

	//here we create the balls
	let ballGeom=new THREE.SphereGeometry(
		2,
		16,
		32
	);

	for(let i=0;i<13;i++){
	createBall(ballGeom,Math.random()*0xffffff,0,1,0)
	}
}

function disposeMeshes(){
	
    console.log("dispose meshes")
	const meshes=[];
	scene.traverse(function(object){
		if(object.isMesh)meshes.push(object);

	});
	for(let i=0;i<meshes.length;i++){
	const mesh=meshes[i];
	mesh.material.dispose();
	mesh.geometry.dispose();
	scene.remove(mesh);
	}
}

function createContainer(){

	console.log("container")
	container=new THREE.Mesh(
		new THREE.BoxGeometry(100,100,100),
		new THREE.MeshStandardMaterial({
			transparent: true,
			opacity: 0.5
		})
	);
	container.position.set(0,0,0)

	container.scale.set(1,1,1)

	container.material.color=0xffffff

	scene.add(container);
}


function createBall(ballGeom,color,x,y,z){
	ball=new THREE.Mesh(
		ballGeom,
		new THREE.MeshPhongMaterial({
			color:color
		})
	)
    ball.position.set(x,y,z);

	ball.userData.vel=new THREE.Vector3().randomDirection();
	ball.userData.vel.multiplyScalar(2.0)
    // console.log(ball.userData)

	balls.push(ball)
	scene.add(ball)
}



/*---------function to animate and render the scene--------*/

function animate(){
	
	Orbcontrols.update();
	render();

	checkEdges();

	renderer.render(scene,camera);
	requestAnimationFrame(animate);
}

function render(){
	balls.forEach((b)=>{
		b.position.add(b.userData.vel)
        console.log(b.userData.vel)
	});
}

function checkEdges(){
	let nedge=(-50*container.scale.x)+2;
	let edge=(50*container.scale.x)-2;

	let offset=2*0.5;

	balls.forEach((b)=>{

		if(b.position.x<nedge){
			b.position.x+=offset;
			b.userData.vel.x*=-1;
		}else if(b.position.x>edge){
			b.position.x-=offset;
			b.userData.vel.x*=-1;
		}

		if(b.position.y<nedge){
			b.position.y+=offset;
			b.userData.vel.y*=-1;
		}else if(b.position.y>edge){
			b.position.y-=offset;
			b.userData.vel.y*=-1;
		}

		if(b.position.z<nedge){
			b.position.z+=offset;
			b.userData.vel.z*=-1;
		}else if(b.position.z>edge){
			b.position.z-=offset;
			b.userData.vel.z*=-1;
		}

	});

}