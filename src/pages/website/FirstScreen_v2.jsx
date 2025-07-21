import { useEffect, useState } from 'react';
import image from '../../assets/logo.png';
import BackButton from '../../components/BackButton';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import text from '../../data/localization';

const FirstScreenV2 = () => {
    const [lang, setLang] = useState(localStorage.getItem("lang") || "pt");

    useEffect(() => {
        console.log("Language changed to:", lang);
    }, [lang]);

    return (
        <div className="min-h-screen w-screen bg-black flex flex-col items-center justify-center py-10">
            <LanguageSwitcher onLanguageChange={setLang} />
            <h1 className="text-3xl text-[#E6E518] font-bold mb-12 font-fontTitle">{ text[lang].firstScreen.title }</h1>
            <img src={image} alt='Title image' className='mb-6' />
            <h3 className='text-sm text-[#5690CC] font-bold mb-6 font-fontBtnMenus'>{ text[lang].firstScreen.readyQuestion }</h3>
            <div className='grid grid-cols-2 gap-[4rem] px-4'>
                <Link to={'/hidden/website/home'} className='block'>
                    <h2 className='text-lg text-[#5690CC] font-bold font-fontBtnMenus'>{ text[lang].firstScreen.btnReady }</h2>
                </Link>
                <h2 className='text-lg text-[#5690CC] font-bold font-fontBtnMenus'>{ text[lang].firstScreen.btnNotReady }</h2>
            </div>
            <BackButton to='/' />
        </div>
    )
}

export default FirstScreenV2;