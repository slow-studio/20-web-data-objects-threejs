console.log("movement along a path")
var position = 0;

//creating the scene and initiating the GUI
const scene=new THREE.Scene();
const gui=new dat.GUI()

//caling the elements
var ambientLight=getambientLight(0.75);
var spotLight=getSpotLight(0.5);
var LinePath=getLinePath();
var sphere1=getSphere(0.2,48,24)
//adding elements to the scene
scene.add(ambientLight);
scene.add(spotLight)
// scene.add(LinePath);
// scene.add(sphere1);

//creating a grid
const gridHelper=new THREE.GridHelper(50,10,0x000000,0xffffff);
scene.add(gridHelper);


//setting up ther perspective camera
var camera=new THREE.PerspectiveCamera(
    75,                                       //camera FOV
    window.innerWidth/window.innerHeight,     //camera aspectRatio
    0.1,                                      //nearSight
    1000                                      //farSight
);

//setting up positions
camera.position.set(0,1,2)
camera.lookAt(0,0,0)

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

//function to draw a line path
function getLinePath(){
    const path = new THREE.Path();

    path.lineTo( 0, 0.8 );      //connects .currentPath to x,y
    path.quadraticCurveTo( 0, 1, 0.2, 1 );      //creates a curve from currentPoint(x,y) to new point(x,y)
    path.lineTo( 1, 1 );
    path.quadraticCurveTo( 1.5, 1, 1.8, 0 );
    path.lineTo( 1.8, 0 );
    // path.quadraticCurveTo( 2, -1, 1.8, -1 );

    const points = path.getPoints();

    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const material = new THREE.LineBasicMaterial( { color: 0xffcc00 } );

    const line = new THREE.Line( geometry, material );
    return line;
}

//function to add a hemi light
function getambientLight(intensity){
    const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
    return light;
}

//function to add a spotLight
function getSpotLight(intensity){
    const light=new THREE.SpotLight(0xffffff,intensity);
    light.castShadow=true;
    light.shadow.bias= -0.00001;
    light.shadow.mapSize.width=1024*2;
    light.shadow.mapSize.height=1024*2;
    return light;
}

//function to get a sphere
function getSphere(radius,widthSegment,heightSegment){
    const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
    const material=new THREE.MeshPhongMaterial({      
        color:  0x3D9D9B       
    });
    const mesh=new THREE.Mesh(geometry,material);
    mesh.receiveShadow=true;
    mesh.castShadow=true;    
    return mesh;

}

//adding curve and moving element accross it.
const somePoints = [

	new THREE.Vector3(  1,   0, -1 ),
	new THREE.Vector3(  1, 0.6,  1 ),
	new THREE.Vector3( -1,   0,  1 ),
	new THREE.Vector3( -1, 0.2, -1 ),
	
];

const curve = new THREE.CatmullRomCurve3( somePoints );	
curve.closed = true;

const points = curve.getPoints( 60 );
const line = new THREE.LineLoop( new THREE.BufferGeometry( ).setFromPoints( points ), new THREE.LineBasicMaterial( { color: 0xffffaa } ) );
scene.add( line );

const light = new THREE.DirectionalLight( 0xc0c0c0 );
light.position.set( - 8, 12, 10 );
light.intensity = 1.0;
scene.add( light );

const geometry = new THREE.BoxGeometry( 0.2, 0.08, 0.05 );
const material = new THREE.MeshPhongMaterial( { color: 0x99ffff, wireframe: false } );
const objectToCurve = new THREE.Mesh( geometry, material );

const flow = new Flow( objectToCurve ); 
flow.updateCurve( 0, curve );
scene.add( flow.object3D );






//function to animate the scene
function animate(){
    requestAnimationFrame(animate);
    render();
}

function render(){
    renderer.render(scene,camera);
}
animate();   

