import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const WhacAMoleV1 = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const groupRef = useRef(null);
    const molesRef = useRef([]);
    const [score, setScore] = useState(0);
    const hammerRef = useRef(null);
    //const controllerRef = useRef(null);

    const spawnMole = () => {
        // Add a "Mole" to the scene
        const moleGeometry = new THREE.SphereGeometry(0.2, 32, 32);
        const moleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const mole = new THREE.Mesh(moleGeometry, moleMaterial);

        const radius = 1; // Distance from the user
        const angle = Math.random() * Math.PI * 2; // Random angle for circular placement

        mole.position.set(
            (Math.sin(angle) * radius),
            -1,
            (Math.cos(angle) * radius)
        )/*.applyMatrix4(cameraRef.current.matrixWorld)*/;

        mole.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

        groupRef.current.add(mole);
        molesRef.current.push(mole);

        return mole;
    }

    useEffect(() => {
        if (!session) return;

        const molesBoundingBox = new Map();
        let spawnInterval;

        const initAR = () => {
            try {
                const container = containerRef.current;

                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.xr.enabled = true; // Enable WebXR
                rendererRef.current = renderer;

                // Animation loop
                const animate = () => {
                    if (cameraRef.current && hammerRef.current) {
                        const camera = cameraRef.current;
                        const hammer = hammerRef.current;
                
                        // Update hammer's position & rotation to follow the camera
                        hammer.position.copy(camera.position);
                        hammer.quaternion.copy(camera.quaternion);
                
                        // Offset hammer slightly in front of the camera
                        hammer.translateZ(-0.5);
                        // hammer.translateY(-0.2);
                    }
                    checkHammerCollision();
                    renderer.render(scene, camera);
                };

                // Initialize Three.js scene
                const scene = new THREE.Scene();
                sceneRef.current = scene;

                const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
                cameraRef.current = camera;

                rendererRef.current.setAnimationLoop(animate);
                rendererRef.current.xr.setReferenceSpaceType("local");
                rendererRef.current.xr.setSession(session);

                if (container) {
                    container.appendChild(renderer.domElement);
                }

                // Add a light
                const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
                scene.add(light);

                const group = new THREE.Group();
                groupRef.current = group;
                scene.add(group);

                const newMole = spawnMole();
                addBoundingBox(newMole);
                spawnInterval = setInterval(() => {
                    if (molesRef.current.length < 5) {
                        const newMole = spawnMole();
                        addBoundingBox(newMole);
                    }
                }, 4000);

                //window.addEventListener("pointerdown", onTouch);
            
                // Load a model
                //const model = new THREE.Object3D();
                const loader = new GLTFLoader();
                loader.load("/models/gavel_modified.glb", (gltf) => {
                    const model = gltf.scene;
                    model.name = "hammer";
                    model.position.set(0, 0, -0.2);
                    model.scale.setScalar(0.3); // Ensure correct scale

                    // This is to prevent duplicate hammers and to make the
                    // camera pick up the correct hammer.
                    scene.children.map((child) => {
                        if (child.name === model.name) {
                            child.geometry.dispose();
                            child.material.dispose();
                            sceneRef.current.remove(child);
                        }
                    });
                    sceneRef.current.add(model); // Add it to the scene first
                    hammerRef.current = model;
                }); 

                // animate();

                // // This fixed the "mole" not rendering problem
                // session.requestAnimationFrame(function onXRFrame(time, frame) {
                //     let session = frame.session;
                //     session.requestAnimationFrame(onXRFrame);
                //     checkHammerCollision();
                //     renderer.render(scene, camera);
                // })

                session.addEventListener("inputsourceschange", (event) => {
                    console.log("XR Input Sources Changed:", event.session.inputSources);
                });

                session.addEventListener('end', () => {
                    console.log("Cleaning up scene...");
                    cleanupScene();
                });
            } catch (error) {
                console.warn("Failed to initialize AR:", error);
            }
        };

        const addBoundingBox = (mole) => {
            if (!molesRef) return;

            const moleBox = new THREE.Box3().setFromObject(mole);
            molesBoundingBox.set(mole, moleBox);
            const helper = new THREE.Box3Helper(moleBox, 0x00ff00);
            sceneRef.current.add(helper);
        }

        const checkHammerCollision = () => {
            if (!hammerRef.current) return;

            const hammerBox = new THREE.Box3().setFromObject(hammerRef.current);

            // Loop through cached bounding boxes
            for (let [mole, moleBox] of molesBoundingBox.entries()) {
                if (hammerBox.intersectsBox(moleBox)) {
                    console.log("Mole hit with hammer!");

                    // Remove mole from scene & cache
                    groupRef.current.remove(mole);
                    molesBoundingBox.delete(mole);
                    molesRef.current = molesRef.current.filter(mole => mole !== mole);
                    setScore((prevScore) => prevScore + 1); // Increase score

                    break; // Stop after hitting one mole
                }
            }
        }

        // const onTouch = (event) => {
        //     event.preventDefault();

        //     //const touch = event.touches[0];
        //     const touchX = (event.clientX / window.innerWidth) * 2 - 1;
        //     const touchY = -(event.clientY / window.innerHeight) * 2 + 1;

        //     const raycaster = new THREE.Raycaster();
        //     const touchPoint = new THREE.Vector2(touchX, touchY);

        //     raycaster.setFromCamera(touchPoint, cameraRef.current);

        //     const intersects = raycaster.intersectObjects(groupRef.current.children);

        //     console.log("int: ", intersects);
        //     console.log("group: ", groupRef.current);

        //     if (intersects.length > 0) {
        //         const hitMole = intersects[0].object; // Get the first hit mole
        //         console.log("Mole hit!");
        //         groupRef.current.remove(hitMole);
        //         molesRef.current = molesRef.current.filter(mole => mole !== hitMole);
        //         setScore((prevScore) => prevScore + 1); // Increase score
        //     }
        // }

        const cleanupScene = () => {
            clearInterval(spawnInterval);

            if (sceneRef.current) {
                sceneRef.current.children.forEach((object) => {
                    if (!object.isLight) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) object.material.dispose();
                        sceneRef.current.remove(object);
                    }
                });
            }

            molesRef.current = [];
        };

        initAR();

        return () => {
            //window.removeEventListener("touchstart", onTouch);
            cleanupScene();
        }
    }, [endSession, session]);

    return (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
            <div style={{
                position: "absolute",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "20px"
            }}>
                Score: {score}
            </div>
        </div>
    );
};

WhacAMoleV1.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
}

export default WhacAMoleV1;
