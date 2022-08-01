console.log("initiating income disparity")

let objects=[]  //we will store all the objects in this array once they are initiated

/*---------set camera variables--------------------*/
//set the camera parameters
var camera_FOV=45, cameraAspectRatio=(window.innerWidth/window.innerHeight),camera_NearSight=1,camera_FarSight=30000
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


/*--adding elements to the scene-------------*/
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


/*-----defining function for transition on click------*/
function transitionStartonClick(){
    
    // ambientLight.visible = !ambientLight.visible;
    console.log(objects)
    
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
