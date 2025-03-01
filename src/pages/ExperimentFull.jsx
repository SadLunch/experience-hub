// import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import * as THREE from "three";
import { experiments } from "../data/experiments";
import { useState } from "react";

const ExperimentFull = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAR, setIsAR] = useState(false);
  const [endSession, setEndSession] = useState(null);

  // Find the experiment by ID
  const experiment = experiments.find((exp) => exp.id === id);

  if (!experiment) {
    navigate("/"); // Redirect if experiment is not found
    return null;
  }

  const Component = experiment.component;

  const handleExitAR = () => {
    if (endSession) {
      endSession(); // Ends AR session
    }
    navigate(`/experiment/${experiment.id}`); // Navigate back
  };

  return (
      <div className="w-screen h-screen relative">
        <Component setIsAR={setIsAR} setEndSession={setEndSession} />
        {/* {!isAR && (
            <Link
            to={`/experiment/${experiment.id}`}
            className="absolute top-5 left-5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
                Back
            </Link>
        )} */}
        
        {isAR && (
            <button onClick={handleExitAR} style={{ position: "absolute", top: 20, left: 20, padding: 10 }}>
                Back
            </button>
        )}
      </div>
  );
};

export default ExperimentFull;
