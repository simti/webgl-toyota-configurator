import * as THREE from 'three';

			import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
			import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
      import { RoughnessMipmapper } from 'three/examples/jsm/utils/RoughnessMipmapper.js';
      import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
      import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
      import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
      import { Reflector } from 'three/examples/jsm/objects/Reflector'
      // import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

			var container, controls;
			var camera, scene, renderer,headlight1,headlight2,lightHelper,shadowCameraHelper,mesh_,glitchPass,renderPass,composer,theta,ftDisplacement,vector,meshs,sprite,ftNormal,ftSpecular,tttt,ftSimple;

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
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
        camera.position.set(400, 200, 300);

        // scene
        scene = new THREE.Scene();
        // scene.add( new THREE.AxesHelper(1000));
        
        //makes color brighter and stronger
        var light = new THREE.AmbientLight( 0x222222 );
        scene.add( light );





        // car shadow
        // Texture
        const shadowTexture = new THREE.TextureLoader().load("dist/textures/shadow.jpg");

        // Plane
        const shadowPlane = new THREE.PlaneBufferGeometry(1200, 1200);
        shadowPlane.rotateX(-Math.PI / 2);
        

        // Material
        const shadowMaterial = new THREE.MeshBasicMaterial({
            map: shadowTexture,
            blending: THREE.MultiplyBlending,
            transparent: true,
            opacity:0
        });

        // Mesh
        // const shadowMesh = new THREE.Mesh(shadowPlane, shadowMaterial);
        // shadowMesh.position.y = - 170;
        // shadowMesh.position.z = 50;
        // shadowMesh.rotation.y = Math.PI / 2;
        // scene.add(shadowMesh)


        // ground

        var ma = new THREE.MeshBasicMaterial( { 
          color: 0x000000, 
          dithering: true ,
          side: THREE.FrontSide,
          map: new THREE.ImageUtils.loadTexture( 'dist/textures/123.png' ), 
          useScreenCoordinates: false,
          color: 0xffffff, 
          transparent: true, 
          blending: THREE.AdditiveBlending
        } );

        var ge = new THREE.PlaneBufferGeometry( 180, 150 );
        meshs = new THREE.Mesh( ge, ma );
        // meshs.scale.set(0.6,0.6);
        meshs.renderOrder = 999;
        meshs.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
        // meshs.lookAt(camera.position)
        // scene.add( meshs );
        meshs.opacity = 0;
        meshs.lookAt(camera.position);

        


        
        

        // normal
        ftNormal = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_normal.jpg' );
        ftNormal.wrapS = ftNormal.wrapT = THREE.RepeatWrapping; 
        ftNormal.repeat.set( 3, 2 );

        // map
        ftSimple = new THREE.ImageUtils.loadTexture( 'dist/textures/uiglegfg_2K_Albedo.jpg' );
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
        var material = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true ,normalMap: ftNormal ,map:ftSimple,displacementMap:ftDisplacement } );
				var geometry = new THREE.PlaneBufferGeometry( 8000, 8000 );
        var mesh = new THREE.Mesh( geometry, material );
				mesh.position.set( 0, 0, 900 );
				mesh.rotation.x = - Math.PI * 0.5;
				mesh.receiveShadow = true;
        // scene.add( mesh );

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
        // var material2 = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true,normalMap: ftNormal,normalScale:(1,1),map:ftSimple } );
				// var geometry2= new THREE.PlaneBufferGeometry( 8000, 8000 );
        // var mesh2 = new THREE.Mesh( geometry2, material2 );
				// mesh2.position.set( 0, 0, 899 );
				// mesh2.rotation.x = - Math.PI * 0.5;
				// mesh2.receiveShadow = true;
        // scene.add( mesh2 );
        




        // load hdri and car object
				new RGBELoader()
					.setDataType( THREE.UnsignedByteType )
					.setPath( 'dist/env/' )
					.load( 'studio.hdr', function ( texture ) {
						var envMap = pmremGenerator.fromEquirectangular( texture ).texture;
            // scene.background = envMap;
            scene.background = pmremGenerator.renderTarget;
						scene.environment = envMap;
						texture.dispose();
						pmremGenerator.dispose();
						render();
						var roughnessMipmapper = new RoughnessMipmapper( renderer );
						var loader = new GLTFLoader().setPath( 'dist/' );
						loader.load( 'final.glb', function ( gltf ) {
							gltf.scene.traverse( function ( child ) {
                  if ( child.isMesh ) {
                    console.log(child)
                    child.castShadow = true; 
                    child.receiveShadow = true;
                    if(child.name == "badane_mashin"){
                        child.material.needsUpdate=true;
                        child.material.envMap=null;
                        child.material.metalness=0.4061918556690216;
                        child.material.reflectivity=0.3;
                        child.material.roughness=0.1878855562210083;
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

                    if(child.name == "shise_cheragh_jelo" && child.material.name=="shishe_cheragh_jelo"){
                        child.material.needsUpdate=true;
                        child.material.opacity=1;  
                        child.material.metalness=0;
                        child.material.reflectivity=1;
                        child.material.roughness=0;
                        child.material.transmission=0.9;

                        // ------------------------
                          
                        // ------------------------

                        // add glow
                        child.add( meshs );
                        meshs.position.z =70;
                        meshs.position.x =95;
                        meshs.position.y =5;
                        meshs.lookAt(camera.position)
                        child.add(meshs)

                        // console.log(child)
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
              // headlight2.target = mesh2;
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
            },function(xhr) {
              console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
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



        //post processing
        // composer = new EffectComposer( renderer );
        // renderPass = new RenderPass( scene, camera );
        // composer.addPass( renderPass );

        // glitchPass = new GlitchPass();
        // composer.addPass( glitchPass );

        // orbit controller
        controls = new OrbitControls( camera, renderer.domElement );
        controls.addEventListener( 'change', render ); // use if there is no animation loop
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 200;
        controls.maxDistance = 1500;
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
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight );
				render();
			}

			//

			function render() {
        renderer.render( scene, camera );
        meshs.lookAt(camera.position);
        vector = camera.getWorldDirection();
        theta = Math.atan2(vector.x,vector.z);
        // console.log(Math.floor(THREE.Math.radToDeg(theta)))
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


      // function animate() {

      //   requestAnimationFrame( animate );
      
      //   // composer.render();
      //   renderer.render();
      
      // }
      