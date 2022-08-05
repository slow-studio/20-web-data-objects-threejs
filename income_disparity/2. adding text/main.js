// add title and heading to sketch's html page.
document.title = 'income disparity'
document.getElementById('sketch_title').innerHTML = 'Income Disparity'
document.getElementById('sketch_description').innerHTML = ''

/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 1
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


let objects=[];  //we will store all the objects in this array once they are initiated
var shouldTransition;
var sphereText;
const totalWealthIndia=15.3*1000000;	//wealth in million USD in 2019


/*----setting up the spherical background-------------*/
// there's a large-humongous SPHERE inside which we place the camera and objects. 
// we're always stuck inside this SPHERE, and never go outside.
// we could do without this, to be honest,
// but, in the way we've structured the code now,
// lights and interactions are attached to this SPHERE.
// so let's keep it as-is, and work with this.
var sphereBackground=getSphere(250,32,32,0x3C4347,false)
sphereBackground.material.side= THREE.BackSide; 
sphereBackground.receiveShadow=false;
sphereBackground.material.opacity =0;


/*---------set camera variables--------------------*/
//set the camera parameters
var camera_FOV=35,camera_NearSight=1,camera_FarSight=30000
//declaring camera position
const cameraPosition_x=0, cameraPosition_y=2,cameraPosition_z=30;
//declaring camera lookat
cameraLookAt_x=0,cameraLookAt_y=0,cameraLookAt_z=0;
//declaring where the camera shall look at when the user clicks on the cta
var changeCameraPosition_x=0, changeCameraPosition_y=6, changeCameraPosition_z=65;


/*----light variables, make changes as required----------*/
//intensity of lghts
intensity_AmbientLight=0.75

//color of lights
color_AmbientLight=0xffffff;

var pointLight1=getPointLight((0xffffff),0.3)
pointLight1.position.set(-273,145,-20)

// var pointLight2=getPointLight((0xffffff),0.3)
// pointLight2.position.set(-273,145,-20)


/*---sphere variables---*/
var sphereTotal=13;
// var sphereWidthSegmets=16, sphereHeightSegmets=16;  
var isSphereWireframe=true;
var changeSPhereColorToOnTouch=0x76E5E3;
var sphereOpacityValue=0.1;

/*----setting up the light-------*/
var ambientLight=getAmbientLight(color_AmbientLight,intensity_AmbientLight)

/*---setting up the elements----*/
//set how the spheres shall appear on the screen
let numberOfRows=4;             //total number of rows 
let numberOfColoumns=4;         //total number of coloumns

/*-----set delay for animation transtition---*/
var delayDuration=1000;

/*-------setting up the text to display-----*/
var displayTextAttheStartOfTheScene="India has a population of 1300 M people."
var displayTextAttheStartOfTheScene2="As per a report by Credit-Suisse, the total wealth in India as of 2020 was 15.3 trillion USD."
var displayTextWhenButtonClicked1="Each sphere represents 10% of the population."
var displayTextWhenButtonClicked2="Click on a sphere to know more."

var ctaInnerText="PROCEED"



/*----declaring the scene-------*/
const scene=new THREE.Scene();
scene.add(sphereBackground)
sphereBackground.add(pointLight1)
// sphereBackground.add(pointLight2)

/*----------adding a grid helper---------*/

const size = 50;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
// scene.add( gridHelper )


/*------adding elements to the scene-------------*/
//adding the lights
sphereBackground.add(ambientLight)


//adding the spheres to the scene
// getMultipleSpheres(sphereWidthSegmets, sphereHeightSegmets,populationWealthDistribution)
getMultipleSpheres(populationWealthDistribution)


/*-----------adding text box -------------------------------------*/
info = document.createElement( 'div' );
info.id = 'textDiv'     
document.getElementById('content').appendChild( info );

// adding paragraph element to the div

infoText=document.createElement('p')
infoText.id="displayText1"
infoText.style.color='#ffffff'
infoText.innerHTML=displayTextAttheStartOfTheScene
info.appendChild(infoText)


// adding paragraph element to the div
infoText2=document.createElement('p')
infoText2.id="displayText2"
infoText2.style.marginTop='2px'
infoText2.style.color='#ffcc66'
infoText2.innerHTML=displayTextAttheStartOfTheScene2
info.appendChild(infoText2)

// adding a CTA to the div
btn=document.createElement('button')
btn.id="btnCTA";
btn.style.backgroundColor='transparent';
btn.style.border='2.5px solid #ffffff';
btn.style.color="#ffcc66";
btn.style.marginTop='20px'
btn.style.padding='10px'
btn.style.borderRadius='4px'

btn.innerHTML=ctaInnerText
info.appendChild(btn)



/*----adding a perspective camera to the scene-------------------------------------------*/
var camera=new THREE.PerspectiveCamera(
    camera_FOV,                                         
    ASPECT_RATIO,    
    camera_NearSight,                                       
    camera_FarSight                                        
);

//set camera positions
camera.position.set(cameraPosition_x,cameraPosition_y,cameraPosition_z);
camera.lookAt(cameraLookAt_x,cameraLookAt_y,cameraLookAt_z)


/*--------setting up the renderer----------------------*/
const renderer=new THREE.WebGLRenderer({
    antialias:true,
    depth: true
});                     //creating an instance of the renderer

renderer.shadowMap.enabled = true;                          //enabling shadow in render
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
renderer.setSize( CANVAS_WIDTH, CANVAS_HEIGHT );   //setting up the size of the renderer
renderer.setClearColor(new THREE.Color('#333'),1)
document.getElementById('content').appendChild( renderer.domElement);


/*----adding lable rendrer-------------------*/
labelRenderer = new THREE.CSS2DRenderer();
				labelRenderer.setSize( CANVAS_WIDTH, CANVAS_WIDTH/ASPECT_RATIO );
				labelRenderer.domElement.style.position = 'relative';
				labelRenderer.domElement.style.bottom = CANVAS_WIDTH/ASPECT_RATIO+"px";
				labelRenderer.domElement.style.pointerEvents = 'none'       //ensures that orbit controls is enabled after adding label rendere
				// document.body.appendChild( labelRenderer.domElement );	
                document.getElementById('content').appendChild( labelRenderer.domElement );	



/*--------setting up orbit controls---------*/
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
Orbcontrols.addEventListener( 'change', render )
// Orbcontrols.enableZoom = false;

Orbcontrols.maxDistance=200
// Orbcontrols.enablePan = false;
Orbcontrols.enableDamping = true;   //damping 
Orbcontrols.dampingFactor = 0.25;   //damping inertia

Orbcontrols.minAzimuthAngle=Math.PI*1.6;
Orbcontrols.maxAzimuthAngle=Math.PI*2;


//setting up drag controls to drag an object around the screen
// const dControls = new THREE.DragControls( objects, camera, renderer.domElement );
// dControls.addEventListener( 'drag', render );

// //disabling orbit controls when drag controls are started
// dControls.addEventListener('dragstart',function(event){
// 	Orbcontrols.enabled=false;
// })



//function to add genreate multiple speheres
function getMultipleSpheres(populationWealthDistribution){
    var sphereTotal=populationWealthDistribution.length;
    
    //declaring a for loop to add the multiple spheres
    for(let i=0;i<sphereTotal;i++){
        var sphereColor=populationWealthDistribution[i].color;
		var sphereRadius=populationWealthDistribution[i].radius;

		var sphereHeightSegmets=Math.sqrt(populationWealthDistribution[i].wealthDistribution)*16;
		var sphereWidthSegmets=Math.sqrt(populationWealthDistribution[i].wealthDistribution)*24;

        var object=getSphere(sphereRadius,sphereWidthSegmets,sphereHeightSegmets,sphereColor,isSphereWireframe)

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

//function to get a point light
function getPointLight(color,intensity){
	const light = new THREE.PointLight(color,intensity);
	// light.castShadow=true;
	return light;
}


/*---declaring the objects on the scene----*/
//funciton to add sphere
function getSphere(radius,widthSegmets,heightSegmets,sphereColor,isSphereWireframe){
    const geometry=new THREE.SphereGeometry(radius,widthSegmets,heightSegmets);
    const material=new THREE.MeshStandardMaterial({
        color: sphereColor,
		wireframe: isSphereWireframe,
		transparent: true,
		opacity:1,
		metalness:0.1,
		roughness:0.75
		
    });
    const mesh=new THREE.Mesh(geometry,material);
	mesh.castShadow=true;
	mesh.receiveShadow=true;
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


/*-----defining the add EventListener functions----*/

//delcaring onClick function for CTA button
function transitionStartonClick(){
	
	//change the text when user clicks on the cta
	infoText.innerHTML=displayTextWhenButtonClicked1;
	infoText2.innerHTML=displayTextWhenButtonClicked2;
	
	//make the transitions
	transitionByCameraPosition(changeCameraPosition_x,changeCameraPosition_y,changeCameraPosition_z)
	transitionByPosition();
	transitionByScale();  

	/*---event listeners will get activated only when user clicks the CTA----*/

	renderer.domElement.addEventListener('mousedown',onMouseDown);
	renderer.domElement.addEventListener('mouseup',onMouseUp);
	renderer.domElement.addEventListener('touchstart',onTouchStart);
	renderer.domElement.addEventListener('touchend',onTouchEnd);

	
	document.addEventListener('dblclick', ondblclick, false);

	document.getElementById("btnCTA").style.visibility="hidden";       
}


/*----declaring event listeners for web-----------------------------*/

//declaring function for double click
function ondblclick(event){
	
	mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.clientHeight ) * 2 + 1;

    // find intersections from raytracing
      raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObject(scene,true);  
	if (intersects.length > 0) { 
        object = intersects[0].object;

		if(object==sphereBackground){
			console.log("bg")
			setControlsTargetToDefault()
		}	
}	
}

//declaring MouseDown function
function onMouseDown(){
	
  	mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.clientHeight ) * 2 + 1;

    // find intersections from raytracing
      raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObject(scene,true);  
	if (intersects.length > 0) { 
        object = intersects[0].object;

		if(object!=sphereBackground){
			
			//hide the text box for the sphere if the user clicks outside
			const sphereTextLabelClassExists = document.querySelectorAll('.label');
			if (sphereTextLabelClassExists.length>0) {
				console.log("label exists");
				sphereText.style.visibility='hidden'
			}

			//make changes to the sphere opacity
			setDefaultSphereOpacity();
			setObjectOpacity(object);
			
			//manipulate color of sphers when the user click on them
			getOrignalSphereColor(object);
			object.material.color.set(changeSPhereColorToOnTouch);
			object.material.wireframe=false;		//disable object wireframe when touched

			changeControlsTargetTo(object);			//set orbit controls to target the selected object
		
			// transitionByText(object);  
			addTextLabel(object);              
   			 }else{

					//hide the text box for the sphere if the user clicks outside
					const sphereTextLabelClassExists = document.querySelectorAll('.label');
					if (sphereTextLabelClassExists.length>0) {
						console.log("label exists");
						sphereText.style.visibility='hidden'
					}
					
					// setControlsTargetToDefault()			//set orbit controls to default
					setDefaultSphereOpacity()
					getOrignalSphereColor(object)			//set the color of the sphere to its original color
				}    
		}	
}

//declaring function for mouse up
function onMouseUp(){
	object.material.wireframe=true;				//wireframe is renabled when the user leaves the said object	
	sphereBackground.material.wireframe=false;
}


/*----declaring event listeners for mobile -----------------------------------------*/

//declaring touchstart function
function onTouchStart(event){
    console.log("touch start")
    var rect = getElementById('content').getBoundingClientRect();
    mouse.x = + ( (event.targetTouches[ 0 ].pageX - rect.left) / rect.width ) * 2 - 1;
    mouse.y = - ( (event.targetTouches[ 0 ].pageY - rect.top) / rect.height ) * 2 + 1;
   
	// find intersections
    raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObject(scene,true);  
    //check if the mouse has intersected any object on the canvas
    if (intersects.length > 0) { 
        object = intersects[0].object;

		if(object!=sphereBackground){
			
			//hide the text box for the sphere if the user clicks outside
			const sphereTextLabelClassExists = document.querySelectorAll('.label');
			if (sphereTextLabelClassExists.length>0) {
				console.log("label exists");
				sphereText.style.visibility='hidden'
			}

			//make changes to the sphere opacity
			setDefaultSphereOpacity()
			setObjectOpacity(object);
			
			//manipulate color of sphers when the user click on them
			getOrignalSphereColor(object)
			object.material.color.set(changeSPhereColorToOnTouch)
			object.material.wireframe=false;		//disable object wireframe when touched

			changeControlsTargetTo(object)			//set orbit controls to target the selected object
		
			// transitionByText(object);  
			addTextLabel(object)              
    }else{

		//hide the text box for the sphere if the user clicks outside
		const sphereTextLabelClassExists = document.querySelectorAll('.label');
		if (sphereTextLabelClassExists.length>0) {
			console.log("label exists");
			sphereText.style.visibility='hidden'
		}
		
		setControlsTargetToDefault()			//set orbit controls to default
		setDefaultSphereOpacity()
		getOrignalSphereColor(object)			//set the color of the sphere to its original color
		}    
	}			
}


//declaring touchEnd function
function onTouchEnd(){
        object.material.wireframe=true;			//object becomes a wireframe when the user left the click    
		sphereBackground.material.wireframe=false;                                   
}


//declaring transition by change in text
function transitionByText(object){
	console.log("mouse down event")
	var totalSpheres=objects.length;
	console.log(totalSpheres)
	for(let i=0;i<totalSpheres;i++){
		if(object==objects[i]){
			var displayText=populationWealthDistribution[i].story;
			infoText.innerHTML=displayText;
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
	.to(targetPosition,delayDuration)
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
			.to(targetScaleTo,delayDuration)
			.easing(TWEEN.Easing.Linear.None) //type of easing animation
			.start();
		}
}


//declaring transition by change in posiiton
function transitionByPosition(){

	for(let i=0;i<objects.length;i++){
		let targetPosition=new THREE.Vector3(populationWealthDistribution[i].targetPositionX,populationWealthDistribution[i].targetPositionY,populationWealthDistribution[i].targetPositionZ);
		let tweenChangePosition=new TWEEN.Tween(objects[i].position)
		.to(targetPosition,delayDuration)
		.easing(TWEEN.Easing.Linear.None)
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
    camera.aspect = ASPECT_RATIO;
    camera.updateProjectionMatrix();
    renderer.setSize( CANVAS_WIDTH, CANVAS_WIDTH/ASPECT_RATIO);

   
}


/*-----------function to add text labels to each individual sphere---------*/

function addTextLabel(object){

	sphereText = document.createElement( 'div' );


	sphereText.className = 'label';
	sphereText.style.color='#3C4347';
	sphereText.style.position='absolute'
	// sphereText.style.color='rgb(1,1,1)'

	// sphereText.style.fontWeight='900';
	// txt0 = document.createElement('p')
	var wealthShareTxt = document.createElement('p')
	sphereText.appendChild(wealthShareTxt)
	var wealthSharingData= document.createElement('p')
	sphereText.appendChild(wealthSharingData)
	var wealthPerPersonTxt= document.createElement('p')
	sphereText.appendChild(wealthPerPersonTxt)
	var wealthPerPersonData= document.createElement('p')
	sphereText.appendChild(wealthPerPersonData)
	var totalSpheres=objects.length;
	for(let i=0;i<totalSpheres;i++){
		if(object==objects[i]){ 		
			var text0="Share of Wealth: ";
			wealthShareTxt.innerHTML=text0;
			var text1=+populationWealthDistribution[i].wealthDistribution+"% of 15.3 trillion USD"
			wealthSharingData.innerHTML = text1;
			var text2="Average wealth per person: ";
			wealthPerPersonTxt.innerHTML=text2;
			var text3=+populationWealthDistribution[i].wealthPerPerson+" USD";	
			wealthPerPersonData.innerHTML=text3;		
			
		}	
	}
	
	wealthShareTxt.style.fontWeight='900'
	wealthPerPersonTxt.style.fontWeight='900'

	sphereText.style.marginTop = '-5em';
	sphereText.style.padding='1%'
	sphereText.style.background='#ffffff'
	sphereText.style.borderRadius='4px'
	
	const sphereLabel=new THREE.CSS2DObject( sphereText );		
	// sphereText.style.visibility='hidden'
	sphereLabel.position.copy(object.position)
	sphereLabel.position.set(0,0,0);
	object.add(sphereLabel);
}

/*--------change in sphere when clicked----------*/
//declaring function to change sphere color to original
function getOrignalSphereColor(object){
	for(let i=0;i<objects.length;i++){
		const colorOriginal=populationWealthDistribution[i].color
		objects[i].material.color.set(colorOriginal)
	}	
} 

/*--------change in opacity of spheres-----------*/

//change in opacity of other spheres when use clicks on one
function setObjectOpacity(object){
	for(let i=0;i<objects.length;i++){
		if(objects[i]!=object){
			objects[i].material.opacity=sphereOpacityValue;
		}
	}
}

//change opacity to original state
function setDefaultSphereOpacity(){
	for(let i=0;i<objects.length;i++){
		objects[i].material.opacity=1;
	}
}

//change camera lookAt
function changeControlsTargetTo(object){

	let targetPosition=new THREE.Vector3(object.position.x,object.position.y,object.position.z);
	let tweenChangeTargetControls=new TWEEN.Tween(Orbcontrols.target)
	.to(targetPosition,delayDuration)
	.easing(TWEEN.Easing.Linear.None)
	.start()

	//change camera position and make it focus on the sphere being selected
	var objectSpecificCameraPosition_X,objectSpecificCameraPosition_Y,objectSpecificCameraPosition_Z ;
	for(let i=0;i<objects.length;i++){
		if(objects[i]==object){
			if(i!=(objects.length-1)){
				objectSpecificCameraPosition_Z=(populationWealthDistribution[i].wealthDistribution)*3.75;
			}
			else if(i==(objects.length-1)){
				objectSpecificCameraPosition_Z=(populationWealthDistribution[i].wealthDistribution)*2;
			}					
		}
		objectSpecificCameraPosition_Y=(populationWealthDistribution[i].wealthDistribution)*0.5;
	}	
	objectSpecificCameraPosition_X=object.position.x
	// objectSpecificCameraPosition_Y=cameraPosition_y
	transitionByCameraPosition(objectSpecificCameraPosition_X,objectSpecificCameraPosition_Y,objectSpecificCameraPosition_Z)

}

//declare function to set target controls to default when the user clicks outside
function setControlsTargetToDefault(){		

	let targetPosition=new THREE.Vector3(0,0,0)
	let tweenChangeTargetControls=new TWEEN.Tween(Orbcontrols.target)
	.to(targetPosition,delayDuration)
	.easing(TWEEN.Easing.Linear.None)
	.start()

	transitionByCameraPosition(changeCameraPosition_x,changeCameraPosition_y,changeCameraPosition_z)	//set the camera position to default

}


/*---------function to animate and render the scene--------*/
animate();
function animate() {   
    
	TWEEN.update();
	Orbcontrols.update();
    requestAnimationFrame( animate );    
    render();
	labelRenderer.render( scene, camera );
}
function render() {       
    renderer.render( scene, camera );
}

