import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { useEffect, useRef, useState } from "react";
import text from "../../data/localization";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const GraffitiPosScreen = () => {
    const { id } = useParams();

    const container = useRef(null);

    const [lang, setLang] = useState(localStorage.getItem("lang") || "pt");

    useEffect(() => {
        console.log("Language changed to:", lang);
    }, [lang]);

    const description = text[lang].graffitiPos[id].description.split('\n');

    return (
        <div ref={container}>
            <div className="min-h-screen w-screen bg-black flex flex-col items-center py-10 top-0">
                <LanguageSwitcher onLanguageChange={setLang} />
                <h1 className="text-lg sm:text-3xl text-[#E6E518] mt-[5rem] font-fontBtnMenus">{text[lang].graffitiPos[id].title}</h1>
                <h6 className="text-white font-bold mt-2 mb-10 font-fontSans">{ text[lang].graffitiPos[id].dob + " - " + text[lang].graffitiPos[id].dod }</h6>

                <div className="max-w-9/10 mx-8 mb-8">
                    <img src={id === "graffiti-1" ? "/images/femmy.png" : "/images/feminista final2.png" } alt={ text[lang].graffitiPos[id].imageAlt } className="w-full bg-neutral-500 rounded-xl mb-2" />
                    <p className="text-white text-xs font-fontSans">{ text[lang].graffitiPos[id].imageDesc }</p>
                </div>
                

                {description.map((p, index) => (
                    <p key={index} className="w-full font-fontSans text-left px-10 py-2">{p}</p>
                ))}

                <div className="flex-grow" /> {/* Use this to separate the bottom content from the top content */}
                <BackButton to={`/hidden/website/experience/${id}`} />
            </div>
        </div>
    );
};

export default GraffitiPosScreen;