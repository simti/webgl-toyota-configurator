"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var THREE = _interopRequireWildcard(require("three"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls.js");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader.js");

var _RectAreaLightUniformsLib = require("three/examples/jsm/lights/RectAreaLightUniformsLib.js");

var _RectAreaLightHelper = require("three/examples/jsm/helpers/RectAreaLightHelper.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('./TweenMax.min.js');

var container, controls;
var camera, scene, renderer, left_headlight, right_headlight, ftDisplacement, headlight_flare_right, headlight_flare_left, ftNormal, ftSpecular, ftSimple, shadowMaterial, groundMaterial;
var shadow = false;
var car_object = [];
var shadowTexture = new THREE.TextureLoader().load("dist/textures/shadow.png");
var groundTexture = new THREE.TextureLoader().load("dist/textures/test.png");
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(2, 2);
var setting = {
  color: {
    "black": new THREE.MeshBasicMaterial({
      color: 0x000000
    }),
    "blue": new THREE.MeshBasicMaterial({
      color: 0x001969
    }),
    "red": new THREE.MeshBasicMaterial({
      color: 0xc40000
    })
  },
  camera: {
    first_look: {
      x: 400,
      y: 300,
      z: 300
    },
    rear_light: {
      x: -984,
      y: 174,
      z: 35,
      duration: 3
    },
    head_light: {
      x: 400,
      y: 20,
      z: 350,
      duration: 3
    },
    sunroof: {
      x: 0,
      y: 300,
      z: 0,
      duration: 3
    },
    wheel_rings: {
      x: -384,
      y: 0,
      z: 300,
      duration: 3
    },
    free_view: {
      x: 400,
      y: 300,
      z: 300,
      duration: 2
    }
  }
};
init();
render();

function init() {
  var _ref;

  container = document.getElementById('canvas');
  document.body.appendChild(container); // camera

  var camera_init = setting.camera.first_look;
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 6000);
  camera.position.set(camera_init.x, camera_init.y, camera_init.z); // scene

  scene = new THREE.Scene(); //ambient light

  var light = new THREE.AmbientLight(0x222222);
  scene.add(light); // add rect lights 

  addRectlights();
  addGroundTexture(); // hemisphere light

  var hemisphere_light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.7);
  scene.add(hemisphere_light); // headlight flares

  var headlight_flare_material = new THREE.MeshBasicMaterial((_ref = {
    color: 0x000000,
    dithering: true,
    side: THREE.FrontSide,
    map: new THREE.ImageUtils.loadTexture('dist/textures/123.png'),
    useScreenCoordinates: false
  }, _defineProperty(_ref, "color", 0xffffff), _defineProperty(_ref, "transparent", true), _defineProperty(_ref, "blending", THREE.AdditiveBlending), _ref));
  var headlight_flare_geometry = new THREE.PlaneBufferGeometry(180, 150);
  headlight_flare_right = new THREE.Mesh(headlight_flare_geometry, headlight_flare_material); // headlight_flare_right.scale.set(0.6,0.6);

  headlight_flare_right.renderOrder = 999;

  headlight_flare_right.onBeforeRender = function (renderer) {
    renderer.clearDepth();
  }; // headlight_flare_right.lookAt(camera.position)
  // scene.add( headlight_flare_right );


  headlight_flare_right.opacity = 0;
  headlight_flare_right.visible = false;
  headlight_flare_right.lookAt(camera.position);
  headlight_flare_left = new THREE.Mesh(headlight_flare_geometry, headlight_flare_material); // headlight_flare_left.scale.set(0.6,0.6);

  headlight_flare_left.renderOrder = 999;

  headlight_flare_left.onBeforeRender = function (renderer) {
    renderer.clearDepth();
  }; // headlight_flare_left.lookAt(camera.position)
  // scene.add( headlight_flare_left );


  headlight_flare_left.opacity = 0;
  headlight_flare_left.visible = false;
  headlight_flare_left.lookAt(camera.position); // end of headlight flares 
  // main ground map textures
  // 1)normal
  // ftNormal = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_normal.jpg' );
  // ftNormal.wrapS = ftNormal.wrapT = THREE.RepeatWrapping; 
  // ftNormal.repeat.set( 1, 1);
  // 2)main map
  // ftSimple = new THREE.ImageUtils.loadTexture( 'dist/textures/test.png' );
  // ftSimple.wrapS = ftSimple.wrapT = THREE.RepeatWrapping; 
  // ftSimple.repeat.set( 3, 2 );
  // 3)specular
  // ftSpecular = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_Roughness.jpg' );
  // ftSpecular.wrapS = ftSpecular.wrapT = THREE.RepeatWrapping; 
  // ftSpecular.repeat.set( 3, 3 );
  // 4)displacement
  // ftDisplacement = new THREE.ImageUtils.loadTexture('dist/textures/uiglegfg_2K_Displacement.jpg');
  // ftDisplacement.wrapS = ftDisplacement.wrapT = THREE.RepeatWrapping;
  // ftDisplacement.repeat.set(3,2);
  // main ground
  // let material = new THREE.MeshBasicMaterial( { color: 0xffffff, dithering: true,map:ftSimple,visible:true} );
  // let geometry = new THREE.PlaneBufferGeometry( 1200, 1200 );
  // let mesh = new THREE.Mesh( geometry, material );
  // mesh.position.set( 0, 1, 900 );
  // mesh.rotation.x = - Math.PI * 0.5;
  // mesh.receiveShadow = true;
  // plane under main ground for showing reflection of headlight on ground in night mode
  // let material2 = new THREE.MeshPhongMaterial({opacity:0,visible:false});
  // let geometry2= new THREE.PlaneBufferGeometry( 4000, 6000 );
  // let mesh2 = new THREE.Mesh( geometry2, material2 );
  // mesh2.position.set( 0, 0, 899 );
  // mesh2.rotation.x = - Math.PI * 0.5;
  // mesh2.receiveShadow = true;
  // scene.add( mesh2 );

  addBackgroundEnv();
  getCubeMapTexture().then(function (_ref2) {
    var envMap = _ref2.envMap;
    //load car and set its settings while traversing car object 
    var loader = new _GLTFLoader.GLTFLoader().setPath('dist/');
    loader.load('final.glb', function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          car_object.push(child); // console.log(child)

          child.material.envMap = envMap;
          child.material.envMapIntensity = 1;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;

          if (child.material.name == "lastic") {
            child.material.needsUpdate = true;
            child.material.envMap = null;
          }

          if (child.material.name == "rang_badane_mashin") {
            child.material.needsUpdate = true;
            child.material.envMap = envMap;
            child.material.envMapIntensity = 1;
            child.material.metalness = 0.02;
            child.material.reflectivity = 0.05;
            child.material.roughness = 0.04;
            child.material.side = 2;
            child.renderOrder = 1; // console.log(child)
          }

          if (child.name == "Shishe_jelo") {
            child.material.needsUpdate = true;
            child.material.envMap = envMap;
            child.material.envMapIntensity = 1;
            child.material.metalness = 0;
            child.material.reflectivity = 0.5;
            child.material.roughness = 0;
            child.material.side = 2;
            child.material.color = new THREE.Color("rgb(0,0, 0)");
          }

          if (child.name == "shise_cheragh_jelo" && child.material.name == "shishe_cheragh_jelo") {
            console.log(child);
            child.material.needsUpdate = true;
            child.material.opacity = 1;
            child.material.metalness = 0;
            child.material.reflectivity = 1;
            child.material.roughness = 0;
            child.material.transmission = 0.9; // add glow left

            child.add(headlight_flare_right);
            headlight_flare_right.position.z = 55;
            headlight_flare_right.position.x = 125;
            headlight_flare_right.position.y = 5;
            headlight_flare_right.lookAt(camera.position);
            child.add(headlight_flare_right); // add glow right

            child.add(headlight_flare_left);
            headlight_flare_left.position.z = 55;
            headlight_flare_left.position.x = -125;
            headlight_flare_left.position.y = 5;
            headlight_flare_left.lookAt(camera.position);
            child.add(headlight_flare_left);
          }

          if (child.name == "cheragh_rahnama_jelo") {
            child.material.needsUpdate = true;
            child.material.emissive = new THREE.Color("rgb(255,51, 0)");
          }

          if (child.name == "ring") {
            child.material.needsUpdate = true;
            child.material.color = new THREE.Color("rgb(75,75, 75)");
            child.material.roughness = 0.3;
            child.material.metalness = 0.6;
            child.material.reflectivity = 0.4;
          }
        }
      }); // spotlight

      var color = 0xFFFFFF;
      var intensity = 1;
      var angle = Math.PI / 4;
      var dist = 600;
      var penumbra = 0.5; //right headlight
      // left_headlight = new THREE.SpotLight(color, intensity);
      // left_headlight.distance = dist;
      // left_headlight.angle = angle;
      // left_headlight.penumbra = penumbra;
      // left_headlight.position.set(-100, 180, 550);
      // left_headlight.target = mesh;
      // left_headlight.target.position.x = -100;
      // gltf.scene.add(left_headlight);
      // gltf.scene.add(left_headlight.target);
      //left headlight
      // right_headlight = new THREE.SpotLight(color, intensity);
      // right_headlight.distance = dist;
      // right_headlight.angle = angle;
      // right_headlight.penumbra = penumbra;
      // right_headlight.position.set(100, 180, 550);
      // right_headlight.target = mesh2;
      // right_headlight.target.position.x = 100;
      // right_headlight.target.position.set(100, 0, -400);
      // gltf.scene.add(right_headlight);
      // gltf.scene.add(right_headlight.target);

      gltf.scene.position.set(0, 0, 0);
      scene.add(gltf.scene);
      addCarShadow();
      shadow = true; // roughnessMipmapper.dispose();

      render();
    }, function (xhr) {// console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
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

  container.appendChild(renderer.domElement); // let pmremGenerator = new THREE.PMREMGenerator( renderer );
  // pmremGenerator.compileEquirectangularShader();
  // orbit controller

  controls = new _OrbitControls.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled

  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 1000;
  controls.maxDistance = 3000;
  controls.maxPolarAngle = Math.PI / 2 - THREE.Math.degToRad(10); // controls.maxAzimuthAngle  = Math.PI/8;
  // controls.minAzimuthAngle = -Math.PI/8

  controls.update();
  window.addEventListener('resize', onWindowResize, false);
  scene.rotation.y = Math.PI / 2; // Grid(scene)

  add_eventListener();
} // update scene after windows resized


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

var euler, rotation, radians; // updated scene

function render() {
  // headlight_flare_right.lookAt(camera.position);
  // headlight_flare_left.lookAt(camera.position);
  // euler = new THREE.Euler();
  // rotation = euler.setFromQuaternion(camera.quaternion);
  // radians = rotation.z > 0
  //   ? rotation.z
  //   : (2 * Math.PI) + rotation.z;
  //  if(shadow == true){
  //    shadowMaterial.visible = true;
  //  }
  renderer.render(scene, camera); //  console.log(camera.position)
} // function animate () {
// requestAnimationFrame( animate );
// groundTexture.offset.x -= 0.003;
// if(car_object.length>0){
//   const LF = car_object.filter((object) => object.name === "lastic")[0];
//   const RF = car_object.filter((object) => object.name === "lastic")[1];
//   const LB = car_object.filter((object) => object.name === "lastic1")[0];
//   const RB = car_object.filter((object) => object.name === "lastic1")[1];
//   LF.parent.rotation.x+=0.05;
//   RF.parent.rotation.x+=0.05;
//   LB.parent.rotation.x+=0.05;
//   RB.parent.rotation.x+=0.05;
// car_object.filter((object) => object.name === "Lastic")[0].parent.rotation.x-=0.003;
// car_object.filter((object) => object.name === "Lastic")[1].parent.rotation.x-=0.003;
// car_object.filter((object) => object.name === "Lastic1")[2].parent.rotation.x-=0.003;
// car_object.filter((object) => object.name === "Lastic1")[3].parent.rotation.x-=0.003;
// }
// render()
// };
// add rect lights around the car


function addRectlights() {
  var rectLight1, rectLight2, rectLight3, rectLight4, rectHelper1, rectHelper2, rectHelper3, rectHelper4;

  _RectAreaLightUniformsLib.RectAreaLightUniformsLib.init(); //right back


  rectLight1 = new THREE.RectAreaLight(0xffffff, 15, 800, 300);
  rectLight1.position.set(-1200, 100, -800);
  rectLight1.rotateY(THREE.Math.degToRad(-90));
  scene.add(rectLight1); //right front

  rectLight2 = new THREE.RectAreaLight(0xffffff, 15, 800, 300);
  rectLight2.position.set(-1200, 100, 800);
  rectLight2.rotateY(THREE.Math.degToRad(-90));
  scene.add(rectLight2); //left back

  rectLight3 = new THREE.RectAreaLight(0xffffff, 15, 800, 300);
  rectLight3.position.set(1200, 100, -800);
  rectLight3.rotateY(THREE.Math.degToRad(90));
  scene.add(rectLight3); //left front

  rectLight4 = new THREE.RectAreaLight(0xffffff, 15, 800, 300);
  rectLight4.position.set(1200, 100, 800);
  rectLight4.rotateY(THREE.Math.degToRad(90));
  scene.add(rectLight4); // rectHelper1 = new RectAreaLightHelper(rectLight1);
  // rectLight1.add(rectHelper1);
  // rectHelper2 = new RectAreaLightHelper(rectLight2);
  // rectLight2.add(rectHelper2);
  // rectHelper3 = new RectAreaLightHelper(rectLight3);
  // rectLight3.add(rectHelper3);
  // rectHelper4 = new RectAreaLightHelper(rectLight4);
  // rectLight4.add(rectHelper4);
} // add shadow plane under the car object


function addCarShadow() {
  // Texture
  // Plane
  var shadowPlane = new THREE.PlaneBufferGeometry(1200, 1200);
  shadowPlane.rotateX(-Math.PI / 2); // Material

  shadowMaterial = new THREE.MeshLambertMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.8
  }); // Mesh

  var shadowMesh = new THREE.Mesh(shadowPlane, shadowMaterial);
  shadowMesh.position.y = 2;
  shadowMesh.position.z = 50;
  shadowMesh.rotation.y = Math.PI / 2;
  shadowMesh.receiveShadow = true;
  console.log(shadowMesh);
  scene.add(shadowMesh); //  console.log(shadowMesh)
}

function addGroundTexture() {
  // Texture
  // Plane
  var groundPlane = new THREE.PlaneBufferGeometry(5000, 5000, 1, 1);
  groundPlane.rotateX(-Math.PI / 2); // Material

  groundMaterial = new THREE.MeshLambertMaterial({
    map: groundTexture,
    transparent: true,
    opacity: 0.5
  }); // Mesh

  var groundMesh = new THREE.Mesh(groundPlane, groundMaterial);
  groundMesh.position.y = 1;
  groundMesh.position.z = 50;
  groundMesh.rotation.y = Math.PI / 2;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh); //  console.log(groundMesh)
} // set scene background


function addBackgroundEnv() {
  var bg = new THREE.CubeTextureLoader().setPath("dist/env/envSky/").load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  scene.background = bg; // new THREE.Color(0x333333)
} // create cube map texture to be reflected on car body


function getCubeMapTexture() {
  return new Promise(function (resolve) {
    var envMap = new THREE.CubeTextureLoader().setPath("dist/env/envReflection/").load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    envMap.format = THREE.RGBFormat;
    resolve({
      envMap: envMap,
      cubeMap: envMap
    });
  });
} // add listener to elements


function add_eventListener() {
  // console.log("listeners added")
  document.querySelector("button").addEventListener("click", function () {
    return close_all();
  }, false);
  document.querySelector("#part_panel").addEventListener("click", function () {
    return open_sidebar('part');
  }, false);
  document.querySelector("#color_panel").addEventListener("click", function () {
    return open_sidebar('color');
  }, false);
  document.querySelectorAll(".color_button").forEach(function (el) {
    el.addEventListener("click", change_car_paint, false);
  });
  document.querySelector("#rear_light").addEventListener("click", function () {
    return change_view('rear_light');
  }, false);
  document.querySelector("#head_light").addEventListener("click", function () {
    return change_view('front_light');
  }, false);
  document.querySelector("#sunroof").addEventListener("click", function () {
    return change_view('sunroof');
  }, false);
  document.querySelector("#wheel_rings").addEventListener("click", function () {
    return change_view('wheel_rings');
  }, false);
  document.querySelector("#free_view").addEventListener("click", function () {
    return change_view('free_view');
  }, false);
} // open sidebar


var active_sidebar = "";

function open_sidebar(title) {
  active_sidebar = title;

  if (title == "part") {
    close_sidebar("color");
    document.querySelector(".gui__sidebar--part").style.transform = "translate3d(0px, 0px, 0px)";
  } else {
    close_sidebar("part");
    document.querySelector(".gui__sidebar--color").style.transform = "translate3d(0px, 0px, 0px)";
  }

  document.querySelector("#canvas").classList.add("sidebar_opened");
  document.querySelector(".gui__footer").classList.add("sidebar_opened");
} // close active sidebar when another is opening


function close_sidebar(title) {
  if (title == "part") {
    document.querySelector(".gui__sidebar--part").style.transform = "translate3d(100%, 0px, 0px)";
  } else {
    document.querySelector(".gui__sidebar--color").style.transform = "translate3d(100%, 0px, 0px)";
  }
} // only close current active sidebar


function close_all() {
  document.querySelector(".gui__sidebar--".concat(active_sidebar)).style.transform = "translate3d(100%, 0px, 0px)";
  document.querySelector("#canvas").classList.remove("sidebar_opened");
  document.querySelector(".gui__footer").classList.remove("sidebar_opened");
} //change car paint color


function change_car_paint() {
  document.querySelector('circle.active').classList.remove("active");
  document.querySelector("circle.circ_".concat(this.dataset.color_name)).classList.add('active');
  var body = car_object.filter(function (part) {
    return part.name == "badane_mashin";
  })[0];
  colorTo(body, setting.color[this.dataset.color_name]);
} // change material color with a transition


function colorTo(meshBody, newColor) {
  var target = meshBody;
  var initial = new THREE.Color(target.material.color.getHex());
  var value = new THREE.Color(newColor.color.getHex());
  TweenLite.to(initial, 0.5, {
    r: value.r,
    g: value.g,
    b: value.b,
    onStart: function onStart() {
      target.material.color = initial;
      render();
    },
    onComplete: function onComplete() {
      target.material.color = value;
      render();
    },
    onUpdate: function onUpdate() {
      render();
    }
  });
} // update camera position


function change_view(view_name) {
  switch (view_name) {
    case 'rear_light':
      updateCameraPositon(setting.camera.rear_light);
      break;

    case 'front_light':
      updateCameraPositon(setting.camera.head_light);
      break;

    case 'sunroof':
      updateCameraPositon(setting.camera.sunroof);
      break;

    case 'wheel_rings':
      updateCameraPositon(setting.camera.wheel_rings);
      break;

    case 'free_view':
      updateCameraPositon(setting.camera.free_view);
      break;

    default: // console.log("free view")

  }
}

function updateCameraPositon(position, _options) {
  var gsap = require("gsap").gsap;

  var x = position.x;
  var y = position.y;
  var z = position.z;
  var duration = position.duration;
  gsap.to(camera.position, _objectSpread({
    x: x,
    y: y,
    z: z,
    duration: duration,
    ease: "circ.out",
    // ease: CustomEase.create("custom", "M0,0 C0.33,0 0.427,0.338 0.5,0.5 0.572,0.66 0.698,1 1,1 "),
    onUpdate: function onUpdate() {
      controls.update();
      render();
    },
    onComplete: function onComplete() {
      camera.updateProjectionMatrix();

      if (!controls.enabled) {
        controls.enabled = true;
        controls.update();
      }

      render();
    }
  }, _options));
}