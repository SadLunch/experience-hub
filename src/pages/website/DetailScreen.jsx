import { useParams } from "react-router-dom";
import { locations } from "../../data/locations_final";
import BackButton from "../../components/BackButton";
import { useEffect, useRef, useState } from "react";
import play from '../../assets/play_correct_color.png';
import text from "../../data/localization";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import socket from "../../components/useSocket";

const DetailScreen = () => {
    const { id } = useParams();

    const container = useRef(null);

    const [mode, setMode] = useState('easy');
    const [ar, setAR] = useState(false);
    const [session, setSession] = useState(null);
    const startTime = useRef(null);
    const [finishedExperience, setFinishedExperience] = useState(false);
    const experiment = locations.find((exp) => exp.experiment.id === id);

    const [lang, setLang] = useState(localStorage.getItem("lang") || "pt");

    useEffect(() => {
        socket.emit("join_experiment", id);
        return () => {
            socket.emit("leave_experiment", id);
            startTime.current = null;
        }
    }, [id]);

    useEffect(() => {
        console.log("Language changed to:", lang);
    }, [lang]);

    const description = text[lang].experiences[experiment.experiment.id].description.split('\n');

    const hasModes = typeof experiment.experiment.component === 'object' && !Array.isArray(experiment.experiment.component);

    const ComponentToRender = hasModes ? experiment.experiment.component[mode] : experiment.experiment.component;

    const handleEndSession = () => {
        setSession(null);
        setAR(false);
    }

    const handleFinishedExperience = () => {
        setFinishedExperience(true);
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
            startTime.current = Date.now();
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
            startTime.current = Date.now();
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

    const finishExperience = () => {
        if (experiment.experiment.isWebXR) {
            if (session) session.end();
        } else {
            exitFullscreen();
            setAR(false);
        }
        const timeTaken = Date.now() - startTime.current;
        socket.emit("completed_experiment", {
            experimentId: id,
            timeTaken: timeTaken
        });
        if (localStorage.getItem("completed")) {
            let completedStr = localStorage.getItem("completed");
            let completedList = completedStr.split(",");
            if (!completedList.includes(id)) {
                completedList.push(id);
                let outputStr = completedList.join(",");
                localStorage.setItem("completed", outputStr);
            }
        } else {
            localStorage.setItem("completed", id);
        }
    }

    const finishedExperienceGraffiti = () => {
        const timeTaken = Date.now() - startTime.current;
        socket.emit("completed_experiment", {
            experimentId: id,
            timeTaken: timeTaken
        });
        if (localStorage.getItem("completed")) {
            let completedStr = localStorage.getItem("completed");
            let completedList = completedStr.split(",");
            if (!completedList.includes(id)) {
                completedList.push(id);
                let outputStr = completedList.join(",");
                localStorage.setItem("completed", outputStr);
            }
        } else {
            localStorage.setItem("completed", id);
        }
    }

    return (
        <div ref={container}>
            {!ar && (
                <div className="min-h-screen w-screen bg-black flex flex-col items-center py-10 top-0">
                    <LanguageSwitcher onLanguageChange={setLang} />
                    <h1 className="text-2xl sm:text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontBtnMenus">{ text[lang].experiences[experiment.experiment.id].title }</h1>
                    {description.map((p, index) => (
                        <p key={index} className="w-full font-fontSans text-justify px-10 py-2">{ p }</p>
                    ))}
                    

                    {hasModes && (
                        <div className="flex items-center justify-center my-5">
                            <div className="mx-2">
                                <input className="hidden peer" id="radio_1" type="radio" checked={mode === 'easy'} onChange={() => setMode('easy')} />
                                <label className="font-fontBtnMenus text-sm text-gray-500 flex flex-col px-4 py-2 border-2 rounded-xl border-gray-500 cursor-pointer peer-checked:border-[#E6E518] peer-checked:text-white" htmlFor="radio_1">{ text[lang].detailScreen.easy }</label>
                            </div>
                            <div className="mx-2">
                                <input className="hidden peer" id="radio_2" type="radio" checked={mode === 'hard'} onChange={() => setMode('hard')} />
                                <label className="font-fontBtnMenus text-sm text-gray-500 flex flex-col px-4 py-2 border-2 rounded-xl border-gray-500 cursor-pointer peer-checked:border-[#E6E518] peer-checked:text-white" htmlFor="radio_2">{ text[lang].detailScreen.hard }</label>
                            </div>
                        </div>
                    )}

                    <button className="my-10 flex items-center border-2 border-[#E6E518] active:border-[#E6E518] hover:border-[#E6E518] py-2 px-4 rounded-xl bg-black" onClick={startAR}>
                        <span className="font-fontBtnMenus text-sm">{ text[lang].detailScreen.experienceStartExp }</span>
                        <img src={play} className="h-[24px] max-w-[24px]" />
                    </button>

                    <div className="flex-grow" /> {/* Use this to separate the bottom content from the top content */}

                    {experiment.experiment.attributions.length > 0 && (
                        <div className="px-10">
                            <h2 className="font-fontSans mt-4 font-semibold">{text[lang].detailScreen.attributions}:</h2>
                            <ul className="font-fontSans list-disc list-inside">
                                {experiment.experiment.attributions.map((attr, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: attr }} />
                                ))}
                            </ul>
                        </div>
                    )}
                    <BackButton lang={lang} to='/hidden/website/experiences' />
                </div>
            )}
            {ar && (
                <div>
                    {hasModes && (
                        <ComponentToRender session={session} endSession={endAR} id={id} onFinish={finishedExperienceGraffiti} />
                    )}
                    {!hasModes && (
                        <ComponentToRender session={session} endSession={endAR} onFinish={handleFinishedExperience} />
                    )}
                    {/* <button className="absolute bg-gray-800 shadow-lg rounded-lg top-5 left-5 p-3" onClick={endAR}>← Back</button> */}
                    <BackButton lang={lang} callback={endAR} />
                    {finishedExperience && (
                        <button onClick={finishExperience} className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 z-[1000] rounded-lg cursor-pointer font-fontBtnMenus text-black bg-[#E6E518] border-2 border-black text-xs hover:border-[#E6E518] active:border-[#E6E518]">{ text[lang].experiences["whac-a-mole"].endSession }</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DetailScreen;