"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var THREE = _interopRequireWildcard(require("three"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls.js");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader.js");

var _RGBELoader = require("three/examples/jsm/loaders/RGBELoader.js");

var _RoughnessMipmapper = require("three/examples/jsm/utils/RoughnessMipmapper.js");

var _EffectComposer = require("three/examples/jsm/postprocessing/EffectComposer.js");

var _RenderPass = require("three/examples/jsm/postprocessing/RenderPass.js");

var _GlitchPass = require("three/examples/jsm/postprocessing/GlitchPass.js");

var _Reflector = require("three/examples/jsm/objects/Reflector");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var container, controls;
var camera, scene, renderer, headlight1, headlight2, lightHelper, shadowCameraHelper, mesh_, glitchPass, renderPass, composer, theta, vector, meshs, sprite, floorTexture, tttt;
init();
render(); // animate();

function init() {
  var _ref;

  // container = document.createElement( 'div' );
  // document.body.appendChild( container );
  container = document.getElementById('canvas');
  document.body.appendChild(container); // camera
  // container.offsetWidth,container.offsetHeight

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
  camera.position.set(400, 200, 300); // scene

  scene = new THREE.Scene(); // scene.add( new THREE.AxesHelper(1000));
  //makes color brighter and stronger

  var light = new THREE.AmbientLight(0x222222);
  scene.add(light); // car shadow
  // Texture

  var shadowTexture = new THREE.TextureLoader().load("dist/textures/shadow.jpg"); // Plane

  var shadowPlane = new THREE.PlaneBufferGeometry(1200, 1200);
  shadowPlane.rotateX(-Math.PI / 2); // Material

  var shadowMaterial = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    blending: THREE.MultiplyBlending,
    transparent: true,
    opacity: 0
  }); // Mesh
  // const shadowMesh = new THREE.Mesh(shadowPlane, shadowMaterial);
  // shadowMesh.position.y = - 170;
  // shadowMesh.position.z = 50;
  // shadowMesh.rotation.y = Math.PI / 2;
  // scene.add(shadowMesh)
  // ground

  var ma = new THREE.MeshBasicMaterial((_ref = {
    color: 0x000000,
    dithering: true,
    side: THREE.FrontSide,
    map: new THREE.ImageUtils.loadTexture('dist/textures/lens.png'),
    useScreenCoordinates: false
  }, _defineProperty(_ref, "color", 0xffffff), _defineProperty(_ref, "transparent", true), _defineProperty(_ref, "blending", THREE.AdditiveBlending), _ref));
  var ge = new THREE.PlaneBufferGeometry(200, 200);
  meshs = new THREE.Mesh(ge, ma);
  meshs.scale.set(0.6, 0.6);
  meshs.renderOrder = 999;

  meshs.onBeforeRender = function (renderer) {
    renderer.clearDepth();
  }; // meshs.position.y = 300;


  meshs.lookAt(camera.position); // scene.add( meshs );

  meshs.opacity = 0; // meshs.lookAt(camera.position);

  floorTexture = new THREE.ImageUtils.loadTexture('dist/textures/asphalt.jpg');
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(9, 9); // ground

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    dithering: true,
    map: floorTexture
  });
  var geometry = new THREE.PlaneBufferGeometry(8000, 8000);
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, -180, 900);
  mesh.rotation.x = -Math.PI * 0.5;
  mesh.receiveShadow = true; // scene.add( mesh );
  // tttt = new THREE.PlaneBufferGeometry( 8000, 8000 );
  // const groundMirror = new Reflector( tttt, {
  // 	clipBias: 0.003,
  // 	textureWidth: window.innerWidth * window.devicePixelRatio,
  // 	textureHeight: window.innerHeight * window.devicePixelRatio,
  //   color: 0x777777,
  //   opacity:0,
  //   transparent:true
  // } );
  // groundMirror.position.set( 0, -110, 900 );
  // groundMirror.rotateX( - Math.PI / 2 );
  // scene.add( groundMirror );
  // test target

  var material2 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    dithering: true,
    map: floorTexture
  });
  var geometry2 = new THREE.PlaneBufferGeometry(8000, 8000);
  var mesh2 = new THREE.Mesh(geometry2, material2);
  mesh2.position.set(0, -180, 900);
  mesh2.rotation.x = -Math.PI * 0.5;
  mesh2.receiveShadow = true; // scene.add( mesh2 );
  // load hdri and car object

  new _RGBELoader.RGBELoader().setDataType(THREE.UnsignedByteType).setPath('dist/env/').load('studio.hdr', function (texture) {
    var envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.background = envMap;
    scene.environment = envMap;
    texture.dispose();
    pmremGenerator.dispose();
    render();
    var roughnessMipmapper = new _RoughnessMipmapper.RoughnessMipmapper(renderer);
    var loader = new _GLTFLoader.GLTFLoader().setPath('dist/');
    loader.load('corolla_v_0017.glb', function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.name == "Body") {
            child.material.needsUpdate = true;
            child.material.envMap = null;
            child.material.metalness = 0.4061918556690216;
            child.material.reflectivity = 0.5;
            child.material.roughness = 0.0278855562210083;
            child.material.side = 2;
          }

          if (child.name == "Shishe_jelo") {// child.material.needsUpdate=true;
            // child.material.envMap=null;
            // child.material.metalness=0;
            // child.material.reflectivity=0.5;
            // child.material.roughness=0;
            // child.material.side=2;  
            // child.material.color=new THREE.Color("rgb(0,0, 0)");
          }

          if (child.name == "shise_jelo" && child.material.name == "shishe_cheragh_jelo.1") {
            // console.log(child.material.name)
            child.material.needsUpdate = true;
            child.material.opacity = 1;
            child.material.metalness = 0;
            child.material.reflectivity = 1;
            child.material.roughness = 0;
            child.material.transmission = 0.9; // ------------------------
            // ------------------------
            // add glow
            // child.add( meshs );

            meshs.position.z = 30;
            meshs.position.x = 20;
            meshs.lookAt(camera.position);
            child.add(meshs); // console.log(child)
          }

          if (child.name == "rahnama_borzorg") {
            child.material.needsUpdate = true;
            child.material.emissive = new THREE.Color("rgb(255,51, 0)");
          }
        }
      }); // spotlight

      var color = 0xFFFFFF;
      var intensity = 1;
      var angle = Math.PI / 4;
      var dist = 600;
      var penumbra = 0.5; //right headlight

      headlight1 = new THREE.SpotLight(color, intensity);
      headlight1.distance = dist;
      headlight1.angle = angle;
      headlight1.penumbra = penumbra;
      headlight1.position.set(-100, 0, 550);
      headlight1.target = mesh;
      headlight1.target.position.x = -100;
      gltf.scene.add(headlight1);
      gltf.scene.add(headlight1.target); //left headlight

      headlight2 = new THREE.SpotLight(color, intensity);
      headlight2.distance = dist;
      headlight2.angle = angle;
      headlight2.penumbra = penumbra;
      headlight2.position.set(100, 0, 550);
      headlight2.target = mesh2;
      headlight2.target.position.x = 100; // headlight2.target.position.set(0, 0, 400);

      gltf.scene.add(headlight2);
      gltf.scene.add(headlight2.target);
      gltf.scene.position.set(0, 0, 0); // const helper1 = new THREE.SpotLightHelper(headlight1);
      // const helper2 = new THREE.SpotLightHelper(headlight2);
      // gltf.scene.add(helper1);
      // gltf.scene.add(helper2);

      scene.add(gltf.scene);
      roughnessMipmapper.dispose();
      render();
    }, function (xhr) {
      console.log(xhr.loaded / xhr.total * 100 + '% loaded');
    });
  }); // renderer

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputEncoding = THREE.sRGBEncoding; // renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);
  var pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader(); //post processing
  // composer = new EffectComposer( renderer );
  // renderPass = new RenderPass( scene, camera );
  // composer.addPass( renderPass );
  // glitchPass = new GlitchPass();
  // composer.addPass( glitchPass );
  // orbit controller

  controls = new _OrbitControls.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled

  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1000;
  controls.maxDistance = 1500;
  controls.maxPolarAngle = Math.PI / 2; // controls.minDistance = 2;
  // controls.maxDistance = 10;
  // controls.target.set( 0, 0, - 0.2 );

  controls.update();
  window.addEventListener('resize', onWindowResize, false);
} // gui
// const gui = new GUI({
//   height : 5 * 32 - 1
// });
// var params = {
//   intensity: 1
// };
// gui.add(params, 'intensity', 0, 40).onChange(updateLight);


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
} //


function render() {
  renderer.render(scene, camera);
  meshs.lookAt(camera.position);
  vector = camera.getWorldDirection();
  theta = Math.atan2(vector.x, vector.z); // console.log(Math.floor(THREE.Math.radToDeg(theta)))
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  var folder = gui.addFolder(name);
  folder.add(vector3, 'x', -100, 100).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 100).onChange(onChangeFn);
  folder.add(vector3, 'z', -100, 100).onChange(onChangeFn);
  folder.open();
}

function updateLight() {
  headlight1.target.updateMatrixWorld();
  headlight2.target.updateMatrixWorld(); // helper.update();
} // function animate() {
//   requestAnimationFrame( animate );
//   // composer.render();
//   renderer.render();
// }