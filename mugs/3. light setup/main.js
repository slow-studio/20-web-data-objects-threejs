// add title and heading to sketch's html page.
document.title = 'mugs | inside cube'
document.getElementById('sketch_title').innerHTML = 'Mugs'
document.getElementById('sketch_description').innerHTML = 'Each mug tells a story of what smoking does to the human body. Select one to know more.'


/*--declare the canvas dimensions--*/
const ASPECT_RATIO = 3/2
contentDiv = document.getElementById('content')
const CANVAS_WIDTH = contentDiv.offsetWidth
const CANVAS_HEIGHT = CANVAS_WIDTH/ASPECT_RATIO


/*--------define here the story you want to tell for each individual cup--------*/
var storyCup1="you have selected cup 1"
var storyCup2="you have selected cup 2"
var storyCup3="you have selected cup 3"
var storyBackground=""

/*-------define the location of each cup here-------------------------*/
var locationCup1='../assets/cup1.glb', x_Cup1=-1.5,y_cup1=0.5,z_cup1=1.5,colorCup1=0xffcc00, cup1_count=1, cup1_class="cup";     
var locationCup2='../assets/cup2.glb',x_Cup2=-0.1,y_cup2=0.18,z_cup2=0,colorCup2=0xffcc00,cup2_count=2,cup2_class="cup";         
var locationCup3='../assets/cup3.glb',x_Cup3=2,y_cup3=0.45,z_cup3=1.4,colorCup3=0xffcc00,cup3_count=3,cup3_class="cup";         

/*-----for the background-------*/
var locationBackGroundPlane='../assets/curved_Plan.glb',x_bg=0,y_bg=-0.5,z_bg=0.3,color_bg=0xffffff,bg_class="background",bg_count=1;


/*----light variables, make changes as required----------*/
//intensity of lghts
intensity_hemiLight=0.7,intensity_AmbientLight=0.5,intensity_rectLight=1,intensity_pointLight=0.5,intensity_DirectLight=0.65

//color of lights
color_AmbientLight=0xffffff,color_rectLight=0xffffff,color_pointLight=0xffffff,color_directLight=0xffffcc
color_hemiLightSky=0xCCCCBE,color_hemiLightSurface=0Xffffee     

//dimensions for rectangular area light
rectLight_width=10,rectLight_height=10;

//light positions
var rectLightPosition_x=-2,rectLightPosition_y=4,rectLightPosition_z=5;                         //rectangular area light
var directLight1Position_x=-0.97, directLight1Position_y=1.96, directLight1Position_z=1.23;     //directional light
var pointLightPosition1_x=-5, pointLightPosition1_y=5, pointLightPosition1_z=5;                 //point light


/*---------set camera variables--------------------*/
//set the camera parameters
var camera_FOV=45, cameraAspectRatio=ASPECT_RATIO,camera_NearSight=1,camera_FarSight=1000
//declaring camera position
cameraPosition_x=0, cameraPosition_y=1.5,cameraPosition_z=4;
//declaring camera lookat
cameraLookAt_x=0,cameraLookAt_y=0,cameraLookAt_z=0;


/*---------paramteres to set when user interacts with the canvas elements-------------------------------*/
//set what color you want the cups to change to when the user clicks on it
var cup1_colorChangeTo=0xDD4CF4,cup2_colorChangeTo=0xFF772B,cup3_colorChangeTo=0xb52525;
//set this parameters if you want the cup to change its position in the axes when the user click
var cupPositionChange_axisX=0, cupPositionChange_axisY=0.5, cupPositionChange_axisZ=0;

/*-----setting the parameters for the DELAY TIMEOUT to return the object to its original state after onClick --------------------*/
var changeObjectColorBackTo=0xffcc00, delayDuration=500;


/*-----------adding text box inside canvas-------------------------------------*/
info = document.createElement( 'div' );
info.style.position = 'absolute';
info.style.top = '30%';
info.style.width = '60%';
info.style.textAlign = 'center';
info.style.color = '#b52525';      
info.style.backgroundColor = 'transparent';
info.style.zIndex = '1';
info.style.fontFamily = 'Poppins';
//-----the input to this can be defined from the OnClick function below
info.innerHTML = ' ';      
document.getElementById('content').appendChild( info );


/*---------creating the 3d scene------*/
const scene=new THREE.Scene();
const gui=new dat.GUI();
//ensures the GUI displays hidden by default, press H to view it
dat.GUI.toggleHide();       


/*----------------adding each element to the scene----------------*/
//adding the gltf objects, the fourth parameter specifies the type of object being loaded
var gltfObj1=getGLTFLoader(locationCup1,x_Cup1,y_cup1,z_cup1,colorCup1,cup1_class,cup1_count);
var gltfObj2=getGLTFLoader(locationCup2,x_Cup2,y_cup2,z_cup2,colorCup2,cup2_class,cup2_count);
var gltfObj3=getGLTFLoader(locationCup3,x_Cup3,y_cup3,z_cup3,colorCup3,cup3_class,cup3_count);
var gltfPlanBG=getGLTFLoader(locationBackGroundPlane,x_bg,y_bg,z_bg,color_bg,bg_class,bg_count);

//adding the lights
var hemiLight=getHemiLight(color_hemiLightSky,color_hemiLightSurface,intensity_hemiLight)
var rectLight=getRectArLight(intensity_rectLight,color_rectLight,rectLight_width,rectLight_height);
var pointLight1=getPointLight(color_pointLight,intensity_pointLight);
var directLight1=getDirectionalLight(color_directLight,intensity_DirectLight);
var ambientLight=getAmbientLight(color_AmbientLight,intensity_AmbientLight)


//rotating the rectangular light on the x axis 
rectLight.rotateX( - Math.PI / 2);  

/*--------------------setting up the object positions-------------------------*/
//setting up the light positions
rectLight.position.set(rectLightPosition_x,rectLightPosition_y,rectLightPosition_z)
directLight1.position.set(directLight1Position_x,directLight1Position_y,directLight1Position_z)
pointLight1.position.set(pointLightPosition1_x,pointLightPosition1_y,pointLightPosition1_z);

//adding the elements to the scene
scene.add(hemiLight)
scene.add(rectLight);
scene.add(ambientLight)
scene.add(directLight1)
scene.add(pointLight1);


//set ambient light and direct light 2 to invisible by default
rectLight.visible = false
ambientLight.visible = false
directLight1.visible = false


/*------------adding the light controls in GUI-----------------*/

//toggle hemi light, ambient light on and off
gui.add(ambientLight,'visible').name('hemi light')
gui.add(ambientLight,'visible').name('ambient light')
gui.add(rectLight,'visible').name('rect area light')
gui.add(pointLight1,'visible').name('Point light')
gui.add(directLight1, 'visible').name('Direct Light')

//adding the GUI controls for the point light
const directLightGUI1=gui.addFolder('direct light 1')
const pointLighttGUI1=gui.addFolder('Point light 1')
const rectLightGUI=gui.addFolder('Rectangular Light')

//adding the GUI controls for direct light 1
directLightGUI1.add(directLight1, 'intensity').min(0).max(10).step(0.01);
directLightGUI1.add(directLight1.position, 'x').min(-50).max(50).step(0.01);
directLightGUI1.add(directLight1.position, 'y').min(0).max(50).step(0.01);
directLightGUI1.add(directLight1.position, 'z').min(-50).max(50).step(0.01);

//adding the GUI controls for point light1
pointLighttGUI1.add(pointLight1, 'intensity').min(0).max(10).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'x').min(-100).max(100).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'y').min(-100).max(100).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'z').min(-100).max(100).step(0.01);

//adding the GUI controls for rectangular light 2
rectLightGUI.add(rectLight, 'intensity').min(0).max(10).step(0.01);
rectLightGUI.add(rectLight.position, 'x').min(-100).max(100).step(0.01);
rectLightGUI.add(rectLight.position, 'y').min(-100).max(100).step(0.01);
rectLightGUI.add(rectLight.position, 'z').min(-100).max(100).step(0.01);

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
    antialias:true,
    depth: true
});                     

//enabling shadow in render
renderer.shadowMap.enabled = true;                       
//adding shadow type as soft shadow   
renderer.shadowMap.type = THREE.PCFSoftShadowMap;           
//setting up the size of the renderer
renderer.setSize( CANVAS_WIDTH,CANVAS_HEIGHT);   
renderer.setClearColor(new THREE.Color('#ddeeff'),0.45)
document.getElementById('content').appendChild( renderer.domElement);


/*--------setting up orbit controls---------*/
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);

Orbcontrols.enablePan = false;

//prevent orbit controls from going below the ground
Orbcontrols.maxPolarAngle = Math.PI/2.2; 
//damping     
Orbcontrols.enableDamping = true;
//damping inertia   
Orbcontrols.dampingFactor = 0.25;   


//--function to call the GLTF Loader----the obj location and positions are passed as parameters in the function call
function getGLTFLoader(assetLocation,positionX,positionY,positionZ,colour,object_class,object_count){
    var model;   
    const loader=new THREE.GLTFLoader();

loader.load( assetLocation, function ( gltf ) {
    model=gltf.scene;
    model.object_class=object_class;
    model.object_count=object_count;
    
    console.log(model.count)
    const newMaterial = new THREE.MeshStandardMaterial({
                                    color: colour,                              
                                    metalness:0.2,
                                    roughness: 1,
                                    transparent: true 
                                                          
                        });
						model.traverse((obj) => {
						    if (obj.isMesh) obj.material = newMaterial;
						}); 
                        model.castShadow = true;                
         
                        model.traverse(function (node) {
                          if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                          }
                        });                   
    model.position.set(positionX,positionY,positionZ);                      
	scene.add(model);
}); 
}


//function to add a plan-------------------------------
function getPlane(length,breadth,colour){
    const geometry=new THREE.PlaneGeometry(length,breadth);
    const material=new THREE.MeshPhongMaterial({
        color: colour,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
     //set this to true to allow the object to recieve the shadow
    mesh.receiveShadow = true;     
    return mesh;
}


/*--declaring the lights-------------------------------*/
//function to get an ambient light
function getAmbientLight(color,intensity){
    const light=new THREE.AmbientLight(color,intensity);
    return light;
}

//function to add a point light
function getPointLight(color,intensity){
    const light=new THREE.PointLight(color,intensity);   
    light.castShadow=true;
    light.shadow.mapSize.width=1024
    light.shadow.mapSize.height=1024
    light.shadow.camera.near=0.1;
    light.shadow.camera.far=500.0;
    return light;
}

//function to add a hemi light
function getHemiLight(color_hemiLightSky,color_hemiLightSurface,intensity){
    const light=new THREE.HemisphereLight(color_hemiLightSky,color_hemiLightSurface, intensity)
    return light;
}

//function to add a rectangualr area light
function getRectArLight(intensity,colour,width,height){
    const light=new THREE.RectAreaLight(colour,intensity,width,height);
    return light;
}

//function to add a direcitonal light
function getDirectionalLight(color,intensity){
    const light = new THREE.DirectionalLight( color, intensity );
    light.castShadow=true;
    light.shadow.bias=-0.001;
    light.shadow.mapSize.width=1024
    light.shadow.mapSize.height=1024
    light.shadow.camera.near=0.1;
    light.shadow.camera.far=500.0;
    light.shadow.camera.left=-50;
    light.shadow.camera.right=30;
    light.shadow.camera.top=30;
    light.shadow.camera.bottom=-50;
    return light;
}

/*--adding raycaster to register mouse events-----*/
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2()


/*---------------adding event listeners-------------*/

// adding window resize
 window.addEventListener( 'resize', onWindowResize );       

//adding on event listeners to aid user interactions
/*----DOM events for web----*/
renderer.domElement.addEventListener('mousedown',onMouseDown);
renderer.domElement.addEventListener('mouseup',onMouseUp);

/*----DOM events for touch----*/
renderer.domElement.addEventListener('touchstart',onTouchStart);
renderer.domElement.addEventListener('touchend',onTouchEnd);


/*-----------defining the event listeners-------------------*/

//declaring function for Window Resize 
function onWindowResize() {
    camera.aspect = ASPECT_RATIO;
    camera.updateProjectionMatrix();
    renderer.setSize( CANVAS_WIDTH,CANVAS_HEIGHT );
}


/*---------------DOM event listeners for Mobile-----------------------*/
//declaring function for Touch start event
function onTouchStart(event){
    var rect = getElementById('content').getBoundingClientRect();
    mouse.x = + ( (event.targetTouches[ 0 ].pageX - rect.left) / rect.width ) * 2 - 1;
     mouse.y = - ( (event.targetTouches[ 0 ].pageY - rect.top) / rect.height ) * 2 + 1;
    // find intersections
      raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObject(scene,true);  
    //check if the mouse has intersected any object on the canvas
    if (intersects.length > 0) { 
        object = intersects[0].object;
              
        if(object.parent.object_class=="cup"){
        //this is where you specify the required interaction as required                  
            getTextForCup(object,object.parent.object_count)

                }else{
                info.innerHTML=(storyBackground)
                console.log("select a cup")
            }                   
    }    
}

//declaring function for Touch End event
function onTouchEnd(){
  
         //this is where you specify the required interaction as required
        if(object.parent.object_class=="cup"){
            timeFunction(object)            
            }                       
        }           
    

/*---------------DOM event listeners for WEB on a PC-----------------------*/
//declaring function for MouseDown event
function onMouseDown(event){
   
    mouse.x = ( ( event.clientX - renderer.domElement.offsetLeft ) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( ( event.clientY - renderer.domElement.offsetTop ) / renderer.domElement.clientHeight ) * 2 + 1;

    // find intersections
      raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObject(scene,true);  
    //check if the mouse has intersected any object on the canvas
    if (intersects.length > 0) { 
        object = intersects[0].object;
              
        if(object.parent.object_class=="cup"){
        //this is where you specify the required interaction as required                  
            getTextForCup(object,object.parent.object_count)

                }else{
                info.innerHTML=(storyBackground)
                console.log("select a cup")
            }                   
    }    
}

//declaring function for MouseUp event
function onMouseUp(){
    
      //this is where you specify the required interaction as required
      if(object.parent.object_class=="cup"){
        timeFunction(object)            
        }            
    } 
    


//declaring the time out functioon to return the object to its original state
function timeFunction(obj) {
    setTimeout(function(){ 
        obj.material.color.set(0xffcc00);                                   
        }, 
        delayDuration);
    }


/*----this is where we define the interaction in the form of text appearing, which results on clicking the individual cups-----*/
//count 1=cup1, count 2=cup2, count 3=cup3
function getTextForCup(obj,count){          
    //for cup1 
    if(count==cup1_count){     
        obj.material.color.set(cup1_colorChangeTo);       
        console.log("cup"+count)
        info.innerHTML=(storyCup1)
    //for cup2  
    }else if(count==cup2_count){
        obj.material.color.set(cup2_colorChangeTo);  
        console.log("cup"+count)
        info.innerHTML=(storyCup2)
    //for cup3     
    }else if(count==cup3_count){
        obj.material.color.set(cup3_colorChangeTo);  
        console.log("cup"+count)
        info.innerHTML=(storyCup3)      
    }
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


