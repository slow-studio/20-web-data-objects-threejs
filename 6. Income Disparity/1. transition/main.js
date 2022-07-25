console.log("initiating income disparity")

let objects=[]  //we will store all the objects in this array once they are initiated
var shouldTransition;

/*---------set camera variables--------------------*/
//set the camera parameters
var camera_FOV=35, cameraAspectRatio=(window.innerWidth/window.innerHeight),camera_NearSight=1,camera_FarSight=30000
//declaring camera position
cameraPosition_x=0, cameraPosition_y=2,cameraPosition_z=30;
//declaring camera lookat
cameraLookAt_x=0,cameraLookAt_y=0,cameraLookAt_z=0;

/*----light variables, make changes as required----------*/
//intensity of lghts
intensity_AmbientLight=0.9

//color of lights
color_AmbientLight=0xffffff;

/*---sphere variables---*/
var sphereTotal=13;
var sphereWidthSegmets=24, sphereHeightSegmets=40;  

/*----setting up the light-------*/
var ambientLight=getAmbientLight(color_AmbientLight,intensity_AmbientLight)

/*---setting up the elements----*/
//set how the spheres shall appear on the screen
let numberOfRows=4;             //total number of rows 
let numberOfColoumns=4;         //total number of coloumns


/*----declaring the scene-------*/
const scene=new THREE.Scene();


/*----------adding a grid helper---------*/

const size = 50;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper )


/*------adding elements to the scene-------------*/
//adding the lights
scene.add(ambientLight)

//adding the spheres to the scene
getMultipleSpheres(sphereWidthSegmets, sphereHeightSegmets,populationWealthDistribution)




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


/*--------setting up orbit controls---------*/
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
// Orbcontrols.enableZoom = false;
Orbcontrols.enablePan = false;
Orbcontrols.enableDamping = true;   //damping 
Orbcontrols.dampingFactor = 0.25;   //damping inertia


//setting up drag controls to drag an object around the screen
const dControls = new THREE.DragControls( objects, camera, renderer.domElement );
dControls.addEventListener( 'drag', render );

//disabling orbit controls when drag controls are started
dControls.addEventListener('dragstart',function(event){
	Orbcontrols.enabled=false;
})
dControls.addEventListener('dragend',function(event){
	Orbcontrols.enabled=true;
})

dControls.addEventListener("hoveron", function(event){
	event.object.material.opacity=0.5;
})

dControls.addEventListener("hoveroff", function(event){
	event.object.material.opacity=1
})


//function to add genreate multiple speheres
function getMultipleSpheres(sphereWidthSegmets, sphereHeightSegmets,populationWealthDistribution){
    var sphereTotal=populationWealthDistribution.length;
    
    //declaring a for loop to add the multiple spheres
    for(let i=0;i<sphereTotal;i++){
        // var sphereColor=populationWealthDistribution[i].color;
		var sphereColor=Math.random() * 0xffffff;
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
        color: sphereColor
    });
    const mesh=new THREE.Mesh(geometry,material);
    return mesh;
}





/*----declaring Event Listeners------------*/
//adding event listener for the CTA button
document.getElementById("start").addEventListener("click", transitionStartonClick);

//adding window resize
window.addEventListener( 'resize', onWindowResize );  


/*-----defining the add EventListener functions----*/

function transitionStartonClick(){
	
	transitionByCameraPosition(0,6,65);
	transitionByScale()  
	transitionByPosition()
	// document.getElementById("start").style.visibility="hidden";       
}

//declaring transition by change in camera position
function transitionByCameraPosition(changeCameraPosition_x,changeCameraPosition_y,changeCameraPosition_z){
	camera.position.x=changeCameraPosition_x
	camera.position.y=changeCameraPosition_y
	camera.position.z=changeCameraPosition_z
}

//declaring transition by scale
function transitionByScale(){
	console.log("transition by scale")
	for(let i=0;i<objects.length;i++){
		
		var wealthDist=populationWealthDistribution[i].wealthDistribution;
		// console.log(wealthDist)
		if(wealthDist<1){
			// console.log("object "+(i+1)+" populaiton distribution: "+wealthDist)				
			var scaleAmt=wealthDist*1.5;
			objects[i].scale.x=scaleAmt;
			objects[i].scale.y=scaleAmt;
			objects[i].scale.z=scaleAmt;

		}else if(wealthDist>1 && wealthDist<10){

			if(wealthDist<5){
				var scaleAmt=wealthDist*1;
				objects[i].scale.x=scaleAmt;
				objects[i].scale.y=scaleAmt;
				objects[i].scale.z=scaleAmt;					
			}else{
				var scaleAmt=wealthDist*1;
				objects[i].scale.x=scaleAmt;
				objects[i].scale.y=scaleAmt;
				objects[i].scale.z=scaleAmt;				
			}

		}else{

			if(wealthDist<50){
				var scaleAmt=wealthDist*1;
				objects[i].scale.x=scaleAmt;
				objects[i].scale.y=scaleAmt;
				objects[i].scale.z=scaleAmt;
			}else{
				var scaleAmt=wealthDist*0.75;
				objects[i].scale.x=scaleAmt;
				objects[i].scale.y=scaleAmt;
				objects[i].scale.z=scaleAmt;
			}
		}
	}
}


//declaring transition by change in posiiton
function transitionByPosition(){
	
	objects[0].position.set(-38,-11.5,0)			//sphere 5
	objects[1].position.set(-35.5,-11.3,0)			//sphere 5
	objects[2].position.set(-32,-10.7,0)			//sphere 5
	objects[3].position.set(-28,-10.5,0)			//sphere 5
	objects[4].position.set(-23,-10,0)				//sphere 5
	objects[5].position.set(-16.5,-9,0)				//sphere 6
	objects[6].position.set(-7.5,-7.5,0)			//sphere 7
	objects[7].position.set(5,-5,0)					//sphere 8
	objects[8].position.set(25,0,0)					//sphere 9
	objects[9].position.set(75,3,-50)				//sphere 10

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
    
    requestAnimationFrame( animate );    
    render();
}
function render() {       
    renderer.render( scene, camera );
}
