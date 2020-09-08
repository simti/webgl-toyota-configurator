import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

var camera, controls, scene, renderer,rectLight1,rectLight2,rectLight3;
let simti = []

			init();
			//render(); // remove when using next line for animation loop (requestAnimationFrame)
			animate();

			function init() {

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xcccccc );
        // scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
        // scene.add(new THREE.GridHelper(10, 10));
        


				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );


				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.position.set( 400, 200, 0 );

				// controls

				controls = new OrbitControls( camera, renderer.domElement );

				//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

				controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.05;

				controls.screenSpacePanning = false;

				controls.minDistance = 100;
				controls.maxDistance = 1000;

				controls.maxPolarAngle = Math.PI*4;

				// world

				var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
				var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

				// for ( var i = 0; i < 500; i ++ ) {

					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.x = 0;
					mesh.position.y = 0;
					mesh.position.z = 0;
					// mesh.updateMatrix();
					// mesh.matrixAutoUpdate = false;
          // scene.add( mesh );
          

				// }

        //add car 
        let car;
        var loader = new GLTFLoader();

        loader.load(
            // resource URL
            'dist/new.gltf',
            // called when the resource is loaded
            function ( gltf ) {
              console.log(gltf.scene.children[0].children[0].children[0].children[0].children[0].children[0])

              gltf.scene.traverse( function( object ) {

                if ( object.isMesh)
                  simti.push(object)
          
                } );

              console.log(simti)

              scene.add( gltf.scene );
          
              gltf.animations; // Array<THREE.AnimationClip>
              gltf.scene; // THREE.Group
              gltf.scenes; // Array<THREE.Group>
              gltf.cameras; // Array<THREE.Camera>
              gltf.asset; // Object
          
            },  
            // called while loading is progressing
            function ( xhr ) {
          
              console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          
            },
            // called when loading has errors
            function ( error ) {
          
              console.log( 'An error happened' );
          
            }
        );


				// lights

				// var light = new THREE.DirectionalLight( 0xffffff );
				// light.position.set( 1, 1, 1 );
        // scene.add( light );
        
        RectAreaLightUniformsLib.init();

				rectLight1 = new THREE.RectAreaLight( 0xffffff, 5, 300, 300 );
        rectLight1.position.set( 0, 450, 0 );
        rectLight1.rotateX(THREE.Math.degToRad(-90));
        scene.add( rectLight1 );
            

        rectLight2 = new THREE.RectAreaLight( 0xffffff, 5, 300, 300 );
        rectLight2.position.set( 0, 300, 300 );
        rectLight2.rotateX(THREE.Math.degToRad(-45));
        scene.add( rectLight2 );

        rectLight3 = new THREE.RectAreaLight( 0xffffff, 5, 300, 300 );
        rectLight3.position.set( 0, 300, -300 );
        rectLight3.rotateX(THREE.Math.degToRad(-135));
        scene.add( rectLight3 );


        var helper1 = new RectAreaLightHelper( rectLight1 );
        rectLight1.add( helper1 ); 
        var helper2 = new RectAreaLightHelper( rectLight2 );
        rectLight2.add( helper2 ); 
        var helper3 = new RectAreaLightHelper( rectLight3 );
        rectLight3.add( helper3 ); 

				// var light = new THREE.DirectionalLight( 0x002288 );
				// light.position.set( - 1, - 1, - 1 );
				// scene.add( light );

				// var light = new THREE.AmbientLight( 0x222222 );
				// scene.add( light );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

        requestAnimationFrame( animate );
        
        // var t = ( Date.now() / 2000 );

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

				renderer.render( scene, camera );

			}