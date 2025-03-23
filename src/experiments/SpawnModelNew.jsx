import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const SpawnModelNew = ({ session, endSession }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!session) return;

    const initAR = () => {
      try {
        const container = containerRef.current;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true; // Enable WebXR
        rendererRef.current = renderer;

        // Initialize Three.js scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        cameraRef.current = camera;

        // Need this to make AR work (DONT FORGET THIS)
        rendererRef.current.xr.setReferenceSpaceType("local");
        rendererRef.current.xr.setSession(session);

        if (container) {
          container.appendChild(renderer.domElement);
        }

        // Add a light
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // Load a model
        const model = new THREE.Object3D();
        const loader = new GLTFLoader();
        loader.load("/models/Fish.glb", (gltf) => {
          model.add(gltf.scene);
          model.scale.set(0.1, 0.1, 0.1);
          model.position.set(0, 0, -1).applyMatrix4(cameraRef.current.matrixWorld); // Place model in front of camera
          model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

          scene.add(model);
        });

        // Animation loop
        const animate = () => {
          renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
          });
        };

        animate();

        session.addEventListener('end', () => {
          console.log("Cleaning up scene...");
          cleanupScene();
        });
      } catch (error) {
        console.warn("Failed to initialize AR:", error);
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
  }, [endSession, session]);

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
      {/* {!isAR && (
        <button onClick={startAR} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: 10 }}>
          Start AR
        </button>
      )} */}


    </div>
  );
};

SpawnModelNew.propTypes = {
  session: propTypes.func.isRequired,
  endSession: propTypes.func.isRequired,
}

export default SpawnModelNew;
