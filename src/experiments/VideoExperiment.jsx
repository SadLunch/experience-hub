import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { ChromaKeyMaterial } from "../components/ChromaKeyShader";

const CardinalVideos = ({ setIsAR, setEndSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const [isARSupported, setIsARSupported] = useState(false);

    useEffect(() => {
        if (!navigator.xr) {
            console.warn("WebXR not supported.");
            return;
        }

        setIsARSupported(true);

        const initAR = async () => {
            try {
                const container = containerRef.current;
                const session = await navigator.xr.requestSession("immersive-ar", {
                    requiredFeatures: ["anchors", "local-floor", "dom-overlay"],
                    domOverlay: { root: document.body }
                });

                session.addEventListener("end", () => {
                    setIsAR(false);
                    setEndSession(null);
                });

                const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.xr.enabled = true;
                rendererRef.current = renderer;
                if (container) container.appendChild(renderer.domElement);

                const scene = new THREE.Scene();
                sceneRef.current = scene;

                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

                //const xrReferenceSpace = await session.requestReferenceSpace("local-floor");

                const gl = renderer.getContext();
                await gl.makeXRCompatible();
                renderer.xr.setReferenceSpaceType("local-floor");

                renderer.xr.setSession(session);
                setIsAR(true);

                placeVideos(sceneRef.current/*, session, xrReferenceSpace*/);

                const animate = () => {
                    renderer.setAnimationLoop(() => {
                        renderer.render(scene, camera);
                    });
                };
                animate();

                setEndSession(() => () => {
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
                });
            } catch (error) {
                console.warn("Failed to start AR:", error);
            }
        };

        initAR();
    }, [setEndSession, setIsAR]);

    const placeVideos = (scene/*, session, referenceSpace*/) => {
        const videoURLs = [
            { src: "/videos/fortaleza_low.mp4", position: [0, 0, -4], rotation: [0, 0, 0], way: "North" },  // North
            { src: "/videos/paz_low_res.mp4", position: [4, 0, 0], rotation: [0, -Math.PI / 2, 0], way: "East" },  // East
            { src: "/videos/prudência_low_res.mp4", position: [0, 0, 4], rotation: [0, Math.PI, 0], way: "South" },  // South
            { src: "/videos/temperança_1_e_2_low.mp4", position: [-4, 0, 0], rotation: [0, Math.PI / 2, 0], way: "West" }  // West
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
            // const material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

            // Shader to remove green
            const material = new ChromaKeyMaterial(src, 0x63b757, 1080, 1920, 0.159, 0.02, 0);

            // const plane = new THREE.Mesh(geometry, material);
            // plane.name = way;
            // plane.position.set(...position);
            // plane.rotation.set(...rotation);
            // scene.add(plane);

            let model;

            loader.load("/models/doorway_v5.glb", (gltf) => {
                model = gltf.scene;
                model.name = "doorway_" + way;
                //model.scale.set(1, 1, 1);
                model.position.set(...position);
                model.rotation.set(...rotation);
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

    return isARSupported ? 
    (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
        </div>
    ) : 
    <p>WebXR AR not supported on this device.</p>;
};

CardinalVideos.propTypes = {
    setIsAR: propTypes.func.isRequired,
    setEndSession: propTypes.func.isRequired,
}

export default CardinalVideos;
