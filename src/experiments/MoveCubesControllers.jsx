import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
import { XRControllerModelFactory } from "three/examples/jsm/Addons.js";

const raycaster = new THREE.Raycaster();
let intersected = [];

const MoveCubesControllers = ({setIsAR, setEndSession}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
//   const controlsRef = useRef(null);
  

  useEffect(() => {
    const container = containerRef.current;
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10);
    cameraRef.current = camera;

    // const controls = new OrbitControls(camera, container);
    // controls.target.set( 0, 1.6, 0 );
    // controls.update();
    // controlsRef.current = controls;

    const floorGeometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
    const floorMaterial = new THREE.ShadowMaterial( { opacity: 0.5/*, blending: THREE.CustomBlending, transparent: false */} );
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.position.set(0, 0, 0);
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add( floor );

    scene.add( new THREE.HemisphereLight( 0xbcbcbc, 0xa5a5a5, 3 ) );

    // Add a light
    const light = new THREE.DirectionalLight( 0xffffff, 3 );
    light.position.set( 0, 6, 0 );
    light.castShadow = true;
    light.shadow.camera.top = 3;
    light.shadow.camera.bottom = - 3;
    light.shadow.camera.right = 3;
    light.shadow.camera.left = - 3;
    light.shadow.mapSize.set( 4096, 4096 );
    scene.add( light );

    const group = new THREE.Group();
    scene.add( group );

    // const geometries = [
    //     new THREE.BoxGeometry( 0.2, 0.2, 0.2 ),
    //     new THREE.ConeGeometry( 0.2, 0.2, 64 ),
    //     new THREE.CylinderGeometry( 0.2, 0.2, 0.2, 64 ),
    //     new THREE.IcosahedronGeometry( 0.2, 8 ),
    //     new THREE.TorusGeometry( 0.2, 0.04, 64, 32 )
    // ];

    const loader = new GLTFLoader();

    for ( let i = 0; i < 10; i ++ ) {

        loader.load("/models/untitled.glb", (gltf) => {
            const model = gltf.scene
            model.position.x = Math.random() * 4 - 2;
            model.position.y = Math.random() * 2;
            model.position.z = Math.random() * 4 - 2;

            model.rotation.x = Math.random() * 2 * Math.PI;
            model.rotation.y = Math.random() * 2 * Math.PI;
            model.rotation.z = Math.random() * 2 * Math.PI;

            model.scale.setScalar(0.1);

            model.castShadow = true;
            model.receiveShadow = true;
            group.add(model);
        })

        

        // const geometry = geometries[ Math.floor( Math.random() * geometries.length ) ];
        // const material = new THREE.MeshStandardMaterial( {
        //     color: Math.random() * 0xffffff,
        //     roughness: 0.7,
        //     metalness: 0.0
        // } );

        // const object = new THREE.Mesh( geometry, material );

        // object.position.x = Math.random() * 4 - 2;
        // object.position.y = Math.random() * 2;
        // object.position.z = Math.random() * 4 - 2;

        // object.rotation.x = Math.random() * 2 * Math.PI;
        // object.rotation.y = Math.random() * 2 * Math.PI;
        // object.rotation.z = Math.random() * 2 * Math.PI;

        // object.scale.setScalar( Math.random() + 0.5 );

        // object.castShadow = true;
        // object.receiveShadow = true;

        // group.add( object );

    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.xr.enabled = true; // Enable WebXR
    rendererRef.current = renderer;

    camera.position.set(0, 3, 0);

    if (container) {
      container.appendChild(renderer.domElement);
    }

    // controllers

    const controller1 = renderer.xr.getController( 0 );
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );
    scene.add( controller1 );

    const controller2 = renderer.xr.getController( 1 );
    controller2.addEventListener( 'selectstart', onSelectStart );
    controller2.addEventListener( 'selectend', onSelectEnd );
    scene.add( controller2 );

    const controllerModelFactory = new XRControllerModelFactory();

    const controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    scene.add( controllerGrip1 );

    const controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    scene.add( controllerGrip2 );

    const geometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

    const line = new THREE.Line( geometry );
    line.name = 'line';
    line.scale.z = 5;

    controller1.add( line.clone() );
    controller2.add( line.clone() );

    //

    window.addEventListener( 'resize', onWindowResize );

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onSelectStart( event ) {

        const controller = event.target;

        const intersections = getIntersections( controller );

        if ( intersections.length > 0 ) {

            const intersection = intersections[ 0 ];

            const object = intersection.object.parent;
            object.children.map((child) => {
                child.material.emissive.b = 1;
            })
            controller.attach( object );

            controller.userData.selected = object;

        }

        controller.userData.targetRayMode = event.data.targetRayMode;

    }

    function onSelectEnd( event ) {

        const controller = event.target;

        if ( controller.userData.selected !== undefined ) {

            const object = controller.userData.selected;
            object.children.map((child) => {
                child.material.emissive.b = 0;
            })
            group.attach( object );

            controller.userData.selected = undefined;

        }

    }

    function getIntersections( controller ) {

        controller.updateMatrixWorld();

        raycaster.setFromXRController( controller );

        return raycaster.intersectObjects( group.children, true );

    }

    function intersectObjects( controller ) {

        // Do not highlight in mobile-ar

        if ( controller.userData.targetRayMode === 'screen' ) return;

        // Do not highlight when already selected

        if ( controller.userData.selected !== undefined ) return;

        const line = controller.getObjectByName( 'line' );
        const intersections = getIntersections( controller );

        if ( intersections.length > 0 ) {

            const intersection = intersections[ 0 ];

            const object = intersection.object.parent;
            object.children.map((child) => {
                child.material.emissive.r = 1;
            })
            intersected.push( object );

            line.scale.z = intersection.distance;

        } else {

            line.scale.z = 5;

        }

    }

    function cleanIntersected() {

        while ( intersected.length ) {

            const object = intersected.pop();
            object.children.map((child) => {
                child.material.emissive.r = 0;
            })

        }

    }

    //

    function animate() {

        cleanIntersected();

        intersectObjects( controller1 );
        intersectObjects( controller2 );

        renderer.render( scene, camera );

    }

    // Try to start AR automatically
    const autoStartAR = async () => {
        if (navigator.xr) {
          try {
            const session = await navigator.xr.requestSession("immersive-ar", {
                optionalFeatures: ["dom-overlay", "depth-sensing"],
                domOverlay: {root: document.body },
                depthSensing: { usagePreference: [ 'gpu-optimized' ], dataFormatPreference: [] },
              });
          
              session.addEventListener("end", () => {
                setIsAR(false);
                setEndSession(null);
              })
          
              rendererRef.current.xr.setReferenceSpaceType("local");
          
              rendererRef.current.xr.setSession(session);
              setIsAR(true);

              setEndSession(() => () => {
                // Clear the scene
                if (sceneRef.current) {
                    sceneRef.current.children.forEach((object) => {
                    if (!object.isLight) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) object.material.dispose();
                        sceneRef.current.remove(object);
                    }
                    });
                }
                const session = rendererRef.current?.xr.getSession();
                if (session) session.end();
              })
          } catch (error) {
            console.warn("Auto AR start failed:", error);
          }
        }
    };
  
      // Start AR after a delay (some browsers block instant start)
    //setTimeout(autoStartAR, 1000);
    autoStartAR();

    // Cleanup function
    return () => {
      renderer.setAnimationLoop(null);
      if (container) container.removeChild(renderer.domElement);
    };
  }, [setIsAR, setEndSession]);

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
    </div>
  );
};

MoveCubesControllers.propTypes = {
    setIsAR: propTypes.func.isRequired,
    setEndSession: propTypes.func.isRequired,
}

export default MoveCubesControllers;
