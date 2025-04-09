import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { XRControllerModelFactory } from "three/examples/jsm/Addons.js";
// import { ChromaKeyMaterial } from "../components/ChromaKeyShader";

const raycaster = new THREE.Raycaster();

const WhacAMoleV3New = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controllerRef = useRef(null);

    const groupRef = useRef(null);
    const hammerRef = useRef(null);
    const hitBoxGroupRef = useRef(null);

    const groupMoleRef = useRef(null);
    const molesRef = useRef([]);

    const groupFlowerRef = useRef(null);
    const flowerRef = useRef(null);

    const hasHammerLoaded = useRef(false);

    const instructionStepRef = useRef(0);
    const [instructionStep, setIntructionStep] = useState(0);
    const hasSeenHammer = useRef(false);
    const instructionMoleHit = useRef(false);

    const timerRef = useRef(null);
    const [timeLeft, setTimeLeft] = useState(120);
    const gameStartedRef = useRef(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const loader = new GLTFLoader();

    const updateGameState = () => {
        hasHammerLoaded.current = false;
        instructionStepRef.current = null;
        setIntructionStep(null);
        gameStartedRef.current = true;
        setGameStarted(true);
    }

    const nextInstructionStep = (step) => {
        setIntructionStep(step);
        instructionStepRef.current = step;
    }

    const loadModel = (src, refVar, name = null, onLoad = null) => {
        loader.load(src, (gltf) => {
            refVar.current = gltf.scene;
            if (name) refVar.current.name = name;
            if (onLoad) onLoad();
        });
    };

    const spawnHammer = () => {
        if (!hammerRef.current || !cameraRef.current || !groupRef.current) return;

        const hammer = hammerRef.current.clone();
        hammer.name = "hammer";

        hammer.position.set(-0.5, 0, -0.7).applyMatrix4(cameraRef.current.matrixWorld);

        hammer.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

        // Set a random rotation (for variety)
        // model.rotation.x = Math.random() * 2 * Math.PI;
        // model.rotation.y = Math.random() * 2 * Math.PI;
        // model.rotation.z = Math.random() * 2 * Math.PI;

        // Scale it accordig to the model's original scale
        hammer.scale.setScalar(0.3);

        // Make it so the models can cast and receive shadows
        hammer.castShadow = true;
        hammer.receiveShadow = true;

        // Create the hitbox
        const hitBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 1, 0.4),
            new THREE.MeshBasicMaterial({ visible: false })
        );
        //hitBox.scale.setScalar(5)

        // Position it correctly
        hitBox.position.set(-0.5, 0, -1);

        // Add it to the hammer
        hitBoxGroupRef.current.add(hitBox);

        // Add hammer to scene
        groupRef.current.add(hammer);
        hammerRef.current = hammer;
        hasHammerLoaded.current = true;
    };

    const spawnMole = (v = null) => {
        // Add a "Mole" to the scene
        const moleGeometry = new THREE.PlaneGeometry(1, 1);
        // const moleMaterial = new ChromaKeyMaterial('/bonk_hand.png', 0x81ff8d, 608, 342, 0.2, 0.1, 0);
        const textureLoader = new THREE.TextureLoader();
        const imgTexture = textureLoader.load('/bonk_hand.png');
        const moleMaterial = new THREE.MeshBasicMaterial({ map: imgTexture, transparent: true, side: THREE.DoubleSide });
        const mole = new THREE.Mesh(moleGeometry, moleMaterial);

        if (v) {
            mole.position.copy(v);
        } else {
            let canPlace = false;

            while (!canPlace) {
                const radius = THREE.MathUtils.randFloat(3, 5); // Distance from the user (This can be changed to the value needed)
                const angle = Math.random() * Math.PI * 2; // Random angle for circular placement

                const vectorMole = new THREE.Vector3(
                    (Math.sin(angle) * radius),
                    -3.4,
                    (Math.cos(angle) * radius)
                );
                if (groupMoleRef.current.children.length > 0) {
                    for (const mole of groupMoleRef.current.children) {
                        if (vectorMole.distanceTo(mole.position) > 1) {
                            canPlace = true;
                        } else {
                            canPlace = false;
                            break;
                        }
                    }
                } else {
                    canPlace = true;
                }

                if (canPlace) mole.position.set(vectorMole.x, vectorMole.y, vectorMole.z);
            }
        }

        mole.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

        groupMoleRef.current.add(mole);
        molesRef.current.push(mole);
        animateMoleRise(mole);
    };

    const animateMoleRise = (mole, duration = 1) => {
        const startY = -3.4;
        const endY = -1.4;

        const startTime = performance.now();

        const animate = () => {
            const elapsed = (performance.now() - startTime) / 1000;
            const t = Math.min(elapsed / duration, 1);
            const eased = t * t * (3 - 2 * t);

            mole.position.y = THREE.MathUtils.lerp(startY, endY, eased);

            if (t < 1) requestAnimationFrame(animate);
        };

        animate();
    }

    const moleLookAtPlayer = () => {
        const cameraWorldPos = new THREE.Vector3();
        cameraRef.current.getWorldPosition(cameraWorldPos);

        groupMoleRef.current.children.forEach((mole) => {
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

    const getIntersectionsHammer = (controller) => {
        controller.updateMatrixWorld();

        raycaster.setFromXRController(controller);

        return raycaster.intersectObjects(groupRef.current.children);
    };

    const getIntersectionsMole = (controller) => {
        controller.updateMatrixWorld();

        raycaster.setFromXRController(controller);

        return raycaster.intersectObjects(groupMoleRef.current.children);
    };

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
                        flower.scale.setScalar(0); // Ensure correct scale

                        // Add a Ring below the flower for contrast with the real-world
                        const ring = new THREE.Mesh(
                            new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
                            new THREE.MeshBasicMaterial()
                        );
                        ring.position.set(
                            flower.position.x, // This depends on the model
                            flower.position.y, // A bit below the flower
                            flower.position.z // This depends on the model
                        );

                        // ring.rotateX(-Math.PI / 2);

                        function animateFlowerGrowth(flower, duration = 1, targetScale = 6) {
                            const startTime = performance.now();
                        
                            function animate() {
                                const elapsed = (performance.now() - startTime) / 1000;
                                const t = Math.min(elapsed / duration, 1);
                                const eased = t * t * (3 - 2 * t); // easeInOut
                        
                                const scale = targetScale * eased;
                                flower.scale.setScalar(scale);
                        
                                if (t < 1) requestAnimationFrame(animate);
                            }
                        
                            animate();
                        }

                        groupFlowerRef.current.add(flower); // Add it to the scene first
                        groupFlowerRef.current.add(ring);

                        animateFlowerGrowth(flower);
                    }

                    groupMoleRef.current.remove(objectMole);
                    molesRef.current = molesRef.current.filter(mole => mole !== objectMole);
                    if (gameStartedRef.current) setScore((prevScore) => prevScore + 1); // Increase score

                    if (instructionStepRef.current === 1) {
                        instructionMoleHit.current = true;
                        // next step
                        nextInstructionStep(2);

                        setTimeout(() => {
                            // clear groups
                            groupRef.current.clear();
                            groupMoleRef.current.clear();
                            groupFlowerRef.current.clear();

                            // next step (message right before starting game)
                            nextInstructionStep(3);
                        }, 3500);
                    }
                    updatePosition(previousPosition);
                }, duration);

            }

            controller.userData.selected = undefined;
        }
    }

    const activateControllers = () => {
        controllerRef.current.addEventListener('selectstart', onSelectStart);
        controllerRef.current.addEventListener('selectend', onSelectEnd);
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

                const hitBoxGroup = new THREE.Group();
                scene.add(hitBoxGroup)
                hitBoxGroupRef.current = hitBoxGroup;

                const groupMole = new THREE.Group();
                scene.add(groupMole);
                groupMoleRef.current = groupMole;

                const groupFlower = new THREE.Group();
                scene.add(groupFlower);
                groupFlowerRef.current = groupFlower;

                // Load all models to be used
                loadModel('/models/white_lilly.glb', flowerRef);
                loadModel('/models/gavel_modified.glb', hammerRef, null, () => {
                    if (!hasHammerLoaded.current) {
                        spawnHammer();
                    }
                });

                // Add controllers to be able to move the fishes
                const controller = renderer.xr.getController(0);
                scene.add(controller);
                controllerRef.current = controller;

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

                

                const animate = () => {
                    // console.log("instruction:", instructionStepRef.current);
                    // console.log("mole hit:", instructionMoleHit.current);
                    // console.log("hammer loaded:", hasHammerLoaded.current);
                    if (instructionStepRef.current === 0) {
                        const r = new THREE.Raycaster();
                        r.setFromCamera({ x: 0, y: 0 }, cameraRef.current);
                        const intersections = r.intersectObjects(hitBoxGroupRef.current.children);
                        if (intersections.length > 0) {
                            hasSeenHammer.current = true;
                            console.log("I have seen the hammer!!!");
                            nextInstructionStep(1);
                            hitBoxGroupRef.current.clear();
                            activateControllers();
                            spawnMole(new THREE.Vector3(0, -3.4, -4));
                        }
                    }
                    moleLookAtPlayer();
                    renderer.render(scene, camera);
                }

                renderer.setAnimationLoop(animate);

                session.addEventListener('end', () => {
                    console.log('Cleaning up scene...');
                    cleanupScene();
                });

                nextInstructionStep(0);

                const handleTap = () => {
                    if (instructionStepRef.current === 3) {
                        updateGameState();
                        if (!hasHammerLoaded.current) {
                            spawnHammer();
                            hasHammerLoaded.current = true; // Set flag so it doesn't load again
                        }
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
                                    setGameStarted(null);
                                    controllerRef.current.removeEventListener("selectstart", onSelectStart);
                                    controllerRef.current.removeEventListener("selectend", onSelectEnd);
                                    controllerRef.current.clear();
                                    groupRef.current.clear();
                                    return 0;
                                }
                                return prev - 1;
                            });
                        }, 1000);
                    }
                };



                window.addEventListener('click', handleTap);

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
            {instructionStep === 0 && (
                <div className="absolute w-5/6 top-20 left-[50%] translate-x-[-50%] bg-black/70 text-white p-10 rounded-md text-xl font-semibold text-center">
                    Look around and find the hammer
                </div>
            )}
            {instructionStep === 1 && (
                <div className="absolute w-5/6 top-20 left-[50%] translate-x-[-50%] bg-black/70 text-white p-10 rounded-md text-xl font-semibold text-center">
                    Drag the hammer in front of the salute to hit it
                </div>
            )}
            {instructionStep === 2 && (
                <div className="absolute w-5/6 top-20 left-[50%] translate-x-[-50%] bg-black/70 text-white p-10 rounded-md text-xl font-semibold text-center">
                    Good Job!
                </div>
            )}
            {instructionStep === 3 && (
                <div className="absolute w-5/6 top-20 left-[50%] translate-x-[-50%] bg-black/70 text-white p-10 rounded-md text-xl font-semibold text-center">
                    <div>You are ready now</div>
                    <div>Tap to start the game</div>
                </div>
            )}

            {gameStarted && (
                <div style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "20px",
                    // transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    Score: {score}
                </div>
            )}
            {gameStarted && (
                <div style={{
                    position: "absolute",
                    bottom: "10px",
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

WhacAMoleV3New.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
}

export default WhacAMoleV3New;
