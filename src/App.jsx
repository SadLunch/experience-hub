// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hub from './pages/Hub'
import ExperimentDetail from "./pages/ExperimentDetail";
import ExperimentFull from "./pages/ExperimentFull";
import MapView from "./pages/MapView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/experiment/:id" element={<ExperimentDetail />} />
        <Route path="/experiment/:id/full" element={<ExperimentFull />} />
      </Routes>
    </Router>
  );
}

export default App;
