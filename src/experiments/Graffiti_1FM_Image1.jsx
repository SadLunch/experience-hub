import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
// import { takeXRScreenshot } from '../components/XRScreenshot';
// import progress1 from '../assets/progress-bg-1.jpg';
import download from '../assets/download_icon.png';
import { useNavigate } from 'react-router-dom';
import text from '../data/localization';
import imgOverlay from '../assets/align_graffiti1.jpg';
import helpButton from '../assets/help_button.png';

const raycaster = new THREE.Raycaster();
const textureSize = 512;

const Graffiti_1FM_Image1 = ({ session, endSession, id, onFinish }) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);

    const controllerRef = useRef(null);

    const canModelRef = useRef(null);
    const hasCanLoaded = useRef(false);
    const revealMaterialRef = useRef(null);
    const spraySoundRef = useRef(null);
    const rattleSoundRef = useRef(null);
    const sourceImageRef = useRef(null);
    const paintCtxRef = useRef(null);
    const paintedTextureRef = useRef(null);
    const wallPlaneRef = useRef(null);

    const hasPickedUpCan = useRef(false);
    const isSpraying = useRef(false);

    const selectedObject = useRef(null);


    const sphereIndicator = useRef(null);
    const isTakingScreenshot = useRef(false);

    const [imageURL, setImageURL] = useState(null);

    const totalRelevantPixels = useRef(0);
    const totalCounted = useRef(false);
    const revealedPixelCount = useRef(0);
    const [revealed, setRevealed] = useState(0);
    const revealedMap = useRef(new Uint8Array(512 * 512)); // initialize for 512x512 canvas

    const [error, setError] = useState(null);

    const [step, setStep] = useState(0);
    const stepRef = useRef(0);
    const [gameStarted, setGameStarted] = useState(false);
    const gameStartedRef = useRef(false);

    const [alignedScene, setAlignedScene] = useState(false);
    const [help, setHelp] = useState(false);
    const helpRef = useRef(false);

    // // groups ref
    // const movableGroupRef = useRef(null);

    const loader = new GLTFLoader();

    const [lang] = useState(localStorage.getItem("lang") || "pt");

    const nextStep = () => {
        stepRef.current += 1;
        setStep(stepRef.current);
        if (stepRef.current > 6) {
            helpRef.current = false;
            setHelp(helpRef.current);
            stepRef.current = null;
            gameStartedRef.current = true
            setGameStarted(true);
        }
    }

    const prevStep = () => {
        if (stepRef.current != 0) {
            stepRef.current -= 1;
            setStep(stepRef.current);
        }
    }

    const showHelp = () => {
        if (helpRef.current) {
            helpRef.current = false;
            stepRef.current = null;
        } else {
            helpRef.current = true;
            stepRef.current = 0;
        }
        setHelp(helpRef.current);
        setStep(stepRef.current);
    }

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
            refVar.current.userData.isPickable = true;
            if (name) refVar.current.name = name;
            if (callback) callback();
        });
    };

    const calculateRevealPercentage = () => {
        if (totalRelevantPixels.current === 0) return;

        const percent = (revealedPixelCount.current / totalRelevantPixels.current) * 100;
        setRevealed(percent);
    };

    const alignScene = () => {
        setAlignedScene(true);
        loadAssets();
        controllerSetup();
        startGame();
    }

    const loadAssets = () => {
        

        // Create a canvas where we'll paint the image gradually
        const paintCanvas = document.createElement('canvas');
        paintCanvas.width = textureSize;
        paintCanvas.height = textureSize;
        const paintCtx = paintCanvas.getContext('2d');

        // Fill with black initially (completely hidden)
        // paintCtx.fillStyle = '#000';
        // paintCtx.fillRect(0, 0, textureSize, textureSize);
        paintCtx.clearRect(0, 0, textureSize, textureSize);
        paintCtxRef.current = paintCtx;

        // Load source image to be revealed
        const sourceImage = new Image();
        sourceImage.src = '/images/femmy.png'; // switch to the desired image
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

        sourceImageRef.current = sourceImage

        const paintedTexture = new THREE.CanvasTexture(paintCanvas);
        paintedTexture.encoding = THREE.sRGBEncoding;
        paintedTexture.needsUpdate = true;
        paintedTextureRef.current = paintedTexture;

        const revealMaterial = new THREE.MeshBasicMaterial({
            map: paintedTexture,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        revealMaterialRef.current = revealMaterial;
    }

    const startGame = () => {
        if (!sceneRef.current || !cameraRef.current || !revealMaterialRef.current) return;

        cameraRef.current.updateMatrixWorld();

        const wallPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 2),
            revealMaterialRef.current
        );
        // wallPlane.position.y = 0
        // wallPlane.position.z = -7;
        wallPlane.position.set(0, 0, -7).applyMatrix4(cameraRef.current.matrixWorld);
        wallPlane.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
        sceneRef.current.add(wallPlane);
        wallPlaneRef.current = wallPlane;

        // Initialize audio listener
        const listener = new THREE.AudioListener();
        cameraRef.current.add(listener);

        const spraySound = new THREE.Audio(listener);
        spraySoundRef.current = spraySound;
        const rattleSound = new THREE.Audio(listener);
        rattleSoundRef.current = rattleSound;

        // Load spray sound
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/sounds/spray.mp3', (buffer) => {
            spraySoundRef.current.setBuffer(buffer);
            spraySoundRef.current.setLoop(true);
            spraySoundRef.current.setVolume(0.5);
        });

        // Load rattle sound
        audioLoader.load('/sounds/rattle.mp3', (buffer) => {
            rattleSoundRef.current.setBuffer(buffer);
            rattleSoundRef.current.setLoop(false);
            rattleSoundRef.current.setVolume(0.5);
        });

        let model;

        // Load model
        loadModel('/models/spray_can_2_2.glb', canModelRef, 'spray can', () => {
            if (!hasCanLoaded.current) {
                model = canModelRef.current
                // Probably will need a separate function for model transformations and stuff
                model.scale.setScalar(1);
                // model.position.set(0, 0, -1);
                model.position.set(0, 0, -1).applyMatrix4(cameraRef.current.matrixWorld);
                model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
                // canModelRef.current.rotation.set(
                //     -Math.PI / 4,
                //     0,
                //     -Math.PI / 2
                // )
                // canModelRef.current.rotateX(-Math.PI/4);
                // canModelRef.current.rotateZ(-Math.PI/2);
                // canModelRef.current.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
                sceneRef.current.add(model);
                hasCanLoaded.current = true;

            }
        });

        sphereIndicator.current = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
        );
        sphereIndicator.current.visible = false;
        sceneRef.current.add(sphereIndicator.current);
    }

    const controllerSetup = () => {
        const onSelectStart = (event) => {
            if (!hasCanLoaded.current || !gameStartedRef.current) return;

            const controller = event.target;


            if (!hasPickedUpCan.current) {
                controller.updateMatrixWorld();

                raycaster.setFromXRController(controller);

                const intersected = raycaster.intersectObject(canModelRef.current);

                if (intersected.length > 0) {
                    let picked = intersected[0].object;

                    while (picked && !picked.userData.isPickable) {
                        picked = picked.parent;
                    }
                    if (picked && picked.userData.isPickable) {
                        selectedObject.current = picked;
                        hasPickedUpCan.current = true;
                        if (rattleSoundRef.current.isPlaying) rattleSoundRef.current.stop();
                        rattleSoundRef.current.play();
                        return;
                    }
                }
            }


            if (!isSpraying.current && hasPickedUpCan.current && selectedObject.current) {
                isSpraying.current = true;
                if (!spraySoundRef.current.isPlaying) spraySoundRef.current.play();
            }
        }

        const onSelectEnd = () => {
            if (isSpraying.current) {
                isSpraying.current = false;
                if (spraySoundRef.current.isPlaying) spraySoundRef.current.stop();
            }
        }
        const controller = rendererRef.current.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        sceneRef.current.add(controller);
        controllerRef.current = controller;
    }

    const initAR = () => {
        const container = containerRef.current;

        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
        cameraRef.current = camera;
        //camera.position.set(0, 3.6, 3); // typical VR height

        // Add a Light to the Scene
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1.5);
        scene.add(light);

        // scene.add(new THREE.AmbientLight(0xffffff, 0.8));

        //Groups
        // const movableGroup = new THREE.Group();
        // scene.add(movableGroup);
        // movableGroupRef.current = movableGroup;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        // renderer.physicallyCorrectLights = true;

        renderer.xr.enabled = true;
        rendererRef.current = renderer;

        // Need this to make AR work (DONT FORGET THIS)
        rendererRef.current.xr.setReferenceSpaceType("local");
        rendererRef.current.xr.setSession(session);

        if (container) container.appendChild(renderer.domElement);

        // let time = 0;

        // Animation Loop
        renderer.setAnimationLoop(() => {
            if (gameStartedRef.current) {
                if (hasPickedUpCan.current) {
                    selectedObject.current.position.copy(cameraRef.current.position);
                    selectedObject.current.quaternion.copy(cameraRef.current.quaternion);

                    selectedObject.current.translateZ(-0.5);
                    selectedObject.current.translateY(-0.2);
                    // time += 0.01; // Increment time

                    // if (selectedObject.current) {
                    //     const x = Math.sin(time) * 1; // moves from -1 to 1
                    //     selectedObject.current.position.set(x, 0, -1); // 1m in front of user
                    // }
                }

                // Check if spray can is in scene
                if (selectedObject.current && wallPlaneRef.current && sourceImageRef.current.complete && !helpRef.current) {
                    const sprayTip = new THREE.Vector3();
                    // sprayTip.add(selectedObject.current.getObjectByName("Tip").position);
                    selectedObject.current.getWorldPosition(sprayTip);

                    raycaster.set(sprayTip, new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRef.current.quaternion));

                    const intersects = raycaster.intersectObject(wallPlaneRef.current);
                    if (intersects.length > 0) {
                        const uv = intersects[0].uv;

                        if (uv) {
                            const x = Math.floor(uv.x * textureSize);
                            const y = Math.floor((1 - uv.y) * textureSize); // flip Y

                            const radius = 50;

                            sphereIndicator.current.visible = !isTakingScreenshot.current;
                            sphereIndicator.current.position.copy(intersects[0].point)

                            if (isSpraying.current) {
                                // Clip drawing to a circle
                                paintCtxRef.current.save();
                                paintCtxRef.current.beginPath();
                                paintCtxRef.current.arc(x, y, radius, 0, Math.PI * 2);
                                paintCtxRef.current.clip();

                                // Draw that part of the source image
                                paintCtxRef.current.drawImage(sourceImageRef.current, 0, 0, textureSize, textureSize);

                                paintCtxRef.current.restore();
                                paintedTextureRef.current.needsUpdate = true;

                                // Count revealed pixels within brush area
                                const imageData = paintCtxRef.current.getImageData(x - radius, y - radius, radius * 2, radius * 2);
                                const data = imageData.data;

                                for (let j = 0; j < data.length; j += 4) {
                                    const pxIndex = (y - radius + Math.floor(j / 4 / (radius * 2))) * textureSize + (x - radius + (j / 4) % (radius * 2));

                                    if (pxIndex >= 0 && pxIndex < revealedMap.current.length && revealedMap.current[pxIndex] === 0) {
                                        const alpha = data[j + 3];
                                        if (alpha > 0) {
                                            revealedMap.current[pxIndex] = 1;
                                            revealedPixelCount.current++;
                                        }
                                    }
                                }

                                calculateRevealPercentage();
                            }
                        }
                    } else {
                        sphereIndicator.current.visible = false;
                    }
                } else {
                    sphereIndicator.current.visible = false;
                }

                if (!isSpraying.current) {
                    if (spraySoundRef.current.isPlaying) spraySoundRef.current.stop();
                }
            }

            renderer.render(scene, camera);
        });




    };

    useEffect(() => {
        if (!session) return;

        const cleanupScene = () => {
            if (rendererRef.current) {
                rendererRef.current.setAnimationLoop(null);
                rendererRef.current.dispose();
                rendererRef.current = null;
            }

            if (sceneRef.current) {
                sceneRef.current.traverse((object) => {
                    if (!object.isLight) {
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) {
                            if (Array.isArray(object.material)) {
                                object.material.forEach((m) => m.dispose());
                            } else {
                                object.material.dispose();
                            }
                        }
                    }
                });

                sceneRef.current.clear();
                sceneRef.current = null;
            }

            cameraRef.current = null;
            canModelRef.current = null;
            hasCanLoaded.current = false;
            controllerRef.current = null;
            selectedObject.current = null;
            isSpraying.current = false;
            // movableGroupRef.current = null;
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
            {!alignedScene && (
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
            {!alignedScene && (
                <button
                    onClick={alignScene}
                    className='absolute bottom-5 left-1/2 -translate-x-1/2 p-2 bg-[#E6E518] border-2 border-black rounded-lg cursor-pointer z-[1000] font-fontBtnMenus text-black tracking-thighter hover:border-[#E6E518] active:border-[#E6E518]'
                >
                    { text[lang].experiences["gremio-lit"].alignScene }
                </button>
            )}
            {step < 6 && (alignedScene || help) && (
                <div className='fixed w-full top-[40%] p-2 z-[1000] flex justify-center'>
                    <div className='bg-zinc-800 bg-opacity-90 text-white p-4 rounded-2xl shadow-2xl'>
                        <p className='text-xl font-bold'>{ text[lang].experiences[id].instructionTitle }</p>
                    </div>
                </div>
            )}
            {step < 7 && ((!gameStarted && alignedScene) || help)  && (
                <div className='fixed bottom-2 w-full p-2 z-1000'>
                    <div className="w-full min-h-[150px] bg-zinc-800 bg-opacity-90 text-white p-4 rounded-2xl shadow-2xl flex flex-col justify-between">
                        <p className='text-lg'>{ text[lang].experiences['graffiti-1'].instructionsEasy[step] }</p>
                        <div className='grid grid-cols-2 gap-2 my-2'>
                            {step > 0 && (
                                <button className="col-start-1 text-center border-2 border-[#E6E518] active:border-[#E6E518] hover:border-[#E6E518] pb-2 px-4 rounded-xl bg-black" onClick={prevStep}>
                                    <span className="font-fontBtnMenus text-xs text-white">{text[lang].experiences[id].prevStep}</span>
                                </button>
                            )}
                            <button className="col-start-2 text-center border-2 border-black active:border-[#E6E518] hover:border-[#E6E518] pb-2 px-4 rounded-xl bg-[#E6E518]" onClick={nextStep}>
                                <span className="font-fontBtnMenus text-xs text-black">{step != 6 ? text[lang].experiences[id].nextStep : text[lang].experiences[id].lastStep}</span>
                            </button>
                        </div>
                        {/* {step > 0 && (
                            <span className="p-4 text-2xl" onClick={prevStep}><FaChevronLeft /></span>
                        )}
                        <p className='text-lg'>{ text[lang].experiences['graffiti-1'].instructionsEasy[step] }</p>
                        <span className="p-4 text-2xl" onClick={nextStep}><FaChevronRight /></span> */}
                    </div>
                </div>
            )}
            {gameStarted && (
                <div className='absolute top-[30%] right-4 p-2' onClick={showHelp}>
                    <img src={helpButton} width={64} height={64} alt="Help button"/>
                </div>
            )}
            {gameStarted && error && (
                <div className='absolute top-20 p-4 rounded-lg left-1/2 -translate-x-1/2 bg-gray-500 text-white z-9999'>
                    {`${error.name}: ${error.message}`}
                </div>
            )}
            {gameStarted && !help && !imageURL && (
                <div className="absolute w-screen bottom-5 left-1/2 -translate-x-1/2 px-4">
                    <div onClick={async () => {
                        if (revealed >= 90) {
                            isTakingScreenshot.current = true;
                            sphereIndicator.current.visible = false;

                            try {
                                // setImageURL(await takeXRScreenshot(rendererRef.current, sceneRef.current, cameraRef.current, "Adelaide Cabete", "#sufragistas"));
                                session.end();
                                navigate(`/experience/${id}/about`);
                                onFinish({ 'Experiment': id, 'Reveal percentage': revealed > 100 ? '100.0%' : `${revealed.toFixed(1)}%` });
                            } catch (err) {
                                setError(err);
                            }

                            isTakingScreenshot.current = false;
                            sphereIndicator.current.visible = true;
                        }
                    }} className="w-9/10 h-[70px] bg-transparent p-2">
                        <div className="w-full h-full bg-gray-300 border-black border-8 rounded-full relative overflow-hidden">
                            <div
                                className="h-full bg-gray-400 rounded-full text-lg text-white flex justify-center items-center absolute left-1/2 top-0 -translate-x-1/2 transition-all duration-300 font-fontBtnMenus"
                                style={{
                                    width: `${revealed}%`,
                                    backgroundColor: '#5690CC',
                                    //backgroundImage: `url(${progress1})`, // background image (maybe change later)
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {revealed >= 90 ? text[lang].experiences["graffiti-1"].moreAbout : `${revealed.toFixed(1)}%`}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {gameStarted && imageURL && (
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
            {/* {revealed >= 90 && (
                <button onClick={async () => {
                    isTakingScreenshot.current = true;
                    sphereIndicator.current.visible = false;

                    await takeXRScreenshot(rendererRef.current, sceneRef.current, cameraRef.current);

                    isTakingScreenshot.current = false;
                    sphereIndicator.current.visible = true;
                }} className='absolute bottom-20 left-[50%] translate-x-[-50%]'>Take Screenshot</button>
            )} */}
        </div>
    );
}

Graffiti_1FM_Image1.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
    id: propTypes.string,
    onFinish: propTypes.func.isRequired,
};

export default Graffiti_1FM_Image1;