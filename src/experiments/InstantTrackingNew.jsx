import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import imgOverlay from '../assets/peacock.png'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const InstantTrackingNew = ({ session, endSession }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const groupRef = useRef(null);
  const [isAligned, setIsAligned] = useState(false);

  useEffect(() => {
    if (!session) return;

    const initAR = () => {
      try {
        const container = containerRef.current;

        // Initialize Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        rendererRef.current = renderer;

        // Initialize Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Initialize Camera
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        cameraRef.current = camera;

        // Set XR Reference Space
        rendererRef.current.xr.setReferenceSpaceType("local");
        // Set XR Session
        rendererRef.current.xr.setSession(session);

        // Attach Canvas to website container
        if (container) container.appendChild(renderer.domElement);

        // Add a Light to the Scene
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // Initialize Group
        const group = new THREE.Group();
        groupRef.current = group;
        scene.add(group);

        const animate = () => {
          renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
          });
        };

        animate();

        session.addEventListener('end', () => {
          console.log("Cleaning up scene...");
          cleanupScene();
        })
      } catch (error) {
        console.warn("Failed to initialize AR:", error);
      }
    }

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
      setIsAligned(false);
    };

    initAR();

    return () => {
      cleanupScene();      
    }
  }, [session, endSession]);

  const alignScene = () => {
    if (!sceneRef.current || !cameraRef.current) return;

    // Load a model
    const model = new THREE.Object3D();
    const loader = new GLTFLoader();
    loader.load("/models/Fish.glb", (gltf) => {
      model.add(gltf.scene);
      model.scale.setScalar(0.1); // This depends on the model (CHANGE IF NEEDED)
      model.position.set(0, 0, -1).applyMatrix4(cameraRef.current.matrixWorld); // Place model in front of camera
      model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

      groupRef.current.add(model);
      setIsAligned(true);
    });
  }

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
      {!isAligned && (
        <img src={imgOverlay} alt="AR Guide Overlay" style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          /*width: "auto",
          height: "auto",*/
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 999,
        }} />
      )}
      {!isAligned && (
        <button onClick={alignScene}
        style={{
          position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", padding: "10px 20px", fontSize: "16px", background: "blue",
          color: "white", border: "none", borderRadius: "5px", cursor: "pointer",
          zIndex: 1000, // Ensure it's above the AR scene
        }}
      >
        Align Scene
      </button>
      )}
    </div>
  );
};

InstantTrackingNew.propTypes = {
  session: propTypes.func.isRequired,
  endSession: propTypes.func.isRequired,
}

export default InstantTrackingNew;
