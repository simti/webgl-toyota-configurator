import * as THREE from 'three/build/three.module.js';

			// import Stats from 'three/examples/jsm/libs/stats.module.js';

			// import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
      import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js';
      import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

			var params = {
				envMap: 'HDR',
				roughness: 0.0,
				metalness: 0.0,
				exposure: 1.0,
				debug: false
			};

			var container;
			var camera, scene, renderer, controls;
			var torusMesh, planeMesh;
			var hdrCubeRenderTarget;
			var hdrCubeMap;

			init();
			animate();

			function getEnvScene() {

				var envScene = new THREE.Scene();

				var geometry = new THREE.BoxBufferGeometry();
				geometry.deleteAttribute( 'uv' );
				var roomMaterial = new THREE.MeshStandardMaterial( { metalness: 0, side: THREE.BackSide } );
				var room = new THREE.Mesh( geometry, roomMaterial );
				room.scale.setScalar( 10 );
				envScene.add( room );

				var mainLight = new THREE.PointLight( 0xffffff, 50, 0, 2 );
				envScene.add( mainLight );

				var lightMaterial = new THREE.MeshLambertMaterial( { color: 0x000000, emissive: 0xffffff, emissiveIntensity: 10 } );

				var light1 = new THREE.Mesh( geometry, lightMaterial );
				light1.material.color.setHex( 0xff0000 );
				light1.position.set( - 5, 2, 0 );
				light1.scale.set( 0.1, 1, 1 );
				envScene.add( light1 );

				var light2 = new THREE.Mesh( geometry, lightMaterial.clone() );
				light2.material.color.setHex( 0x00ff00 );
				light2.position.set( 0, 5, 0 );
				light2.scale.set( 1, 0.1, 1 );
				envScene.add( light2 );

				var light3 = new THREE.Mesh( geometry, lightMaterial.clone() );
				light3.material.color.setHex( 0x0000ff );
				light3.position.set( 2, 1, 5 );
				light3.scale.set( 1.5, 2, 0.1 );
				envScene.add( light3 );

				return envScene;

			}

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.set( 0, 0, 120 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x000000 );

				renderer = new THREE.WebGLRenderer();
				renderer.physicallyCorrectLights = true;
				renderer.toneMapping = THREE.ACESFilmicToneMapping;

				//

				var geometry = new THREE.TorusKnotBufferGeometry( 18, 8, 150, 20 );
				//var geometry = new THREE.SphereBufferGeometry( 26, 64, 32 );
				var material = new THREE.MeshStandardMaterial( {
					color: 0xffffff,
					metalness: params.metalness,
					roughness: params.roughness
				} );

				torusMesh = new THREE.Mesh( geometry, material );
				scene.add( torusMesh );


				var geometry = new THREE.PlaneBufferGeometry( 200, 200 );
				var material = new THREE.MeshBasicMaterial();

				planeMesh = new THREE.Mesh( geometry, material );
				planeMesh.position.y = - 50;
				planeMesh.rotation.x = - Math.PI * 0.5;
				scene.add( planeMesh );

				THREE.DefaultLoadingManager.onLoad = function ( ) {

					pmremGenerator.dispose();

				};

				var hdrUrls = [ 'px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr' ];
				hdrCubeMap = new HDRCubeTextureLoader()
					.setPath( 'dist/env/' )
					.setDataType( THREE.UnsignedByteType )
					.load( hdrUrls, function () {

						hdrCubeRenderTarget = pmremGenerator.fromCubemap( hdrCubeMap );

						hdrCubeMap.magFilter = THREE.LinearFilter;
						hdrCubeMap.needsUpdate = true;

          } );
          

        // hdrCubeMap = new RGBELoader()
        //   .setDataType( THREE.UnsignedByteType )
        //   .setPath( 'textures/equirectangular/' )



				var pmremGenerator = new THREE.PMREMGenerator( renderer );
				pmremGenerator.compileCubemapShader();

				var envScene = getEnvScene();
				// generatedCubeRenderTarget = pmremGenerator.fromScene( envScene, 0.04 );

				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );

				//renderer.toneMapping = ReinhardToneMapping;
				renderer.outputEncoding = THREE.sRGBEncoding;


				controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 50;
				controls.maxDistance = 300;

				window.addEventListener( 'resize', onWindowResize, false );
			}

			function onWindowResize() {

				var width = window.innerWidth;
				var height = window.innerHeight;

				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				renderer.setSize( width, height );

			}

			function animate() {

				requestAnimationFrame( animate );
				render();

			}

			function render() {

				torusMesh.material.roughness = params.roughness;
				torusMesh.material.metalness = params.metalness;

				var renderTarget, cubeMap;
        renderTarget = hdrCubeRenderTarget;
        cubeMap = hdrCubeMap;


				var newEnvMap = renderTarget ? renderTarget.texture : null;

				if ( newEnvMap && newEnvMap !== torusMesh.material.envMap ) {

					torusMesh.material.envMap = newEnvMap;
					torusMesh.material.needsUpdate = true;

					planeMesh.material.map = newEnvMap;
					planeMesh.material.needsUpdate = true;

				}

				torusMesh.rotation.y += 0.005;
				planeMesh.visible = params.debug;

				scene.background = cubeMap;
				renderer.toneMappingExposure = params.exposure;

				renderer.render( scene, camera );

			}
