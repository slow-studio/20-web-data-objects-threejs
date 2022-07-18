console.log("initiate shpere position")
console.log("initiating cups")

var clock = new THREE.Clock;

//declaring global variables
var backgroundObjcts=[];
var objects=[]

//creating the 3d scene
const scene=new THREE.Scene();
const gui=new dat.GUI();
dat.GUI.toggleHide();

//adding the gltf objects, the fourth parameter specifies the type of object being loaded
var gltfObj1=getGLTFLoader('./assets/cup1.glb',-1.5,0.5,1.5,0xffcc00,"cup",1);
var gltfObj2=getGLTFLoader('./assets/cup2.glb',-0.1,0.18,0,0xffcc00,"cup",2);
var gltfObj3=getGLTFLoader('./assets/cup3.glb',2,0.45,1.4,0xffcc00,"cup",3);
var gltfPlanBG=getGLTFLoader('./assets/curved_Plan.glb',0,-0.5,0.3,0xffffff,"background",1);

//adding the plane to display texts and setting up its position
var TextPlane=getPlane(2,0.75,0xffffff)
TextPlane.position.set(0,0.8,0)

//adding the lights
var hemiLight=getHemiLight(0.7)
var rectLight=getRectArLight(2,0xffffff,10,10);
var pointLight1=getPointLight(0xffffff,0.5);
var directLight1=getDirectionalLight(0xffffcc,0.65);
var ambientLight=getAmbientLight(0xffffff,0.5)

//we push the curved plan to the b/g array
backgroundObjcts.push(gltfPlanBG) 
console.log(backgroundObjcts)    

//rotating the plan on the x axis to use it as a floor
rectLight.rotateX( - Math.PI / 2);  

/*--------------------setting up the object positions-------------------------*/
//setting up the light positions
rectLight.position.set(-2,4,5)
directLight1.position.set(-0.97,1.96,1.23)
pointLight1.position.set(-5,5,5);

//adding the elements to the scene
scene.add(hemiLight)
scene.add(rectLight);
scene.add(ambientLight)
scene.add(directLight1)
scene.add(pointLight1);
scene.add(TextPlane)

/*-----------adding text box inside canvas-------------------------------------*/
//info
info = document.createElement( 'div' );
info.style.position = 'relative';
info.style.top = '50px';
info.style.width = '100%';
info.style.textAlign = 'center';
info.style.color = '#b52525';
info.style.backgroundColor = 'transparent';
info.style.zIndex = '1';
info.style.fontFamily = 'Poppins';
info.innerHTML = 'Select a cup'      //-----the input to this can be defined from the OnClick function below
document.getElementById('canvas1').appendChild( info );

//setting the text plane to invisible----
TextPlane.visible=false;

//set ambient light and direct light 2 to invisible by default
rectLight.visible = false
ambientLight.visible = false
directLight1.visible = false


/*------------adding the light controls in GUI-----------------*/

//toggle hemi light, ambient light on and off
gui.add(hemiLight,'visible').name('hemi light')
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

// adding the GUI controls for point light1
pointLighttGUI1.add(pointLight1, 'intensity').min(0).max(10).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'x').min(-100).max(100).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'y').min(-100).max(100).step(0.01);
pointLighttGUI1.add(pointLight1.position, 'z').min(-100).max(100).step(0.01);

//adding the GUI controls for rectangular light 2
rectLightGUI.add(rectLight, 'intensity').min(0).max(10).step(0.01);
rectLightGUI.add(rectLight.position, 'x').min(-100).max(100).step(0.01);
rectLightGUI.add(rectLight.position, 'y').min(-100).max(100).step(0.01);
rectLightGUI.add(rectLight.position, 'z').min(-100).max(100).step(0.01);

//declaring the custom canvas size
var CANVAS_WIDTH=640;
var CANVAS_HEIGHT=480;

//adding a perspective camera to the scene-------------------------------------------
var camera=new THREE.PerspectiveCamera(
    35,                                         //FOV
    window.innerWidth / window.innerHeight,     //aspect ration
    1,                                        //near
    1000                                        //far
);

//set camera positions
camera.position.set(0,1.5,4);
camera.lookAt(0,0,0)


scene.add(TextPlane)

//TextPlane.position.set(0,50,200)
// TextPlane.position.copy(camera.position);

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

/*----adding the text---------------------*/

/*--------setting up orbit controls---------*/
var Orbcontrols = new THREE.OrbitControls(camera,renderer.domElement);
// Orbcontrols.enableZoom = false;
Orbcontrols.enablePan = false;
// Orbcontrols.enableRotate = false;

Orbcontrols.maxPolarAngle = Math.PI/2.2;     //prevent orbit controls from going below the ground
Orbcontrols.enableDamping = true;   //damping 
Orbcontrols.dampingFactor = 0.25;   //damping inertia

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
                                   // wireframe: true,
                                   metalness:0.2,
                                    roughness: 70,
                                    emissive: 0x000000,
                                    
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
    objects.push(model)                   
	scene.add(model);
}); 
}

console.log("objects"+objects)

//function to add a plan-------------------------------
function getPlane(length,breadth,colour){
    const geometry=new THREE.PlaneGeometry(length,breadth);
    const material=new THREE.MeshPhongMaterial({
        color: colour,
        side: THREE.DoubleSide
    })
    const mesh=new THREE.Mesh(geometry,material)
    mesh.receiveShadow = true;      //set this to true to allow the object to recieve the shadow
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
function getHemiLight(intensity){
    const light=new THREE.HemisphereLight(0xCCCCBE,0xffffee, intensity)
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



raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2()
/*---------------adding event listeners-------------*/

//adding window resize
 window.addEventListener( 'resize', onWindowResize );       

//adding on mouse click
renderer.domElement.addEventListener('click', onClick);

/*-----------defining the event listeners-------------------*/

//declaring function for onMouseClick
function onClick() {

    event.preventDefault();
  
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
  
    var intersects = raycaster.intersectObject(scene, true);
  
    if (intersects.length > 0) { 
        object = intersects[0].object;
                  
        if(object.parent.object_class=="cup"){

            
               
                CupEffect(object,object.parent.object_count)
                // TextPlane.visible=true;
            
            }else{
                console.log("select a cup")
                document.location.reload()
            }                   
    }  
  
  }


/*----this is where we define the interaction which results on clicking the individual cups-----*/
/*--------count 1=cup1, count2=cup2, count3=cup3---------------------------------------*/
function CupEffect(obj,count){
        
    obj.material.color.set(0xb52525);    
    if(count==1){
        
        console.log("cup"+count)
        info.innerHTML=('you have selected cup 1')
        getTween(obj)
    }else if(count==2){
        console.log("cup"+count)
        info.innerHTML=('you have selected cup 2')
        getTween(obj)
    }else{
        console.log("cup"+count)
        info.innerHTML=('you have selected cup 3')
        getTween(obj)
    }
}  


//declaring function for Window Resize 
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    // camera.aspect = CANVAS_WIDTH/CANVAS_HEIGHT;
    camera.updateProjectionMatrix();
    // renderer.setSize( CANVAS_WIDTH,CANVAS_HEIGHT );
    renderer.setSize( window.innerWidth, window.innerHeight );
}


//function to animate the scene------
animate();
function animate() {   
    requestAnimationFrame( animate );
    TWEEN.update();
    // var vector = TextPlane.parent.worldToLocal( camera.getWorldPosition() );
    // TextPlane.lookAt( vector );



    render();
}
function render() {
    
    renderer.render( scene, camera );
}


/*---use the below to add the text plane----------*/
// const text = document.createElement( 'div' );
// 			text.className = 'label';
// 			text.textContent = 'Cup 1';
// 			text.style.marginTop = '-1em';
// 			const planeLabel = new THREE.CSS2DObject( text );
// 			planeLabel.position.set( 0, 0.3, 0 );
// 			// planeLabel.position.copy( plane.position );
// 			object.add( planeLabel );