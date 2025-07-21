import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import propTypes from 'prop-types';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import imgOverlay from '../assets/align_gremio_lit.jpg';
import { FaChevronRight } from 'react-icons/fa'
import text from '../data/localization';
// import { Tween, Easing } from '@tweenjs/tween.js';

const raycaster = new THREE.Raycaster();

const paths = [
    { start: new THREE.Vector3(3, 1, -9), end: new THREE.Vector3(-10, 1, -9), hearts: 1, lightbulbs: 1/*, orientation: 'h'/* h = horizontal | v = vertical */ },
    { start: new THREE.Vector3(-10, 1, -9), end: new THREE.Vector3(-10, 3, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/ },
    { start: new THREE.Vector3(-10, 3, -9), end: new THREE.Vector3(4.5, 3, -9), hearts: 1, lightbulbs: 1/*, orientation: 'h'*/ },
    { start: new THREE.Vector3(4.5, 3, -9), end: new THREE.Vector3(4.5, 7, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/ },
    { start: new THREE.Vector3(4.5, 7, -9), end: new THREE.Vector3(-9.5, 7.5, -9), hearts: 1, lightbulbs: 1/*, orientation: 'h'*/ },
    { start: new THREE.Vector3(-9.5, 7.5, -9), end: new THREE.Vector3(-9.5, 11, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/ },
    { start: new THREE.Vector3(-9.5, 11, -9), end: new THREE.Vector3(-1, 11, -9), hearts: 1, lightbulbs: 1/*, orientation: 'h'*/ },
    { start: new THREE.Vector3(-1, 11, -9), end: new THREE.Vector3(-1, 11.7, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/ },
    { start: new THREE.Vector3(2, 7.5, -9), end: new THREE.Vector3(2, 9.6, -9), hearts: 0, lightbulbs: 0/*, orientation: 'v'*/ },
    { start: new THREE.Vector3(2.6, 9.6, -9), end: new THREE.Vector3(4.6, 9.6, -9), hearts: 0, lightbulbs: 1/*, orientation: 'h'*/ },
    { start: new THREE.Vector3(-6, 3.6, -9), end: new THREE.Vector3(-6, 6.1, -9), hearts: 1, lightbulbs: 0/*, orientation: 'v'*/ },
    { start: new THREE.Vector3(5.1, 4, -9), end: new THREE.Vector3(7.1, 4, -9), hearts: 0, lightbulbs: 1/*, orientation: 'h'*/ },
];

const ghostWaypoints = [
    new THREE.Vector3(3, 1, -9),
    new THREE.Vector3(-10, 1, -9),
    new THREE.Vector3(-10, 3, -9),
    new THREE.Vector3(-6, 3, -9),
    new THREE.Vector3(-6, 6.1, -9),
    new THREE.Vector3(-6, 3, -9),
    new THREE.Vector3(4.5, 3, -9),
    new THREE.Vector3(4.5, 4, -9),
    new THREE.Vector3(7.1, 4, -9),
    new THREE.Vector3(4.5, 4, -9),
    new THREE.Vector3(4.5, 7, -9),
    new THREE.Vector3(2, 7.05, -9),
    new THREE.Vector3(2, 9.6, -9),
    new THREE.Vector3(4.6, 9.6, -9),
    new THREE.Vector3(2, 9.6, -9),
    new THREE.Vector3(2, 7.05, -9),
    new THREE.Vector3(-9.5, 7.5, -9),
    new THREE.Vector3(-9.5, 11, -9),
    new THREE.Vector3(-1, 11, -9),
    new THREE.Vector3(-1, 11.7, -9),
];

const GremioLiterario = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);

    const controllerRef = useRef(null);

    // groups ref
    const spheresGroupRef = useRef(null);
    const heartsGroupRef = useRef(null);
    const lightbulbGroupRef = useRef(null);
    const movableGroupRef = useRef(null);
    const ghostGroupRef = useRef(null);
    const floatingObjectsRef = useRef(null);
    const pathsGroupRef = useRef(null);
    const cardsRef = useRef(null);

    // // movable objects refs
    const heartTextureRef = useRef(null);
    const lightbulbTextureRef = useRef(null);
    const playerTextureRef = useRef(null);
    const ghostTextureRef = useRef(null);
    const bubbleModelRef = useRef(null);
    const bookModelRef = useRef(null);
    const facesTextures = useRef([]);

    const isDragging = useRef(false);
    const selectedObject = useRef(null);
    const objectGlowing = useRef(null);
    const pulseTime = useRef(0);
    // const hasCollided = useRef(false);

    const [hearts, setHearts] = useState(0);
    const heartsRef = useRef(0);

    const [lightbulbs, setLightbulbs] = useState(0)
    const lightbulbsRef = useRef(0);

    const gameOverRef = useRef(false);

    const gameWonRef = useRef(false);

    const [showGameWonMessage, setShowGameWonMessage] = useState(false);
    const [showGameLostMessage, setShowGameLostMessage] = useState(false);

    const hasPlaced = useRef(false);

    const interval = useRef(null);

    const [step, setStep] = useState(0);
    const stepRef = useRef(0);
    const [gameStarted, setGameStarted] = useState(false);
    const gameStartedRef = useRef(false);

    const [alignedScene, setAlignedScene] = useState(false);

    const loader = new GLTFLoader();

    const [lang] = useState(localStorage.getItem("lang") || 'pt');

    const nextStep = () => {
        stepRef.current += 1;
        setStep(stepRef.current);
        if (stepRef.current > 5) {
            controllerSetup();
            stepRef.current = null;
            gameStartedRef.current = true
            setGameStarted(true);
            spawnGhosts();
        }
    }

    const alignScene = () => {
        setAlignedScene(true);
        groupSetup();
        loadAssets();
        startGame();
    }

    const spawnGhosts = () => {
        if (!interval.current) {
            interval.current = setInterval(() => {
                createGhost(ghostTextureRef.current);
            }, THREE.MathUtils.randFloat(7, 10) * 1000);
            console.log("creating ghosts every 7 to 10 seconds!");
        }
    }

    const loadModel = (src, refVar, name = null, callback = null) => {
        loader.load(src, (gltf) => {
            refVar.current = gltf.scene;
            if (name) refVar.current.name = name;
            if (callback) callback();
        });
    };

    let ghosts = [];

    function createGhost(texture, speed = 1) {
        if (gameOverRef.current) return;

        const ghost = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, depthWrite: false })
        );
        ghost.position.set(0, 1000, 0);
        ghostGroupRef.current.add(ghost);

        const clock = new THREE.Clock();

        ghost.userData = {
            currentSegment: 0,
            progress: 0,
            hasCollided: false,
            clock,
            speed,
            update: function () {
                const segment = this.currentSegment;
                const ghost = this.mesh;

                if (segment >= ghostWaypoints.length - 1 || this.hasCollided) return;

                const delta = this.clock.getDelta() * 2;
                const start = ghostWaypoints[segment];
                const end = ghostWaypoints[segment + 1];
                const segmentLength = start.distanceTo(end);
                const segmentDuration = segmentLength / this.speed;

                this.progress += delta / segmentDuration;

                if (this.progress >= 1) {
                    this.progress = 0;
                    this.currentSegment++;
                    if (this.currentSegment >= ghostWaypoints.length - 1) {
                        ghostGroupRef.current.remove(ghost);
                        return;
                    }
                }

                const direction = new THREE.Vector3().subVectors(end, start).normalize();
                const position = new THREE.Vector3().lerpVectors(start, end, this.progress);
                ghost.position.set(position.x, position.y, position.z + 0.02);

                const front = new THREE.Vector3(-1, 0, 0);
                const quaternion = new THREE.Quaternion().setFromUnitVectors(front, direction);
                ghost.setRotationFromQuaternion(quaternion);

                const playerObj = movableGroupRef.current.children[0];
                if (playerObj) {
                    const distance = ghost.position.distanceTo(playerObj.position);
                    if (distance < 1 && !this.hasCollided) {
                        this.hasCollided = true;
                        if (heartsRef.current > 0) {
                            heartsRef.current -= 1;
                            setHearts(heartsRef.current);
                            ghostGroupRef.current.remove(ghost);
                        } else {
                            setShowGameLostMessage(true);
                            ghostGroupRef.current.clear();
                            clearInterval(interval.current);
                            interval.current = null;
                        }
                    }
                }
            },
            mesh: ghost
        };

        ghost.userData.mesh = ghost; // make sure update can refer to itself
    }


    function addMarkersBySpacing(start, end, spacing = 0.5, maxHearts, heartTexture, maxLightbulbs, lightbulbTexture, pointList, radius = 0.1, color = 0xff0000) {
        const direction = new THREE.Vector3().subVectors(end, start);
        const length = direction.length();
        const count = Math.floor(length / spacing);

        const unitDir = direction.normalize();

        let numHearts = 0, numLightbulbs = 0, offset = 0, maxOffset = count > 2 ? 3 : 0;

        for (let i = 0; i <= count; i++) {
            const point = new THREE.Vector3().copy(start).addScaledVector(unitDir, i * spacing);

            const tooClose = pointList.some(p => p.distanceTo(point) < 0.1);
            if (tooClose) continue;

            if (numHearts < maxHearts && Math.random() < 1/(count-i) && offset >= maxOffset) {
                const heartMat = new THREE.MeshBasicMaterial({ map: heartTexture, transparent: true });
                const heart = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), heartMat);
                heart.position.set(
                    point.x,
                    point.y,
                    point.z + 0.01
                );
                pointList.push(heart.position)
                heartsGroupRef.current.add(heart);
                numHearts++;
                offset = 0;
            } else if (numLightbulbs < maxLightbulbs && Math.random() < 1/(count-i) && offset >= maxOffset) {
                const lightbulbMat = new THREE.MeshBasicMaterial({ map: lightbulbTexture, transparent: true });
                const lightbulb = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lightbulbMat);
                lightbulb.position.set(
                    point.x,
                    point.y,
                    point.z + 0.01
                );
                pointList.push(lightbulb.position)
                lightbulbGroupRef.current.add(lightbulb);
                numLightbulbs++;
                offset = 0;
            } else {
                const sphere = new THREE.Mesh(
                    new THREE.CircleGeometry(radius, 16),
                    new THREE.MeshBasicMaterial({ color: color })
                );
                sphere.position.set(
                    point.x,
                    point.y,
                    point.z + 0.01
                );
                pointList.push(sphere.position);
                spheresGroupRef.current.add(sphere);
                offset++;
            }
        }
    }

    function animateColorPulseHSL(material, baseColor = new THREE.Color(0xff66cc), amplitude = 0.1, speed = 2) {
        if (heartsRef.current < 1) {
            material.color.setHSL(0, 0, 0.5);
            objectGlowing.current = false;
            return;
        } 

        pulseTime.current += 0.016 * speed;

        // Convert base to HSL once per frame
        const hsl = {};
        baseColor.getHSL(hsl);

        // Pulse lightness (or hue if you want color shifts)
        hsl.l = THREE.MathUtils.clamp(0.5 + Math.sin(pulseTime.current) * amplitude, 0, 1);
        material.color.setHSL(hsl.h, hsl.s, hsl.l);
    }

    // @description: wrapText wraps HTML canvas text onto a canvas of fixed width
    // @param ctx - the context for the canvas we want to wrap text on
    // @param text - the text we want to wrap.
    // @param x - the X starting point of the text on the canvas.
    // @param y - the Y starting point of the text on the canvas.
    // @param maxWidth - the width at which we want line breaks to begin - i.e. the maximum width of the canvas.
    // @param lineHeight - the height of each line, so we can space them below each other.
    // @returns an array of [ lineText, x, y ] for all lines
    const wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
        // First, start by splitting all of our text into words, but splitting it into an array split by spaces
        let words = text.split(' ');
        let line = ''; // This will store the text of the current line
        let testLine = ''; // This will store the text when we add a word, to test if it's too long
        let lineArray = []; // This is an array of lines, which the function will return

        // Lets iterate over each word
        for (var n = 0; n < words.length; n++) {
            // Create a test line, and measure it..
            testLine += `${words[n]} `;
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            // If the width of this test line is more than the max width
            if (testWidth > maxWidth && n > 0) {
                // Then the line is finished, push the current line into "lineArray"
                lineArray.push([line, x, y]);
                // Increase the line height, so a new line is started
                y += lineHeight;
                // Update line and test line to use this word as the first word on the next line
                line = `${words[n]} `;
                testLine = `${words[n]} `;
            }
            else {
                // If the test line is still less than the max width, then add the word to the current line
                line += `${words[n]} `;
            }
            // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
            if (n === words.length - 1) {
                lineArray.push([line, x, y]);
            }
        }
        // Return the line array
        return lineArray;
    }

    function createFrontTexture(imageUrl = null, name) {
        const canvas = document.createElement('canvas');
        const texture = new THREE.CanvasTexture(canvas);

        // Load and draw image
        const imgLoader = new THREE.ImageLoader();

        imgLoader.load(imageUrl, image => {
            const ctx = canvas.getContext('2d');

            canvas.width = image.width;
            canvas.height = image.height;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Draw name (bottom)
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 32px sans-serif';
            ctx.textAlign = 'center';

            const wrappedText = wrapText(ctx, name, canvas.width / 2, canvas.height - 100, canvas.width - 40, 50);
            wrappedText.forEach((item) => {
                ctx.fillText(item[0], item[1], item[2]);
            })
            
        });

        return texture;
    }

    function spawnFaces(n, spacing = 2) {

        const cards = new THREE.Group();
        sceneRef.current.add(cards);
        cardsRef.current = cards;

        const totalWidth = (n - 1) * spacing;
        const startX = -totalWidth / 2;

        const max = Math.floor(n * (11 / 8)); // max number of points / max number of faces I have

        for (let i = 0; i < max; i++) {
            

            const frontMaterial = new THREE.MeshBasicMaterial({ map: facesTextures.current[i][0] }); // 0 is front texture
            frontMaterial.map.needsUpdate = false;
            const backMaterial = new THREE.MeshBasicMaterial({ map: facesTextures.current[i][1]}); // 1 is back texture
            backMaterial.map.needsUpdate = false;
            // TODO material for the back side of the card

            const sideMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

            const geometry = new THREE.BoxGeometry(1.5, 2, 0.01);

            const materials = [
                sideMaterial,
                sideMaterial,
                sideMaterial,
                sideMaterial,
                frontMaterial,
                backMaterial
            ];

            const card = new THREE.Mesh(geometry, materials);

            card.userData = {
                mesh: card,
                flip: function () {
                    const card = this.mesh;

                    card.rotateY(Math.PI);
                }
            };

            card.position.set(startX + i * spacing, 0, -5);
            card.lookAt(cameraRef.current.position); // face the camera
            cardsRef.current.add(card);
        }
    }

    const wonGame = (nBubbles = 20) => {
        if (hasPlaced.current) return;

        hasPlaced.current = true;

        // Add a Light to the Scene
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        sceneRef.current.add(light);

        const floatingObjects = new THREE.Group();
        sceneRef.current.add(floatingObjects);
        floatingObjectsRef.current = floatingObjects;

        const minScale = 0.5, maxScale = 1.5;

        for (let bubble = 0; bubble < nBubbles; bubble++) {
            const bubbleClone = bubbleModelRef.current.clone();
            bubbleClone.position.set(
                Math.random() * 20 - 10,
                Math.random() * 2 + 2,
                THREE.MathUtils.randFloat(-10, 1)
            );

            bubbleClone.scale.setScalar(THREE.MathUtils.randFloat(minScale, maxScale));
            floatingObjectsRef.current.add(bubbleClone)
        }

        const score = heartsRef.current + lightbulbsRef.current;
        spawnFaces(score);
    }

    const animateFloating = (object, timeOffset = 0) => {
        const t = performance.now() * 0.001 + timeOffset;
        object.position.y += Math.sin(t) * 0.005;
    }

    const tryAgain = () => {
        // Reset game references and states
        gameOverRef.current = false;
        gameWonRef.current = false;
        setShowGameLostMessage(false);

        // Reset score
        lightbulbsRef.current = 0;
        setLightbulbs(0);
        heartsRef.current = 0;
        setHearts(0);

        // Reset end game scene state
        hasPlaced.current = false;
        // hasCollided.current = false;

        if (interval.current) {
            clearInterval(interval.current);
            interval.current = null;
        }

        // 🧼 CLEAR ghost update functions
        ghosts.length = 0;

        // 🧼 CLEAR old ghost meshes
        if (ghostGroupRef.current) {
            ghostGroupRef.current.clear();
        }

        // Clear scene
        sceneRef.current.clear();
        // Need to run the setup again after cleaning everything
        controllerSetup();
        groupSetup();
        startGame();
        spawnGhosts();
        // setTimeout(() => {
            
        // }, 2000);
        
    }

    const controllerSetup = () => {
        const onSelectStart = () => {

            controllerRef.current.updateMatrixWorld();

            raycaster.setFromXRController(controllerRef.current);

            if (gameWonRef.current) {
                const intersected = raycaster.intersectObjects(cardsRef.current.children)
                if (intersected.length > 0) {
                    intersected[0].object.userData.flip();
                }
            } else {
                const intersected = raycaster.intersectObjects(movableGroupRef.current.children)
                if (intersected.length > 0) {
                    isDragging.current = true;
                    selectedObject.current = intersected[0].object;
                }
            }
        }

        const onSelectEnd = () => {
            if (!gameWonRef.current) {
                isDragging.current = false;
                selectedObject.current = null;
            }
        }

        // Add controllers to be able to move the fishes
        const controller = rendererRef.current.xr.getController(0);
        controller.addEventListener('selectstart', onSelectStart);
        controller.addEventListener('selectend', onSelectEnd);
        sceneRef.current.add(controller);
        controllerRef.current = controller;
    }

    const groupSetup = () => {
        const movableGroup = new THREE.Group();
        sceneRef.current.add(movableGroup);
        movableGroupRef.current = movableGroup;

        const pathsGroup = new THREE.Group();
        sceneRef.current.add(pathsGroup);
        pathsGroupRef.current = pathsGroup;

        const spheresGroup = new THREE.Group();
        sceneRef.current.add(spheresGroup);
        spheresGroupRef.current = spheresGroup;

        const heartsGroup = new THREE.Group();
        sceneRef.current.add(heartsGroup);
        heartsGroupRef.current = heartsGroup;

        const lightbulbGroup = new THREE.Group();
        sceneRef.current.add(lightbulbGroup);
        lightbulbGroupRef.current = lightbulbGroup;

        const ghostGroup = new THREE.Group();
        sceneRef.current.add(ghostGroup);
        ghostGroupRef.current = ghostGroup;
    }

    const loadAssets = () => {
        // Load bubble and book models
        bubbleModelRef.current = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 32),
            new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3,
                roughness: 0,
                metalness: 0,
                clearcoat: 1,
                clearcoatRoughness: 0,
                reflectivity: 0.6,
                iridescence: 1,
                iridescenceIOR: 1.2,
                iridescenceThicknessRange: [100, 500],
                depthWrite: false
            })
        );
        bubbleModelRef.current.renderOrder = 999;

        loadModel('/models/book_3.glb', bookModelRef, null, () => {
            bookModelRef.current.scale.setScalar(0.2);
        });

        // Items texture loaders
        const video = document.createElement("video");
        video.src = '/videos/heartVid.mp4';
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.play();

        const heartTexture = new THREE.VideoTexture(video);
        heartTexture.minFilter = THREE.LinearFilter;
        heartTexture.magFilter = THREE.LinearFilter;
        heartTexture.format = THREE.RGBAFormat;
        heartTextureRef.current = heartTexture;

        const lightbulbTexture = new THREE.TextureLoader().load('/images/lightbulb.png');
        lightbulbTextureRef.current = lightbulbTexture;

        const playerTexture = new THREE.TextureLoader().load('/images/lady_justice.png');
        playerTextureRef.current = playerTexture;

        const videoGhost = document.createElement("video");
        videoGhost.src = '/videos/skull_chomp_new.mp4';
        videoGhost.crossOrigin = "anonymous";
        videoGhost.loop = true;
        videoGhost.muted = true;
        videoGhost.autoplay = true;
        videoGhost.play();

        const ghostTexture = new THREE.VideoTexture(videoGhost);
        ghostTexture.minFilter = THREE.LinearFilter;
        ghostTexture.magFilter = THREE.LinearFilter;
        ghostTexture.format = THREE.RGBAFormat;
        ghostTextureRef.current = ghostTexture;

        text[lang].gremioLitFaces.forEach(obj => {
            const cardFrontTexture = createFrontTexture(obj.img, obj.name); // Front of the card (face and name of author)
            const cardBackTexture = createFrontTexture('/images/logo.png', "Back");
            // TODO Back of the card (description and works of the author)

            // Add it to a list with all the cards' textures
            facesTextures.current.push([cardFrontTexture, cardBackTexture]);
        })

        // text[lang].gremioLitFaces[i].name
        

    }

    const startGame = () => {
        const placedPoints = []

        for (let p of paths) {
            const direction = new THREE.Vector3().subVectors(p.end, p.start);
            const length = p.start.distanceTo(p.end);
            const center = new THREE.Vector3().addVectors(p.start, p.end).multiplyScalar(0.5);

            const path = new THREE.Mesh(
                new THREE.PlaneGeometry(0.6, length+0.6),
                new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
            );
            path.position.copy(center);

            const up = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());

            path.setRotationFromQuaternion(quaternion);
            pathsGroupRef.current.add(path);

            addMarkersBySpacing(p.start, p.end, 1, p.hearts, heartTextureRef.current, p.lightbulbs, lightbulbTextureRef.current, placedPoints);
        }

        const start = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5, 2.5),
            new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
        );
        start.position.set(3.7, 1, -9);
        pathsGroupRef.current.add(start);

        // Movable slider
        const imageMaterial = new THREE.MeshBasicMaterial({ map: playerTextureRef.current, transparent: true, side: THREE.DoubleSide, depthWrite: false });
        const imagePlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2), // adjust size as needed
            imageMaterial
        );
        imagePlane.position.set(
            start.position.x,
            start.position.y,
            start.position.z + 0.02); // or wherever your path starts
        movableGroupRef.current.add(imagePlane);

        
    }

    const initAR = () => {

        /////////////////////////////////////////////////////////////////////
        ////                       Constant Setup                        ////
        /////////////////////////////////////////////////////////////////////

        const container = containerRef.current;

        // --- Setup basic scene ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 100);
        cameraRef.current = camera;
        //camera.position.set(0, 3.6, 3); // typical VR height

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.xr.enabled = true;

        rendererRef.current = renderer;

        // Need this to make AR work (DONT FORGET THIS)
        renderer.xr.setReferenceSpaceType("local");
        renderer.xr.setSession(session);

        if (container) container.appendChild(renderer.domElement);

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }

        window.addEventListener('resize', onResize);

        /////////////////////////////////////////////////////////////////////
        ////                     End Constant Setup                      ////
        /////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////////
        ////                      Controller Setup                       ////
        /////////////////////////////////////////////////////////////////////

        // controllerSetup();

        // const onSelectStart = () => {

        //     controllerRef.current.updateMatrixWorld();

        //     raycaster.setFromXRController(controllerRef.current);

        //     const intersected = raycaster.intersectObjects(movableGroup.children)
        //     if (intersected.length > 0) {
        //         isDragging.current = true;
        //         selectedObject.current = intersected[0].object;
        //     }
        // }

        // const onSelectEnd = () => {
        //     isDragging.current = false;
        //     selectedObject.current = null;
        // }

        // // Add controllers to be able to move the fishes
        // const controller = renderer.xr.getController(0);
        // controller.addEventListener('selectstart', onSelectStart);
        // controller.addEventListener('selectend', onSelectEnd);
        // scene.add(controller);
        // controllerRef.current = controller;

        /////////////////////////////////////////////////////////////////////
        ////                    End Controller Setup                     ////
        /////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////////
        ////                        Group Setup                          ////
        /////////////////////////////////////////////////////////////////////

        // groupSetup();

        // const movableGroup = new THREE.Group();
        // scene.add(movableGroup);
        // movableGroupRef.current = movableGroup;

        // const pathsGroup = new THREE.Group();
        // scene.add(pathsGroup);
        // pathsGroupRef.current = pathsGroup;

        // const spheresGroup = new THREE.Group();
        // scene.add(spheresGroup);
        // spheresGroupRef.current = spheresGroup;

        // const heartsGroup = new THREE.Group();
        // scene.add(heartsGroup);
        // heartsGroupRef.current = heartsGroup;

        // const lightbulbGroup = new THREE.Group();
        // scene.add(lightbulbGroup);
        // lightbulbGroupRef.current = lightbulbGroup;

        // const ghostGroup = new THREE.Group();
        // scene.add(ghostGroup);
        // ghostGroupRef.current = ghostGroup;

        // const floatingObjects = new THREE.Group();
        // scene.add(floatingObjects);
        // floatingObjectsRef.current = floatingObjects;

        /////////////////////////////////////////////////////////////////////
        ////                       End Group Setup                       ////
        /////////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////////
        ////                         Load Assets                         ////
        /////////////////////////////////////////////////////////////////////

        // loadAssets();

        // // Load bubble and book models
        // bubbleModelRef.current = new THREE.Mesh(
        //     new THREE.SphereGeometry(1, 64, 32),
        //     new THREE.MeshPhysicalMaterial({
        //         color: 0xffffff,
        //         transparent: true,
        //         opacity: 0.3,
        //         roughness: 0,
        //         metalness: 0,
        //         clearcoat: 1,
        //         clearcoatRoughness: 0,
        //         reflectivity: 0.6,
        //         iridescence: 1,
        //         iridescenceIOR: 1.2,
        //         iridescenceThicknessRange: [100, 500],
        //         depthWrite: false
        //     })
        // );
        // bubbleModelRef.current.renderOrder = 999;

        // loadModel('/models/book_3.glb', bookModelRef, null, () => {
        //     bookModelRef.current.scale.setScalar(0.2);
        // });

        // // Items texture loaders
        // const video = document.createElement("video");
        // video.src = '/videos/heartVid.mp4';
        // video.crossOrigin = "anonymous";
        // video.loop = true;
        // video.muted = true;
        // video.autoplay = true;
        // video.play();

        // const heartTexture = new THREE.VideoTexture(video);
        // heartTexture.minFilter = THREE.LinearFilter;
        // heartTexture.magFilter = THREE.LinearFilter;
        // heartTexture.format = THREE.RGBAFormat;

        // const lightbulbTexture = new THREE.TextureLoader().load('lightbulb.png');

        // const playerTexture = new THREE.TextureLoader().load('lady_justice.png');

        // const videoGhost = document.createElement("video");
        // videoGhost.src = '/videos/skull_chomp_new.mp4';
        // videoGhost.crossOrigin = "anonymous";
        // videoGhost.loop = true;
        // videoGhost.muted = true;
        // videoGhost.autoplay = true;
        // videoGhost.play();

        // const ghostTexture = new THREE.VideoTexture(videoGhost);
        // ghostTexture.minFilter = THREE.LinearFilter;
        // ghostTexture.magFilter = THREE.LinearFilter;
        // ghostTexture.format = THREE.RGBAFormat;

        /////////////////////////////////////////////////////////////////////
        ////                       End Load Assets                       ////
        /////////////////////////////////////////////////////////////////////

        // startGame();

        // // Start Game
        // const placedPoints = []

        // for (let p of paths) {
        //     const direction = new THREE.Vector3().subVectors(p.end, p.start);
        //     const length = p.start.distanceTo(p.end);
        //     const center = new THREE.Vector3().addVectors(p.start, p.end).multiplyScalar(0.5);

        //     const path = new THREE.Mesh(
        //         new THREE.PlaneGeometry(0.6, length+0.6),
        //         new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
        //     );
        //     path.position.copy(center);

        //     const up = new THREE.Vector3(0, 1, 0);
        //     const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction.clone().normalize());

        //     path.setRotationFromQuaternion(quaternion);
        //     pathsGroupRef.current.add(path);

        //     addMarkersBySpacing(p.start, p.end, 1, p.hearts, heartTextureRef.current, p.lightbulbs, lightbulbTextureRef.current, placedPoints);
        // }

        // const start = new THREE.Mesh(
        //     new THREE.PlaneGeometry(1.5, 2.5),
        //     new THREE.MeshBasicMaterial({ color: 0x8888ff, side: THREE.DoubleSide })
        // );
        // start.position.set(3.7, 1, -9);
        // pathsGroupRef.current.add(start);

        // // Movable slider
        // const imageMaterial = new THREE.MeshBasicMaterial({ map: playerTextureRef.current, transparent: true, side: THREE.DoubleSide, depthWrite: false });
        // const imagePlane = new THREE.Mesh(
        //     new THREE.PlaneGeometry(2, 2), // adjust size as needed
        //     imageMaterial
        // );
        // imagePlane.position.set(
        //     start.position.x,
        //     start.position.y,
        //     start.position.z + 0.02); // or wherever your path starts
        // movableGroupRef.current.add(imagePlane);

        // if (!interval.current) {
        //     interval.current = setInterval(() => {
        //         createGhost(ghostTextureRef.current);
        //     }, 7000);
        //     console.log("creating ghosts every 7 seconds!");
        // }

        // Animation Loop
        renderer.setAnimationLoop(() => {
            if (gameStartedRef.current) {
                if (!gameWonRef.current) {
                    controllerRef.current.updateMatrixWorld();

                    raycaster.setFromXRController(controllerRef.current);

                    const intersected = raycaster.intersectObjects(movableGroupRef.current.children)
                    if (intersected.length > 0) {
                        isDragging.current = true;
                    } else {
                        isDragging.current = false;
                    }
                    if (isDragging.current && selectedObject.current) {
                        //raycaster.setFromXRController(controllerRef.current);
                        const intersected = raycaster.intersectObjects(pathsGroupRef.current.children);
                        if (intersected.length > 0) {
                            const intersection = intersected[0].point;

                            // Optional: only move if the controller is roughly centered on the image
                            const distance = intersection.distanceTo(selectedObject.current.position);
                            const maxDistance = 1.9; // Tweak based on image size

                            if (distance < maxDistance) {
                                selectedObject.current.position.set(
                                    intersection.x,
                                    intersection.y,
                                    intersection.z + 0.02
                                );
                            }
                        }
                        if (selectedObject.current.position.y >= 11.5 && lightbulbsRef.current >= 3 && heartsRef.current > 0) {
                            // Win game
                            console.log("🎉 Won Game 🎉");
                            // Show win screen
                            gameOverRef.current = true;
                            gameWonRef.current = true;
                            setShowGameWonMessage(true);
                            // After 1 or 2 seconds clear scene and place bubbles and books
                            setTimeout(() => {
                                sceneRef.current.clear();
                                setShowGameWonMessage(false);
                                wonGame();
                            }, 4000);
                            // Maybe add the feature of when clicking books showing some texts/books/authors reated to justice (ask artist later)
                        }
                    }

                    // Remove dots and items if intersected with movable object
                    if (selectedObject.current && spheresGroupRef.current && heartsGroupRef.current && lightbulbGroupRef.current) {
                        if (spheresGroupRef.current.children.length > 0) {
                            for (let i = spheresGroupRef.current.children.length - 1; i >= 0; i--) {
                                const sphere = spheresGroupRef.current.children[i];
                                const dist = sphere.position.distanceTo(selectedObject.current.position);

                                if (dist < 0.7) {
                                    // Remove from scene
                                    spheresGroupRef.current.remove(sphere);
                                }
                            }
                        }
                        if (heartsGroupRef.current.children.length > 0) {
                            for (let i = heartsGroupRef.current.children.length - 1; i >= 0; i--) {
                                const heart = heartsGroupRef.current.children[i];
                                const dist = heart.position.distanceTo(selectedObject.current.position);

                                if (dist < 0.4) {
                                    // Remove from scene
                                    heartsGroupRef.current.remove(heart);
                                    // Add "Shield/Extra Life"
                                    heartsRef.current += 1;
                                    setHearts(heartsRef.current)
                                    objectGlowing.current = selectedObject.current;
                                }
                            }
                        }
                        if (lightbulbGroupRef.current.children.length > 0) {
                            for (let i = lightbulbGroupRef.current.children.length - 1; i >= 0; i--) {
                                const lightbulb = lightbulbGroupRef.current.children[i];
                                const dist = lightbulb.position.distanceTo(selectedObject.current.position);

                                if (dist < 0.4) {
                                    // Remove from scene
                                    lightbulbGroupRef.current.remove(lightbulb);
                                    // Increase size of player
                                    selectedObject.current.scale.addScalar(0.2);
                                    // Increase number of current lightbulbs
                                    lightbulbsRef.current += 1
                                    setLightbulbs(lightbulbsRef.current);
                                }
                            }
                        }
                    }
                    if (objectGlowing.current) {
                        animateColorPulseHSL(objectGlowing.current.material);
                    }

                    // ghosts.forEach(update => update());
                    ghostGroupRef.current.children.forEach((ghost) => {
                        if (ghost.userData.update) {
                            ghost.userData.update();
                        }
                    });

                }

                if (gameOverRef.current && gameWonRef.current && hasPlaced.current) {
                    floatingObjectsRef.current.children.forEach((obj, idx) => animateFloating(obj, idx));
                    
                    // if (hasTouched.current && selectedObject.current) {
                    //     const card = selectedObject.current

                    //     const targetRotation = card.userData.flipped ? 0 : Math.PI;

                    //     // new Tween(card.rotation)
                    //     //     .to({ y: targetRotation }, 500)
                    //     //     .easing(Easing.Quadratic.Out)
                    //     //     .start();

                    //     card.rotateY(targetRotation);

                    //     card.userData.flipped = !card.userData.flipped;
                    //     console.log(card.userData.flipped);
                    // }
                }
            }

            // Logic to end game/decrease size (remove lightbulb) if skulls intersect with player
            renderer.render(sceneRef.current, camera);
        });
    };

    useEffect(() => {
        if (!session) return;

        const cleanupScene = () => {
            clearInterval(interval.current);
            interval.current = null;

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
    }, [session, endSession])

    // const handleTap = () => {
    //     if (stepRef.current) {
    //         if (stepRef.current == 1) {
    //             stepRef.current = 2;
    //             setStep(2);
    //         } else if (stepRef.current == 2) {
    //             stepRef.current = 3;
    //             setStep(3);
    //         } else if (stepRef.current == 3) {
    //             stepRef.current = 4;
    //             setStep(4);
    //         } else if (stepRef.current == 4) {
    //             stepRef.current = 5;
    //             setStep(5);
    //         } else if (stepRef.current == 5) {
    //             stepRef.current = 6;
    //             setStep(6);
    //         }

    //         if (stepRef.current > 5) {
    //             controllerSetup();
    //             stepRef.current = null;
    //             gameStartedRef.current = true
    //             setGameStarted(true);
    //         }
    //     }
    // }

    // window.addEventListener('touchstart', handleTap);

    return (
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
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
            {gameStarted && alignedScene && (
                <div style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "20px",
                    // background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <img
                        src="/images/heart.gif"
                        alt="Heart"
                        style={{ width: "64px", height: "64px", objectFit: "contain" }}
                    />
                    {hearts}
                </div>
            )}

            {gameStarted && alignedScene && (
                <div style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "20px",
                    // background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <img
                        src="/images/lightbulb.png"
                        alt="Lightbulb"
                        style={{ width: "64px", height: "64px", objectFit: "contain" }}
                    />
                    {lightbulbs}
                </div>
            )}

            {showGameWonMessage && (
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    { text[lang].experiences["gremio-lit"].winMessage }
                </div>
            )}
            {showGameLostMessage && (
                <div style={{
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.7)",

                }}>
                    <div style={{
                        position: "absolute",
                        top: "30%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "white",
                        padding: "10px",
                        fontSize: "24px"
                    }}>
                        { text[lang].experiences["gremio-lit"].gameOver }
                    </div>
                    <button onClick={tryAgain} style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "10px",
                        color: "white",
                        borderRadius: "5px",
                        fontSize: "18px"
                    }}
                    >
                        { text[lang].experiences["gremio-lit"].tryAgain }
                    </button>
                </div>
            )}

            {step < 6 && alignedScene && (
                <div className='fixed bottom-2 w-full p-2 z-1000'>
                    <div className="w-full min-h-[150px] bg-zinc-800 bg-opacity-90 text-white p-4 rounded-2xl shadow-2xl">
                        <div className='grid grid-flow-row grid-rows-3 gap-2 '>
                            <p className='col-span-1 row-span-1 row-start-1 col-start-1 place-self-center text-lg'>{step < 5 ? "Instruções do jogo:" : "" }</p>
                            {step < 5 && (
                                <p className='col-span-2 row-span-2 row-start-2 col-start-1 place-self-baseline text-lg'>
                                { text[lang].experiences["gremio-lit"].instructions[step] }
                                </p>
                            )}
                            {step === 5 && (
                                <p className='col-span-2 row-span-2 row-start-2 col-start-1 place-self-baseline text-lg'>
                                    { text[lang].experiences["gremio-lit"].instructions[step][0] } <br /> { text[lang].experiences["gremio-lit"].instructions[step][1] }
                                </p>
                            )}
                            <span className="col-span-1 row-span-2 row-start-2 col-start-3 place-self-center px-4 text-2xl" onClick={nextStep}><FaChevronRight /></span>
                        </div>
                    </div>
                </div>
            )}

            {/* {step === 1 && (
                <div style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    Olha em volta e encontra a estatua.
                </div>
            )}

            {step === 2 && (
                <div style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    Arrasta a estatua pelo caminho azul até ao topo.
                </div>
            )}

            {step === 3 && (
                <div style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    Para ganhares tens de obter ideais (lâmpadas) e emoções (corações).
                </div>
            )}

            {step === 4 && (
                <div style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    Tem cuidado com as caveiras. Elas tiram-te emoções. Se as caveiras te acertarem quando não tens emoções, perdes o jogo.
                </div>
            )}

            {step === 5 && (
                <div style={{
                    position: "absolute",
                    bottom: "10%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "18px"
                }}>
                    Boa sorte!
                </div>
            )} */}
            {/* Maybe have a message with instructions here */}
            {/* Message: Drag the lady justice statue across the [insert color] path */}
            {/* Say that lightbulbs increse your size */}
            {/* Say that hearts give you immunity (still don't know if for a certain amount of time or for one hit) */}
            {/* Say that you need some amount of lightbulbs to be able to win (i think) */}
        </div>
    );
}

GremioLiterario.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
};

export default GremioLiterario;