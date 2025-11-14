import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
// import { ChromaKeyMaterial } from "../components/ChromaKeyShader";

const MoleSpawnTest = ({ session, endSession }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);

    const groupMoleRef = useRef(null);
    const molesRef = useRef([]);
    const groupHitBoxMoleRef = useRef(null);
    const groupMoleBaseRef = useRef(null);

    const loader = new GLTFLoader();
    const flowerRef = useRef(null);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderConfig({ type: 'js' });
    loader.setDRACOLoader(dracoLoader);

    const loadModel = (src, refVar, name = null, onLoad = null) => {
        loader.load(src, (gltf) => {
            refVar.current = gltf.scene;
            if (name) refVar.current.name = name;
            if (onLoad) onLoad();
        });
    };

    const spawnMole = () => {
        // if (!flowerRef.current) return;
        // const flower = flowerRef.current;

        // Add a "Mole" to the scene
        const moleGeometry = new THREE.PlaneGeometry(1, 1);

        moleGeometry.translate(-0.4, 0.5, 0);
        // const moleMaterial = new ChromaKeyMaterial('/bonk_hand.png', 0x81ff8d, 608, 342, 0.2, 0.1, 0);
        const textureLoader = new THREE.TextureLoader();
        const imgTexture = textureLoader.load('/images/saudacao_5_cut.png');
        const moleMaterial = new THREE.MeshBasicMaterial({ map: imgTexture, transparent: true, side: THREE.DoubleSide });
        const moleMesh = new THREE.Mesh(moleGeometry, moleMaterial);

        const ring = new THREE.Mesh(
            new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );

        const deltaDic = [
            {distance: 5, deltaAngle: Math.PI / 8, offset: 0},
            {distance: 4, deltaAngle: Math.PI / 4, offset: Math.PI / 16},
            {distance: 3, deltaAngle: Math.PI / 3, offset: Math.PI / 8},
        ]

        // for 5 meters use max 10.5 (21 moles) 9
        // for 4 meters use max 8.5 (17 moles) 7
        // for 3 meters user max 6.5 (13 moles) 5
        // const deltaAngle = Math.PI / 6.5;
        
        deltaDic.map((delta) => {
            let angle = 0;
            for (var i = 0; angle < 360 + delta.offset; i++) {
                const mole = moleMesh.clone();
                //mole.scale.setScalar(6);
                angle = (delta.deltaAngle * i) + delta.offset;
                const distance = delta.distance;
    
                const vectorMole = new THREE.Vector3(
                    (Math.sin(angle) * distance),
                    0,
                    (Math.cos(angle) * distance)
                );
    
                mole.position.set(vectorMole.x, vectorMole.y, vectorMole.z).applyMatrix4(cameraRef.current.matrixWorld);
    
                ring.position.set(
                    mole.position.x, // This depends on the model
                    mole.position.y, // A bit below the flower
                    mole.position.z // This depends on the model
                );
        
                mole.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);
        
                const hitboxMole = new THREE.Mesh(
                    new THREE.PlaneGeometry(1.5, 1.5),
                    new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ff00/*, visible: false*/ })
                );
        
                hitboxMole.name = "hitbox";
        
                hitboxMole.position.copy(mole.position);
                hitboxMole.geometry.translate(-0.4, 0.5, 0);
                mole.userData.hitbox = hitboxMole;
                mole.userData.base = ring;
        
                //hitboxMole.add(mole);
                groupMoleRef.current.add(mole);
                molesRef.current.push(mole);
        
                groupHitBoxMoleRef.current.add(hitboxMole);
                groupMoleBaseRef.current.add(ring);
            }
        });

        
    };

    const moleLookAtPlayer = () => {
        const cameraWorldPos = new THREE.Vector3();
        cameraRef.current.getWorldPosition(cameraWorldPos);

        groupMoleRef.current.children.forEach((mole) => {
            // Get plane's world position
            const planeWorldPos = new THREE.Vector3();
            mole.getWorldPosition(planeWorldPos);

            const hitbox = mole.userData.hitbox;

            // Create a horizontal target (same Y as plane)
            const target = new THREE.Vector3(
                cameraWorldPos.x,
                planeWorldPos.y,
                cameraWorldPos.z
            );

            mole.lookAt(target);
            hitbox.lookAt(target);
        });
    };

    useEffect(() => {
        if (!session) return;

        let spawnInterval;

        const initAR = () => {
            try {
                const container = containerRef.current;

                // Initialize Renderer
                const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = THREE.PCFSoftShadowMap;
                renderer.xr.enabled = true;
                rendererRef.current = renderer;

                // Need this to make AR work (DONT FORGET THIS)
                rendererRef.current.xr.setReferenceSpaceType("local");
                rendererRef.current.xr.setSession(session);

                if (container) container.appendChild(renderer.domElement);

                // Initialize Scene
                const scene = new THREE.Scene();
                sceneRef.current = scene;

                // Initialize Camera
                const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
                cameraRef.current = camera;

                // Add a Light to the Scene
                const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
                scene.add(light);

                // Add Directional Light (This is so the objects can cast shadows in the Scene)
                const dLight = new THREE.DirectionalLight(0xffffff, 3);
                dLight.position.set(0, 6, 0);
                dLight.castShadow = true;
                dLight.shadow.camera.top = 3;
                dLight.shadow.camera.bottom = -3;
                dLight.shadow.camera.right = 3;
                dLight.shadow.camera.left = -3;
                dLight.shadow.mapSize.set(4096, 4096);
                scene.add(dLight);

                // Add a floor the shadows can be cast upon
                // const floorGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);
                // const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5, blending: THREE.CustomBlending, transparent: false });
                // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
                // floor.position.set(0, -1.6, 0); // Average height the device is from the floor
                // floor.rotateX(-Math.PI / 2);
                // floor.receiveShadow = true;
                // scene.add(floor);

                // Initialize Group (Where movable objects will be put)
                const groupMole = new THREE.Group();
                scene.add(groupMole);
                groupMoleRef.current = groupMole;

                const groupHitBoxMole = new THREE.Group();
                scene.add(groupHitBoxMole);
                groupHitBoxMoleRef.current = groupHitBoxMole;

                const groupMoleBase = new THREE.Group();
                scene.add(groupMoleBase);
                groupMoleBaseRef.current = groupMoleBase;

                loadModel('/models/white_lilly.glb', flowerRef, null, () => {
                    spawnMole();
                });

                //spawnMole();

                const animate = () => {
                    moleLookAtPlayer();
                    renderer.render(scene, camera);
                }

                renderer.setAnimationLoop(animate);

                session.addEventListener('end', () => {
                    console.log('Cleaning up scene...');
                    cleanupScene();
                });

            } catch (error) {
                console.log("Failed to initialize AR:", error);
            }
        };

        const cleanupScene = () => {
            clearInterval(spawnInterval);

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

    return (
        <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
        </div>
    );
};

MoleSpawnTest.propTypes = {
    session: propTypes.func.isRequired,
    endSession: propTypes.func.isRequired,
}

export default MoleSpawnTest;
