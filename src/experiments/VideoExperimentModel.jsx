import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const VideoExperimentModel = ({ setIsAR, setEndSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    // const hitTestSource = useRef(null);
    // const hitTestSourceRequested = useRef(false);
    // const controllerRef = useRef(null);
    // const reticleRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        cameraRef.current = camera;

        placeVideos(sceneRef.current);

        // Animation loop
        const animate = (timestamp, frame) => {
            if (frame) {
                // const referenceSpace = renderer.xr.getReferenceSpace();
                // const session = renderer.xr.getSession();
                // frame.createAnchor();
            }
            renderer.render(scene, camera);
        };

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true; // Enable WebXR
        renderer.setAnimationLoop(animate);
        rendererRef.current = renderer;

        if (container) {
            container.appendChild(renderer.domElement);
        }

        // Add a light
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        // // Load a model
        // const model = new THREE.Object3D();
        // const loader = new GLTFLoader();
        // loader.load("/models/Fish.glb", (gltf) => {
        //     model.add(gltf.scene);
        //     model.scale.set(0.1, 0.1, 0.1);
        //     model.position.set(0, 0, -1).applyMatrix4(cameraRef.current.matrixWorld); // Place model in front of camera
        //     model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);

        //     scene.add(model);
        // });

        // Try to start AR automatically
        const autoStartAR = async () => {
            if (navigator.xr) {
                try {
                    const session = await navigator.xr.requestSession("immersive-ar", {
                        requiredFeatures: ["anchors", "local-floor", "dom-overlay"],
                        domOverlay: { root: document.body },
                    });

                    session.addEventListener("end", () => {
                        setIsAR(false);
                        setEndSession(null);
                    })

                    rendererRef.current.xr.setReferenceSpaceType("local");

                    rendererRef.current.xr.setSession(session);
                    setIsAR(true);

                    setEndSession(() => () => {
                        // Clear the scene
                        if (sceneRef.current) {
                            sceneRef.current.children.forEach((object) => {
                                if (!object.isLight) {
                                    if (object.geometry) object.geometry.dispose();
                                    if (object.material) object.material.dispose();
                                    sceneRef.current.remove(object);
                                }
                            });
                        }
                        const session = rendererRef.current?.xr.getSession();
                        if (session) session.end();
                    })
                } catch (error) {
                    console.warn("Auto AR start failed:", error);
                }
            }
        };

        // Start AR after a delay (some browsers block instant start)
        //setTimeout(autoStartAR, 1000);
        autoStartAR();

        // Cleanup function
        return () => {
            renderer.setAnimationLoop(null);
            if (container) container.removeChild(renderer.domElement);
        };
    }, [setIsAR, setEndSession]);

    const placeVideos = (scene/*, session, referenceSpace*/) => {
        const videoURLs = [
            { src: "/videos/fortaleza_low.mp4", position: [0, 1.5, -2], rotation: [0, 0, 0], way: "North" },  // North
            { src: "/videos/paz_low_res.mp4", position: [2, 1.5, 0], rotation: [0, -Math.PI / 2, 0], way: "East" },  // East
            { src: "/videos/prudência_low_res.mp4", position: [0, 1.5, 2], rotation: [0, Math.PI, 0], way: "South" },  // South
            { src: "/videos/temperança_1_e_2_low.mp4", position: [-2, 1.5, 0], rotation: [0, Math.PI / 2, 0], way: "West" }  // West
        ];

        const loader = new GLTFLoader();

        for (const { src, position, rotation, way } of videoURLs) {
            const video = document.createElement("video");
            video.src = src;
            video.crossOrigin = "anonymous";
            video.loop = true;
            video.muted = true;
            video.autoplay = true;
            video.play();

            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBAFormat;

            // const geometry = new THREE.PlaneGeometry(2, 1.5);  // Adjust video size
            const material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
            // const plane = new THREE.Mesh(geometry, material);
            // plane.name = way;
            // plane.position.set(...position);
            // plane.rotation.set(...rotation);
            // scene.add(plane);

            let model;

            loader.load("/models/doorway.glb", (gltf) => {
                model = gltf.scene;
                model.name = "doorway_" + way;
                model.scale.setScalar(1);
                model.position.set(position);
                model.rotation.set(rotation);
                const doorway = model.getObjectByName("DoorVideo");
                if (doorway.isMesh) doorway.material = material;
                scene.add(model);
            });
            

            // Create an anchor so the video remains fixed in place
            // if (session.requestAnchor) {
            // const anchor = await session.requestAnchor(position, referenceSpace);
            // anchor.attach(model);
            // }
        }
    };

    return (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
            {/* {!isAR && (
        <button onClick={startAR} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: 10 }}>
          Start AR
        </button>
      )} */}


        </div>
    );
};

VideoExperimentModel.propTypes = {
    setIsAR: propTypes.func.isRequired,
    setEndSession: propTypes.func.isRequired,
}

export default VideoExperimentModel;
