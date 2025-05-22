import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const raycaster = new THREE.Raycaster();

const TestGetPositionsV2 = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);

    const [isAligned, setIsAligned] = useState(false);

    const planeRef = useRef(null);

    const controllerRef = useRef(null);

    const pathsGroupRef = useRef(null);

    const paused = useRef(false);
    const [isPaused, setIsPaused] = useState(false);

    const paths = [];
    const firstTouch = useRef(false);
    const startLine = useRef(null);
    const endLine = useRef(null);

    const selectedObject = useRef(null);

    let gui;

    

    const pausePathPlacement = () => {
        if (isPaused) {
            setIsPaused(false);
            paused.current = false;
        } else {
            setIsPaused(true);
            paused.current = true;
        }
    }

    const onSelectStart = () => {

        controllerRef.current.updateMatrixWorld();

        raycaster.setFromXRController(controllerRef.current);

        if (!paused.current) {
            const intersected = raycaster.intersectObjects([planeRef.current])
            if (intersected.length > 0) {
                if (!firstTouch.current) {
                    const start = new THREE.Mesh(
                        new THREE.PlaneGeometry(1.5, 2.5),
                        new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
                    );
                    start.position.copy(intersected[0].point);

                    start.userData.start = intersected[0].point;
                    start.userData.end = new THREE.Vector3();
                    start.userData.index = "start";
                    
                    pathsGroupRef.current.add(start);
                    paths.push(start);
                    firstTouch.current = true;
                } else {
                    if (!startLine.current) {
                        startLine.current = intersected[0].point;
                    } else if (!endLine.current) {
                        endLine.current = intersected[0].point;
                    }

                    if (startLine.current && endLine.current) {
                        const direction = new THREE.Vector3().subVectors(startLine.current, endLine.current);
                        const length = direction.length();
                        const center = new THREE.Vector3().addVectors(startLine.current, endLine.current).multiplyScalar(0.5);

                        const geometry = new THREE.PlaneGeometry(0.6, length + 0.6);
                        const material = new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide });
                        const path = new THREE.Mesh(geometry, material);

                        path.position.copy(center);

                        path.userData.start = startLine.current;
                        path.userData.end = endLine.current;
                        path.userData.index = paths.length;

                        const up = new THREE.Vector3(0, 1, 0);
                        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());

                        path.setRotationFromQuaternion(quaternion);

                        pathsGroupRef.current.add(path);
                        paths.push(path);

                        // Reset the start and end of the paths (for next paths)
                        startLine.current = endLine.current.clone();
                        endLine.current = null;
                    }
                }
            }

        } else {
            const intersected = raycaster.intersectObjects(pathsGroupRef.current.children);
            if (intersected.length > 0) {
                const object = intersected[0].object;
                object.children.map((child) => {
                    child.material.emissive.r = 1;
                })
                selectedObject.current = intersected[0].object;
                updateGUI();
            }
        }

    }

    const alignScene = () => {
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            new THREE.MeshBasicMaterial({ color: 0x999999, transparent: true, opacity: 0.5 })
        )
        plane.position.set(0, 0, -9);
        sceneRef.current.add(plane);
        planeRef.current = plane;

        // Add controllers to be able to move the fishes
        const controller = rendererRef.current.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        sceneRef.current.add(controller);
        controllerRef.current = controller;
        setIsAligned(true);
        initGUI();
    }

    const initGUI = () => {
        if (!planeRef.current) return;

        if (gui) gui.destroy();

        const paramsBack = {
            x: planeRef.current.position.x,
            y: planeRef.current.position.y,
            z: planeRef.current.position.z
        };

        gui = new GUI();

        gui.title("Background plane");

        gui.add(paramsBack, 'x', - 50, 50).onChange(val => {
            planeRef.current.position.setX(val);
        });
        gui.add(paramsBack, 'y', - 50, 50).onChange(val => {
            planeRef.current.position.setY(val);
        });
        gui.add(paramsBack, 'z', - 100, 2).onChange(val => {
            planeRef.current.position.setZ(val);
        });

        gui.open();
    }

    const updateGUI = () => {
        if (!selectedObject.current) return;

        if (gui) gui.destroy();

        const paramsPath = {
            start: {
                x: selectedObject.current.userData.start.x,
                y: selectedObject.current.userData.start.y
            },
            end: {
                x: selectedObject.current.userData.end.x,
                y: selectedObject.current.userData.end.y
            },
        };

        gui = new GUI();

        gui.title(`Path ${selectedObject.current.userData.index}`);

        const startFolder = gui.addFolder("Start");

        startFolder.add(paramsPath.start, 'x', - 50, 50).onChange(val => {
            selectedObject.current.userData.start.setX(val);
        });
        startFolder.add(paramsPath.start, 'y', - 50, 50).onChange(val => {
            selectedObject.current.userData.start.setY(val);
        });

        const endFolder = gui.addFolder("End");

        endFolder.add(paramsPath.end, 'x', - 50, 50).onChange(val => {
            selectedObject.current.userData.end.setX(val);
        });
        endFolder.add(paramsPath.end, 'y', - 50, 50).onChange(val => {
            selectedObject.current.userData.end.setY(val);
        });
    }

    const updatePath = () => {
        if (!selectedObject.current) return;

        const start = selectedObject.current.userData.start;
        const end = selectedObject.current.userData.end;

        const direction = new THREE.Vector3().subVectors(start, end);
        const length = direction.length();
        const center = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        selectedObject.current.geometry.parameters.height = length + 0.6;

        selectedObject.current.position.copy(center);

        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());

        selectedObject.current.setRotationFromQuaternion(quaternion);
    }

    const initAR = () => {
        const container = containerRef.current;

        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
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
        const pathsGroup = new THREE.Group();
        scene.add(pathsGroup);
        pathsGroupRef.current = pathsGroup;




        // Animation Loop
        renderer.setAnimationLoop(() => {
            updatePath();
            renderer.render(scene, camera);
        });


    };

    useEffect(() => {
        if (!session) return;

        const cleanupScene = () => {

            if (gui) gui.destroy();

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
            <button onClick={pausePathPlacement} style={{ position: "absolute", top: 20, right: 20, padding: 10 }}>
                {isPaused ? "Play" : "Pause"}
            </button>
        </div>
    );
}

TestGetPositionsV2.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default TestGetPositionsV2;