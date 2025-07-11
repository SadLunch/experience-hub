import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const raycaster = new THREE.Raycaster();

const GraffitiWallArt = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);

    const controllerRef = useRef(null);

    const canModelRef = useRef(null);

    const selectedObject = useRef(null);
    const isDragging = useRef(false);

    // // groups ref
    // const movableGroupRef = useRef(null);

    const loader = new GLTFLoader();

    const loadModel = (src, refVar, name = null, callback = null) => {
        loader.load(src, (gltf) => {
            refVar.current = gltf.scene;
            if (name) refVar.current.name = name;
            if (callback) callback();
        });
    };

    const initAR = () => {
        const container = containerRef.current;

        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
        cameraRef.current = camera;
        //camera.position.set(0, 3.6, 3); // typical VR height

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;
        rendererRef.current = renderer;

        // Need this to make AR work (DONT FORGET THIS)
        rendererRef.current.xr.setReferenceSpaceType("local");
        rendererRef.current.xr.setSession(session);

        if (container) container.appendChild(renderer.domElement);

        // Add a Light to the Scene
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const textureSize = 512;

        // Create a canvas where we'll paint the image gradually
        const paintCanvas = document.createElement('canvas');
        paintCanvas.width = textureSize;
        paintCanvas.height = textureSize;
        const paintCtx = paintCanvas.getContext('2d');

        // Fill with black initially (completely hidden)
        // paintCtx.fillStyle = '#000';
        // paintCtx.fillRect(0, 0, textureSize, textureSize);
        paintCtx.clearRect(0, 0, textureSize, textureSize);

        // Load source image to be revealed
        const sourceImage = new Image();
        sourceImage.src = '/images/peacock.png';
        sourceImage.crossOrigin = 'anonymous';

        const paintedTexture = new THREE.CanvasTexture(paintCanvas);
        paintedTexture.encoding = THREE.sRGBEncoding;
        paintedTexture.needsUpdate = true;

        const revealMaterial = new THREE.MeshBasicMaterial({
            map: paintedTexture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const wallPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            revealMaterial
        );
        wallPlane.position.z = -2;
        scene.add(wallPlane);



        //Groups
        const movableGroup = new THREE.Group();
        scene.add(movableGroup);

        // Load model
        loadModel('/models/spray_can_1.glb', canModelRef, 'spray can', () => {
            if (canModelRef.current) {
                // Probably will need a separate function for model transformations and stuff
                canModelRef.current.scale.setScalar(0.05);
                canModelRef.current.position.set(0, 0, -1);
                //canModelRef.current.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
                movableGroup.add(canModelRef.current);
            }
        })

        const onSelectStart = (event) => {
            const controller = event.target;
            controllerRef.current.updateMatrixWorld();

            raycaster.setFromXRController(controller);

            const intersected = raycaster.intersectObjects(movableGroup.children)
            if (intersected.length > 0) {
                const object = intersected[0].object.parent.parent;
                controller.attach(object);
                controller.userData.selected = object;
                selectedObject.current = object;
                isDragging.current = true;
            }
            // controllerRef.current.userData.targetRayMode = event.target.targetRayMode
        }

        const onSelectEnd = (event) => {
            const controller = event.target;
            if (selectedObject.current !== null) {
                const object = selectedObject.current;
                movableGroup.attach(object);
                controller.userData.selected = undefined;
                // selectedObject.current = null;
                isDragging.current = false;
            }
        }

        // Add controllers to be able to move the fishes
        const controller = renderer.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        scene.add(controller);
        controllerRef.current = controller;

        // Animation Loop
        renderer.setAnimationLoop(() => {
            // Check if spray can is in scene
            if (isDragging.current && selectedObject.current && wallPlane && sourceImage.complete) {
                const sprayTip = new THREE.Vector3();
                // sprayTip.add(selectedObject.current.getObjectByName("Tip").position);
                selectedObject.current.getWorldPosition(sprayTip);

                raycaster.set(sprayTip, new THREE.Vector3(0, 0, -1)/*.applyQuaternion(cameraRef.current.quaternion)*/);

                const intersects = raycaster.intersectObject(wallPlane);
                if (intersects.length > 0) {
                    const uv = intersects[0].uv;

                    if (uv) {
                        const x = Math.floor(uv.x * textureSize);
                        const y = Math.floor((1 - uv.y) * textureSize); // flip Y

                        const radius = 30;

                        // Clip drawing to a circle
                        paintCtx.save();
                        paintCtx.beginPath();
                        paintCtx.arc(x, y, radius, 0, Math.PI * 2);
                        paintCtx.clip();

                        // Draw that part of the source image
                        paintCtx.drawImage(sourceImage, 0, 0, textureSize, textureSize);

                        paintCtx.restore();
                        paintedTexture.needsUpdate = true;
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

GraffitiWallArt.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default GraffitiWallArt;