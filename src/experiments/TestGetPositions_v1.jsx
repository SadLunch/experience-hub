import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import { FontLoader, TextGeometry } from 'three/examples/jsm/Addons.js';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const raycaster = new THREE.Raycaster();

const TestGetPositions = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);

    const [isAligned, setIsAligned] = useState(false);

    const planeRef = useRef(null);

    const controllerRef = useRef(null);

    const fontLoader = new FontLoader();

    const onSelectStart = () => {

        controllerRef.current.updateMatrixWorld();

        raycaster.setFromXRController(controllerRef.current);

        const intersected = raycaster.intersectObjects([planeRef.current])
        if (intersected.length > 0) {
            const p = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 32, 32),
                new THREE.MeshBasicMaterial({ color: 0xffff00 })
            );
            p.position.copy(intersected[0].point);
            sceneRef.current.add(p);
            fontLoader.load('/fonts/Bluetags_Regular_1.json', (font) => {
                const x = intersected[0].point.x.toFixed(2);
                const y = intersected[0].point.y.toFixed(2);
                const z = intersected[0].point.z.toFixed(2);
                const t = new THREE.Mesh(
                    new TextGeometry(`${x} ${y} ${z}`, {
                        font: font,
                        size: 1,
                        depth: 0.01,
                    }),
                    new THREE.MeshStandardMaterial({ color: 0xffffff })
                );
                t.geometry.center();
                t.position.set(
                    intersected[0].point.x,
                    intersected[0].point.y+1,
                    intersected[0].point.z,
                )
                sceneRef.current.add(t);
            })
        }
    }

    const alignScene = () => {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({ color: 0x999999, transparent: true, opacity: 0.5 })
        )
        plane.position.set(0, 0, -100).applyMatrix4(cameraRef.current.matrixWorld);
        plane.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
        sceneRef.current.add(plane);
        planeRef.current = plane;
        
        // Add controllers to be able to move the fishes
        const controller = rendererRef.current.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        sceneRef.current.add(controller);
        controllerRef.current = controller;
        setIsAligned(true);
    }

    const initAR = () => {
        const container = containerRef.current;

        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        rendererRef.current = renderer;

        // Need this to make AR work (DONT FORGET THIS)
        rendererRef.current.xr.setReferenceSpaceType("local");
        rendererRef.current.xr.setSession(session);

        if (container) container.appendChild(renderer.domElement);

        // Add a light
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        //Groups
        const positions = new THREE.Group();
        scene.add(positions);

        


        // Animation Loop
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });


    };

    useEffect(() => {
        if (!session) return;

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
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
            {!isAligned && (
            <button
            onClick={alignScene}
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 20px",
              fontSize: "16px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              zIndex: 1000, // Ensure it's above the AR scene
            }}
          >
            Align Scene
          </button>
        )}
        </div>
    );
}

TestGetPositions.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default TestGetPositions;