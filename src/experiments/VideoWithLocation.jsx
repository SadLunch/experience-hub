import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
//import * as geolib from 'geolib';
import { ChromaKeyMaterial } from "../components/ChromaKeyShader";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// const METERS_PER_DEGREE_LAT = 111320; // Rough estimate (1 degree latitude ≈ 111.32 km)
// const METERS_PER_DEGREE_LON = (lat) => 111320 * Math.cos((lat * Math.PI) / 180); // Adjusted for latitude

const CardinalVideosLocation = ({ setIsAR, setEndSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const [isARSupported, setIsARSupported] = useState(false);
    //const [userLocation, setUserLocation] = useState(null);
    const [headingOffset, setHeadingOffset] = useState(0); // Stores real-world North direction
    //const userLocation = useRef(null);

    const [videoPositions] = useState([
        { src: "/videos/fortaleza_cropped.mp4", coords: null, bearing: 0, dir: "North" },
        { src: "/videos/paz_cropped.mp4", coords: null, bearing: Math.PI / 2, dir: "East" },
        { src: "/videos/prudência_cropped.mp4", coords: null, bearing: Math.PI, dir: "South" },
        { src: "/videos/temperança_cropped.mp4", coords: null, bearing: (3 * Math.PI) / 2, dir: "West" }
    ]);

    useEffect(() => {
        //if (!userLocation.current) return;
        if (!navigator.xr) {
            console.warn("WebXR not supported.");
            return;
        }

        setIsARSupported(true);

        // // Get user's starting location
        // navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //         userLocation.current = {
        //             lat: position.coords.latitude,
        //             lon: position.coords.longitude
        //         };
        //         const updatedVideos = videoPositions.map((vid) => ({
        //             ...vid//,
        //             // coords: geolib.computeDestinationPoint(
        //             //     { latitude: position.coords.latitude, longitude: position.coords.longitude },
        //             //     4, vid.bearing
        //             // )
        //         }));

        //         setVideoPositions(updatedVideos); // Updates state
        //     },
        //     (error) => console.warn("Geolocation failed:", error),
        //     { enableHighAccuracy: true }
        // );

        let session;

        // function placeVideos(scene, heading) {
        //     const distance = 5; // Distance in meters to place the videos


        //     const loader = new GLTFLoader();

        //     videoPositions.forEach((vid) => {
        //         const video = document.createElement("video");
        //         video.src = vid.src;
        //         video.crossOrigin = "anonymous";
        //         video.loop = true;
        //         video.muted = true;
        //         video.autoplay = true;
        //         video.play();

        //         const videoTexture = new THREE.VideoTexture(video);
        //         videoTexture.minFilter = THREE.LinearFilter;
        //         videoTexture.magFilter = THREE.LinearFilter;
        //         videoTexture.format = THREE.RGBAFormat;

        //         // Shader to remove green
        //         const material = new ChromaKeyMaterial(vid.src, 0x63b757, 1080, 1920, 0.159, 0.02, 0);

        //         // const distance = geolib.getDistance(
        //         //     {latitude: userLocation.current.lat, longitude: userLocation.current.lon},
        //         //     {latitude: vid.coords.latitude, longitude: vid.coords.longitude}
        //         // );

        //         // const bearing = geolib.getRhumbLineBearing(
        //         //     {latitude: userLocation.current.lat, longitude: userLocation.current.lon},
        //         //     {latitude: vid.coords.latitude, longitude: vid.coords.longitude}
        //         // );

        //         // const relativeAngle = (bearing - heading + 360) % 360;
        //         const relativeAngle = THREE.MathUtils.degToRad(heading) + vid.bearing;

        //         console.log(`${vid.dir} angle: ${relativeAngle}`);

        //         let x = distance * Math.sin(relativeAngle);
        //         let z = - distance * Math.cos(relativeAngle);
        //         console.log(`${vid.dir} x position: ${x}`);
        //         console.log(`${vid.dir} z position: ${z}`);

        //         let model;

        //         loader.load("/models/doorway_v5.glb", (gltf) => {
        //             model = gltf.scene;
        //             model.name = "doorway_" + vid.dir;
        //             //model.scale.set(1, 1, 1);
        //             // Calculate the plane's position based on direction
        //             model.position.set(
        //                 x,
        //                 0,
        //                 z
        //             );
        //             model.lookAt(0,0,0);
        //             const doorway = model.getObjectByName("DoorVideo");
        //             if (doorway.isMesh) doorway.material = material;
        //             scene.add(model);
        //         });

        //         console.log(`${vid.dir} placed at (${x.toFixed(2)}, ${z.toFixed(2)})`);

        //         // // Make the plane always face the user
        //         // plane.lookAt(0, 1.6, 0);

        //         // scene.add(plane);
        //     });
        // }

        function placeVideos(scene, vid, heading) {
            const distance = 2; // Distance in meters to place the videos


            const loader = new GLTFLoader();
            const video = document.createElement("video");
            video.src = vid.src;
            video.crossOrigin = "anonymous";
            video.loop = true;
            video.muted = true;
            video.autoplay = true;
            video.play();

            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;
            videoTexture.format = THREE.RGBAFormat;

            // Shader to remove green
            const material = new ChromaKeyMaterial(vid.src, 0x63b757, 1080, 1920, 0.159, 0.02, 0);

            // const relativeAngle = (bearing - heading + 360) % 360;
            const relativeAngle = heading + vid.bearing;

            console.log(`${vid.dir} angle: ${relativeAngle}`);

            const x = distance * Math.sin(relativeAngle);
            const z = - distance * Math.cos(relativeAngle);
            console.log(`${vid.dir} x position: ${x}`);
            console.log(`${vid.dir} z position: ${z}`);

            let model;

            loader.load("/models/doorway_v5.glb", (gltf) => {
                model = gltf.scene;
                model.name = "doorway_" + vid.dir;
                model.scale.set(0.3, 0.3, 0.3);
                model.position.set(
                    x,
                    0,
                    z
                ).applyMatrix4(cameraRef.current.matrixWorld);
                model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
                model.lookAt(0, 0, 0);
                const doorway = model.getObjectByName("DoorVideo");
                if (doorway.isMesh) doorway.material = material;
                scene.add(model);
            });

            console.log(`${vid.dir} placed at (${x.toFixed(2)}, ${z.toFixed(2)})`);
        }

        const handleOrientation = (event) => {
            setHeadingOffset(event.alpha);
            console.log(event.alpha);
        }

        const initAR = async () => {
            try {
                let all4placed = false;
                const container = containerRef.current;
                session = await navigator.xr.requestSession("immersive-ar", {
                    requiredFeatures: ["anchors", "local-floor", "dom-overlay"],
                    domOverlay: { root: document.body }
                });

                const handleSessionEnd = () => {
                    setIsAR(false);
                    setEndSession(null);
                };

                session.addEventListener("end", handleSessionEnd);

                const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.xr.enabled = true;
                rendererRef.current = renderer;
                if (container) container.appendChild(renderer.domElement);

                const scene = new THREE.Scene();
                sceneRef.current = scene;

                const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
                cameraRef.current = camera;
                scene.add(camera);

                const gl = renderer.getContext();
                await gl.makeXRCompatible();
                renderer.xr.setReferenceSpaceType("local-floor");

                renderer.xr.setSession(session);
                setIsAR(true);
                // CHECK IF WORKING
                window.addEventListener('deviceorientation', (event) => {
                    let heading = event.alpha;
                    if (heading !== null && !all4placed) {
                        let radianHeading = THREE.MathUtils.degToRad(heading);
                        videoPositions.forEach((v) => {
                            placeVideos(sceneRef.current, v, radianHeading);
                        })
                        all4placed = true;
                    }
                }, { enableHighAccuracy: true })

                placeVideos(scene, headingOffset);

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
                    if (rendererRef.current) {
                        rendererRef.current.setAnimationLoop(null);
                    }
                    const session = rendererRef.current?.xr.getSession();
                    if (session) {
                        session.removeEventListener("end", handleSessionEnd);
                        session.end();
                    }

                    setIsAR(false);
                    setEndSession(null);
                });
            } catch (error) {
                console.warn("Failed to start AR:", error);
            }
        };

        initAR();

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            if (session) {
                session.end();
            }
        }
    }, [headingOffset, setEndSession, setIsAR, videoPositions]);

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
