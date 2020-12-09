import * as THREE from 'three';

			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
      import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
      import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
      import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
      import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
      import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
      import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
      import { Reflector } from 'three/examples/jsm/objects/Reflector'
      // import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
      import {RectAreaLightUniformsLib} from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
      import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
      import { BackSide, DoubleSide } from 'three';

			var container, controls;
			var camera, scene, renderer,left_headlight,right_headlight,lightHelper,shadowCameraHelper,mesh_,glitchPass,renderPass,composer,theta,ftDisplacement,vector,headlight_flare_right,headlight_flare_left,sprite,ftNormal,ftSpecular,tttt,ftSimple,shadowMaterial;
      var shadow = false;


      let setting={
        camera:{
          initial:[400,300,300]
          // front,and other positions
        },
      }

			init();
      render();
      // animate();

			function init() {

				// container = document.createElement( 'div' );
        // document.body.appendChild( container );

        container = document.getElementById( 'canvas' );
        document.body.appendChild( container );
        
        // camera
        // container.offsetWidth,container.offsetHeight
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 6000);
        camera.position.set(400, 300, 300);

        // scene
        scene = new THREE.Scene();
        // scene.add( new THREE.AxesHelper(1000));
        
        //makes color brighter and stronger
        // var light = new THREE.AmbientLight( 0x0f0f0f );
        var light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );


        // add rect lights to both sides of the car
        addRectlights();



        // headlight flares

        var headlight_flare_material = new THREE.MeshBasicMaterial( { 
          color: 0x000000, 
          dithering: true ,
          side: THREE.FrontSide,
          map: new THREE.ImageUtils.loadTexture( 'dist/textures/123.png' ), 
          useScreenCoordinates: false,
          color: 0xffffff, 
          transparent: true, 
          blending: THREE.AdditiveBlending
        } );

        var headlight_flare_geometry = new THREE.PlaneBufferGeometry( 180, 150 );
        headlight_flare_right = new THREE.Mesh( headlight_flare_geometry, headlight_flare_material );
        // headlight_flare_right.scale.set(0.6,0.6);
        headlight_flare_right.renderOrder = 999;
        headlight_flare_right.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
        // headlight_flare_right.lookAt(camera.position)
        // scene.add( headlight_flare_right );
        headlight_flare_right.opacity = 0;
        headlight_flare_right.lookAt(camera.position);

        headlight_flare_left = new THREE.Mesh( headlight_flare_geometry, headlight_flare_material );
        // headlight_flare_left.scale.set(0.6,0.6);
        headlight_flare_left.renderOrder = 999;
        headlight_flare_left.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
        // headlight_flare_left.lookAt(camera.position)
        // scene.add( headlight_flare_left );
        headlight_flare_left.opacity = 0;
        headlight_flare_left.lookAt(camera.position);

        // end of headlight flares 



        // normal
        ftNormal = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_normal.jpg' );
        ftNormal.wrapS = ftNormal.wrapT = THREE.RepeatWrapping; 
        ftNormal.repeat.set( 1, 1);

        // map
        ftSimple = new THREE.ImageUtils.loadTexture( 'dist/env/ny.jpg' );
        ftSimple.wrapS = ftSimple.wrapT = THREE.RepeatWrapping; 
        ftSimple.repeat.set( 3, 2 );

        // specular
        ftSpecular = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_Roughness.jpg' );
        ftSpecular.wrapS = ftSpecular.wrapT = THREE.RepeatWrapping; 
        ftSpecular.repeat.set( 3, 3 );

        // displacement
        ftDisplacement = new THREE.ImageUtils.loadTexture('dist/textures/uiglegfg_2K_Displacement.jpg');
        ftDisplacement.wrapS = ftDisplacement.wrapT = THREE.RepeatWrapping;
        ftDisplacement.repeat.set(3,2);
        
        

        // ground
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff, dithering: true,map:ftSimple,visible:false} );
				var geometry = new THREE.PlaneBufferGeometry( 4000, 6000 );
        var mesh = new THREE.Mesh( geometry, material );
				mesh.position.set( 0, 0, 900 );
        mesh.rotation.x = - Math.PI * 0.5;
        // mesh.rotation.z = Math.PI/6;
				mesh.receiveShadow = true;



        // test target
        var material2 = new THREE.MeshPhongMaterial({opacity:0,visible:false});
				var geometry2= new THREE.PlaneBufferGeometry( 4000, 6000 );
        var mesh2 = new THREE.Mesh( geometry2, material2 );
				mesh2.position.set( 0, 0, 899 );
				mesh2.rotation.x = - Math.PI * 0.5;
				mesh2.receiveShadow = true;
        scene.add( mesh2 );

        // background plane

        
        //add env images
        // addEnv();
        // load hdri and car object
        // new EXRLoader()
        // new RGBELoader()
				// 	.setDataType( THREE.UnsignedByteType )
				// 	.setPath( 'dist/env/' )
        //   .load( 'night_city.hdr', function ( texture ) {
        //     var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
            // scene.background = envMap;
            // scene.background = pmremGenerator.renderTarget;
						// scene.environment = envMap;
						// texture.dispose();
						// pmremGenerator.dispose();
						// render();
            // var roughnessMipmapper = new RoughnessMipmapper( renderer );
            addBackgroundEnv();
            getCubeMapTexture().then(({ envMap }) => {
						var loader = new GLTFLoader().setPath( 'dist/' );
						loader.load( 'final.glb', function ( gltf ) {
							gltf.scene.traverse( function ( child ) {
                  if ( child.isMesh ) {
                    // console.log(child)
                    child.material.envMap  = envMap;
                    child.material.envMapIntensity =1;
                    child.material.needsUpdate = true;
                    child.castShadow = true; 
                    child.receiveShadow = true;
                    if(child.material.name == "rang_badane_mashin"){
                        child.material.needsUpdate=true;
                        child.material.envMap  = envMap;
                        child.material.envMapIntensity =3;
                        child.material.metalness=0.02;
                        child.material.reflectivity=0.05;
                        child.material.roughness=0.04;
                        child.material.side=2;  
                        child.renderOrder=1;
                        // console.log(child)
                    }

                    if(child.name == "Shishe_jelo"){
                        child.material.needsUpdate=true;
                        child.material.envMap  = envMap;
                        child.material.envMapIntensity =3;
                        child.material.metalness=0;
                        child.material.reflectivity=0.5;
                        child.material.roughness=0;
                        child.material.side=2;  
                        child.material.color=new THREE.Color("rgb(0,0, 0)");
                    }

                    if(child.name == "shise_cheragh_jelo" && child.material.name=="shishe_cheragh_jelo"){
                        // console.log(child)
                        child.material.needsUpdate=true;
                        child.material.opacity=1;  
                        child.material.metalness=0;
                        child.material.reflectivity=1;
                        child.material.roughness=0;
                        child.material.transmission=0.9;

                        // add glow left
                        child.add( headlight_flare_right );
                        headlight_flare_right.position.z =55;
                        headlight_flare_right.position.x =125;
                        headlight_flare_right.position.y =5;
                        headlight_flare_right.lookAt(camera.position)
                        child.add(headlight_flare_right)

                        // add glow right
                        child.add( headlight_flare_left );
                        headlight_flare_left.position.z =55;
                        headlight_flare_left.position.x =-125;
                        headlight_flare_left.position.y =5;
                        headlight_flare_left.lookAt(camera.position)
                        child.add(headlight_flare_left)

                        
                    }

                    if(child.name == "cheragh_rahnama_jelo"){
                      child.material.needsUpdate=true;
                      child.material.emissive=new THREE.Color("rgb(255,51, 0)");

                    }

                    if(child.name=="ring"){
                      child.material.needsUpdate=true;
                      child.material.color=new THREE.Color("rgb(75,75, 75)");
                      child.material.roughness = 0.3;
                      child.material.metalness = 0.6;
                      child.material.reflectivity = 0.4;
                    }
                  }
                }
              );
              // spotlight
              const color = 0xFFFFFF;
              const intensity = 1;
              const angle = Math.PI/4;
              const dist = 600;
              const penumbra = 0.5;
              //right headlight
              left_headlight = new THREE.SpotLight(color, intensity);
              left_headlight.distance = dist;
              left_headlight.angle = angle;
              left_headlight.penumbra = penumbra;
              left_headlight.position.set(-100, 180, 550);
              left_headlight.target = mesh;
              left_headlight.target.position.x = -100;
              gltf.scene.add(left_headlight);
              gltf.scene.add(left_headlight.target);

              //left headlight
              right_headlight = new THREE.SpotLight(color, intensity);
              right_headlight.distance = dist;
              right_headlight.angle = angle;
              right_headlight.penumbra = penumbra;
              right_headlight.position.set(100, 180, 550);
              right_headlight.target = mesh2;
              right_headlight.target.position.x = 100;
              // right_headlight.target.position.set(100, 0, -400);
              gltf.scene.add(right_headlight);
              gltf.scene.add(right_headlight.target);
              
              gltf.scene.position.set(0,0,0);
              scene.add( gltf.scene );

              addCarShadow()
              shadow=true;
							// roughnessMipmapper.dispose();
							render();
            },function(xhr) {
              // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            } );
          } 
        );

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth,window.innerHeight  );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        // renderer.shadowMap.enabled = true;
        container.appendChild( renderer.domElement );
        var pmremGenerator = new THREE.PMREMGenerator( renderer );
        pmremGenerator.compileEquirectangularShader();

        // orbit controller
        controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1000;
        controls.maxDistance = 1200;
        controls.maxPolarAngle = Math.PI/2 - THREE.Math.degToRad(10);
        controls.maxAzimuthAngle  = Math.PI/8;
        controls.minAzimuthAngle = -Math.PI/8
        controls.update();
        window.addEventListener( 'resize', onWindowResize, false );

        // scene.rotation.y = Math.PI;
      }

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight );
				render();
			}
 
      var euler,rotation,radians,degrees;
			function render() {
        renderer.render( scene, camera );
        headlight_flare_right.lookAt(camera.position);
        headlight_flare_left.lookAt(camera.position);
        // vector = camera.getWorldDirection();
        // theta = Math.atan2(vector.x,vector.z);
        // console.log(theta);
         euler = new THREE.Euler();
         rotation = euler.setFromQuaternion(camera.quaternion);
         radians = rotation.z > 0
            ? rotation.z
            : (2 * Math.PI) + rotation.z;
         degrees = THREE.Math.radToDeg(radians);
         if(shadow == true){
           shadowMaterial.visible = true;
         }

        //  console.log(controls.getAzimuthalAngle ())
      }

      function addRectlights(){
        let rectLight1,rectLight2,rectLight3,rectHelper1,rectHelper2,rectHelper3;
        	RectAreaLightUniformsLib.init();

          rectLight1 = new THREE.RectAreaLight(0xffffff, 10, 400, 100);
          rectLight1.position.set(-400, 100, 0);
          rectLight1.rotateY(THREE.Math.degToRad(-90));
          scene.add(rectLight1);

          rectLight2 = new THREE.RectAreaLight(0xffffff, 10, 400, 100);
          rectLight2.position.set(400, 100, 0);
          rectLight2.rotateY(THREE.Math.degToRad(90));
          scene.add(rectLight2);

          rectLight3 = new THREE.RectAreaLight(0xffffff, 5, 400, 100);
          rectLight3.position.set(0, 150, -600);
          rectLight3.rotateX(THREE.Math.degToRad(-180));
          scene.add(rectLight3);

          // rectHelper1 = new RectAreaLightHelper(rectLight1);
          // rectLight1.add(rectHelper1);
          // rectHelper2 = new RectAreaLightHelper(rectLight2);
          // rectLight2.add(rectHelper2);
          // rectHelper3 = new RectAreaLightHelper(rectLight3);
          // rectLight3.add(rectHelper3);
      }

      function addEnv(){
        var frontEnvMap = new THREE.ImageUtils.loadTexture( 'dist/env/nx.png' );
        frontEnvMap.wrapS = frontEnvMap.wrapT = THREE.RepeatWrapping; 
        frontEnvMap.repeat.set( 1, 1 );
        // var backEnvMap = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_Albedo.jpg' );
        // var rightEnvMap = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_Albedo.jpg' );
        // var leftEnvMap = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_Albedo.jpg' );

        var FrontEnvMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff,map:frontEnvMap,side:BackSide } );
				var FrontEnvGeometry = new THREE.PlaneBufferGeometry( 4000, 4000 );
        var FrontEnvMesh = new THREE.Mesh( FrontEnvGeometry, FrontEnvMaterial );
        FrontEnvMesh.position.set( 0, 1000, 3000 );
        
				// FrontEnvMesh.rotation.x = Math.PI *2;
        scene.add( FrontEnvMesh );
      }
      

      function addCarShadow(){
         // Texture
         const shadowTexture = new THREE.TextureLoader().load("dist/textures/shadow.jpg");

         // Plane
         const shadowPlane = new THREE.PlaneBufferGeometry(1200, 1200);
         shadowPlane.rotateX(-Math.PI / 2);
         
 
         // Material
         shadowMaterial = new THREE.MeshBasicMaterial({
             map: shadowTexture,
             blending: THREE.MultiplyBlending,
             transparent: true,
             opacity:0,
             visible: false
         });
 
         // Mesh
         const shadowMesh = new THREE.Mesh(shadowPlane, shadowMaterial);
         shadowMesh.position.y = 1;
         shadowMesh.position.z = 50;
         shadowMesh.rotation.y = Math.PI / 2;
         scene.add(shadowMesh);
      }


      function addBackgroundEnv() {
        var bg = new THREE.CubeTextureLoader()
            .setPath("dist/env/envSky/")
            .load([
                'px.jpg',
                'nx.jpg',
                'py.jpg',
                'ny.jpg',
                'pz.jpg',
                'nz.jpg'
            ]);
        scene.background = bg; // new THREE.Color(0x333333)
    }

    function getCubeMapTexture() {
      return new Promise((resolve) => {
          const envMap = new THREE.CubeTextureLoader()
              .setPath("dist/env/envReflection/")
              .load([
                  'px.jpg',
                  'nx.jpg',
                  'py.jpg',
                  'ny.jpg',
                  'pz.jpg',
                  'nz.jpg'
              ]);
          envMap.format = THREE.RGBFormat;
          resolve({ envMap, cubeMap: envMap })
      })
  }
      // function updateLight() {
      //   left_headlight.target.updateMatrixWorld();
      //   right_headlight.target.updateMatrixWorld();
      // }


      // function animate() {

      //   requestAnimationFrame( animate );
      
      //   // composer.render();
      //   renderer.render();
      
      // }
      