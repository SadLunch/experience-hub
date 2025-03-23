import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const HittestSurfaceNew = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const hitTestSource = useRef(null);
    const hitTestSourceRequested = useRef(false);
    const controllerRef = useRef(null);
    const reticleRef = useRef(null);

    useEffect(() => {
        if (!session) return;

        const initAR = () => {
            try {
                const container = containerRef.current;

                // Initialize Scene
                const scene = new THREE.Scene();
                sceneRef.current = scene;

                // Initialize Camera
                const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
                cameraRef.current = camera;

                // Initialize Renderer
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.xr.enabled = true;
                rendererRef.current = renderer;

                // Need this to make AR work (DONT FORGET THIS)
                rendererRef.current.xr.setReferenceSpaceType("local");
                rendererRef.current.xr.setSession(session);

                // Append Renderer to website container
                if (container) container.appendChild(renderer.domElement);

                const animate = () => {
                    const frame = rendererRef.current.xr.getFrame();
                    if (frame) {
                        const referenceSpace = renderer.xr.getReferenceSpace();
                        const xrSession = renderer.xr.getSession();

                        if (hitTestSourceRequested.current === false) {
                            xrSession.requestReferenceSpace('viewer').then((referenceSpace) => {
                                xrSession.requestHitTestSource({ space: referenceSpace }).then((source) => {
                                    hitTestSource.current = source;
                                });
                            });
                            hitTestSourceRequested.current = true;
                        }

                        if (hitTestSource.current) {
                            const hitTestResults = frame.getHitTestResults(hitTestSource.current);

                            if (hitTestResults.length) {
                                const hit = hitTestResults[0];
                                reticleRef.current.visible = true;
                                reticleRef.current.matrix.fromArray(hit.getPose(referenceSpace).transform.matrix);
                            } else {
                                reticleRef.current.visible = true;
                            }
                        }
                    }
                    renderer.render(scene, camera);
                };

                renderer.setAnimationLoop(animate);

                // Add a Light to the Scene
                const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
                scene.add(light);

                const onSelect = () => {
                    if (reticleRef.current.visible) {
                        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(0, 0.1, 0);
                        const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
                        const mesh = new THREE.Mesh(geometry, material);
                        reticleRef.current.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
                        mesh.scale.y = Math.random() * 2 + 1;
                        scene.add(mesh);
                    }
                };

                controllerRef.current = renderer.xr.getController(0);
                controllerRef.current.addEventListener('select', onSelect);
                scene.add(controllerRef.current);

                reticleRef.current = new THREE.Mesh(
                    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
                    new THREE.MeshBasicMaterial()
                );
                reticleRef.current.matrixAutoUpdate = false;
                reticleRef.current.visible = false;
                scene.add(reticleRef.current);

                // Add event for end of XRSession
                session.addEventListener('end', () => {
                    hitTestSourceRequested.current = false;
                    hitTestSource.current = null;
                    console.log('Cleaning up scene...');
                    cleanupScene();
                })
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

HittestSurfaceNew.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
}

export default HittestSurfaceNew;
