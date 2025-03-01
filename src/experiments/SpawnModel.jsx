import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const SpawnModel = ({setIsAR, setEndSession}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    cameraRef.current = camera;


    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Enable WebXR
    rendererRef.current = renderer;

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

    // Try to start AR automatically
    const autoStartAR = async () => {
        if (navigator.xr) {
          try {
            const session = await navigator.xr.requestSession("immersive-ar", {
                requiredFeatures: ["dom-overlay"],
                domOverlay: {root: document.body },
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
      {/* {!isAR && (
        <button onClick={startAR} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: 10 }}>
          Start AR
        </button>
      )} */}
      
      
    </div>
  );
};

SpawnModel.propTypes = {
    setIsAR: propTypes.func.isRequired,
    setEndSession: propTypes.func.isRequired,
}

export default SpawnModel;
