import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
import { XRControllerModelFactory } from "three/examples/jsm/Addons.js";

const raycaster = new THREE.Raycaster();
// let intersected = []; // I dont know if this is really needed (It works event without it)

const MoveCubesControllersNew = ({ session, endSession }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const groupRef = useRef(null);
  //   const controlsRef = useRef(null);

  const spawnFishes = () => {
    const loader = new GLTFLoader();
    for (let i = 0; i < 10; i++) {
      loader.load("/models/untitled.glb", (gltf) => {
        const model = gltf.scene;
  
        // Set random position in a radius of 2 meters
        model.position.x = Math.random() * 4 - 2;
        model.position.y = Math.random() * 4;
        model.position.z = Math.random() * 4 - 2;
  
        // Set a random rotation (for variety)
        model.rotation.x = Math.random() * 2 * Math.PI;
        model.rotation.y = Math.random() * 2 * Math.PI;
        model.rotation.z = Math.random() * 2 * Math.PI;
  
        // Scale it accordig to the model's original scale
        model.scale.setScalar(0.1);
  
        // Make it so the models can cast and receive shadows
        model.castShadow = true;
        model.receiveShadow = true;
        groupRef.current.add(model);
      });
    }
  }

  useEffect(() => {
    if (!session) return;

    const initAR = () => {
      try {
        const container = containerRef.current;

        // Initialize Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.xr.enabled = true;
        rendererRef.current = renderer;

        // Need this to make AR work (DONT FORGET THIS)
        rendererRef.current.xr.setReferenceSpaceType("local");
        rendererRef.current.xr.setSession(session);

        if (container) container.appendChild(renderer.domElement);

        // Initialize Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Initialize Camera
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        cameraRef.current = camera;

        // Add a Light to the Scene
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // Add Directional Light (This is so the objects can cast shadows in the Scene)
        const dLight = new THREE.DirectionalLight(0xffffff, 3);
        dLight.position.set(0, 6, 0);
        dLight.castShadow = true;
        dLight.shadow.camera.top = 3;
        dLight.shadow.camera.bottom = -3;
        dLight.shadow.camera.right = 3;
        dLight.shadow.camera.left = -3;
        dLight.shadow.mapSize.set(4096, 4096);
        scene.add(dLight);

        // Add a floor the shadows can be cast upon
        const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5, blending: THREE.CustomBlending, transparent: false });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.set(0, -1.5, 0); // Average height the device is from the floor
        floor.rotateX(-Math.PI / 2);
        floor.receiveShadow = true;
        scene.add(floor);

        // Initialize Group (Where movable objects will be put)
        const group = new THREE.Group();
        scene.add(group);
        groupRef.current = group;

        // Spawn the fishes
        spawnFishes();

        // Functions for the controllers
        const onSelectStart = (event) => {
          const controller = event.target;

          const intersections = getIntersections(controller);

          if (intersections.length > 0) {
            const intersection = intersections[0];

            const object = intersection.object.parent;
            object.children.map((child) => {
              child.material.emissive.b = 1;
            });
            controller.attach(object);

            controller.userData.selected = object;
          }
          controller.userData.targetRayMode = event.target.targetRayMode;
        };

        const onSelectEnd = (event) => {
          const controller = event.target;

          if (controller.userData.selected !== undefined) {
            const object = controller.userData.selected;
            object.children.map((child) => {
              child.material.emissive.b = 0;
            });
            groupRef.current.attach(object);

            controller.userData.selected = undefined;
          }
        };

        // Add controllers to be able to move the fishes
        const controller1 = renderer.xr.getController(0);
        controller1.addEventListener('selectstart', onSelectStart);
        controller1.addEventListener('selectend', onSelectEnd);
        scene.add(controller1);

        const controller2 = renderer.xr.getController(1);
        controller2.addEventListener('selectstart', onSelectStart);
        controller2.addEventListener('selectend', onSelectEnd);
        scene.add(controller2);

        const controllerModelFactory = new XRControllerModelFactory();

        const controllerGrip1 = renderer.xr.getControllerGrip(0);
        controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
        scene.add(controllerGrip1);

        const controllerGrip2 = renderer.xr.getControllerGrip(1);
        controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
        scene.add(controllerGrip2);

        // Add lines to intersect with objects
        const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

        const line = new THREE.Line(geometry);
        line.name = 'line';
        line.scale.z = 5;

        controller1.add(line.clone());
        controller2.add(line.clone());

        

        const getIntersections = (controller) => {
          controller.updateMatrixWorld();

          raycaster.setFromXRController(controller);

          return raycaster.intersectObjects(group.children);
        };

        // const intersectObjects = (controller) => {
        //   if (controller.userData.targetRayMode === 'screen') return;

        //   if (controller.userData.selected !== undefined) return;

        //   const line = controller.getObjectByName('line');
        //   const intersections = getIntersections(controller);

        //   if (intersections.length > 0) {
        //     const intersection = intersections[0];

        //     const object = intersection.object.parent;
        //     object.children.map((child) => {
        //       child.material.emissive.r = 1;
        //     });
        //     intersected.push(object);

        //     line.scale.z = intersection.distance;
        //   } else {
        //     line.scale.z = 5;
        //   }
        // };

        // const cleanIntersected = () => {
        //   while (intersected.length) {
        //     const object = intersected.pop();
        //     object.children.map((child) => {
        //       child.material.emissive.r = 0;
        //     });
        //   }
        // };

        const animate = () => {
          // cleanIntersected();

          // intersectObjects(controller1);
          // intersectObjects(controller2);

          renderer.render(scene, camera);
        }

        renderer.setAnimationLoop(animate);

        session.addEventListener('end', () => {
          console.log('Cleaning up scene...');
          cleanupScene();
        });
      } catch (error) {
        console.log("Failed to initialize AR:", error);
      }
    };

    const cleanupScene = () => {
      if (sceneRef.current) {
        sceneRef.current.children.forEach((object) => {
          if (!object.isLight) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
            sceneRef.current.remove(object);
          }
        });
      }
    };

    initAR();

    return () => {
      cleanupScene();
    }
  }, [session, endSession])

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
    </div>
  );
};

MoveCubesControllersNew.propTypes = {
  session: propTypes.func.isRequired,
  endSession: propTypes.func.isRequired,
}

export default MoveCubesControllersNew;
