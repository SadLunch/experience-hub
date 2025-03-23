import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const HittestModelLiveSizeTest = ({ session, endSession }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const hitTestSourceRequested = useRef(false);
  const hitTestSource = useRef(null);
  const reticleRef = useRef(null);
  const isPlaced = useRef(false);
  const controllerRef = useRef(null);

  useEffect(() => {
    if (!session) return;

    const initAR = () => {
      try {
        const container = containerRef.current;

        // Animation loop
        const animate = (timestamp, frame) => {
          if (frame) {
            const referenceSpace = renderer.xr.getReferenceSpace();
            const session = renderer.xr.getSession();

            if (hitTestSourceRequested.current === false) {
              session.requestReferenceSpace("viewer").then((referenceSpace) => {
                session.requestHitTestSource({ space: referenceSpace }).then((source) => { hitTestSource.current = source; })
              });

              session.addEventListener("end", () => {
                hitTestSourceRequested.current = false;
                hitTestSource.current = null;
                console.log("Cleaning up scene...");
                cleanupScene();
              });

              hitTestSourceRequested.current = true;
            }

            if (hitTestSource.current) {
              const hitTestResults = frame.getHitTestResults(hitTestSource.current);

              if (hitTestResults.length && !isPlaced.current) {
                const hit = hitTestResults[0];
                reticleRef.current.visible = true;
                reticleRef.current.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
              } else {
                reticleRef.current.visible = false;
              }
            }
          }
          renderer.render(scene, camera);
        };

        // Create the Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        renderer.setAnimationLoop(animate);
        rendererRef.current = renderer;

        rendererRef.current.xr.setReferenceSpaceType("local");
        rendererRef.current.xr.setSession(session); // Set the session passed from the experiment detail page

        if (container) {
          container.appendChild(renderer.domElement);
        }

        // Create the Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Create the Camera
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        cameraRef.current = camera;

        // Create a Light
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        controllerRef.current = renderer.xr.getController(0);
        controllerRef.current.addEventListener('select', onSelect);
        scene.add(controllerRef.current);

        reticleRef.current = new THREE.Mesh(
          new THREE.RingGeometry(0.15, 0.2, 32).rotateX(- Math.PI / 2),
          new THREE.MeshBasicMaterial()
        );
        reticleRef.current.matrixAutoUpdate = false;
        reticleRef.current.visible = false;
        scene.add(reticleRef.current);
      } catch (error) {
        console.warn("Failed to initialize AR:", error);
      }
    };

    const onSelect = () => {
      if (reticleRef.current.visible) {
        const model = new THREE.Object3D();
        const loader = new GLTFLoader();
        loader.load("/models/room.glb", (gltf) => {
          model.add(gltf.scene);
          reticleRef.current.matrix.decompose(model.position, model.quaternion, model.scale);
          sceneRef.current.add(model);
          isPlaced.current = true;
        })
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
    }

    initAR();

    return () => {
      cleanupScene();
    }
  }, [session, endSession]);

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
    </div>
  );
};

HittestModelLiveSizeTest.propTypes = {
  session: propTypes.func.isRequired,
  endSession: propTypes.func.isRequired,
}

export default HittestModelLiveSizeTest;
