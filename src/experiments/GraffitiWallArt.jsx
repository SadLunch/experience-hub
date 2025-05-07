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
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 100);
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
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = textureSize;
        maskCanvas.height = textureSize;
        const maskContext = maskCanvas.getContext('2d');
        maskContext.fillStyle = 'black'; // fully hidden
        maskContext.fillRect(0, 0, textureSize, textureSize);

        const maskTexture = new THREE.CanvasTexture(maskCanvas);

        const imageTexture = new THREE.TextureLoader().load('peacock.png'); // use your image here

        const revealMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uImage: { value: imageTexture },
                uMask: { value: maskTexture },
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uImage;
                uniform sampler2D uMask;
                varying vec2 vUv;

                void main() {
                    vec4 image = texture2D(uImage, vUv);
                    float mask = texture2D(uMask, vUv).r;
                    gl_FragColor = vec4(image.rgb, mask);
                }
            `,
            transparent: true,
        });

        const wallPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            revealMaterial
        );
        //wallPlane.rotation.y = Math.PI; // optional: face the camera
        wallPlane.position.z = -2; // place it in front
        scene.add(wallPlane);


        //Groups
        const movableGroup = new THREE.Group();
        scene.add(movableGroup);

        // Load model
        loadModel('/models/spray_can_1.glb', canModelRef, 'spray can', () => {
            if (canModelRef.current) {
                // Probably will need a separate function for model transformations and stuff
                canModelRef.current.scale.setScalar(0.05);
                canModelRef.current.position.set(0, 0, -1).applyMatrix4(cameraRef.current.matrixWorld);
                canModelRef.current.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
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
            if (isDragging.current && selectedObject.current && wallPlane) {
                const sprayTip = new THREE.Vector3();
                selectedObject.current.getWorldPosition(sprayTip);

                raycaster.set(sprayTip, new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion));

                const intersects = raycaster.intersectObject(wallPlane);
                if (intersects.length > 0) {
                    const uv = intersects[0].uv;

                    if (uv) {
                        const x = Math.floor(uv.x * textureSize);
                        const y = Math.floor((1 - uv.y) * textureSize); // flip Y

                        const radius = 20;
                        maskContext.beginPath();
                        maskContext.arc(x, y, radius, 0, Math.PI * 2);
                        maskContext.fillStyle = 'white'; // reveal
                        maskContext.fill();
                        maskTexture.needsUpdate = true;
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