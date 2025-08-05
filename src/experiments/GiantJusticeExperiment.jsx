import AFRAME from 'aframe';
import { useEffect, useRef, useState } from 'react'
import imgOverlay from '../assets/align_giant_justice.jpg';
import propTypes from 'prop-types';
// import { VERTEX_SHADER, FRAGMENT_SHADER } from '../components/shaders';
import { ChromaKeyMaterial } from '../components/ChromaKeyShader';
import text from '../data/localization';
// import * as dat from 'dat.gui';


AFRAME.registerComponent('apply-camera-orientation', {
    init: function () {
        const camera = this.el.sceneEl.camera;

        camera.updateMatrixWorld();

        // Apply rotation
        this.el.object3D.position.set(0, 0, -70).applyMatrix4(camera.matrixWorld);
        this.el.object3D.quaternion.setFromRotationMatrix(camera.matrixWorld);

        // const cameraQuat = camera.quaternion.clone();
        // this.el.object3D.quaternion.copy(cameraQuat);
    }
});

AFRAME.registerComponent('move-forward', {
    schema: {
        speed: { type: 'number', default: 0.5 },
        stopDistance: { type: 'number', default: 10 } // distance to stop
        // minZ: { type: 'number', default: -2 }
    },
    init: function () {
        const video = document.querySelector('#giantJustice');
        if (video) {
            video.loop = false;
            video.pause();
            video.currentTime = 0;
            video.play().catch(err => {
                console.warn("Video play failed:", err);
            });
        }
    },
    tick: function (time, timeDelta) {
        const el = this.el;
        const position = el.object3D.getWorldPosition(new AFRAME.THREE.Vector3());

        const camera = el.sceneEl.camera;
        const cameraPosition = new AFRAME.THREE.Vector3();
        camera.getWorldPosition(cameraPosition);

        const directionToCamera = cameraPosition.clone().sub(position).normalize();
        const distance = position.distanceTo(cameraPosition);

        if (distance <= this.data.stopDistance) return;

        const movement = directionToCamera.multiplyScalar(this.data.speed * (timeDelta / 1000));
        el.object3D.position.add(movement);
    }

});


const GiantJustice = ({ onFinish }) => {

    const [isAligned, setIsAligned] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [ended, setEnded] = useState(false);
    const videoEntityRef = useRef(null);
    const streamRef = useRef(null);
    // const [zValue, setZValue] = useState(-70);
    // const zValueRef = useRef(-70);
    // const intervalRef = useRef(null);

    const [lang] = useState(localStorage.getItem("lang") || 'pt');

    const getCamera = async () => {
        const video = document.getElementById("webcam");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { exact: "environment" } // <-- This tries to get the rear camera
                }
            });
            streamRef.current = stream;
            video.srcObject = stream;
        } catch (err) {
            console.error("Error accessing webcam: ", err);
        }
    };

    useEffect(() => {
        // Auto-enter fullscreen + start camera
        const run = async () => {
            await getCamera();

            // Slight timeout to ensure DOM is mounted
            // setTimeout(() => {
            //     enterFullscreen(document.documentElement);
            // }, 100);
        };

        run();

        const scene = document.querySelector('a-scene');
        if (scene) {
            scene.addEventListener('loaded', () => setLoaded(true))
        }

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const sceneEl = document.querySelector('a-scene');
            if (sceneEl?.renderer?.dispose) {
                sceneEl.renderer.dispose();
            }
        }
    }, []);

    useEffect(() => {
        const video = document.getElementById('giantJustice');
        if (!video) return;

        const handleVideoEnded = () => {
            console.log("Video Ended");
            setEnded(true);
            setTimeout(() => {
                onFinish();
            }, 5000);
        }

        video.onended = handleVideoEnded;

        // video.addEventListener("ended", handleVideoEnded);

        return () => {
            video.onended = null;
            // video.removeEventListener("ended", handleVideoEnded);
        }
    }, []);

    // useEffect(() => {
    //     // Move the video forward every second
    //     intervalRef.current = setInterval(() => {
    //         // zValueRef.current += 1.5;
    //         // if (zValueRef.current >= -2) {
    //         //     clearInterval(intervalRef.current);
    //         //     zValueRef.current = -2;
    //         // }
    //         setZValue(prev => {
    //             const next = prev + 1.5; // Adjust speed here
    //             if (next >= -2) {
    //                 clearInterval(intervalRef.current);
    //                 return -2; // Stop close to the user
    //             }

    //             if (videoEntityRef.current) {
    //                 const pos = videoEntityRef.current.getAttribute('position');
    //                 videoEntityRef.current.setAttribute('position', { ...pos, z: next });
    //             }

    //             return next;
    //         });
    //     }, 1000);
    //     return () => clearInterval(intervalRef.current);
    // }, []);

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

        const camera = document.querySelector('a-camera');
        const cameraDirection = new AFRAME.THREE.Vector3();
        camera.object3D.getWorldDirection(cameraDirection);

        // Create entity
        const aentityVideo = document.createElement('a-entity');
        aentityVideo.setAttribute('id', 'videoPlane');
        aentityVideo.setAttribute('apply-camera-orientation', '');
        aentityVideo.setAttribute('geometry', 'primitive: plane; height: 16; width: 9');
        aentityVideo.setAttribute('position', '0 0 -70');
        aentityVideo.setAttribute('move-forward', {
            speed: 1.5,
            stopDistance: 7
        });

        aentityVideo.object3D.userData.forwardDirection = cameraDirection.clone();
        videoEntityRef.current = aentityVideo;

        document.querySelector('#scene').appendChild(aentityVideo);

        // Wait until the entity's mesh is available (1 tick delay)
        setTimeout(() => {
            const mesh = videoEntityRef.current.getObject3D('mesh');
            if (mesh) {
                const chromaMaterial = new ChromaKeyMaterial(
                    '/videos/fortaleza_cropped.mp4', // your video path
                    '#63b757',                       // key color
                    1920,                            // width (can be video width)
                    1080,                            // height
                    0.149,                           // similarity
                    0.02,                            // smoothness
                    0                                // spill (optional)
                );

                mesh.material = chromaMaterial;
            } else {
                console.warn('Mesh not ready yet');
            }
        }, 0);
    };

    return (
        <div id='container'>

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
                    className='absolute bottom-5 left-1/2 -translate-x-1/2 p-2 bg-[#E6E518] border-2 border-black rounded-lg cursor-pointer z-[1000] font-fontBtnMenus text-black tracking-thighter hover:border-[#E6E518] active:border-[#E6E518]'
                >
                    { text[lang].experiences["justica-monstro"].alignScene }
                </button>
            )}
            {ended && (
                <div className="absolute w-5/6 h-5/6 top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] bg-black/70 text-white p-10 rounded-md text-xl font-semibold text-center z-[999]">
                    {
                    // Text to show after the video has ended
                    }Text
                </div>
            )}
            <a-scene id="scene" xr-mode-ui="enabled: false">
                <a-assets>
                    <video id="giantJustice" muted src="/videos/fortaleza_cropped.mp4"></video>
                </a-assets>
                <a-camera position="0 1.6 0" look-controls="touchEnabled: false; mouseEnabled: false;"></a-camera>
                {/* {isAligned && (
                    <a-video ref={videoEntityRef} id="videoPlane" src="#giantJustice" width="9" height="16" position={`0 0 ${zValue}`}></a-video>
                )} */}
                {/* <a-video ref={videoEntityRef} src="#giantJustice" visible={isAligned} width="9" height="16" position={`0 0 ${zValue}`}></a-video> */}
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

GiantJustice.propTypes = {
    onFinish: propTypes.func.isRequired,
}

export default GiantJustice;