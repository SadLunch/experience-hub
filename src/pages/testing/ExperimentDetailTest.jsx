// import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import * as THREE from "three";
import { experiments } from "../../data/experiments";
import { useState } from "react";
// import { io } from "socket.io-client";

// Connect to Socket.io server
// const socket = io("http://localhost:5000");

const ExperimentDetailTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAR, setIsAR] = useState(false);
    const [session, setSession] = useState(null);

    // Find the experiment by ID
    const experiment = experiments.find((exp) => exp.id === id);

    if (!experiment) {
        navigate("/testing"); // Redirect if experiment is not found
        return null;
    }

    const Component = experiment.component;

    // const startARSession = () => {
    //     setIsAR(true);
    //     navigate(experiment.url);
    // }

    const handleEndSession = () => {
        setSession(null);
        setIsAR(false);
    }

    const startWebXRSession = () => {
        if (!navigator.xr) {
            console.warn('WebXR not supported!');
            return;
        }

        // let overlay = document.querySelector('.overlay');

        // experiment.sessionOptions.domOverlay.root = overlay;

        navigator.xr.requestSession(
            'immersive-ar', experiment.sessionOptions
        ).then((xrSession) => {
            xrSession.addEventListener('end', handleEndSession);

            setIsAR(true);
            setSession(xrSession);
        }).catch((err) => {
            console.log("Failed to start AR:", err)
        })
    }

    const startARSession = () => {
        setIsAR(true);
    }

    const endSession = () => {
        if (session) session.end();
    }

    const endARSession = () => {
        // 1. Stop camera
        const video = document.getElementById("webcam");
        const stream = video?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;

        // 2. Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }

        // 3. Optional: dispose A-Frame scene
        const sceneEl = document.querySelector('a-scene');
        if (sceneEl?.renderer?.dispose) {
            sceneEl.renderer.dispose();
        }

        // 4. Reset the flag
        setIsAR(false);
    };

    const endMindARSession = () => {
        setIsAR(false);
    }


    // const leaveExperiment = (id) => {
    //   socket.emit("leave_experiment", id);
    // };

    return (
        <div>
            {!isAR && (
                <motion.div
                    className="min-h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-center overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold mb-4">{experiment.title}</h1>
                    <p className="text-gray-400 mb-4">{experiment.description}</p>
                    {/* Don't forget to add the attributions before launching it on the web */}

                    {!experiment.url && experiment.sessionOptions && (
                        <button
                            onClick={startWebXRSession}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                        >
                            Start Experiment
                        </button>
                    )}
                    {experiment.url && !experiment.sessionOptions && (
                        <a href={experiment.url}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                        >
                            Start Experiment
                        </a>
                    )}
                    {!experiment.url && !experiment.sessionOptions && (
                        <button
                            onClick={startARSession}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                        >
                            Start Experiment
                        </button>
                    )}
                    <Link to="/testing/map" /*onClick={() => leaveExperiment(experiment.id)}*/ className="text-white absolute top-5 left-5 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
                        Back to Map
                    </Link>
                </motion.div>
            )}
            {isAR && experiment.isWebXR && (
                <div className="w-screen h-screen relative">
                    {/* AR component */}
                    <Component session={session} endSession={endSession} />
                    {/* Back Button */}
                    <button onClick={endSession} style={{ position: "absolute", top: 20, left: 20, padding: 10}}>
                        Back
                    </button>
                </div>
            )}
            {isAR && !experiment.isWebXR && (
                <div className="w-screen h-screen relative">
                    {/* AR component */}
                    <Component />
                    <button onClick={!experiment.mindAR ? endARSession : endMindARSession} style={{ position: "absolute", top: 20, left: 20, padding: 10}}>
                        Back
                    </button>
                </div>
            )}
        </div>
    );
    //   return (
    //     <div className="w-screen h-screen">{experiment.component}</div>
    //   );
};

export default ExperimentDetailTest;
