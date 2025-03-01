import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";

// const METERS_PER_DEGREE_LAT = 111320; // Rough estimate (1 degree latitude ≈ 111.32 km)
// const METERS_PER_DEGREE_LON = (lat) => 111320 * Math.cos((lat * Math.PI) / 180); // Adjusted for latitude

const CardinalVideosLocation = ({ setIsAR, setEndSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const [isARSupported, setIsARSupported] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [headingOffset, setHeadingOffset] = useState(0); // Stores real-world North direction

    useEffect(() => {
        if (!navigator.xr) {
            console.warn("WebXR not supported.");
            return;
        }

        setIsARSupported(true);

        // Get user's starting location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => console.warn("Geolocation failed:", error),
            { enableHighAccuracy: true }
        );

        // Get user's compass heading
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientationabsolute", (event) => {
                if (event.absolute && event.alpha !== null) {
                    setHeadingOffset(event.alpha * (Math.PI / 180)); // Convert degrees to radians
                }
            });
        }
    }, []);

    useEffect(() => {
        if (!userLocation) return;

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
                scene.add(camera);

                const xrReferenceSpace = await session.requestReferenceSpace("local-floor");

                const gl = renderer.getContext();
                await gl.makeXRCompatible();
                renderer.xr.setReferenceSpaceType("local-floor");

                renderer.xr.setSession(session);
                setIsAR(true);

                placeVideos(scene, session, xrReferenceSpace, headingOffset);

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
    }, [userLocation, headingOffset, setEndSession, setIsAR]);

    const placeVideos = async (scene, session, referenceSpace, headingOffset) => {
        const distance = 5; // Distance in meters to place the videos

        // Convert real-world North into the Three.js world
        const northAngle = 0 - headingOffset;
        const eastAngle = Math.PI / 2 - headingOffset;
        const southAngle = Math.PI - headingOffset;
        const westAngle = (3 * Math.PI) / 2 - headingOffset;

        const videoPositions = [
            { src: "/videos/north.mp4", angle: northAngle },
            { src: "/videos/east.mp4", angle: eastAngle },
            { src: "/videos/south.mp4", angle: southAngle },
            { src: "/videos/west.mp4", angle: westAngle }
        ];

        for (const { src, angle } of videoPositions) {
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

            const geometry = new THREE.PlaneGeometry(2, 1.5);
            const material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(geometry, material);

            // Calculate the plane's position based on direction
            plane.position.set(
                Math.cos(angle) * distance,
                1.5,
                Math.sin(angle) * distance
            );

            // Make the plane always face the user
            plane.lookAt(0, 1.5, 0);

            scene.add(plane);

            if (session.requestAnchor) {
                const anchor = await session.requestAnchor(plane.position, referenceSpace);
                anchor.attach(plane);
            }
        }
    };

    return isARSupported ? 
    (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
        </div>
    ) : 
    <p>WebXR AR not supported on this device.</p>;
};

CardinalVideosLocation.propTypes = {
    setIsAR: propTypes.func.isRequired,
    setEndSession: propTypes.func.isRequired,
}

export default CardinalVideosLocation;
