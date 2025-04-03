import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { XRControllerModelFactory } from "three/examples/jsm/Addons.js";
// import { ChromaKeyMaterial } from "../components/ChromaKeyShader";
// import gsap from 'gsap';

const raycaster = new THREE.Raycaster();

const WhacAMoleV3 = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const groupRef = useRef(null);
    const group2Ref = useRef(null);
    const molesRef = useRef([]);
    const flowerRef = useRef(null);

    const hammerRef = useRef(null);
    const hasLoadedHammer = useRef(null);
    //   const controlsRef = useRef(null);

    // Instruction Stuff
    // const [isMessage1, setIsMessage1] = useState(true);
    // const [isMessage2, setIsMessage2] = useState(false);
    // const [isMessage3, setIsMessage3] = useState(false);
    // const [isMessage4, setIsMessage4] = useState(false);
    // const [isMessage5, setIsMessage5] = useState(false);

    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); // 60 
    const [gameOver, setGameOver] = useState(false);
    const timerRef = useRef(null);

    const loader = new GLTFLoader();

    const spawnHammer = () => {
        loader.load("/models/gavel.glb", (gltf) => {
            const model = gltf.scene;
            // model.name = "hammer";

            // Place the hammer around the user randomly
            const distance = THREE.MathUtils.randFloat(0.3, 0.7);
            const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);

            model.position.set(
                distance * Math.sin(angle),
                -1.5,
                distance * Math.cos(angle)
            ).applyMatrix4(cameraRef.current.matrixWorld);

            model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

            // Set a random rotation (for variety)
            // model.rotation.x = Math.random() * 2 * Math.PI;
            // model.rotation.y = Math.random() * 2 * Math.PI;
            // model.rotation.z = Math.random() * 2 * Math.PI;

            // Scale it accordig to the model's original scale
            model.scale.setScalar(0.04);

            // Make it so the models can cast and receive shadows
            model.castShadow = true;
            model.receiveShadow = true;
            groupRef.current.add(model);

            hammerRef.current = model;
        });
    }

    const spawnMole = () => {
        // Add a "Mole" to the scene
        const moleGeometry = new THREE.PlaneGeometry(1, 1);
        // const moleMaterial = new ChromaKeyMaterial('/bonk_hand.png', 0x81ff8d, 608, 342, 0.2, 0.1, 0);
        const textureLoader = new THREE.TextureLoader();
        const imgTexture = textureLoader.load('/bonk_hand.png');
        const moleMaterial = new THREE.MeshBasicMaterial({ map: imgTexture, transparent: true, side: THREE.DoubleSide });
        const mole = new THREE.Mesh(moleGeometry, moleMaterial);

        const radius = THREE.MathUtils.randInt(2, 4); // Distance from the user (This can be changed to the value needed)
        const angle = Math.random() * Math.PI * 2; // Random angle for circular placement

        mole.position.set(
            (Math.sin(angle) * radius),
            -1.5,
            (Math.cos(angle) * radius)
        )/*.applyMatrix4(cameraRef.current.matrixWorld)*/;

        mole.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

        group2Ref.current.add(mole);
        molesRef.current.push(mole);
    }

    const moleLookAtPlayer = () => {
        const cameraWorldPos = new THREE.Vector3();
        cameraRef.current.getWorldPosition(cameraWorldPos);

        group2Ref.current.children.forEach((mole) => {
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

    const loadModel = (src, refVar, name = null) => {
        loader.load(src, (gltf) => {
            refVar.current = gltf.scene;
            if (name) refVar.current.name = name;
        });
    };

    useEffect(() => {
        if (!session) return;

        let spawnInterval;

        const initAR = () => {
            try {
                const container = containerRef.current;

                // Initialize Renderer
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                renderer.xr.enabled = true;
                rendererRef.current = renderer;

                // Need this to make AR work (DONT FORGET THIS)
                rendererRef.current.xr.setReferenceSpaceType("local");
                rendererRef.current.xr.setSession(session);

                if (container) container.appendChild(renderer.domElement);

                // Initialize Scene
                const scene = new THREE.Scene();
                sceneRef.current = scene;

                // Initialize Camera
                const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
                cameraRef.current = camera;

                // Add a Light to the Scene
                const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
                scene.add(light);

                // Add Directional Light (This is so the objects can cast shadows in the Scene)
                const dLight = new THREE.DirectionalLight(0xffffff, 3);
                dLight.position.set(0, 6, 0);
                dLight.castShadow = true;
                dLight.shadow.camera.top = 3;
                dLight.shadow.camera.bottom = -3;
                dLight.shadow.camera.right = 3;
                dLight.shadow.camera.left = -3;
                dLight.shadow.mapSize.set(4096, 4096);
                scene.add(dLight);

                // Add a floor the shadows can be cast upon
                const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
                const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5, blending: THREE.CustomBlending, transparent: false });
                const floor = new THREE.Mesh(floorGeometry, floorMaterial);
                floor.position.set(0, -1.6, 0); // Average height the device is from the floor
                floor.rotateX(-Math.PI / 2);
                floor.receiveShadow = true;
                scene.add(floor);

                // Initialize Group (Where movable objects will be put)
                const group = new THREE.Group();
                scene.add(group);
                groupRef.current = group;

                const group2 = new THREE.Group();
                scene.add(group2);
                group2Ref.current = group2;

                // Load all models to be used
                loadModel('/models/white_lilly.glb', flowerRef);

                // Spawn the hammer
                if (!hasLoadedHammer.current) {
                    spawnHammer();
                    hasLoadedHammer.current = true; // Set flag so it doesn't load again
                }

                spawnMole();
                spawnInterval = setInterval(() => {
                    if (molesRef.current.length < 5) {
                        spawnMole();
                    }
                }, 4000);

                // Functions for the controllers
                const onSelectStart = (event) => {
                    const controller = event.target;

                    const intersections = getIntersectionsHammer(controller);

                    if (intersections.length > 0) {
                        const intersection = intersections[0];

                        const object = intersection.object.parent;
                        object.children.map((child) => {
                            child.material.emissive.b = 0;
                        });
                        controller.attach(object);

                        controller.userData.selected = object;
                    }
                    controller.userData.targetRayMode = event.target.targetRayMode;
                };

                const onSelectEnd = (event) => {
                    const controller = event.target;

                    if (controller.userData.selected !== undefined) {

                        const object = controller.userData.selected;
                        object.children.map((child) => {
                            child.material.emissive.b = 0;
                        });
                        groupRef.current.attach(object);

                        const intersections = getIntersectionsMole(controller);

                        if (intersections.length > 0) {
                            const intersection = intersections[0];
                            const objectMole = intersection.object;

                            const previousPosition = new THREE.Vector3();
                            previousPosition.copy(object.position);
                            const targetVector = new THREE.Vector3(objectMole.position.x, objectMole.position.y + 0.3, objectMole.position.z);

                            function updatePosition(target) {
                                const totalSteps = 500 / 16;
                                let step = 0;

                                function update(t) {
                                    step++;
                                    const time = step / totalSteps;
                                    object.position.lerp(t, time);
                                    if (step < totalSteps) {
                                        setTimeout(() => update(t), 16);
                                    } else {
                                        object.position.copy(t); // Ensure exact position at end
                                    }
                                }
                                update(target)
                            }
                            updatePosition(targetVector);

                            // Do the deed (Smack)
                            const duration = 1000;

                            setTimeout(() => {
                                // Load the Flower model
                                if (flowerRef.current) {
                                    const flower = flowerRef.current.clone();
                                    flower.position.copy(objectMole.position);
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

                                group2Ref.current.remove(objectMole);
                                molesRef.current = molesRef.current.filter(mole => mole !== objectMole);
                                setScore((prevScore) => prevScore + 1); // Increase score
                                updatePosition(previousPosition);
                            }, duration);

                            // Go back to previous position
                            


                        }

                        controller.userData.selected = undefined;
                    }
                };

                // Add controllers to be able to move the fishes
                const controller = renderer.xr.getController(0);
                controller.addEventListener('selectstart', onSelectStart);
                controller.addEventListener('selectend', onSelectEnd);
                scene.add(controller);

                const controllerModelFactory = new XRControllerModelFactory();

                const controllerGrip = renderer.xr.getControllerGrip(0);
                controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
                scene.add(controllerGrip);

                // Add lines to intersect with objects
                const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

                const line = new THREE.Line(geometry);
                line.name = 'line';
                line.scale.z = 5;

                controller.add(line.clone());

                timerRef.current = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            clearInterval(spawnInterval); // stop mole spawning
                            setGameOver(true);
                            controller.removeEventListener("selectstart", onSelectStart);
                            controller.removeEventListener("selectend", onSelectEnd)
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                

                const getIntersectionsHammer = (controller) => {
                    controller.updateMatrixWorld();

                    raycaster.setFromXRController(controller);

                    return raycaster.intersectObjects(group.children);
                };

                const getIntersectionsMole = (controller) => {
                    controller.updateMatrixWorld();

                    raycaster.setFromXRController(controller);

                    return raycaster.intersectObjects(group2.children);
                };

                const animate = () => {
                    // const r = new THREE.Raycaster();
                    // r.setFromCamera({x: 0, y: 0}, cameraRef.current);
                    // const intersections = r.intersectObjects(groupRef.current.children);
                    // if (intersections.length > 0) {
                    //     console.log(intersections[0].object);
                    // }
                    moleLookAtPlayer();
                    renderer.render(scene, camera);
                }

                renderer.setAnimationLoop(animate);

                session.addEventListener('end', () => {
                    console.log('Cleaning up scene...');
                    cleanupScene();
                });
            } catch (error) {
                console.log("Failed to initialize AR:", error);
            }
        };

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
        };

        initAR();

        return () => {
            cleanupScene();
        }
    }, [session, endSession])

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

WhacAMoleV3.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
}

export default WhacAMoleV3;
