console.log("text page transition")

console.log("initiating income disparity")

let objects=[]  //we will store all the objects in this array once they are initiated
var shouldTransition;

/*---------set camera variables--------------------*/
//set the camera parameters
var camera_FOV=35, cameraAspectRatio=(window.innerWidth/window.innerHeight),camera_NearSight=1,camera_FarSight=30000
//declaring camera position
var cameraPosition_x=0, cameraPosition_y=2,cameraPosition_z=30;
//declaring camera lookat
cameraLookAt_x=0,cameraLookAt_y=0,cameraLookAt_z=0;

/*----light variables, make changes as required----------*/
//intensity of lghts
intensity_AmbientLight=0.9

//color of lights
color_AmbientLight=0xffffff;

/*---sphere variables---*/
var sphereTotal=13;
var sphereWidthSegmets=16, sphereHeightSegmets=16;  

/*----setting up the light-------*/
var ambientLight=getAmbientLight(color_AmbientLight,intensity_AmbientLight)

/*---setting up the elements----*/
//set how the spheres shall appear on the screen
let numberOfRows=4;             //total number of rows 
let numberOfColoumns=4;         //total number of coloumns

/*-------setting up the text to display-----*/
var displayTextAttheStartOfTheScene="Would like to view the wealth distribution in India?"
var displayTextWhenButtonClicked="Click on any of the ball to know more details about its"

/*----declaring the scene-------*/
const scene=new THREE.Scene();


/*----------adding a grid helper---------*/

const size = 50;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper )


/*------adding elements to the scene-------------*/
//adding the lights
scene.add(ambientLight)


//adding the spheres to the scene
getMultipleSpheres(sphereWidthSegmets, sphereHeightSegmets,populationWealthDistribution)

/*-----------adding text box inside canvas-------------------------------------*/
info = document.createElement( 'div' );
info.id = 'textDiv'
info.style.position = 'relative';
info.style.top = '80px';
info.style.left = '20px';
info.style.width = '100%';
info.style.textAlign = 'left';
info.style.color = '#ffffff';      
info.style.backgroundColor = 'transparent';
info.style.zIndex = '1';
info.style.fontFamily = 'Poppins';
document.getElementById('canvas1').appendChild( info );

// adding paragraph element to the div
infoText=document.createElement('p')
infoText.id="displayText"
infoText.innerHTML=displayTextAttheStartOfTheScene
info.appendChild(infoText)

// adding a CTA to the div
btn=document.createElement('button')
btn.id="btnCTA"
btn.innerHTML='Click here'
info.appendChild(btn)



/*----adding a perspective camera to the scene-------------------------------------------*/
var camera=new THREE.PerspectiveCamera(
    camera_FOV,                                         
    cameraAspectRatio,    
    camera_NearSight,                                       
    camera_FarSight                                        
);

//set camera positions
camera.position.set(cameraPosition_x,cameraPosition_y,cameraPosition_z);
camera.lookAt(cameraLookAt_x,cameraLookAt_y,cameraLookAt_z)


/*--------setting up the renderer----------------------*/
const renderer=new THREE.WebGLRenderer({
    alpha:true,
    antialias:true,
    depth: true
});                     //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
renderer.setClearColor(new THREE.Color('#737373'),1)
document.getElementById('canvas1').appendChild( renderer.domElement );
// document.body.appendChild( renderer.domElement);


/*----adding lable rendrer-------------------*/
labelRenderer = new THREE.CSS2DRenderer();
				labelRenderer.setSize( window.innerWidth, window.innerHeight );
				labelRenderer.domElement.style.position = 'absolute';
				labelRenderer.domElement.style.top = '0px';
				labelRenderer.domElement.style.pointerEvents = 'none'       //ensures that orbit controls is enabled after adding label rendere
				// document.body.appendChild( labelRenderer.domElement );	
                document.getElementById('canvas1').appendChild( labelRenderer.domElement );	



/*--------setting up orbit controls---------*/
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
// Orbcontrols.enableZoom = false;
// Orbcontrols.enablePan = false;
Orbcontrols.enableDamping = true;   //damping 
Orbcontrols.dampingFactor = 0.25;   //damping inertia


//setting up drag controls to drag an object around the screen
// const dControls = new THREE.DragControls( objects, camera, renderer.domElement );
// dControls.addEventListener( 'drag', render );

// //disabling orbit controls when drag controls are started
// dControls.addEventListener('dragstart',function(event){
// 	Orbcontrols.enabled=false;
// })
// dControls.addEventListener('dragend',function(event){
// 	Orbcontrols.enabled=true;
// })

// dControls.addEventListener("hoveron", function(event){
// 	event.object.material.opacity=0.5;
// })

// dControls.addEventListener("hoveroff", function(event){
// 	event.object.material.opacity=1
// })


//function to add genreate multiple speheres
function getMultipleSpheres(sphereWidthSegmets, sphereHeightSegmets,populationWealthDistribution){
    var sphereTotal=populationWealthDistribution.length;
    
    //declaring a for loop to add the multiple spheres
    for(let i=0;i<sphereTotal;i++){
        var sphereColor=populationWealthDistribution[i].color;
		var sphereRadius=populationWealthDistribution[i].radius;

        console.log("sphere total "+sphereRadius)
        var object=getSphere(sphereRadius,sphereWidthSegmets,sphereHeightSegmets,sphereColor)

        console.log*(sphereRadius)  
        objects.push(object)    
        scene.add( object );        
    }
    objectPositionSet();        //allocatiing position to the spheres as generated from the matrix
}


/*-----creating a matrix to generate the object positions------------*/

//setting the position of each sphere in the scene
function objectPositionSet(){
    var SphereRadius=populationWealthDistribution[0].radius
    getObjectPositionMatrix(SphereRadius)   //get the coordinates from the matrix
    for(let k=0;k<objects.length;k++){
        let object=objects[k];
        object.position.x=objectPosition.positionX[k];
        object.position.y=objectPosition.positionY[k];
        object.position.z=objectPosition.positionZ[k];                
    }
}

//declaring the matrix to set the position of the respective spheres
function getObjectPositionMatrix(rad){
    
    var y_PositionObj=(-5)*rad;         //set the y position to 5 times the radius intially   
    var z_PositionObj=0;                //set the z position to 0
   
    for(let i=0;i<numberOfRows;i++){
        var x_PositionObj=(-5)*rad;     //set the x position to 5 times the radius intially      
    
        for(let j=0;j<numberOfColoumns;j++){
            (objectPosition.positionY).push(y_PositionObj);         //y position   
            x_PositionObj=x_PositionObj+(4*rad);                    
            (objectPosition.positionX).push(x_PositionObj);         //x position
            (objectPosition.positionZ).push(z_PositionObj);         //z position
        }
        y_PositionObj=y_PositionObj+(4*rad)     //change in y position
    }
}



/*--declaring the lights-------------------------------*/
//function to get an ambient light
function getAmbientLight(color,intensity){
    const light=new THREE.AmbientLight(color,intensity);
    return light;
}


/*---declaring the objects on the scene----*/
//funciton to add sphere
function getSphere(radius,widthSegmets,heightSegmets,sphereColor){
    const geometry=new THREE.SphereGeometry(radius,widthSegmets,heightSegmets);
    const material=new THREE.MeshPhongMaterial({
        color: sphereColor,
		wireframe: true
    });
    const mesh=new THREE.Mesh(geometry,material);
    return mesh;
}


/*--adding raycaster to register mouse events-----*/
var raycaster = new THREE.Raycaster();		//declaring rayCaster
var mouse = new THREE.Vector2()				//declaring mouse variable



/*----declaring Event Listeners------------*/
//adding event listener for the CTA button
document.getElementById("btnCTA").addEventListener("click", transitionStartonClick);

//adding window resize
window.addEventListener( 'resize', onWindowResize );  

//adding body event listeners
/*----DOM events for web----*/
renderer.domElement.addEventListener('mousedown',onMouseDown);
// renderer.domElement.addEventListener('mouseup',onMouseUp);

/*----DOM events for touch----*/
// renderer.domElement.addEventListener('touchstart',onTouchStart);
// renderer.domElement.addEventListener('touchend',onTouchEnd);


/*-----defining the add EventListener functions----*/

//declaring MouseDown function
function onMouseDown(){

	
    event.preventDefault();
    // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	let canvasBounds = renderer.context.canvas.getBoundingClientRect();
	mouse.x = ( ( event.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1;
	mouse.y = - ( ( event.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;

    // find intersections
      raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObject(scene,true);  
	if (intersects.length > 0) { 
        object = intersects[0].object;
		// console.log(object);
		// console.log(objects[1]);
		transitionByText(object);
	}else{
		console.log("no sphere selected")
	}
}

//declaring touchstart function
function onTouchStart(event){
    console.log("touch start")
    var rect = canvas1.getBoundingClientRect();
    mouse.x = + ( (event.targetTouches[ 0 ].pageX - rect.left) / rect.width ) * 2 - 1;
     mouse.y = - ( (event.targetTouches[ 0 ].pageY - rect.top) / rect.height ) * 2 + 1;
    // find intersections
      raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObject(scene,true);  
    //check if the mouse has intersected any object on the canvas
    if (intersects.length > 0) { 
        object = intersects[0].object;
		transitionByText(object);                
    }else{
		console.log("no sphere selected")
	}    
}


//delcaring onClick function for CTA button
function transitionStartonClick(){

	info.innerHTML=displayTextWhenButtonClicked;
	transitionByCameraPosition(0,6,65);
	transitionByPosition();
	transitionByScale();  
	// document.getElementById("btnCTA").style.visibility="hidden";       
}



//declaring transition by change in text
function transitionByText(object){
	console.log("mouse down event")
	var totalSpheres=objects.length;
	console.log(totalSpheres)
	for(let i=0;i<totalSpheres;i++){
		if(object==objects[i]){
			var displayText=populationWealthDistribution[i].story;
			info.innerHTML=displayText;
		}else{
			console.log("no sphere selected")
		}
		
	}
	// info.innerHTML=displayTextWhenButtonClicked;
}


//declaring transition by change in camera position
function transitionByCameraPosition(changeCameraPosition_x,changeCameraPosition_y,changeCameraPosition_z){
	// camera.position.set(changeCameraPosition_x,changeCameraPosition_y,changeCameraPosition_z)

	let targetPosition=new THREE.Vector3(changeCameraPosition_x,changeCameraPosition_y,changeCameraPosition_z);
	let tweenChangeCameraPosition=new TWEEN.Tween(camera.position)
	.to(targetPosition,10000)
	.easing(TWEEN.Easing.Linear.None)
	.start()

}


//declaring transition by scale
function transitionByScale(){

	for(let i=0;i<objects.length;i++){
		
		var wealthDist=populationWealthDistribution[i].wealthDistribution;
		var objectScaleInX, objectScaleInY, objectScaleInZ;

		if(wealthDist<1){
			var scaleAmt=wealthDist*1.5;		
		}else if(wealthDist>1 && wealthDist<10){
			if((wealthDist<5)){
				var scaleAmt=wealthDist*1;		
			}else{
				var scaleAmt=wealthDist*1;	
			}		
		}else{
			if(wealthDist<50){
				var scaleAmt=wealthDist*1;
			}else{
				var scaleAmt=wealthDist*0.75;
			}
		}
		
		objectScaleInX=scaleAmt;
		objectScaleInY=scaleAmt;
		objectScaleInZ=scaleAmt;

		//declaring tween animation to animate the scaling
		let targetScaleTo=new THREE.Vector3(objectScaleInX, objectScaleInY, objectScaleInZ); //scale for x,y,z
		let scaleChange=new TWEEN.Tween(objects[i].scale)
			.to(targetScaleTo,10000)
			.easing(TWEEN.Easing.Linear.None) //type of easing animation
			.start();
		}
}


//declaring transition by change in posiiton
function transitionByPosition(){

	for(let i=0;i<objects.length;i++){
		let targetPosition=new THREE.Vector3(populationWealthDistribution[i].targetPositionX,populationWealthDistribution[i].targetPositionY,populationWealthDistribution[i].targetPositionZ);
		let tweenChangePosition=new TWEEN.Tween(objects[i].position)
		.to(targetPosition,10000)
		.easing(TWEEN.Easing.Bounce.InOut)
		.start()
	}

}


//declaring function to display text for each sphere
function textForEachSphere(objectId){
		const sphereInfoText=populationWealthDistribution[objectId].story;
		info.innerHTML=sphereInfoText;
}


//declaring function for Window Resize 
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

   
}



/*---------function to animate and render the scene--------*/
animate();
function animate() {   
    
	TWEEN.update();
	Orbcontrols.update();
    requestAnimationFrame( animate );    
    render();
}
function render() {       
    renderer.render( scene, camera );
}

