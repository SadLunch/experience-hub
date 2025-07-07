import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { takeXRScreenshot } from '../components/XRScreenshot';
import progress1 from '../assets/progress-bg-1.jpg';
import download from '../assets/download_icon.png';

const raycaster = new THREE.Raycaster();

const Graffiti_2FM_Image2 = ({ session, endSession }) => {
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

    const totalRelevantPixels = useRef(0);
    // const [totalPixels, setTotalPixels] = useState(0);
    const [revealed, setRevealed] = useState(0);
    const totalCounted = useRef(false);
    const isTakingScreenshot = useRef(false);

    const [imageURL, setImageURL] = useState(null);
    // const revealedPixelCount = useRef(0);
    // const revealedMap = useRef(new Uint8Array(512 * 512)); // initialize for 512x512 canvas

    const progressInterval = useRef(null);

    const [error, setError] = useState(null);


    // // groups ref
    // const movableGroupRef = useRef(null);

    const loader = new GLTFLoader();

    const downloadImage = () => {
        const link = document.createElement("a");
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-');
        link.download = `screenshot_${timestamp}.png`;
        link.href = imageURL;
        link.click();
    }

    const loadModel = (src, refVar, name = null, callback = null) => {
        loader.load(src, (gltf) => {
            refVar.current = gltf.scene;
            if (name) refVar.current.name = name;
            if (callback) callback();
        });
    };

    const calculateRevealPercentage = (maskCanvas) => {
        if (totalRelevantPixels.current === 0) return;

        const ctx = maskCanvas.getContext('2d');
        const pixels = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;

        let revealedCount = 0;
        //const totalPixels = maskCanvas.width * maskCanvas.height;

        for (let i = 0; i < pixels.length; i += 4) {
            const alpha = pixels[i + 3];
            if (alpha > 0) {
                // const r = pixels[i]; // Assuming 'white' means revealed
                // if (r > 128) revealedCount++;
                revealedCount++;
            }
        }

        setRevealed((revealedCount / totalRelevantPixels.current) * 100);

        // return (revealedCount / totalRelevantPixels.current) * 100;
    }

    // const calculateRevealPercentage = () => {
    //     if (totalRelevantPixels.current === 0) return;

    //     const percent = (revealedPixelCount.current / totalRelevantPixels.current) * 100;
    //     setRevealed(percent);
    // };



    const initAR = () => {
        const container = containerRef.current;

        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
        cameraRef.current = camera;
        //camera.position.set(0, 3.6, 3); // typical VR height

        if (!rendererRef.current) {
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.xr.enabled = true;
            rendererRef.current = renderer;
        }

        // Need this to make AR work (DONT FORGET THIS)
        rendererRef.current.xr.setReferenceSpaceType("local");
        rendererRef.current.xr.setSession(session);

        if (container) container.appendChild(rendererRef.current.domElement);

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
        sourceImage.src = '/images/feminista final2.png'; // switch to the desired image
        sourceImage.crossOrigin = 'anonymous';

        sourceImage.onload = () => {
            if (totalCounted.current) return;

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = textureSize;
            tempCanvas.height = textureSize;
            const tempCtx = tempCanvas.getContext('2d');

            // Draw the image onto the temp canvas
            tempCtx.drawImage(sourceImage, 0, 0, textureSize, textureSize);

            // Read image data
            const imgData = tempCtx.getImageData(0, 0, textureSize, textureSize);
            const data = imgData.data;

            for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];
                if (alpha > 0) {
                    totalRelevantPixels.current++;
                }
            }

            //setTotalPixels(totalRelevantPixels.current);
            totalCounted.current = true;

            console.log("Total non-transparent (revealable) pixels:", totalRelevantPixels.current);
        }

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
            new THREE.PlaneGeometry(2, 1),
            revealMaterial
        );
        wallPlane.position.y = 0
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
        const controller = rendererRef.current.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        scene.add(controller);
        controllerRef.current = controller;

        rendererRef.current.domElement.addEventListener('touchstart', (event) => {
            if (event.touches.length == 2) {
                startSpraying();
            }
        })

        rendererRef.current.domElement.addEventListener('touchend', stopSpraying);

        sphereIndicator.current = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
        );
        sphereIndicator.current.visible = false;
        scene.add(sphereIndicator.current);

        if (!progressInterval.current) {
            progressInterval.current = setInterval(() => {
                calculateRevealPercentage(paintCanvas);
            }, 1000);
        }

        // Animation Loop
        rendererRef.current.setAnimationLoop(() => {
            // Check if spray can is in scene
            if (controllerRef.current.userData.selected && wallPlane && sourceImage.complete) {
                const sprayTip = new THREE.Vector3();
                // sprayTip.add(selectedObject.current.getObjectByName("Tip").position);
                selectedObject.current.getWorldPosition(sprayTip);

                raycaster.set(sprayTip, new THREE.Vector3(0, 0, -10).applyQuaternion(cameraRef.current.quaternion));

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

                            // // Count revealed pixels within brush area
                            // const imageData = paintCtx.getImageData(x - radius, y - radius, radius * 2, radius * 2);
                            // const data = imageData.data;

                            // for (let j = 0; j < data.length; j += 4) {
                            //     const pxIndex = (y - radius + Math.floor(j / 4 / (radius * 2))) * textureSize + (x - radius + (j / 4) % (radius * 2));

                            //     if (pxIndex >= 0 && pxIndex < revealedMap.current.length && revealedMap.current[pxIndex] === 0) {
                            //         const alpha = data[j + 3];
                            //         if (alpha > 0) {
                            //             revealedMap.current[pxIndex] = 1;
                            //             revealedPixelCount.current++;
                            //         }
                            //     }
                            // }

                            // calculateRevealPercentage();
                        }
                    }
                } else {
                    sphereIndicator.current.visible = false;
                }

                // calculateRevealPercentage(paintCanvas)
                // progressBarRef.current.value = percent;
            } else {
                sphereIndicator.current.visible = false;
            }



            rendererRef.current.render(scene, camera);

        });


    };

    // const takeScreenshot = async () => {
    //     const container = document.getElementsByTagName('canvas')[0];
    //     if (!container) return;

    //     try {
    //         const canvas = await html2canvas(container, {
    //             useCORS: true,
    //             logging: false,
    //             allowTaint: true,
    //             backgroundColor: null,
    //         });

    //         const dataUrl = canvas.toDataURL('image/png');

    //         const link = document.createElement('a');
    //         link.href = dataUrl;
    //         link.download = 'graffiti_screenshot.png';
    //         link.click();
    //     } catch (err) {
    //         console.error('Screenshot failed:', err);
    //     }
    // };



    useEffect(() => {
        if (!session) return;

        const cleanupScene = () => {

            clearInterval(progressInterval.current);

            if (sceneRef.current) {
                sceneRef.current.children.forEach((object) => {
                    if (!object.isLight) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) object.material.dispose();
                        sceneRef.current.remove(object);
                    }
                });
            }

            progressInterval.current = null;
        };

        initAR();



        return () => {
            cleanupScene();
        }
    }, [session, endSession])

    return (
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
            {/* <div id="step1" className='absolute w-5/6 bottom-20 left-[50%] translate-x-[-50%] bg-black/70 text-white p-10 rounded-md text-xl font-semibold font-fontSans text-center'>
                Look around and find the spray paint can.
            </div>
            <div id="step2" className='absolute w-5/6 bottom-20 left-[50%] translate-x-[-50%] bg-black/70 text-white p-10 rounded-md text-xl font-semibold font-fontSans text-center'>
                Grab the spray paint can (touch and hold).
            </div>
            <div id="step3" className='absolute w-5/6 bottom-20 left-[50%] translate-x-[-50%] bg-black/70 text-white p-10 rounded-md text-xl font-semibold font-fontSans text-center'>
                <div>If you see a semi-transparent ball that means you found a &quot;sprayable&quot; area</div>
                <div>Touch anywhere on the screen to spray.</div>
            </div> */}
            {error && (
                <div className='absolute top-20 p-4 rounded-lg left-1/2 -translate-x-1/2 bg-gray-500 text-white z-9999'>
                    {`${error.name}: ${error.message}`}
                </div>
            )}
            {!imageURL && (
                <div className="absolute w-screen bottom-5 left-1/2 -translate-x-1/2 px-4">
                    <div onClick={async () => {
                        if (revealed >= 90) {
                            isTakingScreenshot.current = true;
                            sphereIndicator.current.visible = false;

                            try {
                                setImageURL(await takeXRScreenshot(rendererRef.current, sceneRef.current, cameraRef.current));
                            } catch (err) {
                                setError(err);
                            }

                            isTakingScreenshot.current = false;
                            sphereIndicator.current.visible = true;
                        }
                    }} className="w-9/10 h-[70px] bg-transparent p-2">
                        <div className="w-full h-full bg-gray-300 border-black border-8 rounded-full relative overflow-hidden">
                            <div
                                className="h-full bg-gray-400 rounded-full text-xl text-white flex justify-center items-center absolute left-1/2 top-0 -translate-x-1/2 transition-all duration-300"
                                style={{
                                    width: `${revealed}%`,
                                    backgroundImage: `url(${progress1})`, // background image (maybe change later)
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {revealed >= 90 ? "Take Screenshot" : `${revealed.toFixed(1)}%`}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {imageURL && (
                <div className="fixed inset-0 flex items-center justify-center z-9998">
                    <div className='relative animate-scale-in'>
                        {/* Close Button */}
                        <span className="absolute top-2 right-2 w-10 h-10 rounded-full border-2 border-white bg-black cursor-pointer text-white flex items-center justify-center shadow-md" onClick={() => {
                            setImageURL(null);
                        }}>
                            ✕
                        </span>
                        <div className="border-2 rounded-xl border-white bg-black overflow-hidden">

                            <img src={imageURL} alt="Picture taken" className="block max-w-[99vw] max-h-[80vh]" />
                            {/* Your content here */}
                        </div>
                        <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full cursor-pointer text-white flex items-center justify-center" onClick={() => {
                            downloadImage();
                        }}>
                            <img src={download} alt="Download Icon" width={32} height={32} />
                            <span className='ml-2 text-[#E6E518] font-fontBtnMenus'>Download</span>
                        </span>
                    </div>
                </div>
            )}

        </div>
    );
}

Graffiti_2FM_Image2.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default Graffiti_2FM_Image2;