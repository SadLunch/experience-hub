import 'aframe';
import { useEffect, useRef, useState } from 'react'
import imgOverlay from '../assets/align_giant_justice.jpg'
// import * as dat from 'dat.gui';

const getCamera = async () => {
    const video = document.getElementById("webcam");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { exact: "environment" } // <-- This tries to get the rear camera
            }
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing webcam: ", err);
    }
};

const enterFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

const GiantJustice = () => {

    const [isAligned, setIsAligned] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const videoEntityRef = useRef(null);

    useEffect(() => {
        // Auto-enter fullscreen + start camera
        const run = async () => {
            await getCamera();

            // Slight timeout to ensure DOM is mounted
            setTimeout(() => {
                enterFullscreen(document.documentElement);
            }, 100);
        };

        run();

        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.addEventListener('loaded', () => {
                setLoaded(true);
            })
        }
    }, []);

    // useEffect(() => {
    //     if (isAligned && videoEntityRef.current) {
    //         const gui = new dat.GUI();
    //         const videoPosition = videoEntityRef.current.getDOMAttribute('position');
    //         const videoWidth = videoEntityRef.current.getDOMAttribute('width');
    //         const videoHeight = videoEntityRef.current.getDOMAttribute('height');

    //         const controller = {
    //             x: videoPosition.x,
    //             y: videoPosition.y,
    //             z: videoPosition.z
    //         };

    //         gui.add(controller, 'x', -10, 10).onChange(val => {
    //             videoEntityRef.current.setAttribute('position', `${val} ${controller.y} ${controller.z}`);
    //         });
    //         gui.add(controller, 'y', -10, 10).onChange(val => {
    //             videoEntityRef.current.setAttribute('position', `${controller.x} ${val} ${controller.z}`);
    //         });
    //         gui.add(controller, 'z', -200, 1).onChange(val => {
    //             videoEntityRef.current.setAttribute('position', `${controller.x} ${controller.y} ${val}`);
    //         });

    //         const scaleController = {
    //             width: videoWidth,
    //             height: videoHeight
    //         };

    //         const scaleGUI = gui.addFolder('Scale');
    //         scaleGUI.add(scaleController, 'width', 9, 27).onChange(val => {
    //             videoEntityRef.current.setAttribute('width', `${val}`);
    //         });
    //         scaleGUI.add(scaleController, 'height', 16, 64).onChange(val => {
    //             videoEntityRef.current.setAttribute('height', `${val}`);
    //         });

    //         return () => gui.destroy(); // Clean up on unmount
    //     }
    // }, [isAligned]);


    const alignScene = () => {
        setIsAligned(true);
    }

    return (
        <div>

            {!isAligned && loaded && (
                <img
                    src={imgOverlay}
                    alt="AR Guide Overlay"
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        // width: "auto",
                        // height: "100%",
                        opacity: 0.5,
                        pointerEvents: "none",
                        zIndex: 999,
                    }}
                />
            )}
            {!isAligned && loaded && (
                <button
                    onClick={alignScene}
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "10px 20px",
                        fontSize: "16px",
                        background: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        zIndex: 1000, // Ensure it's above the AR scene
                    }}
                >
                    Align Scene
                </button>
            )}
            <a-scene xr-mode-ui="enabled: false">
                <a-assets>
                    <video id="giantJustice" autoPlay src="/videos/fortaleza_cropped.mp4"></video>
                </a-assets>
                <a-camera position="0 1.6 0" look-controls="touchEnabled: false; mouseEnabled: false;"></a-camera>
                {isAligned && (
                    <a-video ref={videoEntityRef} src="#giantJustice" width="9" height="16" position="0 0 -70"></a-video>
                )}
            </a-scene>

            <video id="webcam" autoPlay playsInline muted
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                }}
            ></video>
        </div>
    );
}

export default GiantJustice;