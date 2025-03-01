import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";

const ImageTracking = ({ setIsAR, setEndSession }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const modelRef = useRef(null);

  useEffect(() => {
    const initScene = () => {
      // Create scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Set up camera
      const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 1, 2);

      // Set up renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      rendererRef.current = renderer;

      // Append renderer to the DOM
      mountRef.current.appendChild(renderer.domElement);

      // Add a light
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(2, 2, 5);
      scene.add(light);

      // Add a sample model (a cube for now)
      const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1); // Small cube
      const material = new THREE.MeshStandardMaterial({ color: "blue" });
      const model = new THREE.Mesh(geometry, material);
      model.visible = false; // Hide model initially until marker is detected
      scene.add(model);
      modelRef.current = model;

      // Animation loop
      const animate = () => {
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });
      };
      animate();
    };

    initScene();

    // 🔹 Start WebXR AR with Image Tracking
    const autoStartAR = async () => {
      if (navigator.xr) {
        try {
          // Load marker image
          const img = document.getElementById("img")
          const imgBitmap = await createImageBitmap(img);

          // Start AR session with image tracking
          const session = await navigator.xr.requestSession("immersive-ar", {
            requiredFeatures: ["dom-overlay", "image-tracking"],
            domOverlay: { root: document.body },
            trackedImages: [{ image: imgBitmap, widthInMeters: 0.2 }], // 20 cm real-world size
          });

          session.addEventListener("end", () => {
            setIsAR(false);
            setEndSession(null);
          });

          rendererRef.current.xr.setReferenceSpaceType("local");
          rendererRef.current.xr.setSession(session);
          setIsAR(true);

          // Image tracking event listener
          session.addEventListener("trackedimageschange", (event) => {
            for (const image of event.added) {
              console.log("Tracking started for", image);
              if (modelRef.current) modelRef.current.visible = true;
            }
            for (const image of event.removed) {
              console.log("Tracking lost for", image);
              if (modelRef.current) modelRef.current.visible = false;
            }
          });

          // Cleanup function when session ends
          setEndSession(() => () => {
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
          });

        } catch (error) {
          console.warn("Auto AR start failed:", error);
        }
      }
    };

    autoStartAR();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null);
        rendererRef.current.dispose();
      }
    };
  }, [setEndSession, setIsAR]);



  return (
  <div ref={mountRef} className="w-full h-full">
    <img src="/peacock.png" id="img" style={{display: 'none'}} />
  </div>
);
};

ImageTracking.propTypes = {
  setIsAR: propTypes.func.isRequired,
  setEndSession: propTypes.func.isRequired,
}

export default ImageTracking;
