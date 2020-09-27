import * as THREE from 'three';

			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
			import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
      import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
      import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

			var container, controls;
			var camera, scene, renderer,headlight,lightHelper,shadowCameraHelper;

			init();
			render();

			function init() {

				container = document.createElement( 'div' );
        document.body.appendChild( container );
        
        // camera
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.set(400, 200, 0);

        // scene
        scene = new THREE.Scene();
        scene.add( new THREE.AxesHelper(1000));
        
        //makes color brighter and stronger
        var light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );

        // spotlight
        const color = 0xFFFFFF;
        const intensity = 1;
        headlight = new THREE.SpotLight(color, intensity);
        headlight.position.set(0, 4, 40);
        headlight.target.position.set(0, 0, 400);
        scene.add(headlight);
        scene.add(headlight.target);

        const helper = new THREE.SpotLightHelper(headlight);
        scene.add(helper);
        

        // ground
        var material = new THREE.MeshPhongMaterial( { color: 0x747474, dithering: true } );
				var geometry = new THREE.PlaneBufferGeometry( 4000, 4000 );
        var mesh = new THREE.Mesh( geometry, material );
				mesh.position.set( 0, -180, 300 );
				mesh.rotation.x = - Math.PI * 0.5;
				mesh.receiveShadow = true;
				scene.add( mesh );


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
                    }

                    if(child.name == "rahnama_borzorg"){
                      child.material.needsUpdate=true;
                      child.material.emissive=new THREE.Color("rgb(255,51, 0)");

                    }
                  }
                }
              );
              scene.add( gltf.scene );
              
							roughnessMipmapper.dispose();
							render();
						} );
          } 
        );

        // renderer
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
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
        controls.minDistance = 100;
        controls.maxDistance = 2000;
        controls.maxPolarAngle = Math.PI/2 ;
        // controls.minDistance = 2;
        // controls.maxDistance = 10;
        // controls.target.set( 0, 0, - 0.2 );
        controls.update();
        window.addEventListener( 'resize', onWindowResize, false );
		  	}


        // gui
        const gui = new GUI({
          height : 5 * 32 - 1
        });
        var params = {
          intensity: 1
      };
        // gui.add(headlight, 'intensity', 0, 2, 0.01);
        // gui.add(params, 'interation').min(128).max(256).step(16)
        gui.add(params, 'intensity', 0, 40).onChange(updateLight);
        // gui.add(headlight, 'penumbra', 0, 1, 0.01);
        // makeXYZGUI(gui, headlight.position, 'position', updateLight);
        // makeXYZGUI(gui, headlight.target.position, 'target', updateLight);



			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
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
        headlight.target.updateMatrixWorld();
        // helper.update();
      }
      