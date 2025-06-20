import SpinningCube from "../experiments/SpinningCube";
import ImageTracking from "../experiments/ImageTracking";
import CardinalVideos from "../experiments/VideoExperimentCropped";
import CardinalVideosLocation from "../experiments/VideoWithLocation";
import CardinalVideosCropped from "../experiments/VideoExperimentCropped";
import NeedleExperiment from "../experiments/NeedleExperiment";
import SpawnModelLiveSize from "../experiments/SpawnModelLiveSize";
// import HittestModelLiveSize from "../experiments/HittestModelLiveSize";
import SpawnModelNew from "../experiments/SpawnModelNew";
import WhacAMoleV2 from "../experiments/Whac-A-Mole_v2";
import WhacAMoleV1 from "../experiments/Whac-A-Mole_v1";
import HittestModelLiveSizeTest from "../experiments/HittestModelLiveSizeTest";
import InstantTrackingNew from "../experiments/InstantTrackingNew";
import HittestSurfaceNew from "../experiments/HittestSurfaceNew";
import MoveCubesControllersNew from "../experiments/MoveCubesControllersNew";
import WhacAMoleV3 from "../experiments/Whac-A-Mole_v3";
import WhacAMoleV3New from "../experiments/Whac-A-Mole_v3New";
import AFrameExperiment from "../experiments/AFrameExperiment";
import MoleSpawnTest from "../experiments/MoleSpawnTest";
import VirtualExhibition from "../experiments/VirtualExhibition";
import GremioLiterario from "../experiments/GremioLiterario";
import TestGetPositionsV2 from "../experiments/TestGetPositions";
import GraffitiWallArt from "../experiments/GraffitiWallArt";
import VirtualExhibitionV2 from "../experiments/VirtualExhibition_v2";
import GiantJustice from "../experiments/GiantJusticeExperiment";
import MNACStairsExperiment from "../experiments/MNACStairsExperiment";
import MindARFaceTracking from "../experiments/MindARFaceTracking";
import GraffitiWallArtV2 from "../experiments/GraffitiWallArtV2";
import MoveCubesControllers from "../experiments/MoveCubesControllers";
import GraffitiWallArtV2_2 from "../experiments/GraffitiWallArtV2_2";

export const experiments = [
  {
    id: "1",
    title: "Floating Fish (NEW)",
    description: "A fish model in front of the camera. The user can move it by touching it and dragging.",
    component: SpawnModelNew,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
      "Fish by jeremy [CC-BY] via Poly Pizza",
    ]
  },
  {
    id: "2",
    title: "Spinning Cube",
    description: "A cube that spins in place.",
    component: SpinningCube,
    isWebXR: true,
    disabled: true,
    attributions: []
  },
  {
    id: "3",
    title: "Movable Floating Fishes",
    description: "Three.js scene where you can move fishes that are floating around you.",
    component: MoveCubesControllersNew,
    sessionOptions: {
      optionalFeatures: ["dom-overlay", "depth-sensing"],
      domOverlay: {root: document.body },
      depthSensing: { usagePreference: [ 'gpu-optimized' ], dataFormatPreference: [] },
    },
    isWebXR: true,
    disabled: false,
    attributions: []
  },
  {
    id: "3-1",
    title: "Movable Floating Fishes before",
    description: "Three.js scene where you can move fishes that are floating around you.",
    component: MoveCubesControllers,
    sessionOptions: {
      optionalFeatures: ["dom-overlay", "depth-sensing"],
      domOverlay: {root: document.body },
      depthSensing: { usagePreference: [ 'gpu-optimized' ], dataFormatPreference: [] },
    },
    isWebXR: true,
    disabled: false,
    before: true,
    attributions: []
  },
  {
    id: "4",
    title: "Three.js Image tracking (WIP)",
    description: "Example scene showcasing Image tracking using the WebXR API (limited)",
    component: ImageTracking,
    isWebXR: true,
    disabled: true,
    attributions: []
  },
  {
    id: "5",
    title: "Three.js Hit-Test Surface",
    description: "Three.js scene that uses Hit Tests to put objects on detected surfaces",
    component: HittestSurfaceNew,
    sessionOptions: {
      requiredFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: true,
    attributions: []
  },
  {
    id: "6",
    title: "Cardinal Video Experiment (cropped)",
    description: "Three.js scene that shows videos in the four cardinal direction relative to the user's initial position.",
    component: CardinalVideosCropped,
    isWebXR: true,
    disabled: true,
    attributions: []
  },
  {
    id: "7",
    title: "Cardinal Video Experiment",
    description: "Three.js scene that shows videos in the four cardinal direction relative to the user's initial position.",
    component: CardinalVideos,
    isWebXR: true,
    disabled: true,
    attributions: []
  },
  {
    id: "8",
    title: "Cardinal Video Experiment w/ Location",
    description: "Three.js scene that shows videos in the four cardinal direction relative to the user's initial location.",
    component: CardinalVideosLocation,
    isWebXR: true,
    disabled: true,
    attributions: []
  },
  {
    id: "9",
    title: "Needle Experiment",
    description: "Needle Basic Scene Experiment",
    component: NeedleExperiment,
    isWebXR: true,
    disabled: true,
    url: "https://sadlunch.github.io/testingNeedle/",
    attributions: []
  },
  {
    id: "10",
    title: "Live Sized Room Model",
    description: "Experiment with a live sized room model.",
    component: SpawnModelLiveSize,
    sessionOptions: {
      requiredFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: true,
    attributions: [
      '"Charité University Hospital - Operating Room" (https://skfb.ly/oCTvA) by ChrisRE is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
    ]
  },
  {
    id: "11",
    title: "Live Sized Room Model (HitTest)",
    description: "Experiment with hittest placing a live sized room model on a detected surface.",
    component: HittestModelLiveSizeTest,
    sessionOptions: {
      requiredFeatures: ["hit-test", "dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: true,
    attributions: [
      '"Charité University Hospital - Operating Room" (https://skfb.ly/oCTvA) by ChrisRE is licensed under Creative Commons Attribution-NonCommercial (http://creativecommons.org/licenses/by-nc/4.0/).',
    ]
  },
  {
    id: "12",
    title: "Image Assisted Alignment",
    description: "Three.js simple scene that uses an image to assist alignment.",
    component: InstantTrackingNew,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: []
  },
  {
    id: "13",
    title: "Whac-A-Mole V1",
    description: 'A Whac-A-Mole AR test. Your hammer is in front of you. Get close to the "mole" to hit it!',
    component: WhacAMoleV1,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: true,
    attributions: [
      "'Gavel' (https://skfb.ly/6ZNqB) by RushilT is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/)."
    ]
  },
  {
    id: "14",
    title: "Whac-A-Mole V2",
    description: 'A Whac-A-Mole AR test. Touch the moleto hit it with you hammer!',
    component: WhacAMoleV2,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: true,
    attributions: [
      '"2K Textured Animated Video Game Hammer" (https://skfb.ly/oInYQ) by Kimbell Whatley is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
      '"White Lilly - Metascan" (https://skfb.ly/o9HYz) by Moshe Caine is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    ]
  },
  {
    id: "15",
    title: "Face Tracking",
    description: "A face tracking experiment.",
    isWebXR: false,
    disabled: false,
    url: "/facetracking.html",
    attributions: [
    ]
  },
  {
    id: "16",
    title: "Whac-A-Mole V3",
    description: 'A test for the final version of the whac-a-mole experience.',
    component: WhacAMoleV3,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: true,
    attributions: [
      '"2K Textured Animated Video Game Hammer" (https://skfb.ly/oInYQ) by Kimbell Whatley is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
      '"White Lilly - Metascan" (https://skfb.ly/o9HYz) by Moshe Caine is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    ]
  },
  {
    id: "17",
    title: "Whac-A-Mole with Instructions",
    description: 'A test for the final version of the whac-a-mole experience with instructions.',
    component: WhacAMoleV3New,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
      '"gavel" (https://skfb.ly/owxOK) by rutesh sakpal is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
      '"White Lilly - Metascan" (https://skfb.ly/o9HYz) by Moshe Caine is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    ]
  },
  {
    id: "18",
    title: "AFRAME AR test",
    description: 'A test for an AFRAME approach that might work on iOS.',
    component: AFrameExperiment,
    isWebXR: false,
    disabled: false,
  },
  {
    id: "19",
    title: "AFRAME AR test (separate html file)",
    description: 'A test for an AFRAME approach that might work on iOS.',
    isWebXR: false,
    disabled: true,
    url: '/aframe_test.html'
  },
  {
    id: "20",
    title: "Mole Spawn Test",
    description: 'Testing how many moles we can spawn at certainn distances',
    component: MoleSpawnTest,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: true,
    attributions: []
  },
  {
    id: "21",
    title: "Virtual Exhibition Test",
    description: 'Testing the virtual exhibition experience where you move the objects on a plane',
    component: VirtualExhibition,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
      "Fish by jeremy [CC-BY] via Poly Pizza",
    ]
  },
  {
    id: "22",
    title: "Gremio Literario",
    description: 'Testing experience for Gremio Literario',
    component: GremioLiterario,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
      '"Fallen Book" (https://skfb.ly/6WXT9) by jesseroberts is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).',
    ]
  },
  {
    id: "23",
    title: "Test Get Positions",
    description: 'Test for getting the necessary positions for the Gremio Literario experience',
    component: TestGetPositionsV2,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
    ]
  },
  {
    id: "24",
    title: "Graffiti test",
    description: 'Test for graffiti experience',
    component: GraffitiWallArt,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
    ]
  },
  {
    id: "25-1",
    title: "Graffiti test V2",
    description: 'Graffiti Wall art experience with first image',
    component: GraffitiWallArtV2,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
      '"Spray Paint Can" (https://skfb.ly/o8rIG) by Isuk is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).'
    ]
  },
  {
    id: "25-2",
    title: "Graffiti test V2",
    description: 'Graffiti Wall art experience with second image',
    component: GraffitiWallArtV2_2,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
      '"Spray Paint Can" (https://skfb.ly/o8rIG) by Isuk is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).'
    ]
  },
  {
    id: "26",
    title: "Face Tracking with MindAR",
    description: "Test for MindAR's face tracking experience",
    component: MindARFaceTracking,
    isWebXR: false,
    disabled: false,
    mindAR: true,
    attributions: [
    ]
  },
  {
    id: "27",
    title: "Virtual Exhibition Test V2",
    description: 'Version 2 of the Virtual Exhibition Test',
    component: VirtualExhibitionV2,
    sessionOptions: {
      requiredFeatures: ["dom-overlay"],
      domOverlay: { root: document.body },
      //depthSensing: { usagePreference: [ 'gpu-optimized' ], dataFormatPreference: [] },
    },
    isWebXR: true,
    disabled: false,
    attributions: [
    ]
  },
  {
    id: "28",
    title: "Giant Justice",
    description: 'A test for the Giant Justice roaming the streets experience.',
    component: GiantJustice,
    isWebXR: false,
    disabled: false,
  },
  {
    id: "29",
    title: "MNAC Stairs Experiment",
    description: 'A test for the MNAC stairs voice recording experiment.',
    component: MNACStairsExperiment,
    isWebXR: false,
    disabled: false,
  },
];
//