import { useRef, useEffect } from 'react';
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

    // // groups ref
    // const movableGroupRef = useRef(null);

    // // movable objects refs
    // const fishRef = useRef(null);
    // const fishPlaced = useRef(null);

    const isDragging = useRef(false);
    const selectedObject = useRef(null);

    // const loader = new GLTFLoader();

    // const loadModel = (src, refVar, name = null, callback = null) => {
    //     loader.load(src, (gltf) => {
    //         refVar.current = gltf.scene;
    //         if (name) refVar.current.name = name;
    //         if (callback) callback();
    //     });
    // };

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

        // Paths
        const paths = [
            {start: new THREE.Vector3(3, -1, -9), end: new THREE.Vector3(-7, -1, -9), orientation: 'h'/* h = horizontal | v = vertical */},
            {start: new THREE.Vector3(-7, -1, -9), end: new THREE.Vector3(-7, 1, -9), orientation: 'v'},
            {start: new THREE.Vector3(-7, 1, -9), end: new THREE.Vector3(5, 1, -9), orientation: 'h'},
            {start: new THREE.Vector3(5, 1, -9), end: new THREE.Vector3(5, 3, -9), orientation: 'v'},
            {start: new THREE.Vector3(5, 3, -9), end: new THREE.Vector3(-7, 3, -9), orientation: 'h'},
            {start: new THREE.Vector3(-7, 3, -9), end: new THREE.Vector3(-7, 4, -9), orientation: 'v'},
            {start: new THREE.Vector3(-7, 4, -9), end: new THREE.Vector3(0, 4, -9), orientation: 'h'},
            {start: new THREE.Vector3(0, 4, -9), end: new THREE.Vector3(0, 4.5, -9), orientation: 'v'},
            {start: new THREE.Vector3(-6, 3, -9), end: new THREE.Vector3(-6, 2, -9), orientation: 'v'},
            {start: new THREE.Vector3(0, 3, -9), end: new THREE.Vector3(0, 2, -9), orientation: 'v'},
            {start: new THREE.Vector3(4, 3, -9), end: new THREE.Vector3(4, 4, -9), orientation: 'v'},
            {start: new THREE.Vector3(4, 4, -9), end: new THREE.Vector3(5, 4, -9), orientation: 'h'},
        ];

        for (let p of paths) {
            //const direction = new THREE.Vector3().subVectors(p.end, p.start);
            const length = p.start.distanceTo(p.end);
            const center = new THREE.Vector3().addVectors(p.start, p.end).multiplyScalar(0.5);

            const path = new THREE.Mesh(
                new THREE.PlaneGeometry(0.6, length+0.6),
                new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
            );
            path.position.copy(center);
            if (p.orientation == 'h') path.rotateZ(Math.PI / 2);
            pathsGroup.add(path);
        }

        const start = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 2.5),
            new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
        );
        start.position.set(3.5, -1, -9);
        pathsGroup.add(start);

        // Movable slider
        const slider = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xff8888 })
        );
        slider.position.copy(start.position);
        movableGroup.add(slider);

        
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
                    selectedObject.current.position.copy(intersected[0].point)
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

GremioLiterario.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default GremioLiterario;