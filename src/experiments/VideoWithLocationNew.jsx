import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
//import * as geolib from 'geolib';
import { ChromaKeyMaterial } from "../components/ChromaKeyShader";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// const METERS_PER_DEGREE_LAT = 111320; // Rough estimate (1 degree latitude ≈ 111.32 km)
// const METERS_PER_DEGREE_LON = (lat) => 111320 * Math.cos((lat * Math.PI) / 180); // Adjusted for latitude

const CardinalVideosLocation = ({ session, endSession }) => {
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

    // const placeVideos = (vid, heading)

    useEffect(() => {
        if (!session) return;

        const initAR = () => {
            const container = containerRef.current;

            // Initialize Renderer
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.xr.enabled = true;
            rendererRef.current = renderer;

            const animate = () => {
                renderer.render(scene, camera);
            };

            renderer.setAnimationLoop(animate);

            //Initialize Scene
            const scene = new THREE.Scene();
            sceneRef.current = scene;

            // Initialize Camera
            const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
            cameraRef.current = camera;

            rendererRef.current.xr.setReferenceSpaceType("local");
            rendererRef.current.xr.setSession(session);

            if (container) container.appendChild(renderer.domElement);

            // Add a Light
            const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
            scene.add(light);



        };

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
    }, [session, endSession]);

    return isARSupported ?
        (
            <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
            </div>
        ) :
        <p>WebXR AR not supported on this device.</p>;
};

CardinalVideosLocation.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
}

export default CardinalVideosLocation;
