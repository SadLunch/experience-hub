import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const raycaster = new THREE.Raycaster();

const GremioLiterario = ({ session, endSession }) => {
    const containerRef = useRef(null);
    // const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    // const cameraRef = useRef(null);

    const controllerRef = useRef(null);

    // groups ref
    const spheresGroupRef = useRef(null);
    const heartsGroupRef = useRef(null);
    const lightbulbGroupRef = useRef(null);
    // const movableGroupRef = useRef(null);

    // // movable objects refs
    // const fishRef = useRef(null);
    // const fishPlaced = useRef(null);

    const isDragging = useRef(false);
    const selectedObject = useRef(null);

    const [hearts, setHearts] = useState(0);

    const [lightbulbs, setLightbulbs] = useState(0)
    const lightbulbsRef = useRef(0);

    const [gameOver, setGameOver] = useState(false);

    // const loader = new GLTFLoader();

    // const loadModel = (src, refVar, name = null, callback = null) => {
    //     loader.load(src, (gltf) => {
    //         refVar.current = gltf.scene;
    //         if (name) refVar.current.name = name;
    //         if (callback) callback();
    //     });
    // };

    function addMarkersBySpacing(start, end, spacing = 0.5, maxHearts, heartTexture, maxLightbulbs, lightbulbTexture, pointList, radius = 0.1, color = 0xff0000) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const count = Math.floor(length / spacing);

        const unitDir = direction.normalize();

        let numHearts = 0, numLightbulbs = 0, offset = 0, maxOffset = count > 2 ? 3 : 0;

        for (let i = 0; i <= count; i++) {
            const point = new THREE.Vector3().copy(start).addScaledVector(unitDir, i * spacing);

            const tooClose = pointList.some(p => p.distanceTo(point) < 0.1);
            if (tooClose) continue;

            if (numHearts < maxHearts && Math.random() < 1/(count-i) && offset >= maxOffset) {
                const heartMat = new THREE.MeshBasicMaterial({ map: heartTexture, transparent: true });
                const heart = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), heartMat);
                heart.position.set(
                    point.x,
                    point.y,
                    point.z + 0.01
                );
                pointList.push(heart.position)
                heartsGroupRef.current.add(heart);
                numHearts++;
                offset = 0;
            } else if (numLightbulbs < maxLightbulbs && Math.random() < 1/(count-i) && offset >= maxOffset) {
                const lightbulbMat = new THREE.MeshBasicMaterial({ map: lightbulbTexture, transparent: true });
                const lightbulb = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lightbulbMat);
                lightbulb.position.set(
                    point.x,
                    point.y,
                    point.z + 0.01
                );
                pointList.push(lightbulb.position)
                lightbulbGroupRef.current.add(lightbulb);
                numLightbulbs++;
                offset = 0;
            } else {
                const sphere = new THREE.Mesh(
                    new THREE.CircleGeometry(radius, 16),
                    new THREE.MeshBasicMaterial({ color: color })
                );
                sphere.position.set(
                    point.x,
                    point.y,
                    point.z + 0.01
                );
                pointList.push(sphere.position);
                spheresGroupRef.current.add(sphere);
                offset++;
            }
        }
    }


    const initAR = () => {
        const container = containerRef.current;

        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 100);
        //camera.position.set(0, 3.6, 3); // typical VR height

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;

        // Need this to make AR work (DONT FORGET THIS)
        renderer.xr.setReferenceSpaceType("local");
        renderer.xr.setSession(session);

        if (container) container.appendChild(renderer.domElement);

        //Groups
        const movableGroup = new THREE.Group();
        scene.add(movableGroup);

        const pathsGroup = new THREE.Group();
        scene.add(pathsGroup);

        const spheresGroup = new THREE.Group();
        scene.add(spheresGroup);
        spheresGroupRef.current = spheresGroup;

        const heartsGroup = new THREE.Group();
        scene.add(heartsGroup);
        heartsGroupRef.current = heartsGroup;

        const lightbulbGroup = new THREE.Group();
        scene.add(lightbulbGroup);
        lightbulbGroupRef.current = lightbulbGroup;

        // Items texture loaders
        const video = document.createElement("video");
        video.src = '/videos/heartVid.mp4';
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.play();

        const heartTexture = new THREE.VideoTexture(video);
        heartTexture.minFilter = THREE.LinearFilter;
        heartTexture.magFilter = THREE.LinearFilter;
        heartTexture.format = THREE.RGBAFormat;

        const lightbulbTexture = new THREE.TextureLoader().load('lightbulb.png')

        // Paths
        const paths = [
            {start: new THREE.Vector3(3, 1, -9), end: new THREE.Vector3(-10, 1, -9), hearts: 1, lightbulbs: 1/*, orientation: 'h'/* h = horizontal | v = vertical */},
            {start: new THREE.Vector3(-10, 1, -9), end: new THREE.Vector3(-10, 3, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/},
            {start: new THREE.Vector3(-10, 3, -9), end: new THREE.Vector3(4.5, 3, -9), hearts: 1, lightbulbs: 1/*, orientation: 'h'*/},
            {start: new THREE.Vector3(4.5, 3, -9), end: new THREE.Vector3(4.5, 7, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/},
            {start: new THREE.Vector3(4.5, 7, -9), end: new THREE.Vector3(-9.5, 7.5, -9), hearts: 1, lightbulbs: 1/*, orientation: 'h'*/},
            {start: new THREE.Vector3(-9.5, 7.5, -9), end: new THREE.Vector3(-9.5, 11, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/},
            {start: new THREE.Vector3(-9.5, 11, -9), end: new THREE.Vector3(-1, 11, -9), hearts: 1, lightbulbs: 1/*, orientation: 'h'*/},
            {start: new THREE.Vector3(-1, 11, -9), end: new THREE.Vector3(-1, 11.5, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/},
            {start: new THREE.Vector3(2, 7.5, -9), end: new THREE.Vector3(2, 9.6, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/},
            {start: new THREE.Vector3(2.6, 9.6, -9), end: new THREE.Vector3(4.6, 9.6, -9), hearts: 0, lightbulbs: 1/*, orientation: 'h'*/},
            {start: new THREE.Vector3(-6, 3.6, -9), end: new THREE.Vector3(-6, 6.1, -9), hearts: 1, lightbulbs: 0/*, orientation: 'v'*/},
            {start: new THREE.Vector3(5.1, 4, -9), end: new THREE.Vector3(7.1, 4, -9), hearts: 0, lightbulbs: 1/*, orientation: 'h'*/},
        ];

        const placedPoints = []

        for (let p of paths) {
            const direction = new THREE.Vector3().subVectors(p.end, p.start);
            const length = p.start.distanceTo(p.end);
            const center = new THREE.Vector3().addVectors(p.start, p.end).multiplyScalar(0.5);

            const path = new THREE.Mesh(
                new THREE.PlaneGeometry(0.6, length+0.6),
                new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
            );
            path.position.copy(center);

            const up = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());

            path.setRotationFromQuaternion(quaternion);
            pathsGroup.add(path);

            addMarkersBySpacing(p.start, p.end, 1, p.hearts, heartTexture, p.lightbulbs, lightbulbTexture, placedPoints);
        }

        const start = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 2.5),
            new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
        );
        start.position.set(3.7, 1, -9);
        pathsGroup.add(start);

        // Movable slider
        const texture = new THREE.TextureLoader().load('lady_justice.png');

        const imageMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
        const imagePlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2), // adjust size as needed
            imageMaterial
        );
        imagePlane.position.set(
            start.position.x,
            start.position.y,
            start.position.z + 0.02); // or wherever your path starts
        movableGroup.add(imagePlane);

        // const slider = new THREE.Mesh(
        //     new THREE.SphereGeometry(0.2, 32, 32),
        //     new THREE.MeshBasicMaterial({ color: 0xff8888 })
        // );
        // slider.position.copy(start.position);
        // movableGroup.add(slider);

        
        // let dragging = false;
        // let selectedObject = null;

        const onSelectStart = () => {

            controllerRef.current.updateMatrixWorld();

            raycaster.setFromXRController(controllerRef.current);

            const intersected = raycaster.intersectObjects(movableGroup.children)
            if (intersected.length > 0) {
                isDragging.current = true;
                selectedObject.current = intersected[0].object;
            }
        }

        const onSelectEnd = () => {
            isDragging.current = false;
            selectedObject.current = null;
        }

        // Add controllers to be able to move the fishes
        const controller = renderer.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        scene.add(controller);
        controllerRef.current = controller;

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }

        window.addEventListener('resize', onResize);


        // Animation Loop
        renderer.setAnimationLoop(() => {
            controllerRef.current.updateMatrixWorld();

            raycaster.setFromXRController(controllerRef.current);

            const intersected = raycaster.intersectObjects(movableGroup.children)
            if (intersected.length > 0) {
                isDragging.current = true;
            } else {
                isDragging.current = false;
            }
            if (isDragging.current && selectedObject.current) {
                //raycaster.setFromXRController(controllerRef.current);
                const intersected = raycaster.intersectObjects(pathsGroup.children);
                if (intersected.length > 0) {
                    const intersection = intersected[0].point;

                    // Optional: only move if the controller is roughly centered on the image
                    const distance = intersection.distanceTo(selectedObject.current.position);
                    const maxDistance = 1.9; // Tweak based on image size

                    if (distance < maxDistance) {
                        selectedObject.current.position.set(
                            intersection.x,
                            intersection.y,
                            intersection.z + 0.02
                        );
                    }
                }
                if (selectedObject.current.position.y >= 11.4 && lightbulbsRef.current >= 3) {
                    console.log("🎉 Won Game 🎉");
                    setGameOver(true);
                    // Win game
                    // Show win screen
                    // After 1/2 seconds place bubbles and books
                    // Maybe add the feature of when clicking books showing some texts/books/authors reated to justice (ask artist later)
                }
            }

            // Remove dots and items if intersected with movable object
            if (selectedObject.current && spheresGroupRef.current && heartsGroupRef.current && lightbulbGroupRef.current) {
                if (spheresGroupRef.current.children.length > 0) {
                    for (let i = spheresGroupRef.current.children.length - 1; i >= 0; i--) {
                        const sphere = spheresGroupRef.current.children[i];
                        const dist = sphere.position.distanceTo(selectedObject.current.position);

                        if (dist < 0.7) {
                            // Remove from scene
                            spheresGroupRef.current.remove(sphere);
                        }
                    }
                }
                if (heartsGroupRef.current.children.length > 0) {
                    for (let i = heartsGroupRef.current.children.length - 1; i >= 0; i--) {
                        const heart = heartsGroupRef.current.children[i];
                        const dist = heart.position.distanceTo(selectedObject.current.position);

                        if (dist < 0.4) {
                            // Remove from scene
                            heartsGroupRef.current.remove(heart);
                            // Add "Shield/Extra Life"
                            setHearts(hearts+1)
                        }
                    }
                }
                if (lightbulbGroupRef.current.children.length > 0) {
                    for (let i = lightbulbGroupRef.current.children.length - 1; i >= 0; i--) {
                        const lightbulb = lightbulbGroupRef.current.children[i];
                        const dist = lightbulb.position.distanceTo(selectedObject.current.position);

                        if (dist < 0.4) {
                            // Remove from scene
                            lightbulbGroupRef.current.remove(lightbulb);
                            // Increase size of player
                            selectedObject.current.scale.addScalar(0.2);
                            // Increase number of current lightbulbs
                            lightbulbsRef.current += 1
                            setLightbulbs(lightbulbsRef.current);
                        }
                    }
                }
            }

            // Logic to end game/decrease size (remove lightbulb) if skulls intersect with player
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
                    Hearts: {hearts}
            </div>
            <div style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "20px",
                    // transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                Lightbulbs: {lightbulbs}
            </div>
            {gameOver && (
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    You Won!
                </div>
            )}
            {/* Maybe have a message with instructions here */}
            {/* Message: Drag the lady justice statue across the [insert color] path */}
            {/* Say that lightbulbs increse your size */}
            {/* Say that hearts give you immunity (still don't know if for a certain amount of time or for one hit) */}
            {/* Say that you need some amount of lightbulbs to be able to win (i think) */}
        </div>
    );
}

GremioLiterario.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default GremioLiterario;