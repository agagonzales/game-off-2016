//COLORS
var Colors = {
    grey: 0xA9A9A9,
    white: 0xFFFFFF,
    skin: 0xFFD5A9,
    hair: 0xFFD300
};

// THREEJS RELATED VARIABLES

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
    mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );

  camera.position.x = -30;
  camera.position.z = 130;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  container = document.getElementById('game');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);
}

// HANDLE SCREEN EVENTS

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

  ambientLight = new THREE.AmbientLight(0xdc8874, .5);

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);
}


var Player = function() {
	this.mesh = new THREE.Object3D();
  this.mesh.name = "hacker";

  // legs
	var geomLeg = new THREE.CubeGeometry(10, 10, 10);
  var matLeg = new THREE.MeshPhongMaterial({color:Colors.grey, shading:THREE.FlatShading});
  var leg1 = new THREE.Mesh(geomLeg, matLeg);
	leg1.castShadow = true;
  leg1.receiveShadow = true;
  this.mesh.add(leg1);
  leg1.position.x += 5;

	var geomLegUp = new THREE.CubeGeometry(10, 10, 20);
  var leg1a = new THREE.Mesh(geomLegUp, matLeg);
	leg1a.castShadow = true;
  leg1a.receiveShadow = true;
  this.mesh.add(leg1a);
  leg1a.position.x += 5;
  leg1a.position.y += 10;
  leg1a.position.z += 5;

  var leg2 = new THREE.Mesh(geomLeg, matLeg);
  leg2.castShadow = true;
  leg2.receiveShadow = true;
  leg2.position.x -= 15;
  this.mesh.add(leg2);

  var leg2a = new THREE.Mesh(geomLegUp, matLeg);
  leg2a.castShadow = true;
  leg2a.receiveShadow = true;
  this.mesh.add(leg2a);
  leg2a.position.y += 10;
  leg2a.position.z += 5;
  leg2a.position.x -= 15;

  // belly
  var geomBelly = new THREE.CubeGeometry(30, 30, 30);
  var belly = new THREE.Mesh(geomBelly, matLeg);
  belly.castShadow = true;
  belly.receiveShadow = true;
  this.mesh.add(belly);
  belly.position.y += 30;
  belly.position.x -= 5;
  belly.position.z += 10;
  // belly.position.x -= 20;
};


// 3D Models
var airplane;

function createPlane() {
  airplane = new Player();
  airplane.mesh.scale.set(.5,.5,.5);
  airplane.mesh.position.y = 50;
  airplane.mesh.rotation.y -= 0.9;
  scene.add(airplane.mesh);
}

function loop(){
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function init(event){
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createLights();
  createPlane();
  loop();
}

// HANDLE MOUSE EVENTS

var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
  var tx = -1 + (event.clientX / WIDTH)*2;
  var ty = 1 - (event.clientY / HEIGHT)*2;
  mousePos = {x:tx, y:ty};
}

window.addEventListener('load', init, false);