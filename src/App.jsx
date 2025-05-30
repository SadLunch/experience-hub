// import React from "react";
import { /*BrowserRouter as Router,*/ Routes, Route, HashRouter } from "react-router-dom";
import Hub from './pages/testing/Hub'
import ExperimentDetail from "./pages/ExperimentDetail";
import ExperimentFull from "./pages/ExperimentFull";
import MapView from "./pages/testing/MapView";
import ExperimentDetailTest from "./pages/testing/ExperimentDetailTest";
import Home from "./pages/Home";
import FirstScreen from "./pages/website/FirstScreen";
import MainScreen from "./pages/website/MainScreen";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/website" element={<FirstScreen />} />
        <Route path="/website/main" element={<MainScreen />} />
        <Route path="/testing" element={<Hub />} />
        <Route path="/testing/map" element={<MapView />} />
        <Route path="/testing/experiment/:id" element={<ExperimentDetailTest />} />
        <Route path="/testing/before/experiment/:id" element={<ExperimentDetail />} />
        <Route path="/testing/before/experiment/:id/full" element={<ExperimentFull />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
