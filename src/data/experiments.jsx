import SpawnModel from "../experiments/SpawnModel";
import SpinningCube from "../experiments/SpinningCube";
import MoveCubesControllers from "../experiments/MoveCubesControllers";
import ImageTracking from "../experiments/ImageTracking";
import HittestSurface from "../experiments/HittestSurface";
import CardinalVideos from "../experiments/VideoExperimentCropped";
import CardinalVideosLocation from "../experiments/VideoWithLocation";
import CardinalVideosCropped from "../experiments/VideoExperimentCropped";
import NeedleExperiment from "../experiments/NeedleExperiment";

export const experiments = [
  {
    id: "1",
    title: "Floating Fish",
    description: "A fish model in front of the camera. The user can move it by touching it and dragging.",
    component: SpawnModel,
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
    disabled: true,
    attributions: []
  },
  {
    id: "3",
    title: "Three.js Dragging Scene",
    description: "Example scene taken from the Three.js github examples.",
    component: MoveCubesControllers,
    disabled: false,
    attributions: []
  },
  {
    id: "4",
    title: "Three.js Image tracking (WIP)",
    description: "Example scene showcasing Image tracking using the WebXR API (limited)",
    component: ImageTracking,
    disabled: true,
    attributions: []
  },
  {
    id: "5",
    title: "Three.js Hit-Test Surface",
    description: "Three.js scene that uses Hit Tests to put objects on detected surfaces",
    component: HittestSurface,
    disabled: false,
    attributions: []
  },
  {
    id: "6",
    title: "Cardinal Video Experiment (cropped)",
    description: "Three.js scene that shows videos in the four cardinal direction relative to the user's initial position.",
    component: CardinalVideosCropped,
    disabled: false,
    attributions: []
  },
  {
    id: "7",
    title: "Cardinal Video Experiment",
    description: "Three.js scene that shows videos in the four cardinal direction relative to the user's initial position.",
    component: CardinalVideos,
    disabled: false,
    attributions: []
  },
  {
    id: "8",
    title: "Cardinal Video Experiment w/ Location",
    description: "Three.js scene that shows videos in the four cardinal direction relative to the user's initial location.",
    component: CardinalVideosLocation,
    disabled: false,
    attributions: []
  },
  {
    id: "9",
    title: "Needle Experiment",
    description: "Needle Basic Scene Experiment",
    component: NeedleExperiment,
    disabled: false,
    url: "https://sadlunch.github.io/testingNeedle/",
    attributions: []
  },
];
