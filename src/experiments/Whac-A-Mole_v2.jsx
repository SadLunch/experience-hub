import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { ChromaKeyMaterial } from "../components/ChromaKeyShader";
// import gsap from 'gsap';

const WhacAMoleV2 = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const groupRef = useRef(null);
    const molesRef = useRef([]);
    const [score, setScore] = useState(0);
    const flowerRef = useRef(null);

    const hammerRef = useRef(null);
    const hammerMixerRef = useRef(null);
    const clockRef = useRef(new THREE.Clock());

    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
    const [gameOver, setGameOver] = useState(false);
    const timerRef = useRef(null);


    const loader = new GLTFLoader();

    const spawnMole = () => {
        // Add a "Mole" to the scene
        const moleGeometry = new THREE.PlaneGeometry(1, 1);
        // const moleMaterial = new ChromaKeyMaterial('/bonk_hand.png', 0x81ff8d, 608, 342, 0.2, 0.1, 0);
        const textureLoader = new THREE.TextureLoader();
        const imgTexture = textureLoader.load('/bonk_hand.png');
        const moleMaterial = new THREE.MeshBasicMaterial({ map: imgTexture, transparent: true, side: THREE.DoubleSide });
        const mole = new THREE.Mesh(moleGeometry, moleMaterial);

        const radius = 2; // Distance from the user (This can be changed to the value needed)
        const angle = Math.random() * Math.PI * 2; // Random angle for circular placement

        mole.position.set(
            (Math.sin(angle) * radius),
            -1.5,
            (Math.cos(angle) * radius)
        )/*.applyMatrix4(cameraRef.current.matrixWorld)*/;

        mole.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

        groupRef.current.add(mole);
        molesRef.current.push(mole);
    }

    // const spawnHammer = () => {
    //     loader.load("/models/gavel.glb", (gltf) => {
    //         const model = gltf.scene;
    //         model.name = "hammer";

    //         // Place the hammer around the user randomly
    //         const distance = THREE.MathUtils.randFloat(0.3, 0.7);
    //         const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);

    //         model.position.set(
    //             distance * Math.sin(angle),
    //             -1.5,
    //             distance * Math.cos(angle)
    //         ).applyMatrix4(cameraRef.current.matrixWorld);

    //         model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

    //         // Set a random rotation (for variety)
    //         model.rotation.x = Math.random() * 2 * Math.PI;
    //         model.rotation.y = Math.random() * 2 * Math.PI;
    //         model.rotation.z = Math.random() * 2 * Math.PI;

    //         // Scale it accordig to the model's original scale
    //         model.scale.setScalar(0.04);

    //         // Make it so the models can cast and receive shadows
    //         model.castShadow = true;
    //         model.receiveShadow = true;
    //         hammerGroupRef.current.add(model);

    //         hammerRef.current = model;
    //     });
    // };

    const loadModel = (src, refVar, name = null) => {
        loader.load(src, (gltf) => {
            refVar.current = gltf.scene;
            if (name) refVar.current.name = name;
        });
    };

    const moleLookAtPlayer = () => {
        const cameraWorldPos = new THREE.Vector3();
        cameraRef.current.getWorldPosition(cameraWorldPos);

        groupRef.current.children.forEach((mole) => {
            // Get plane's world position
            const planeWorldPos = new THREE.Vector3();
            mole.getWorldPosition(planeWorldPos);

            // Create a horizontal target (same Y as plane)
            const target = new THREE.Vector3(
                cameraWorldPos.x,
                planeWorldPos.y,
                cameraWorldPos.z
            );

            mole.lookAt(target);
        });
    };

    useEffect(() => {
        if (!session) return;

        let spawnInterval;

        const initAR = () => {
            try {
                const container = containerRef.current;

                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.xr.enabled = true; // Enable WebXR
                rendererRef.current = renderer;

                // Animation loop
                const animate = () => {
                    const delta = clockRef.current.getDelta();
                    if (hammerMixerRef.current) hammerMixerRef.current.update(delta);
                    moleLookAtPlayer();
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

                // Load all models to be used
                loadModel('/models/white_lilly.glb', flowerRef);

                spawnMole();
                spawnInterval = setInterval(() => {
                    if (molesRef.current.length < 5) {
                        spawnMole();
                    }
                }, 4000);

                timerRef.current = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            clearInterval(spawnInterval); // stop mole spawning
                            setGameOver(true);
                            window.removeEventListener("pointerdown", onTouch);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);


                window.addEventListener("pointerdown", onTouch);

                // spawnHammer();

                // Load the Hammer model
                loader.load("/models/hammer.glb", (gltf) => {
                    const model = gltf.scene;
                    model.name = "hammer";
                    model.scale.setScalar(6); // Ensure correct scale
                    model.visible = false;

                    sceneRef.current.add(model); // Add it to the scene first
                    hammerRef.current = model;

                    const mixer = new THREE.AnimationMixer(model);
                    const clip = gltf.animations[0];
                    const action = mixer.clipAction(clip);
                    action.setLoop(THREE.LoopOnce);
                    action.clampWhenFinished = true;
                    hammerMixerRef.current = mixer;
                });

                session.addEventListener('end', () => {
                    console.log("Cleaning up scene...");
                    cleanupScene();
                });
            } catch (error) {
                console.warn("Failed to initialize AR:", error);
            }
        };

        const onTouch = (event) => {
            if (gameOver) return;
            event.preventDefault();

            //const touch = event.touches[0];
            const touchX = (event.clientX / window.innerWidth) * 2 - 1;
            const touchY = -(event.clientY / window.innerHeight) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            const touchPoint = new THREE.Vector2(touchX, touchY);

            raycaster.setFromCamera(touchPoint, cameraRef.current);

            const intersects = raycaster.intersectObjects(groupRef.current.children);

            // console.log("int: ", intersects);
            // console.log("group: ", groupRef.current);

            if (intersects.length > 0) {
                const hitMole = intersects[0].object; // Get the first hit mole
                console.log("Mole hit!");

                if (hammerRef.current && hammerMixerRef.current) {
                    hammerRef.current.position.set(hitMole.position.x, hitMole.position.y+0.1, hitMole.position.z);
                    hammerRef.current.visible = true;

                    const action = hammerMixerRef.current._actions[0];
                    action.reset();
                    action.play();

                    const duration = action.getClip().duration * 1000;
                    // const duration = 1000;

                    setTimeout(() => {
                        // Load the Flower model
                        if (flowerRef.current) {
                            const flower = flowerRef.current.clone();
                            flower.position.set(hitMole.position.x, hitMole.position.y, hitMole.position.z);
                            flower.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
                            flower.scale.setScalar(3); // Ensure correct scale

                            // Add a Ring below the flower for contrast with the real-world
                            const ring = new THREE.Mesh(
                                new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
                                new THREE.MeshBasicMaterial()
                            );
                            ring.position.set(
                                flower.position.x - 0.1, // This depends on the model
                                flower.position.y - 0.01, // A bit below the flower
                                flower.position.z - 0.2 // This depends on the model
                            );

                            // ring.rotateX(-Math.PI / 2);

                            sceneRef.current.add(flower); // Add it to the scene first
                            sceneRef.current.add(ring);
                        }

                        groupRef.current.remove(hitMole);
                        molesRef.current = molesRef.current.filter(mole => mole !== hitMole);
                        setScore((prevScore) => prevScore + 1); // Increase score

                        hammerRef.current.visible = false;
                    }, duration);
                }

                // if (!hammerRef.current) return;

                // hammerRef.current.position.set(hitMole.position.x, hitMole.position.y, hitMole.position.z);
                // hammerRef.current.visible = true;



            }
        }

        const cleanupScene = () => {
            clearInterval(spawnInterval);
            clearInterval(timerRef.current);

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
            window.removeEventListener("pointerdown", onTouch);
            cleanupScene();
        }
    }, [endSession, session]);

    return (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
            {!gameOver && (
                <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "20px",
                    //transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "20px"
                }}>
                    Score: {score}
                </div>
            )}
            {!gameOver && (
                <div style={{
                    position: "absolute",
                    top: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    Time Left: {timeLeft}s
                </div>
            )}
            {gameOver && (
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
            )}
            {gameOver && (
                <button
                    onClick={endSession}
                    style={{
                        position: "absolute",
                        bottom: "40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "12px 24px",
                        fontSize: "18px",
                        background: "#ff5555",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    End Session
                </button>
            )}

        </div>
    );
};

WhacAMoleV2.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
}

export default WhacAMoleV2;
