import { useEffect, useRef } from "react";
import * as THREE from "three";
import propTypes from "prop-types";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

const images = [
  { src: '/images/256px-AlexandreHerculano.png', name: 'Alexandre Herculano (1810 - 1877)'},
  { src:'/images/256px-Almeida_Garrett_por_Guglielmi.jpg', name: 'Almeida Garrett (1799 - 1854)'},
  { src: '/images/256px-Anselmo_José_Braamcamp,_1887_(London,_Maclure_&_Co.).png', name: 'Anselmo Braamcamp (1817 - 1885)'},
  { src: '/images/256px-António_Maria_de_Fontes_Pereira_de_Melo,_1883.png', name: 'Fontes Pereira de Melo (1819 - 1887)'},
  { src: '/images/256px-José_da_Silva_Mendes_Leal.png', name: 'Mendes Leal (1820 - 1886)'},
  { src: '/images/256px-Rebello_da_Silva_-_Serões_(Abr1907).png', name: 'Rebelo da Silva (1822 - 1871)'},
  { src: '/images/António_Rodrigues_Sampaio_(1806-1882).png', name: 'Rodrigues Sampaio (1806 - 1882)'},
  { src: '/images/Retrato_do_Marquês_de_Sá_da_Bandeira_-_Academia_Militar.png', name: 'Sá da Bandeira (1795 - 1876)'},
  { src: '/images/Rodrigo_da_Fonseca_Magalhães_(Grémio_Literário).png', name: 'Rodrigo da Fonseca (1787 - 1858)'},
]

const SpawnModelNew = ({ session, endSession }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  const objectRef = useRef(null);
  const objectLoadedRef = useRef(false);

  const paintingGroupRef = useRef(null);

  // const [selected, setSelected] = useState(false);
  // const selectedObject = useRef(null);

  const raycaster = new THREE.Raycaster();

  const loader = new GLTFLoader();

  const loadModel = (src, refVar, name = null, callback = null) => {
    loader.load(src, (gltf) => {
      refVar.current = gltf.scene;
      if (name) refVar.current.name = name;
      if (callback) callback();
    });
  };

  const createPaintingNameplate = (name, width, position) => {

    const canvas = document.createElement("canvas");
    const canvasTexture = new THREE.CanvasTexture(canvas);

    canvas.width = 1500;
    canvas.height = 90;

    const ctx = canvas.getContext('2d');

    // canvas.width = width;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#000000";
    ctx.font = 'bold 10vh sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(name, canvas.width / 2, 70);

    const canvasMaterial = new THREE.MeshBasicMaterial({ map: canvasTexture });

    const nameplate = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.15, 0.02),
      //new THREE.MeshBasicMaterial({ color: 0xffffff })
      [
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
        new THREE.MeshBasicMaterial({ color: 0xffffff }),
        canvasMaterial,
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      ]
    );

    nameplate.position.set(position.x, position.y, position.z);
    nameplate.lookAt(0, 0, 0);

    sceneRef.current.add(nameplate);
  }

  const createFullPaintings = () => {
    if (!objectRef.current || !sceneRef.current) return;
    images.forEach((image, i) => {
      const object = new THREE.Object3D();
      object.add(objectRef.current.clone());
      object.scale.setScalar(9);

      const faceTexture = new THREE.TextureLoader().load(image.src);

      const faceMaterial = new THREE.MeshBasicMaterial({ map: faceTexture, side: THREE.FrontSide });

      const backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })

      const sideMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });


      const painting = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.15, 0.013),
        [
          sideMaterial,
          sideMaterial,
          sideMaterial,
          sideMaterial,
          faceMaterial,
          backMaterial
        ]
      );

      object.add(painting);
      painting.position.setZ(-0.00215);

      // Semicircle angle from -π/2 to π/2
      const angle = (i / (images.length - 1)) * Math.PI;

      const x = - (5 * Math.cos(angle) + Math.cos(Math.PI/2));
      const z = - (5 * Math.sin(angle) + Math.cos(Math.PI/2));

      const to_x = - (0.5 * Math.cos(angle) + Math.cos(Math.PI/2));
      const to_z = - (0.5 * Math.sin(angle) + Math.cos(Math.PI/2));

      object.position.set(x, 0, z)//.applyMatrix4(cameraRef.current.matrixWorld); // Place model in front of camera
      //model.quaternion.setFromRotationMatrix(cameraRef.current.matrixWorld);



      const b = new THREE.Box3().setFromObject(object);
      const t = new THREE.Vector3();
      b.getSize(t);

      const position = new THREE.Vector3();
      position.copy(object.position);
      position.setY((position.y - (t.y / 2)) - 0.1)
      createPaintingNameplate(image.name, t.x, position);

      object.lookAt(0, 0, 0);

      const scale = new THREE.Vector3();
      scale.copy(object.scale);

      object.userData = {
        mesh: object,
        animating: false,
        canClick: true,
        clicked: false,
        startTime: 0,
        duration: 3000,
        from: new THREE.Vector3(x, 0, z),
        to: new THREE.Vector3(to_x, 0, to_z),
        fromScale: scale,
        toScale: new THREE.Vector3(3, 3, 3),
        rotFrom: object.rotation.y,
        rotTo: object.rotation.y + Math.PI,
        flip: function () {
          const painting = this.mesh;
          painting.rotateY(Math.PI);
        },
      }

      paintingGroupRef.current.add(object);
    });
    objectLoadedRef.current = true;
  }

  // const updatePosition = (object, targetPos, targetScale) => {
  //   const totalSteps = 70000 / 16;
  //   let step = 0;

  //   function update(t1, t2) {
  //     step++;
  //     const time = step / totalSteps;
  //     object.position.lerp(t1, time);
  //     object.scale.lerp(t2, time);
  //     if (step < totalSteps) {
  //       setTimeout(() => update(t1, t2), 16);
  //     } else {
  //       object.position.copy(t1); // Ensure exact position at end
  //     }
  //   }
  //   update(targetPos, targetScale);
  // }

  // const deselect = () => {
  //   if (!selectedObject.current) return;

  //   const targetPosition = selectedObject.current.userData.to;
  //   const targetScale = selectedObject.current.userData.toScale;
  //   selectedObject.current.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
  //   selectedObject.current.scale.set(targetScale.x, targetScale.y, targetScale.z);
  //   selectedObject.current = null;
  //   setSelected(false);
  // }

  useEffect(() => {
    if (!session) return;

    const initAR = () => {
      try {
        const container = containerRef.current;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true; // Enable WebXR
        rendererRef.current = renderer;

        // Initialize Three.js scene
        const scene = new THREE.Scene();

        new RGBELoader().load("/models/san_giuseppe_bridge_2k.hdr", (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          scene.environment = texture;
        });

        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        cameraRef.current = camera;

        // Need this to make AR work (DONT FORGET THIS)
        rendererRef.current.xr.setReferenceSpaceType("local");
        rendererRef.current.xr.setSession(session);

        if (container) {
          container.appendChild(renderer.domElement);
        }

        // Add a light
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        var dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(75, 300, -75);
        scene.add(dirLight);

        const paintingGroup = new THREE.Group();
        scene.add(paintingGroup);
        paintingGroupRef.current = paintingGroup;

        const controller = renderer.xr.getController(0);
        controller.addEventListener('selectstart', (event) => {
          const controller = event.target;

          controller.updateMatrixWorld();

          raycaster.setFromXRController(controller);

          const intersected = raycaster.intersectObjects(paintingGroupRef.current.children);
          if (intersected.length > 0) {
            const selectedObj = intersected[0].object.parent;

            if (!selectedObj.userData.animating) {
              selectedObj.userData.clicked = !selectedObj.userData.clicked; // toggle
              selectedObj.userData.animating = true;
              selectedObj.userData.startTime = performance.now();
            }

            // if (!selectedObject.current) {
            //   const targetPosition = intersected[0].object.parent.userData.to;
            //   const targetScale = intersected[0].object.parent.userData.toScale;
            //   intersected[0].object.parent.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            //   intersected[0].object.parent.scale.set(targetScale.x, targetScale.y, targetScale.z);
            //   selectedObject.current = intersected[0].object.parent;
            //   setSelected(true);
            // }


            // if (hasClicked.current) {
            //   intersected[0].object.parent.userData.animating = false;
            //   updatePosition(intersected[0].object.parent, intersected[0].object.parent.userData.from, intersected[0].object.parent.userData.fromScale);
            // }
            // if (!hasClicked.current) {
            //     // intersected[0].object.parent.userData.startTime = performance.now();
            //     intersected[0].object.parent.userData.animating = true;
            //     updatePosition(intersected[0].object.parent, intersected[0].object.parent.userData.to, intersected[0].object.parent.userData.toScale);
            //     intersected[0].object.parent.userData.clicked = true;
            // }
          }
        });

        // controller.addEventListener('selectend', (event) => {
        //   const controller = event.target;
        //   if (controller.userData.selected !== undefined) {
        //     const object = controller.userData.selected;
        //     if (object.userData.clicked) {
        //       object.userData.clicked = false;
        //     } else {
        //       object.userData.clicked = true;
        //     }
        //     controller.userData.selected = undefined;
        //   }
        // })
        scene.add(controller)

        // Load a model
        
        loadModel("/models/frame03_centered.glb", objectRef, null, () => {
          if (!objectLoadedRef.current) {
            createFullPaintings();
          }
        })
        // loader.load("/models/frame03_centered.glb", (gltf) => {
        //   objectRef.current = gltf.scene;

        //   // objectRef.current = object;
        // });




        // Animation loop
        const animate = () => {
          renderer.setAnimationLoop((timestamp) => {
            for (const object of paintingGroupRef.current.children) {
              if (object.userData.animating) {
                const elapsed = timestamp - object.userData.startTime;
                const duration = object.userData.duration;
                const t = Math.min(elapsed / duration, 1);

                const eased = t * (2 - t); // ease-out

                // Choose direction based on clicked state
                const fromPos = object.userData.clicked ? object.userData.from : object.userData.to;
                const toPos = object.userData.clicked ? object.userData.to : object.userData.from;

                const fromRot = object.userData.clicked ? object.userData.rotFrom : object.userData.rotTo;
                const toRot = object.userData.clicked ? object.userData.rotTo : object.userData.rotFrom;

                const fromScale = object.userData.clicked ? object.userData.fromScale : object.userData.toScale;
                const toScale = object.userData.clicked ? object.userData.toScale : object.userData.fromScale;
                

                object.position.lerpVectors(fromPos, toPos, eased);
                object.rotation.y = THREE.MathUtils.lerp(fromRot, toRot, eased);
                object.scale.lerpVectors(fromScale, toScale, eased);

                if (t >= 1) {
                  object.userData.animating = false;
                }
              }
            }

          // for (const object of paintingGroupRef.current.children) {
            //   if (object.userData.animating) {
            //     const elapsed = timestamp - object.userData.startTime;
            //     const duration = object.userData.duration;
            //     const t = Math.min(elapsed / duration, 1);

            //     const eased = t * (2 - t);

            //     // object.position.lerp(object.userData.to, eased);

            //     // object.position.x = THREE.MathUtils.lerp(object.userData.from.x, object.userData.to.x, eased);
            //     // object.position.z = THREE.MathUtils.lerp(object.userData.from.z, object.userData.to.z, eased);
            //     if (object.userData.clicked) {
            //       object.rotation.y = THREE.MathUtils.lerp(object.userData.rotTo, object.userData.rotFrom, eased);
            //     } else {
            //       object.rotation.y = THREE.MathUtils.lerp(object.userData.rotFrom, object.userData.rotTo, eased);
            //     }                

            //     if (t >= 1) {
            //       object.userData.animating = false;
            //       object.userData.canClick = true;
            //       if (object.userData.clicked) object.userData.clicked = false;
            //     }
            //   }
            // }

            renderer.render(scene, camera);
          });
        };

        animate();

        session.addEventListener('end', () => {
          console.log("Cleaning up scene...");
          cleanupScene();
        });
      } catch (error) {
        console.warn("Failed to initialize AR:", error);
      }
    };

    const cleanupScene = () => {
      if (sceneRef.current) {
        sceneRef.current.children.forEach((object) => {
          if (!object.isLight) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((mat) => {
                  mat.dispose();
                })
              } else {
                object.material.dispose();
              }
            }
            sceneRef.current.remove(object);
          }
        });
      }
    };

    initAR();

    return () => {
      cleanupScene();
    }
  }, [endSession, session]);

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
      {/* {!isAR && (
        <button onClick={startAR} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: 10 }}>
          Start AR
        </button>
      )} */}

      {/* {selected && (
        <div className="w-screen h-screen">
          <span onClick={deselect} className="absolute top-10 right-10 w-10 h-10 border-2 border-white bg-black rounded-full ">✕</span>
          <div className="w-full h-full opacity-50 bg-black"></div>
        </div>
      )} */}


    </div>
  );
};

SpawnModelNew.propTypes = {
  session: propTypes.func.isRequired,
  endSession: propTypes.func.isRequired,
}

export default SpawnModelNew;
