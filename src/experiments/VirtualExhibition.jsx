import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import * as CANNON from 'cannon-es';
// import { GLTFLoader } from 'three/examples/jsm/Addons.js';

// const raycaster = new THREE.Raycaster();

const VirtualExhibition = ({ session, endSession }) => {
    const containerRef = useRef(null);
    // const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    // const cameraRef = useRef(null);

    // const controllerRef = useRef(null);

    // // groups ref
    // const movableGroupRef = useRef(null);

    // // movable objects refs
    // const fishRef = useRef(null);
    // const fishPlaced = useRef(null);

    const clock = new THREE.Clock();

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

        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);

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

        // --- Floor ---
        const planeGeometry = new THREE.PlaneGeometry(25, 25)
        const planeMesh = new THREE.Mesh(
            planeGeometry,
            new THREE.MeshPhongMaterial()
        )
        planeMesh.position.y = -1.61
        planeMesh.rotateX(-Math.PI / 2)
        planeMesh.receiveShadow = true
        scene.add(planeMesh)
        const planeShape = new CANNON.Plane()
        const planeBody = new CANNON.Body({
            mass: 0
        })
        planeBody.addShape(planeShape)
        planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
        world.addBody(planeBody)

        // --- Movable Object ---
        const size = 0.3;
        const cubeGeometry = new THREE.BoxGeometry(size, size, size)
        const cubeMesh = new THREE.Mesh(
            cubeGeometry,
            new THREE.MeshNormalMaterial()
        )
        cubeMesh.position.x = -4
        cubeMesh.position.y = 1
        cubeMesh.castShadow = true
        scene.add(cubeMesh)
        const cubeShape = new CANNON.Box(new CANNON.Vec3(0.15, 0.15, 0.15))
        const cubeBody = new CANNON.Body({
            mass: 1
        })
        cubeBody.addShape(cubeShape)
        cubeBody.position.x = cubeMesh.position.x
        cubeBody.position.y = cubeMesh.position.y
        cubeBody.position.z = cubeMesh.position.z
        world.addBody(cubeBody)

        // --- Virtual Walls (Collision Objects) ---
        const wallMaterial = new THREE.MeshNormalMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true });
        const wall1 = new THREE.Mesh(
            new THREE.BoxGeometry(5, 2, 0.1),
            wallMaterial
        );
        wall1.position.set(0, -0.6, -2);
        scene.add(wall1);
        const wallBody1 = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(2.5, 1, 0.05)),
        });
        wallBody1.position.x = wall1.position.x;
        wallBody1.position.y = wall1.position.y;
        wallBody1.position.z = wall1.position.z;
        world.addBody(wallBody1);

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

        // Dragging State
        // let isDragging = false;
        let offset = new THREE.Vector3();

        // Raycasting
        const tempMatrix = new THREE.Matrix4();
        const raycaster = new THREE.Raycaster();
        const workingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        // const planeIntersect = new THREE.Vector3();

        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);

        function onSelectStart() {
        // Create a ray from controller forward
        tempMatrix.identity().extractRotation(controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

        const intersects = raycaster.intersectObject(cubeMesh);
        if (intersects.length > 0) {
            // isDragging = true;

            const hitPoint = intersects[0].point;
            offset.subVectors(cubeMesh.position, hitPoint);

            // Set plane to pass through object
            workingPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), hitPoint);
        }
        }

        function onSelectEnd() {
        // isDragging = false;
        }

        // Animation Loop
        renderer.setAnimationLoop(() => {
            world.step(clock.getDelta());

            cubeMesh.position.set(
                cubeBody.position.x,
                cubeBody.position.y,
                cubeBody.position.z
            );
            cubeMesh.quaternion.set(
                cubeBody.quaternion.x,
                cubeBody.quaternion.y,
                cubeBody.quaternion.z,
                cubeBody.quaternion.w
            );
            // if (isDragging) {
            //     tempMatrix.identity().extractRotation(controller.matrixWorld);
            //     raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
            //     raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

            //     if (raycaster.ray.intersectPlane(workingPlane, planeIntersect)) {
            //     const newPos = planeIntersect.clone().add(offset);
            //     newPos.y = -1.45; // Keep on ground
                
            //     // Check collision
            //     cubeBody.position.copy(newPos);

            //     cubeMesh.position.copy(cubeBody.position);
            //     cubeMesh.quaternion.copy(cubeBody.quaternion);
                
            //     }
            // }
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

VirtualExhibition.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default VirtualExhibition;