import * as THREE from 'three';

			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
			import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
			import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';

			var container, controls;
			var camera, scene, renderer,spotLight,lightHelper,shadowCameraHelper;

			init();
			render();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				// camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
        // camera.position.set( - 1.8, 0.6, 2.7 );
        
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(400, 200, 0);

        scene = new THREE.Scene();

        scene.add( new THREE.AxesHelper(1000));
        
        //makes color brighter and stronger
        var light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );
        

        // spotLight = new THREE.SpotLight( 0xffffff, 1 );
        // spotLight.position.set( 0, 0, 0 );
        // spotLight.target.position.x = 300;
        // spotLight.target.position.y = 300;
        // spotLight.target.position.z = 300;


        // spotLight.angle = 0.5;
        // spotLight.intensity = 2;
				// spotLight.penumbra = 0.4;
				// spotLight.decay = 2;
				// spotLight.distance = 600;
				// spotLight.castShadow = true;
				// spotLight.shadow.mapSize.width = 1024;
				// spotLight.shadow.mapSize.height = 1024;
				// spotLight.shadow.camera.near = 100;
        // spotLight.shadow.camera.far = 600;
				// scene.add( spotLight );

				// lightHelper = new THREE.SpotLightHelper( spotLight );
        // scene.add( lightHelper );
        
        // shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
        // scene.add( shadowCameraHelper );
        
        spotLight = new THREE.SpotLight( 0xffffff, 10 );
        spotLight.position.set( 0, 0, -1 );
        
				spotLight.angle = Math.PI / 4;
				spotLight.penumbra = 0.05;
				spotLight.decay = 2;
        spotLight.distance = 1000;
        spotLight.intensity = 2;
				spotLight.castShadow = true;
				spotLight.shadow.mapSize.width = 1024;
				spotLight.shadow.mapSize.height = 1024;
				spotLight.shadow.camera.near = 10;
				spotLight.shadow.camera.far = 1000;
        scene.add( spotLight );
        // scene.add( spotLight.target );
        // spotLight.target.position.x = 1;
        // spotLight.target.position.y = 0;
        // spotLight.target.position.z = 100;
        
        // var li = new THREE.PointLight( 0xff0000, 2 );
        // li.decay = 2;
        // li.distance = 20;
        // li.position.set( 0, -230, 0 );
        // scene.add( li );

        lightHelper = new THREE.SpotLightHelper( spotLight );
				// lightHelper = new THREE.PointLightHelper( li );
				scene.add( lightHelper );

				shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
        // scene.add( shadowCameraHelper );
        
        var material = new THREE.MeshPhongMaterial( { color: 0x747474, dithering: true } );

				var geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
        var mesh = new THREE.Mesh( geometry, material );
				mesh.position.set( 0, -180, 300 );
				mesh.rotation.x = - Math.PI * 0.5;
				mesh.receiveShadow = true;
				scene.add( mesh );


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
						// use of RoughnessMipmapper is optional
						var roughnessMipmapper = new RoughnessMipmapper( renderer );
						var loader = new GLTFLoader().setPath( 'dist/' );
						loader.load( 'corolla_v_0017.glb', function ( gltf ) {
							gltf.scene.traverse( function ( child ) {
                  if ( child.isMesh ) {
                    child.castShadow = true; 
                    child.receiveShadow = true;
                    // console.log(child)
                    // child.material.wireframe = true;
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




        // var geometry = new THREE.PlaneGeometry( 500, 500, 300 );
        // var material = new THREE.MeshPhongMaterial( { color: 0x474747, dithering: true ,side: THREE.DoubleSide} );
        // var plane = new THREE.Mesh( geometry, material );
        // plane.receiveShadow = true;
        // plane.position.set(0,0, 600);
        // scene.add( plane );


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

        controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 100;
        controls.maxDistance = 1500;
        controls.maxPolarAngle = Math.PI/2 ;
        // controls.minDistance = 2;
        // controls.maxDistance = 10;
        // controls.target.set( 0, 0, - 0.2 );
        controls.update();
        window.addEventListener( 'resize', onWindowResize, false );
		  	}

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