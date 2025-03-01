// import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import * as THREE from "three";
import { experiments } from "../data/experiments";
// import { io } from "socket.io-client";

// Connect to Socket.io server
// const socket = io("http://localhost:5000");

const ExperimentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the experiment by ID
  const experiment = experiments.find((exp) => exp.id === id);

  if (!experiment) {
    navigate("/"); // Redirect if experiment is not found
    return null;
  }

  // const leaveExperiment = (id) => {
  //   socket.emit("leave_experiment", id);
  // };

  return (
    <motion.div
      className="min-h-screen w-screen bg-gray-900 text-white flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-4">{experiment.title}</h1>
      <p className="text-gray-400 mb-4">{experiment.description}</p>
      {/* Don't forget to add the attributions before launching it on the web */}

      <Link
        to={`/experiment/${experiment.id}/full`}
        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
      >
        Start Experiment
      </Link>

      <Link to="/map" /*onClick={() => leaveExperiment(experiment.id)}*/ className="text-white absolute top-5 left-5 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
        Back to Map
      </Link>
    </motion.div>
  );
//   return (
//     <div className="w-screen h-screen">{experiment.component}</div>
//   );
};

export default ExperimentDetail;
