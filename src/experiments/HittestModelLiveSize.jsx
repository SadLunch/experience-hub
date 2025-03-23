import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const HittestModelLiveSize = ({ setIsAR, setEndSession }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const hitTestSource = useRef(null);
  const hitTestSourceRequested = useRef(false);
  const controllerRef = useRef(null);
  const reticleRef = useRef(null);
  const isPlaced = useRef(false);
  //const [isPlaced, setIsPlaced] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    cameraRef.current = camera;

    // Animation loop
    const animate = (timestamp, frame) => {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();

        if (hitTestSourceRequested.current === false) {
          session.requestReferenceSpace('viewer').then((referenceSpace) => {
            session.requestHitTestSource({ space: referenceSpace }).then((source) => {
              hitTestSource.current = source;
            })
          });

          session.addEventListener('end', () => {
            hitTestSourceRequested.current = false;
            hitTestSource.current = null;
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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Enable WebXR
    renderer.setAnimationLoop(animate);
    rendererRef.current = renderer;

    if (container) {
      container.appendChild(renderer.domElement);
    }

    // Add a light
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // // Load a model
    // const model = new THREE.Object3D();
    // const loader = new GLTFLoader();
    // loader.load("/models/Fish.glb", (gltf) => {
    //     model.add(gltf.scene);
    //     model.scale.set(0.1, 0.1, 0.1);
    //     model.position.set(0, 0, -1).applyMatrix4(cameraRef.current.matrixWorld); // Place model in front of camera
    //     model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

    //     scene.add(model);
    // });



    const onSelect = () => {
      if (reticleRef.current.visible) {

        //setIsPlaced(true);
        // Load a model
        const model = new THREE.Object3D();
        const loader = new GLTFLoader();
        loader.load("/models/room.glb", (gltf) => {
          model.add(gltf.scene);
          reticleRef.current.matrix.decompose(model.position, model.quaternion, model.scale);
          scene.add(model);
          isPlaced.current = true;
        });
        // const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);
        // const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
        // const mesh = new THREE.Mesh(geometry, material);
        // reticleRef.current.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
        // mesh.scale.y = Math.random() * 2 + 1;
        // scene.add(mesh);
        //setIsPlaced(true);
      }
    }

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

    //animate();

    // Try to start AR automatically
    const autoStartAR = async () => {
      if (navigator.xr) {
        try {
          const session = await navigator.xr.requestSession("immersive-ar", {
            requiredFeatures: ["hit-test", "dom-overlay"],
            domOverlay: { root: document.body },
          });

          session.addEventListener("end", () => {
            setIsAR(false);
            setEndSession(null);
            session.end();
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
  }, [setIsAR, setEndSession/*, isPlaced*/]);

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

HittestModelLiveSize.propTypes = {
  setIsAR: propTypes.func.isRequired,
  setEndSession: propTypes.func.isRequired,
}

export default HittestModelLiveSize;
