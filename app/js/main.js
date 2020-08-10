import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

var camera, scene, renderer;
var geometry, material, mesh;
 
init();
animate();
 
function init() {
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    camera.position.z = 1;
 
    scene = new THREE.Scene();
 
    // geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    // material = new THREE.MeshNormalMaterial();
 
    // mesh = new THREE.Mesh( geometry, material );
    // scene.add( mesh );
 

    var loader = new GLTFLoader();

    loader.load( '../models/scene.gltf', function ( gltf ) {
    
      scene.add( gltf.scene );
    
    }, undefined, function ( error ) {
    
      console.error( error );
    
    } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
}
 
function animate() {
 
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
 
}