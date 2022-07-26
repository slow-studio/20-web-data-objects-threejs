console.log("user inputs")
var clock = new THREE.Clock;    //defining clock as a global variable

const scene=new THREE.Scene();
const gui=new dat.GUI()

//objects to call the declared elements
var hemiLight=getHemiLight(0.5);
spotLight=getSpotLight(0.5);
sphere1=getSphere(0.35,32,16,0x3290FF); 
sphere2=getSphere(0.3,32,16,0xffcc00)
sphere3=getSphere(0.3,32,16,0xffcc00)
plane=getPlane(10,10);
shadowPlane=getShadowPlane()                //this is a shadow plan which is cast on top of the original plan

//adding movements
getKeyboardMovement(sphere1)

//console.log(sphere1)

//setting up positions
spotLight.position.set(10,20,20);       //setting position of spotlight
sphere2.position.x=-2;
sphere3.position.x=+2;


//adding the elements to the scene
scene.add(hemiLight);
scene.add(sphere1);
scene.add(sphere2);
scene.add(sphere3);
scene.add(plane);
scene.add(shadowPlane)
scene.add(spotLight);


//setting the position of the sphere with respect to the y axis on top of the plan
sphere1.position.y = sphere1.geometry.parameters.radius;
sphere2.position.y = sphere2.geometry.parameters.radius;
sphere3.position.y = sphere3.geometry.parameters.radius;

//rotating the plan on the x axis to use it as a floor
plane.rotateX( - Math.PI / 2);
shadowPlane.rotateX( - Math.PI / 2);    //rotating the shadow plan to align with the original plan

//creating a grid
const gridHelper=new THREE.GridHelper(10,10,0x000000,0xffffff);
//gridHelper.position.y =0.5
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
controls.maxDistance=12;    //set max zoom(dolly) out distance for perspective camera, default=infinity
controls.minDistance=0.75
controls.maxPolarAngle = Math.PI/2.1;     //prevent orbit controls from going below the ground
controls.enableDamping = true;   //damping 
controls.dampingFactor = 0.25;   //damping inertia


//function to add a hemi light-------------------------
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
    return light;
}

//function to add a spotlight----------------
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

//tween animation properties-------------------

//adding event listener to change obj parameters
colorChange=getColorChange(sphere1)
//positionChange=getObjectMovement(sphere1);
document.addEventListener("keypress",(e)=>{
	if(e.keyCode==97){
		colorChange.start();
	}else if(e.keyCode===115){
		positionChange.start();
	}else if(e.keyCode===100){
		 scaleChange.start();
       // positionChange.start();
	}
});


//animate to change color
function getColorChange(object){
    
let colorChange=new TWEEN.Tween(object.material.color)
.to({r:1,g:1,b:1},2000)
.easing(TWEEN.Easing.Linear.None)
//.start();
return colorChange;
}


//moving the object
function getObjectMovement(object){
   // currentPosition=object.position.y;
    
    let targetPosition=new THREE.Vector3(0,object.geometry.parameters.radius,0); //move to this target
    let positionChange=new TWEEN.Tween(object.position)
	    .to(targetPosition,3000)
	    .easing(TWEEN.Easing.Linear.None)  
        return positionChange      
    
}

var playerPositionReset=getObjectMovement(sphere1);


// let positionChange1=new TWEEN.Tween(sphere1.position)
// let targetDown=new THREE.Vector3(0,1,0); //move to this target
// let positionChange=new TWEEN.Tween(object.position)
//     .to(targetDown,3000)
//     .easing(TWEEN.Easing.Bounce.InOut)


//function to add keyboard movement
function getKeyboardMovement(object){
    document.onkeydown=function(e){
        if(e.keyCode===37){
            object.position.x-=0.05;
        }
        if(e.keyCode===39){
            object.position.x+=0.05;
        }
        if(e.keyCode===38){
            object.position.z-=0.05;
        }
        if(e.keyCode===40){
            object.position.z+=0.05;
        }    
    }    
}


//creating a bounding box around the sphere
let sphereBB1=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
sphereBB1.setFromObject(sphere1);

//-------------creating bounding box for the obstacle sphers
let sphereBB2=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
sphereBB2.setFromObject(sphere2);

let sphereBB3=new THREE.Box3(new THREE.Vector3(),new THREE.Vector3());
sphereBB3.setFromObject(sphere3);


function checkCollisions(){

	//collision intersects
	if(sphereBB1.intersectsBox(sphereBB2) || sphereBB1.intersectsBox(sphereBB3) ){
		animation1(sphere1);
    //    sphere1.position.set(0,sphere1.position.y = sphere1.geometry.parameters.radius,0)
	}else{
		sphere1.material.opacity=1.0;
	}
	
	//collision containsBox
    if(sphereBB1.containsBox(sphereBB2)){
		sphere2.scale.x=2;
		sphere2.scale.y=2;
		sphere2.scale.z=2;
	}else{
		sphere2.scale.x=1;
		sphere2.scale.y=1;
		sphere2.scale.z=1;
	}
 }

//implementing Collision check with dynamic variable
//function checkCollisions(){
	//declaring a for loop where i iterations=number of obstacles
	// for(var i=2;i<=3;i++){
	// 	this["dynamicVar"+i]="sphereBB"+i;
    //     console.log(this["dynamicVar"+i])
	// 	if(sphereBB1.intersectsBox(this["dynamicVar"+i])){
	// 		animation1(sphere1);
	// 	}else{
	// 		sphere1.material.opacity=1.0;
	// 	}
	// }
// }



function animation1(obj){
	obj.material.transparent=true;
	obj.material.opacity=0.5;
  //  playerPositionReset.start();
    // playerPositionReset.call(onComplete);
    //obj.position.set(0,obj.position.y = obj.geometry.parameters.radius,0)
	obj.material.color= new THREE.Color(Math.random()*0xffffff);
    
}




//animating the scale
let targetBig=new THREE.Vector3(3,3,3); //scale for x,y,z
let scaleChange=new TWEEN.Tween(sphere1.scale)
	.to(targetBig,5000)
	.easing(TWEEN.Easing.Back.InOut) //type of easing animation
	//.start();



//----
console.log("showoing iterations")
const var1=[]
for (let i=0;i<3;i++){
    var1[i]='name'+i
    console.log(var1)
}



    
//function to animate the scene------
animate();
function animate() {
    sphereBB1.copy(sphere1.geometry.boundingBox).applyMatrix4(sphere1.matrixWorld)       
    TWEEN.update();
    checkCollisions();
    requestAnimationFrame( animate );
    render();
}
function render() {
    renderer.render( scene, camera );
}



// //decalring dynamic variables
// for (var i=1;i<=3;i++){
//     this["dynamicVar"+i]="sphereBB"+i;
//     console.log(this["v"+i])
// }
