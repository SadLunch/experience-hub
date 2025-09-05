import BackButton from "../../components/BackButton";
import { useEffect, useState } from "react";
import text from "../../data/localization";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import play from '../../assets/play_correct_color.png';

const AboutUsPage = () => {
    const [lang, setLang] = useState(localStorage.getItem("lang") || "pt");
    const [initial, setInitial] = useState(true);
    const [artist, setArtist] = useState(false);
    const [partnership, setPartnership] = useState(false);

    useEffect(() => {
        console.log("Language changed to:", lang);
    }, [lang]);

    const bioText = text[lang].aboutUsScreen.artistBio.split('\n');
    const partnershipText = text[lang].aboutUsScreen.partnershipText.split('\n');

    return (
        <div className="flex flex-col items-center  transition-all duration-700 ease-in-out min-h-screen w-screen overflow-hidden bg-black justify-center">
            <LanguageSwitcher onLanguageChange={setLang} />
            {initial && (
                <div className="flex flex-col items-center justify-center text-center py-10">
                    <BackButton to={"/experiences"} />
                    <h1 className="text-2xl sm:text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontBtnMenus">{text[lang].global.title}</h1>

                    <button className="my-10 flex items-center border-2 border-[#E6E518] active:border-[#E6E518] hover:border-[#E6E518] py-2 px-4 rounded-xl bg-black" onClick={() => {
                        setInitial(false);
                        setArtist(true);
                        setPartnership(false);
                    }}>
                        <span className="font-fontBtnMenus text-2xl">{text[lang].aboutUsScreen.artist}</span>
                        <img src={play} className="h-[32px] max-w-[32px]" />
                    </button>

                    <button className="my-10 flex items-center border-2 border-[#E6E518] active:border-[#E6E518] hover:border-[#E6E518] py-2 px-4 rounded-xl bg-black" onClick={() => {
                        setInitial(false);
                        setArtist(false);
                        setPartnership(true);
                    }}>
                        <span className="font-fontBtnMenus text-2xl">{text[lang].aboutUsScreen.partnership}</span>
                        <img src={play} className="h-[32px] max-w-[32px]" />
                    </button>
                </div>
            )}

            {artist && (
                <div className="flex flex-col items-center justify-center text-center py-10">
                    <BackButton callback={() => {
                        setInitial(true);
                        setArtist(false);
                        setPartnership(false);
                    }} />
                    <h1 className="text-2xl sm:text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontBtnMenus">{text[lang].aboutUsScreen.artist}</h1>

                    {bioText.map((p, index) => (
                        <p key={"bio" + index} className="w-full font-fontSans text-left px-10 py-2">{p}</p>
                    ))}
                </div>

            )}

            {partnership && (
                <div className="flex flex-col items-center justify-center text-center py-10">
                    <BackButton callback={() => {
                        setInitial(true);
                        setArtist(false);
                        setPartnership(false);
                    }} />
                    <h1 className="text-2xl sm:text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontBtnMenus">{text[lang].aboutUsScreen.partnershipFull}</h1>

                    {partnershipText.map((p, index) => (
                        <p key={"partnership" + index} className="w-full font-fontSans text-left px-10 py-2">{p}</p>
                    ))}
                </div>

            )}




            <div className="flex-grow" /> {/* Use this to separate the bottom content from the top content */}
        </div>
    );
};

export default AboutUsPage;