import { useParams } from "react-router-dom";
import { locations } from "../../data/locations_final";
import BackButton from "../../components/BackButton";
import { useRef, useState } from "react";
import play from '../../assets/play_correct_color.png';
import text from "../../data/localization";

const DetailScreen = () => {
    const { id } = useParams();

    const container = useRef(null);

    const [mode, setMode] = useState('easy');
    const [ar, setAR] = useState(false);
    const [session, setSession] = useState(null);
    const experiment = locations.find((exp) => exp.experiment.id === id);

    const hasModes = typeof experiment.experiment.component === 'object' && !Array.isArray(experiment.experiment.component);

    const ComponentToRender = hasModes ? experiment.experiment.component[mode] : experiment.experiment.component;

    const handleEndSession = () => {
        setSession(null);
        setAR(false);
    }

    const enterFullscreen = () => {
        if (!container.current) return;

        if (container.current.requestFullscreen) {
            container.current.requestFullscreen();
        } else if (container.current.webkitRequestFullscreen) {
            container.current.webkitRequestFullscreen();
        } else if (container.current.msRequestFullscreen) {
            container.current.msRequestFullscreen();
        }
    };

    const exitFullscreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
    };

    const startAR = () => {
        if (experiment.experiment.isWebXR) {
            if (!navigator.xr) {
                console.warn('WebXR not supported!');
                // Show webXR not supported message to user
                return;
            }
            navigator.xr.requestSession('immersive-ar', experiment.experiment.sessionOptions)
            .then((xrSession) => {
                xrSession.addEventListener('end', handleEndSession);

                setSession(xrSession);
                setAR(true);
            })
            .catch((err) => {
                console.log("Failed to start AR:", err);
                //show user message that some trouble has ocurred
            })
        } else {
            enterFullscreen();
            setAR(true);
        }
    };

    const endAR = () => {
        if (experiment.experiment.isWebXR) {
            if (session) session.end();
        } else {
            exitFullscreen();
            setAR(false);
        }
    }

    return (
        <div ref={container}>
            {!ar && (
                <div className="min-h-screen w-screen bg-black flex flex-col items-center py-10 top-0">
                    <h1 className="text-2xl sm:text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontBtnMenus">{ text["pt"].experiences[experiment.experiment.id].title }</h1>
                    <p className="font-fontSans text-justify px-10">{ text["pt"].experiences[experiment.experiment.id].description }</p>

                    {hasModes && (
                        <div className="flex items-center justify-center my-5">
                            <div className="mx-2">
                                <input className="hidden peer" id="radio_1" type="radio" checked={mode === 'easy'} onChange={() => setMode('easy')} />
                                <label className="font-fontBtnMenus text-sm text-gray-500 flex flex-col px-4 py-2 border-2 rounded-xl border-gray-500 cursor-pointer peer-checked:border-[#E6E518] peer-checked:text-white" htmlFor="radio_1">Fácil</label>
                            </div>
                            <div className="mx-2">
                                <input className="hidden peer" id="radio_2" type="radio" checked={mode === 'hard'} onChange={() => setMode('hard')} />
                                <label className="font-fontBtnMenus text-sm text-gray-500 flex flex-col px-4 py-2 border-2 rounded-xl border-gray-500 cursor-pointer peer-checked:border-[#E6E518] peer-checked:text-white" htmlFor="radio_2">Difícil</label>
                            </div>
                        </div>
                    )}

                    <button className="my-10 flex items-center border-2 border-[#E6E518] py-2 px-4 rounded-xl bg-black" onClick={startAR}>
                        <span className="font-fontBtnMenus text-sm">{ text["pt"].detailScreen.experienceStartExp }</span>
                        <img src={play} className="h-[24px] max-w-[24px]" />
                    </button>

                    <div className="flex-grow" /> {/* Use this to separate the bottom content from the top content */}

                    <div className="px-10">
                        <h2 className="font-fontSans mt-4 font-semibold">{ text["pt"].detailScreen.attributions }:</h2>
                        <ul className="font-fontSans list-disc list-inside">
                            {experiment.experiment.attributions.map((attr, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: attr }} />
                            ))}
                        </ul>
                    </div>
                    <BackButton to='/hidden/website/experiences' />
                </div>
            )}
            {ar && (
                <div>
                    <ComponentToRender session={session} endSession={endAR} />
                    <button className="absolute bg-gray-800 shadow-lg rounded-lg top-5 left-5 p-3" onClick={endAR}>← Back</button>
                </div>
            )}
        </div>
    );
};

export default DetailScreen;