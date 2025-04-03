// import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { experiments } from "../../data/experiments";
import BackButton from "../../components/BackButton";

const Hub = () => {
  return (
    <div className="min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-center p-10">
      <BackButton to='/' />
      <h1 className="text-3xl font-bold mb-6">Experiment Hub</h1>
      <Link to="/testing/map">
        <button className="block bg-gray-800 p-3 mb-10 rounded-lg shadow-lg hover:bg-gray-700">View Map</button>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full px-4">
        {experiments.map((exp, index) => (
          <motion.div 
            key={exp.id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link 
              to={!exp.disabled ? `/testing/experiment/${exp.id}` : "/"} 
              className="block bg-gray-800 p-5 rounded-lg shadow-lg hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold">{exp.title}</h2>
              <p className="text-gray-400">{exp.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Hub;
