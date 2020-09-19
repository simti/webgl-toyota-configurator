import * as THREE from 'three';

			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
			import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
			import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';

			var container, controls;
			var camera, scene, renderer;

			init();
			render();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				// camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
        // camera.position.set( - 1.8, 0.6, 2.7 );
        
        camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(400, 200, 0);

        scene = new THREE.Scene();
        
        //makes color brighter and stronger
        var light = new THREE.AmbientLight( 0x222222 );
	      scene.add( light );


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
						loader.load( 'mustang.gltf', function ( gltf ) {
							gltf.scene.traverse( function ( child ) {
                  if ( child.isMesh ) {
                    console.log(child)
                    if(child.name == "Body"){
                        child.material.needsUpdate=true;
                        child.material.envMap=null;
                        child.material.metalness=0.4061918556690216;
                        child.material.reflectivity=0.5;
                        child.material.roughness=0.0278855562210083;
                        child.material.side=2;  

                    }

                    if(child.name == "Shishe_jelo"){
                        child.material.needsUpdate=true;
                        child.material.envMap=null;
                        child.material.metalness=0;
                        child.material.reflectivity=0.5;
                        child.material.roughness=0;
                        child.material.side=2;  
                        child.material.color=new THREE.Color("rgb(0,0, 0)");
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

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild( renderer.domElement );

        var pmremGenerator = new THREE.PMREMGenerator( renderer );
        pmremGenerator.compileEquirectangularShader();

        controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 100;
        controls.maxDistance = 1000;
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