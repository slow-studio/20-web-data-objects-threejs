const gui=new dat.GUI();
dat.GUI.toggleHide();       //ensures the GUI displays hidden by default, press H to view it

/*---adding the dat gui elements----*/
//creating the folders
const sphereGUI_1=gui.addFolder('sphere 1');
const sphereGUI_2=gui.addFolder('sphere 2');
const sphereGUI_3=gui.addFolder('sphere 3');
const sphereGUI_4=gui.addFolder('sphere 4')
const sphereGUI_5=gui.addFolder('sphere 5')
const sphereGUI_6=gui.addFolder('sphere 6')
const sphereGUI_7=gui.addFolder('sphere 7')
const sphereGUI_8=gui.addFolder('sphere 8')
const sphereGUI_9=gui.addFolder('sphere 9')
const sphereGUI_10=gui.addFolder('sphere 10')
const cameraControls=gui.addFolder('camera controls')
const pointLightControls1=gui.addFolder('pointLight controls')

//sphere 1 controls
sphereGUI_1.add(objects[0].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_1.add(objects[0].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_1.add(objects[0].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 2 controls
sphereGUI_2.add(objects[1].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_2.add(objects[1].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_2.add(objects[1].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 3 controls
sphereGUI_3.add(objects[2].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_3.add(objects[2].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_3.add(objects[2].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 4 controls
sphereGUI_4.add(objects[3].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_4.add(objects[3].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_4.add(objects[3].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 5 controls
sphereGUI_5.add(objects[4].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_5.add(objects[4].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_5.add(objects[4].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 6 controls
sphereGUI_6.add(objects[5].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_6.add(objects[5].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_6.add(objects[5].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 7 controls
sphereGUI_7.add(objects[6].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_7.add(objects[6].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_7.add(objects[6].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 8 controls
sphereGUI_8.add(objects[7].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_8.add(objects[7].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_8.add(objects[7].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 9 controls
sphereGUI_9.add(objects[8].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_9.add(objects[8].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_9.add(objects[8].position, 'z').min(-100).max(100).step(0.01).listen();

//sphere 10 controls
sphereGUI_10.add(objects[9].position, 'x').min(-100).max(100).step(0.01).listen();
sphereGUI_10.add(objects[9].position, 'y').min(-100).max(100).step(0.01).listen();
sphereGUI_10.add(objects[9].position, 'z').min(-100).max(100).step(0.01).listen();

//camera controls
cameraControls.add(camera.position, 'x').min(-500).max(500).step(0.01).listen();
cameraControls.add(camera.position, 'y').min(-500).max(500).step(0.01).listen();
cameraControls.add(camera.position, 'z').min(-500).max(500).step(0.01).listen();

//pointLight Gui
pointLightControls1.add(pointLight1.position,'x').min(-500).max(500).step(0.01).listen();
pointLightControls1.add(pointLight1.position,'y').min(-500).max(500).step(0.01).listen();
pointLightControls1.add(pointLight1.position,'z').min(-500).max(500).step(0.01).listen();
pointLightControls1.add(pointLight1,'intensity').min(0).max(10).step(0.001).listen();