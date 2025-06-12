import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const raycaster = new THREE.Raycaster();

const GraffitiWallArtV2 = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);

    const controllerRef = useRef(null);

    const canModelRef = useRef(null);
    const hasCanLoaded = useRef(false);

    const selectedObject = useRef(null);
    // const isDragging = useRef(false);
    const isSpraying = useRef(false);
    const sphereIndicator = useRef(null);

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
        sourceImage.src = 'peacock.png'; // switch to the desired image
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

        // Initialize audio listener
        const listener = new THREE.AudioListener();
        camera.add(listener);

        const spraySound = new THREE.Audio(listener);
        const rattleSound = new THREE.Audio(listener);

        // Load spray sound
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/sounds/spray.mp3', (buffer) => {
            spraySound.setBuffer(buffer);
            spraySound.setLoop(true);
            spraySound.setVolume(0.5);
        });

        // Load rattle sound
        audioLoader.load('/sounds/rattle.mp3', (buffer) => {
            rattleSound.setBuffer(buffer);
            rattleSound.setLoop(false);
            rattleSound.setVolume(0.5);
        });

        //Groups
        const movableGroup = new THREE.Group();
        scene.add(movableGroup);

        // Load model
        loadModel('/models/spray_can_2_1.glb', canModelRef, 'spray can', () => {
            if (!hasCanLoaded.current) {
                // Probably will need a separate function for model transformations and stuff
                canModelRef.current.scale.setScalar(1);
                canModelRef.current.position.set(0, 0, -1);
                canModelRef.current.rotation.set(
                    -Math.PI / 4,
                    0,
                    -Math.PI / 2
                )
                // canModelRef.current.rotateX(-Math.PI/4);
                // canModelRef.current.rotateZ(-Math.PI/2);
                // canModelRef.current.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
                movableGroup.add(canModelRef.current);
                hasCanLoaded.current = true;
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
                //isDragging.current = true;
                if (rattleSound.isPlaying) rattleSound.stop();
                rattleSound.play();
            }
            // controllerRef.current.userData.targetRayMode = event.target.targetRayMode
        }

        const onSelectEnd = (event) => {
            const controller = event.target;
            if (selectedObject.current !== null) {
                const object = selectedObject.current;
                movableGroup.attach(object);
                controller.userData.selected = undefined;
                // selectedObject.current = undefined;
                //isDragging.current = false;
            }
        }

        const startSpraying = () => {
            if (selectedObject.current) {
                isSpraying.current = true;
                if (!spraySound.isPlaying) spraySound.play();
            }
        }

        const stopSpraying = () => {
            if (isSpraying.current) {
                isSpraying.current = false;
                if (spraySound.isPlaying) spraySound.stop();
            }
        }

        // Add controllers to be able to move the fishes
        const controller = renderer.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        scene.add(controller);
        controllerRef.current = controller;

        renderer.domElement.addEventListener('touchstart', (event) => {
            if (event.touches.length == 2) {
                startSpraying();
            }
        })

        renderer.domElement.addEventListener('touchend', stopSpraying);

        sphereIndicator.current = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
        );
        sphereIndicator.current.visible = false;
        scene.add(sphereIndicator.current);

        // Animation Loop
        renderer.setAnimationLoop(() => {
            // Check if spray can is in scene
            if (controllerRef.current.userData.selected && wallPlane && sourceImage.complete) {
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

                        sphereIndicator.current.visible = true;
                        sphereIndicator.current.position.copy(intersects[0].point)

                        if (isSpraying.current) {
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
                } else {
                    sphereIndicator.current.visible = false;
                }
            } else {
                sphereIndicator.current.visible = false;
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

GraffitiWallArtV2.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default GraffitiWallArtV2;