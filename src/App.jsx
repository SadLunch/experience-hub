// import React from "react";
import { /*BrowserRouter as Router,*/ Routes, Route, HashRouter } from "react-router-dom";
import Hub from './pages/testing/Hub'
import ExperimentDetail from "./pages/ExperimentDetail";
import ExperimentFull from "./pages/ExperimentFull";
import MapView from "./pages/testing/MapView";
import ExperimentDetailTest from "./pages/testing/ExperimentDetailTest";
import Home from "./pages/Home";
import FirstScreenV1 from "./pages/website/FirstScreen_v1";
import MainScreen from "./pages/website/MainScreen";
import FirstScreen from "./pages/website/FirstScreen";
import HomeScreen from "./pages/website/HomeScreen";
import ExperiencesScreen from "./pages/website/ExperiencesScreen";
import DetailScreen from "./pages/website/DetailScreen";
import FirstScreenV2 from "./pages/website/FirstScreen_v2";
import GraffitiPosScreen from "./pages/website/GraffitiPosScreen";
import AboutUsPage from "./pages/website/AboutUs";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Final Routing */}
        <Route path="/" element={<FirstScreen />} />
        <Route path="/aboutUs" element={<AboutUsPage />} />
        <Route path="/experiences" element={<ExperiencesScreen />} />
        <Route path="/experience/:id" element={<DetailScreen />} />
        <Route path="/experience/:id/about" element={<GraffitiPosScreen />} />
        {/* Testting Routing */}
        <Route path="/hidden" element={<Home />} />
        {/* <Route path="/hidden/website" element={<FirstScreen />} /> */}
        <Route path="/hidden/website/v2" element={<FirstScreenV2 />} />
        <Route path="/hidden/website/home" element={<HomeScreen />} />
        {/* <Route path="/hidden/website/experiences" element={<ExperiencesScreen />} /> */}
        {/* <Route path="/hidden/website/experience/:id" element={<DetailScreen />} /> */}
        {/* <Route path="/hidden/website/experience/:id/about" element={<GraffitiPosScreen />} /> */}
        <Route path="/website" element={<FirstScreenV1 />} />
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
