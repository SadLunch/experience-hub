import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// const raycaster = new THREE.Raycaster();

const VirtualExhibitionV2 = ({ session, endSession }) => {
    const containerRef = useRef(null);
    // const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    // const cameraRef = useRef(null);

    const controllerRef = useRef(null);

    // groups ref
    const movableGroupRef = useRef(null);

    // // movable objects refs
    // const fishRef = useRef(null);
    // const fishPlaced = useRef(null);

    const selectedObject = useRef(null);
    const isDragging = useRef(false);

    // const loader = new GLTFLoader();

    // const loadModel = (src, refVar, name = null, callback = null) => {
    //     loader.load(src, (gltf) => {
    //         refVar.current = gltf.scene;
    //         if (name) refVar.current.name = name;
    //         if (callback) callback();
    //     });
    // };

    // const placeObjects = (object, position = null) => {
    //     if (position) {
    //         object.position.add(position).applyMatrix4(cameraRef.current.matrixWorld);
    //     } else {
    //         object.position.set(0, -2, -2).applyMatrix4(cameraRef.current.matrixWorld);
    //     }
    //     object.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
    //     object.scale.setScalar(0.1)
    //     movableGroupRef.current.add(object);
    //     fishPlaced.current = true;
    // }

    const initAR = () => {
        const container = containerRef.current;
        
        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 100);
        //camera.position.set(0, 3.6, 3); // typical VR height

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;

        

        // Need this to make AR work (DONT FORGET THIS)
        renderer.xr.setReferenceSpaceType("local");
        renderer.xr.setSession(session);

        if (container) container.appendChild(renderer.domElement);

        // --- Groups ---
        const movableGroup = new THREE.Group();
        scene.add(movableGroup);
        movableGroupRef.current = movableGroup;

        // --- Floor ---
        const planeGeometry = new THREE.PlaneGeometry(25, 25)
        const planeMesh = new THREE.Mesh(
            planeGeometry,
            new THREE.MeshPhongMaterial()
        )
        planeMesh.position.y = -0.61
        planeMesh.rotateX(-Math.PI / 2)
        planeMesh.receiveShadow = true
        scene.add(planeMesh)

        // --- Movable Object ---
        const size = 0.3;
        const cubeGeometry = new THREE.BoxGeometry(size, size, size)
        const cubeMesh = new THREE.Mesh(
            cubeGeometry,
            new THREE.MeshNormalMaterial()
        )
        cubeMesh.position.z = -0.5
        cubeMesh.position.y = -0.45
        movableGroupRef.current.add(cubeMesh)

        // --- Virtual Walls (Collision Objects) ---
        const wallMaterial = new THREE.MeshNormalMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
        const wall1 = new THREE.Mesh(
            new THREE.BoxGeometry(5, 2, 0.1),
            wallMaterial
        );
        wall1.position.set(0, -0.6, -2);
        scene.add(wall1);

        // const wallBody2 = new CANNON.Body({
        //     type: CANNON.Body.STATIC,
        //     shape: new CANNON.Box(new CANNON.Vec3(0.05, 1, 2.5)),
        //     position: new CANNON.Vec3(2, -0.6, 0),
        // });
        // world.addBody(wallBody2);

        // --- Light ---
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // --- Controllers ---
        const controller = renderer.xr.getController(0);
        scene.add(controller);
        controllerRef.current = controller;

        // Raycasting
        const raycaster = new THREE.Raycaster();

        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);

        function onSelectStart(event) {
            const controller = event.target;

            controller.updateMatrixWorld();

            raycaster.setFromXRController(controller);

            const intersected = raycaster.intersectObjects(movableGroupRef.current.children);
            if (intersected.length > 0) {
                selectedObject.current = intersected[0].object;
                isDragging.current = true;
            }
        }

        function onSelectEnd() {
            isDragging.current = false;
            selectedObject.current = undefined;
        }

        // Animation Loop
        renderer.setAnimationLoop(() => {
            if (isDragging.current && selectedObject.current) {
                
                raycaster.setFromXRController(controllerRef.current);

                const movementIntersected = raycaster.intersectObject(planeMesh);

                if (movementIntersected.length > 0) {
                    const newPosition = new THREE.Vector3();
                    newPosition.copy(movementIntersected[0].point);

                    const origin = selectedObject.current.position.clone();

                    const direction = new THREE.Vector3(0, -1, 0).normalize();

                    raycaster.set(origin, direction);

                    const intersected = raycaster.intersectObject(planeMesh);
                    if (intersected.length > 0) {
                        selectedObject.current.geometry.computeBoundingBox();
                        const hit = intersected[0];

                        const objectHeight = selectedObject.current.geometry.boundingBox.max.y - selectedObject.current.geometry.boundingBox.min.y;

                        selectedObject.current.position.set(
                            newPosition.x,
                            hit.point.y + (objectHeight / 2),
                            newPosition.z
                        );
                    }
                }
            }
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
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}></div>
    );
}

VirtualExhibitionV2.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default VirtualExhibitionV2;