import * as THREE from 'three';

			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
			import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
      import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
      import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
      import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
      import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
      // import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

			var container, controls;
			var camera, scene, renderer,headlight1,headlight2,lightHelper,shadowCameraHelper,mesh_,glitchPass,renderPass,composer;

			init();
      // render();
      animate();

			function init() {

				// container = document.createElement( 'div' );
        // document.body.appendChild( container );

        container = document.getElementById( 'canvas' );
        document.body.appendChild( container );
        
        // camera
        camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 1, 4000);
        camera.position.set(400, 200, 0);

        // scene
        scene = new THREE.Scene();
        // scene.add( new THREE.AxesHelper(1000));
        
        //makes color brighter and stronger
        var light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );


        

        

        // ground
        var material = new THREE.MeshPhongMaterial( { color: 0x747474, dithering: true } );
				var geometry = new THREE.PlaneBufferGeometry( 8000, 8000 );
        var mesh = new THREE.Mesh( geometry, material );
				mesh.position.set( 0, -180, 900 );
				mesh.rotation.x = - Math.PI * 0.5;
				mesh.receiveShadow = true;
        scene.add( mesh );


        // test target
        var material2 = new THREE.MeshPhongMaterial( { color: 0x747474, dithering: true } );
				var geometry2= new THREE.PlaneBufferGeometry( 8000, 8000 );
        var mesh2 = new THREE.Mesh( geometry2, material2 );
				mesh2.position.set( 0, -180, 900 );
				mesh2.rotation.x = - Math.PI * 0.5;
				mesh2.receiveShadow = true;
        scene.add( mesh2 );
        




        // load hdri and car object
				new RGBELoader()
					.setDataType( THREE.UnsignedByteType )
					.setPath( 'dist/env/' )
					.load( 'studio.hdr', function ( texture ) {
						var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
						scene.background = envMap;
						scene.environment = envMap;
						texture.dispose();
						pmremGenerator.dispose();
						render();
						var roughnessMipmapper = new RoughnessMipmapper( renderer );
						var loader = new GLTFLoader().setPath( 'dist/' );
						loader.load( 'corolla_v_0017.glb', function ( gltf ) {
							gltf.scene.traverse( function ( child ) {
                  if ( child.isMesh ) {
                    child.castShadow = true; 
                    child.receiveShadow = true;
                    if(child.name == "Body"){
                        child.material.needsUpdate=true;
                        child.material.envMap=null;
                        child.material.metalness=0.4061918556690216;
                        child.material.reflectivity=0.5;
                        child.material.roughness=0.0278855562210083;
                        child.material.side=2;  

                    }

                    if(child.name == "Shishe_jelo"){
                        // child.material.needsUpdate=true;
                        // child.material.envMap=null;
                        // child.material.metalness=0;
                        // child.material.reflectivity=0.5;
                        // child.material.roughness=0;
                        // child.material.side=2;  
                        // child.material.color=new THREE.Color("rgb(0,0, 0)");
                    }

                    if(child.name == "shise_jelo" && child.material.name=="shishe_cheragh_jelo.1"){
                      // console.log(child.material.name)
                        child.material.needsUpdate=true;
                        child.material.opacity=1;  
                        child.material.metalness=0;
                        child.material.reflectivity=1;
                        child.material.roughness=0;
                        child.material.transmission=0.9;

                        // add glow
                        // var spriteMaterial = new THREE.SpriteMaterial( 
                        //   { 
                        //     map: new THREE.ImageUtils.loadTexture( 'dist/textures/t.png' ), 
                        //     useScreenCoordinates: false,
                        //     color: 0xff0000, transparent: false, blending: THREE.AdditiveBlending
                        //   });
                        //   var sprite = new THREE.Sprite( spriteMaterial );
                        //   sprite.opacity = 0;
                        //   sprite.center.set( 0, 0 );
                        //   sprite.scale.set(200, 200, 1.0);
                        //   child.add(sprite)
                    }

                    if(child.name == "rahnama_borzorg"){
                      child.material.needsUpdate=true;
                      child.material.emissive=new THREE.Color("rgb(255,51, 0)");

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
              headlight1 = new THREE.SpotLight(color, intensity);
              headlight1.distance = dist;
              headlight1.angle = angle;
              headlight1.penumbra = penumbra;
              headlight1.position.set(-100, 0, 550);
              headlight1.target = mesh;
              headlight1.target.position.x = -100;
              gltf.scene.add(headlight1);
              gltf.scene.add(headlight1.target);

              //left headlight
              headlight2 = new THREE.SpotLight(color, intensity);
              headlight2.distance = dist;
              headlight2.angle = angle;
              headlight2.penumbra = penumbra;
              headlight2.position.set(100, 0, 550);
              headlight2.target = mesh2;
              headlight2.target.position.x = 100;
              // headlight2.target.position.set(0, 0, 400);
              gltf.scene.add(headlight2);
              gltf.scene.add(headlight2.target);
              
              gltf.scene.position.set(0,0,0);
              // const helper1 = new THREE.SpotLightHelper(headlight1);
              // const helper2 = new THREE.SpotLightHelper(headlight2);
              // gltf.scene.add(helper1);
              // gltf.scene.add(helper2);

              scene.add( gltf.scene );
              
							roughnessMipmapper.dispose();
							render();
						} );
          } 
        );

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( container.offsetWidth,container.offsetHeight  );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        // renderer.shadowMap.enabled = true;
        container.appendChild( renderer.domElement );
        var pmremGenerator = new THREE.PMREMGenerator( renderer );
        pmremGenerator.compileEquirectangularShader();



        //post processing
        composer = new EffectComposer( renderer );
        renderPass = new RenderPass( scene, camera );
        composer.addPass( renderPass );

        glitchPass = new GlitchPass();
        composer.addPass( glitchPass );

        // orbit controller
        controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 100;
        controls.maxDistance = 3000;
        controls.maxPolarAngle = Math.PI/2;
        // controls.minDistance = 2;
        // controls.maxDistance = 10;
        // controls.target.set( 0, 0, - 0.2 );
        controls.update();
        window.addEventListener( 'resize', onWindowResize, false );
		  	}


        // gui
        // const gui = new GUI({
        //   height : 5 * 32 - 1
        // });
        // var params = {
        //   intensity: 1
        // };
        // gui.add(params, 'intensity', 0, 40).onChange(updateLight);
        



			function onWindowResize() {
				camera.aspect = container.offsetWidth / container.offsetHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(container.offsetWidth, container.offsetHeight );
				render();
			}

			//

			function render() {
				renderer.render( scene, camera );
      }
      

      function makeXYZGUI(gui, vector3, name, onChangeFn) {
        const folder = gui.addFolder(name);
        folder.add(vector3, 'x', -100, 100).onChange(onChangeFn);
        folder.add(vector3, 'y', 0, 100).onChange(onChangeFn);
        folder.add(vector3, 'z', -100, 100).onChange(onChangeFn);
        folder.open();
      }

      function updateLight() {
        headlight1.target.updateMatrixWorld();
        headlight2.target.updateMatrixWorld();
        // helper.update();
      }


      function animate() {

        requestAnimationFrame( animate );
      
        composer.render();
      
      }
      