import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import { XRControllerModelFactory } from 'three/examples/jsm/Addons.js';
// import { XRButton } from 'three/examples/jsm/Addons.js';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const raycaster = new THREE.Raycaster();

const VirtualExhibitionV2 = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controllerRef = useRef(null);

    const movableGroupRef = useRef(null);
    const locked = useRef(false);

    // const selectedObject = useRef(null);

    const lockInPlace = () => {
        // if (!sceneRef.current || !controllerRef.current) return;

        // if(sceneRef.current.children.includes(controllerRef.current)) {
        //     sceneRef.current.remove(controllerRef.current);
        // } else {
        //     sceneRef.current.add(controllerRef.current);
        // }
        locked.current = !locked.current;
    }

    const initAR = () => {
        const container = containerRef.current;
        
        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 100);
        //camera.position.set(0, 3.6, 3); // typical VR height
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        rendererRef.current = renderer;

        // Need this to make AR work (DONT FORGET THIS)
        renderer.xr.setReferenceSpaceType("local");
        renderer.xr.setSession(session);

        if (container) container.appendChild(renderer.domElement);

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const movableGroup = new THREE.Group();
        scene.add(movableGroup);
        movableGroupRef.current = movableGroup;

        // const floor = new THREE.Mesh(
        //     new THREE.PlaneGeometry(10, 10),
        //     new THREE.MeshBasicMaterial({ color: 0xc5c5c5, side: THREE.DoubleSide })
        // );
        // floor.rotateX(-Math.PI / 2)
        // floor.position.set(0, -1.6, 0);

        // scene.add(floor);

        const bbox = new THREE.Box3();

        for (let i = 0; i < 1; i++) {
            let c = Math.random() * 0xffffff;
            const geometry = new THREE.BoxGeometry(0.8, 2, 0.5);
            const material = new THREE.MeshStandardMaterial({
                color: c,
            });

            const box = new THREE.Mesh(geometry, material);

            box.position.set(0, (-1.6 + 1), -2);

            box.rotation.y = Math.random() * 2 * Math.PI;

            box.userData.initialColor = c;

            box.geometry.computeBoundingBox();

            bbox.copy(box.geometry.boundingBox).applyMatrix4(box.matrixWorld);

            movableGroup.add(box);
        }

        const wallGeometry = new THREE.PlaneGeometry(5, 3);
        const wallMaterial = new THREE.MeshBasicMaterial({
            opacity: 0.2,
            transparent: true,
            color: 0xffffff,
            side: THREE.DoubleSide
        });

        const wall = new THREE.Mesh(wallGeometry, wallMaterial);

        wall.position.set(3, 0, 0);
        wall.rotateY(-Math.PI/2);

        const wallBox = new THREE.Box3().setFromObject(wall);

        scene.add(wall);

        const controller = renderer.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        // controller.addEventListener('move', onMove);
        controllerRef.current = controller;
        scene.add(controller);

        const controllerModelFactory = new XRControllerModelFactory();

        const controllerGrip = renderer.xr.getControllerGrip(0);
        controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
        scene.add(controllerGrip);

        function onSelectStart(event) {
            const controller = event.target;

            controller.updateMatrixWorld();

            raycaster.setFromXRController(controller);

            const intersected = raycaster.intersectObjects(movableGroup.children, false);

            if (intersected.length > 0) {
                controller.userData.isSelecting = true;
            }

            controller.userData.targetRayMode = event.data.targetRayMode;
        };

        function onSelectEnd(event) {
            const controller = event.target;

            controller.userData.isSelecting = false;
        }

        // function onMove(event) {
        //     const controller = event.target;

        //     if (controller.userData.intersection === undefined) return;

        //     const intersected = controller.userData.intersection;

        //     const hitPoint = intersected.point;

        //     const downRay = new THREE.Raycaster(
        //         hitPoint.clone(),
        //         new THREE.Vector3(0, -1, 0)
        //     );

        //     const floorIntersected = downRay.intersectObject(floor);

        //     if (floorIntersected.length > 0) {
        //         const floorXZ = floorIntersected[0].point;

        //         intersected.object.position.set(
        //             floorXZ.x,
        //             intersected.object.position.y,
        //             floorXZ.z
        //         )
        //     }

        // };

        // Animation Loop
        renderer.setAnimationLoop(() => {
            if (!locked.current) {
                if (controller.userData.isSelecting) {
                    controller.updateMatrixWorld();

                    raycaster.setFromXRController(controller);

                    const intersected = raycaster.intersectObjects(movableGroup.children, false);

                    if (intersected.length > 0) {
                        const selectedObject = intersected[0].object;

                        // Compute movement direction
                        const direction = raycaster.ray.direction.clone();
                        const currentPosition = raycaster.ray.origin.clone();
                        const minDistance = 2.5;

                        const targetPosition = currentPosition.clone().add(direction.multiplyScalar(minDistance));
                        const currentY = selectedObject.position.y;

                        // Clone dummy object and move it to the proposed new position
                        const dummy = selectedObject.clone();
                        dummy.position.set(targetPosition.x, currentY, targetPosition.z);
                        dummy.geometry.computeBoundingBox();

                        const dummyBbox = dummy.geometry.boundingBox.clone().applyMatrix4(dummy.matrixWorld);

                        // Create wall box for collision detection
                        //const wallBox = new THREE.Box3().setFromObject(wall);

                        if (dummyBbox.intersectsBox(wallBox)) {
                            // Collision detected — determine if it's moving away from wall
                            const wallCenter = new THREE.Vector3();
                            wallBox.getCenter(wallCenter);

                            const dummyCenter = new THREE.Vector3();
                            dummyBbox.getCenter(dummyCenter);

                            const movement = targetPosition.clone().sub(selectedObject.position).setY(0).normalize();
                            const wallToDummy = dummyCenter.clone().sub(wallCenter).normalize();

                            const dot = movement.dot(wallToDummy);

                            if (dot > 0) {
                                // Moving away from wall — allow it
                                selectedObject.position.set(targetPosition.x, currentY, targetPosition.z);
                            }
                            // else: movement is into the wall — block it
                        } else {
                            // No collision — normal movement
                            selectedObject.position.set(targetPosition.x, currentY, targetPosition.z);
                        }

                        // Always make it look at the camera (XZ plane only)
                        const lookAtTarget = new THREE.Vector3(
                            camera.position.x,
                            selectedObject.getWorldPosition(new THREE.Vector3()).y,
                            camera.position.z
                        );
                        selectedObject.lookAt(lookAtTarget);
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
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
            <button onClick={lockInPlace} className="absolute block bottom-10 left-1/2 -translate-x-1/2 p-2 z-[1000] rounded-lg cursor-pointer font-fontBtnMenus text-black bg-[#E6E518] border-2 border-black text-xs hover:border-[#E6E518] active:border-[#E6E518]">Lock / Unlock</button>
        </div>
    );
}

VirtualExhibitionV2.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default VirtualExhibitionV2;