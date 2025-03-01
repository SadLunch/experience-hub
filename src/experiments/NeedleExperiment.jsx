import { useEffect, useRef } from "react";

const NeedleExperiment = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@needle-tools/engine/dist/needle-engine.min.js";
        script.type = "module";
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script); // Cleanup on unmount
        };
    }, []);

    return (
        <div ref={mountRef} className="w-screen h-screen">
            <needle-engine src="https://cloud.needle.tools/-/assets/ZVOHc51tEGla-1tEGla-world/file" autoplay camera-controls contactshadows tonemapping="agx" environment-image="studio"></needle-engine>
        </div>
    );
};

export default NeedleExperiment;
