import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import text from '../../data/localization';
import LanguageSwitcher from '../../components/LanguageSwitcher';

const HomeScreen = () => {
    const [introductionStarted, setIntroductionStarted] = useState(false);
    const [firstPart, setFirstPart] = useState(true);
    const navigate = useNavigate();

    const [lang, setLang] = useState(localStorage.getItem("lang") || "pt");

    useEffect(() => {
        console.log("Language changed to:", lang);
    }, [lang]);

    const goToMap = () => {
        localStorage.setItem('backLink', '/hidden/website/v2');
        navigate("/hidden/website/experiences");
    }

    return (
        <div className="min-h-screen w-screen bg-black flex flex-col items-center py-10 top-0">
            <LanguageSwitcher onLanguageChange={setLang} />
            <h1 className="text-3xl text-[#E6E518] font-bold mt-[5rem] mb-10 font-fontTitle">{ text[lang].firstScreen.title }</h1>

            {!introductionStarted && (
                <div className='grid grid-cols-1 gap-8 px-4 min-w-[90vw]'>
                    <div className='block border border-[#5690CC] rounded-xl active:bg-[#5690CC] px-4 py-2' onClick={() => setIntroductionStarted(true)}>
                        <h2 className='text-xl text-white text-center font-bold font-fontBtnMenus'>{ text[lang].firstScreen.btnIntroduction }</h2>
                    </div>
                    {/* <Link to={'/hidden/website/experiences'} >
                    
                </Link> */}
                    {/* <Link to={'#'} className='block border border-[#2A2E7F] rounded-xl active:bg-[#2A2E7F] px-4 py-2'>
                    <h2 className='text-xl text-white text-center font-bold font-fontBtnMenus'>TBD</h2>
                </Link>
                <Link to={'#'} className='block border border-[#2A2E7F] rounded-xl active:bg-[#2A2E7F] px-4 py-2'>
                    <h2 className='text-xl text-white text-center font-bold font-fontBtnMenus'>TBD</h2>
                </Link> */}
                    <Link to={'#'} className='block border border-[#2A2E7F] rounded-xl active:bg-[#2A2E7F] px-4 py-2'>
                        <h2 className='text-xl text-white text-center font-bold font-fontBtnMenus'>{ text[lang].firstScreen.aboutUs }</h2>
                    </Link>
                </div>
            )}
            
            

            <AnimatePresence>
                {introductionStarted && (
                    <div>
                        <AnimatePresence>
                            {firstPart && (
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center mt-10'>
                                        <p className='text-lg font-fontSnas'>{text[lang].firstScreen.introductionMessage1}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 1 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center'>
                                        <p className='text-lg font-fontSnas'>{text[lang].firstScreen.introductionMessage2}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 1.5 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center'>
                                        <div onClick={() => setFirstPart(false)} className="block border border-[#5690CC] active:bg-[#5690CC] rounded-xl mt-16 px-4 py-2" >
                                            <h2 className='text-lg text-white text-center font-bold font-fontBtnMenus'>{ text[lang].firstScreen.next }</h2>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {!firstPart && (
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center mt-10'>
                                        <p className='text-lg font-fontSnas'>{text[lang].firstScreen.introductionMessage3}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 1 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center'>
                                        <div onClick={goToMap} className="block border border-[#5690CC] active:bg-[#5690CC] rounded-xl mt-16 px-4 py-2" >
                                            <h2 className='text-lg text-white text-center font-bold font-fontBtnMenus'>{ text[lang].firstScreen.map }</h2>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 1 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center'>
                                        <div className="block border border-[#5690CC] active:bg-[#5690CC] rounded-xl px-4 py-2" onClick={() => setIntroductionStarted(false)}>
                                            <h2 className='text-lg text-white text-center font-bold font-fontBtnMenus'>{ text[lang].firstScreen.back }</h2>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                    </div>
                )}
            </AnimatePresence>
            <BackButton to='/hidden/website/v2' />
        </div>
    )
}

export default HomeScreen;