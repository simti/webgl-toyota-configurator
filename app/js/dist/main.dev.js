"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var THREE = _interopRequireWildcard(require("three"));

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader.js");

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var _RectAreaLightUniformsLib = require("three/examples/jsm/lights/RectAreaLightUniformsLib.js");

var _RectAreaLightHelper = require("three/examples/jsm/helpers/RectAreaLightHelper.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

//libraries
var camera, controls, scene, renderer, rectLight1, rectLight2, rectLight3;
var simti = [];
init(); //render(); // remove when using next line for animation loop (requestAnimationFrame)

animate();

function init() {
  scene = new THREE.Scene(); // scene.background = new THREE.Color(0xcccccc);
  // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
  // scene.add(new THREE.GridHelper(10, 10));

  var bg_loader = new THREE.CubeTextureLoader();
  var texture = bg_loader.load(['dist/env/px.jpg', 'dist/env/nx.jpg', 'dist/env/py.jpg', 'dist/env/ny.jpg', 'dist/env/pz.jpg', 'dist/env/nz.jpg']);
  scene.background = texture;
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(400, 200, 0); // controls

  controls = new _OrbitControls.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled

  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 1000;
  controls.maxPolarAngle = Math.PI * 4; //add car 

  var car;
  var loader = new _GLTFLoader.GLTFLoader();
  loader.load( // resource URL
  'dist/new.gltf', // called when the resource is loaded
  function (gltf) {
    console.log(gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0]);
    gltf.scene.traverse(function (object) {
      if (object.isMesh) {
        if (object.name == "gum001_carpaint_0") {
          object.material.metalness = 0.2061918556690216;
          object.material.roughness = 0.2278855562210083;
        }

        simti.push(object);
      }
    });
    console.log(simti);
    scene.add(gltf.scene);
    gltf.animations; // Array<THREE.AnimationClip>

    gltf.scene; // THREE.Group

    gltf.scenes; // Array<THREE.Group>

    gltf.cameras; // Array<THREE.Camera>

    gltf.asset; // Object
  }, // called while loading is progressing
  function (xhr) {
    console.log(xhr.loaded / xhr.total * 100 + '% loaded');
  }, // called when loading has errors
  function (error) {
    console.log('An error happened');
  }); // lights
  // var light = new THREE.DirectionalLight( 0xffffff );
  // light.position.set( 1, 1, 1 );
  // scene.add( light );
  // RectAreaLightUniformsLib.init();

  rectLight1 = new THREE.RectAreaLight(0xffffff, 5, 300, 300);
  rectLight1.position.set(0, 900, 0);
  rectLight1.rotateX(THREE.Math.degToRad(-90));
  scene.add(rectLight1);
  rectLight2 = new THREE.RectAreaLight(0xffffff, 5, 100, 300);
  rectLight2.position.set(0, 300, 300);
  rectLight2.rotateX(THREE.Math.degToRad(-45));
  scene.add(rectLight2);
  rectLight3 = new THREE.RectAreaLight(0xffffff, 5, 100, 300);
  rectLight3.position.set(0, 300, -300);
  rectLight3.rotateX(THREE.Math.degToRad(-135));
  scene.add(rectLight3);
  var helper1 = new _RectAreaLightHelper.RectAreaLightHelper(rectLight1);
  rectLight1.add(helper1);
  var helper2 = new _RectAreaLightHelper.RectAreaLightHelper(rectLight2);
  rectLight2.add(helper2);
  var helper3 = new _RectAreaLightHelper.RectAreaLightHelper(rectLight3);
  rectLight3.add(helper3); // var light = new THREE.DirectionalLight( 0x002288 );
  // light.position.set( - 1, - 1, - 1 );
  // scene.add( light );
  // var light = new THREE.AmbientLight( 0x222222 );
  // scene.add( light );
  //

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate); // var t = ( Date.now() / 2000 );
  // 	// move light in circle around center
  // 	// change light height with sine curve
  // 	var r = 15.0;
  // 	var lx = r * Math.cos( t );
  // 	var lz = r * Math.sin( t );
  // 	var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
  // 	rectLight.position.set( lx, ly, lz );
  // 	rectLight.lookAt( origin );

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  renderer.render(scene, camera);
}