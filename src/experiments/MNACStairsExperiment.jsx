import AFRAME from 'aframe';
import 'aframe-textarea-component';
import { useEffect, useRef, useState } from 'react';
import imgOverlay from '../assets/peacock.png';
import * as dat from 'dat.gui';

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

AFRAME.registerComponent('click-to-edit', {
    init: function () {
        const input = document.createElement('input');
        input.type = 'text';
        input.style.position = 'absolute';
        input.style.opacity = '0';
        input.style.pointerEvents = 'none';
        input.style.zIndex = -1;

        document.body.appendChild(input);

        const target = this.el;

        this.el.addEventListener('click', () => {
            input.value = target.getAttribute('value');
            input.click();
            input.focus();

            input.addEventListener('input', () => {
                target.setAttribute('value', input.value);
            });
        });
    }
});

// AFRAME.registerComponent('auto-resize', {
//     tick: function () {
//         this.el.setAttribute('width', this.el.textContent.length * (this.el.getAttribute('width') / this.el.getAttribute('wrapCount')))
//     },
// })

AFRAME.registerComponent('record-audio', {
    init: function () {
        let mediaRecorder;
        let chunks = [];
        let recording = false;

        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                chunks = [];

                mediaRecorder.ondataavailable = e => chunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    const audio = document.createElement('audio');
                    audio.controls = true;
                    audio.src = url;
                    audio.style.position = 'absolute';
                    audio.style.zIndex = '1000';
                    document.body.appendChild(audio); // Append or handle however you want
                };

                mediaRecorder.start();
                recording = true;
                this.el.setAttribute('color', 'red');
            } catch (err) {
                console.error('Audio recording failed:', err);
            }
        };

        const stopRecording = () => {
            if (mediaRecorder && recording) {
                mediaRecorder.stop();
                recording = false;
                this.el.setAttribute('color', 'green');
            }
        };

        this.el.addEventListener('click', () => {
            if (!recording) {
                startRecording();
            } else {
                stopRecording();
            }
        });

        // Optional: provide visual cue on hover
        this.el.addEventListener('mouseenter', () => {
            this.el.setAttribute('scale', '1.1 1.1 1.1');
        });
        this.el.addEventListener('mouseleave', () => {
            this.el.setAttribute('scale', '1 1 1');
        });
    }
});


const MNACStairsExperiment = () => {

    const [isAligned, setIsAligned] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const answerEntityRef = useRef(null);
    const logText = useRef(null);

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

    useEffect(() => {
        if (isAligned && answerEntityRef.current) {
            const gui = new dat.GUI();
            const answerPosition = answerEntityRef.current.getDOMAttribute('position');
            // logText.current.setAttribute('value', AFRAME.utils.coordinates.stringify(answerPosition)); // Use this is for debugging values
            const controller = {
                x: answerPosition.x,
                y: answerPosition.y,
                z: answerPosition.z
            };

            gui.add(controller, 'x', -10, 10).onChange(val => {
                answerEntityRef.current.setAttribute('position', `${val} ${controller.y} ${controller.z}`);
            });
            gui.add(controller, 'y', -10, 10).onChange(val => {
                answerEntityRef.current.setAttribute('position', `${controller.x} ${val} ${controller.z}`);
            });
            gui.add(controller, 'z', -200, 1).onChange(val => {
                answerEntityRef.current.setAttribute('position', `${controller.x} ${controller.y} ${val}`);
            });

            return () => gui.destroy(); // Clean up on unmount
        }
    }, [isAligned]);


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
                        /*width: "auto",
                        height: "auto",*/
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
                <a-camera position="0 1.6 0" look-controls="touchEnabled: false; mouseEnabled: false;">
                    {/* <a-entity cursor="rayOrigin: mouse;" raycaster="objects: .clickable" position="0 0 -1"></a-entity> */}
                    <a-cursor fuse="false"></a-cursor>
                </a-camera>

                {isAligned && (
                    <a-entity ref={answerEntityRef} position="0 1.5 -2">
                        {/* Question */}
                        <a-text
                            value="O museu é um lugar de Justiça?"
                            align="center"
                            width="3.5"
                            color="white"
                        ></a-text>
                        <a-text ref={logText} position="0 1.7 -2" color="white"></a-text>

                        {/* Record Button */}
                        <a-box
                            position="-1 -0.5 0"
                            width="1.5"
                            height="0.3"
                            depth="0.1"
                            color='green'
                            class="clickable"
                            record-audio
                        ></a-box>
                        <a-text
                            value="Record / Stop"
                            position="-1 -0.5 0.1"
                            align="center"
                            width="2"
                            color="white"
                        ></a-text>
                        <a-text
                            id="editableText"
                            class="clickable"
                            value="Click to type..."
                            position="1 -0.5 0.1"
                            align="center"
                            // anchor="left"
                            // baseline="top"
                            width="2"
                            wrapCount="15"
                            color="white"
                            geometry="primitive:plane; height:0; width:0"
                            material="opacity: 0;"
                            click-to-edit
                        ></a-text>
                    </a-entity>
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

export default MNACStairsExperiment;