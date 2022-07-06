// console.log("script running")

// const scene=new THREE.Scene();
// const gui=new dat.GUI()

// var objects=[];

// //calling objects to initiate the elements
// hemiLight=getHemiLight(0.5);
// sphere1=getSphere(0.35,32,16,0x3290FF); 
// sphere2=getSphere(0.2,32,16,0x3290FF); 

// //adding elements to the scene
// scene.add(hemiLight);
// scene.add(sphere1);
// scene.add(sphere2);

// //adding elemnts to the objects array
// objects.push(sphere1)
// objects.push(sphere2)

// //setting up object positions
// sphere1.position.y = sphere1.geometry.parameters.radius;      //setting up sphere position wrt y axis
// sphere2.position.set(2,sphere2.geometry.parameters.radius,0)

// //creating a grid
// const gridHelper=new THREE.GridHelper(10,10,0x000000,0xffffff);
// // gridHelper.position.y =-0.5
// scene.add(gridHelper);

// //setting up ther perspective camera
// var camera=new THREE.PerspectiveCamera(
//     50,                                       //camera FOV
//     window.innerWidth/window.innerHeight,     //camera aspectRatio
//     0.1,                                      //nearSight
//     1000                                      //farSight
// );

// //set camera positions
// camera.position.set(0,1,4);     //set the camera position on on x,y,z axes
// //camera.lookAt(0,0,0)            //makes the camera look at the center of the object

// //setting up the renderer
// const renderer=new THREE.WebGLRenderer({
//     alpha:true,
//     antialias:true,
//     depth: true
// });                     //creating an instance of the renderer

// renderer.shadowMap.enabled = true;                          //enabling shadow in render
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;           //adding shadow type as soft shadow
// renderer.setSize( window.innerWidth, window.innerHeight);   //setting up the size of the renderer
// renderer.setClearColor(new THREE.Color('#ffffff'),0.45)
// document.body.appendChild( renderer.domElement);

// //setting up orbit controls
// controls = new THREE.OrbitControls(camera,renderer.domElement);
// // controls.maxDistance=12;    //set max zoom(dolly) out distance for perspective camera, default=infinity
// // controls.minDistance=0.75
// controls.maxPolarAngle = Math.PI/2.1;     //prevent orbit controls from going below the ground
// controls.enableDamping = true;   //damping 
// controls.dampingFactor = 0.25;   //damping inertia

// //function to add a hemi light-------------------------
// function getHemiLight(intensity){
//     const light=new THREE.HemisphereLight(0xffffee,0xffffee, intensity)
//     return light;
// }

// //function to get a sphere-----------------------------
// function getSphere(radius,widthSegment,heightSegment,color){
//     const geometry=new THREE.SphereBufferGeometry(radius,widthSegment,heightSegment);
//     const material=new THREE.MeshBasicMaterial({      
//         color: color,
//         metalness:0.1,
//         roughness:0.5,
//         transparent: true,
//         opacity:1
//     });
//     const mesh=new THREE.Mesh(geometry,material);
//     mesh.receiveShadow=true;
//     mesh.castShadow=true;    
//     return mesh;
// }

// //calling the mousedown through addEventListener
// document.addEventListener('mousedown',onDocumentMouseDown);

// //defining the mouseDown function
// function onDocumentMouseDown(event){
//     event.preventDefault();
//     var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,   
//                                     -( event.clientY / window.innerHeight ) * 2 + 1,  
//                                     0.5 );   
//     var raycaster=new THREE.Raycaster();
//     raycaster.setFromCamera(mouse3D,camera);
    
//     var intersects=raycaster.intersectObjects(objects);
//     console.log(intersects)

//     if(intersects.length>0){
//         intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
//     }
// }

// //function to animate the scene------
// animate();
// function animate() {   
//    // TWEEN.update();
//     requestAnimationFrame( animate );
//    // camera.lookAt( scene.position );
//     render();
// }
// function render() {
//     renderer.render( scene, camera );
// }


//-------------------------


let container;
			let camera, scene, renderer;
			let controls, group;
			let enableSelection = false;

			const objects = [];

			const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

			init();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 5000 );
				camera.position.z = 1000;

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xf0f0f0 );

				scene.add( new THREE.AmbientLight( 0x505050 ) );

				const light = new THREE.SpotLight( 0xffffff, 1.5 );
				light.position.set( 0, 500, 2000 );
				light.angle = Math.PI / 9;

				light.castShadow = true;
				light.shadow.camera.near = 1000;
				light.shadow.camera.far = 4000;
				light.shadow.mapSize.width = 1024;
				light.shadow.mapSize.height = 1024;

				scene.add( light );

				group = new THREE.Group();
				scene.add( group );

				const geometry = new THREE.BoxGeometry( 40, 40, 40 );

				for ( let i = 0; i < 200; i ++ ) {

					const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

					object.position.x = Math.random() * 1000 - 500;
					object.position.y = Math.random() * 600 - 300;
					object.position.z = Math.random() * 800 - 400;

					object.rotation.x = Math.random() * 2 * Math.PI;
					object.rotation.y = Math.random() * 2 * Math.PI;
					object.rotation.z = Math.random() * 2 * Math.PI;

					object.scale.x = Math.random() * 2 + 1;
					object.scale.y = Math.random() * 2 + 1;
					object.scale.z = Math.random() * 2 + 1;

					object.castShadow = true;
					object.receiveShadow = true;

					scene.add( object );

					objects.push( object );

				}

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );

				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFShadowMap;

				container.appendChild( renderer.domElement );

				controls = new DragControls( [ ... objects ], camera, renderer.domElement );
				controls.addEventListener( 'drag', render );

				//

				window.addEventListener( 'resize', onWindowResize );

				document.addEventListener( 'click', onClick );
				window.addEventListener( 'keydown', onKeyDown );
				window.addEventListener( 'keyup', onKeyUp );

				render();

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

				render();

			}

			function onKeyDown( event ) {

				enableSelection = ( event.keyCode === 16 ) ? true : false;

			}

			function onKeyUp() {

				enableSelection = false;

			}

			function onClick( event ) {

				event.preventDefault();

				if ( enableSelection === true ) {

					const draggableObjects = controls.getObjects();
					draggableObjects.length = 0;

					mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
					mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

					raycaster.setFromCamera( mouse, camera );

					const intersections = raycaster.intersectObjects( objects, true );

					if ( intersections.length > 0 ) {

						const object = intersections[ 0 ].object;

						if ( group.children.includes( object ) === true ) {

							object.material.emissive.set( 0x000000 );
							scene.attach( object );

						} else {

							object.material.emissive.set( 0xaaaaaa );
							group.attach( object );

						}

						controls.transformGroup = true;
						draggableObjects.push( group );

					}

					if ( group.children.length === 0 ) {

						controls.transformGroup = false;
						draggableObjects.push( ...objects );

					}

				}

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}