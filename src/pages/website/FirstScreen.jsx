// import { Link } from 'react-router-dom';
import { useState } from 'react';
import image from '../../assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
// import BackButton from '../../components/BackButton';
import text from '../../data/localization';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../../components/BackButton';

const FirstScreen = () => {
    const [logoClicked, setLogoClicked] = useState(false);
    const [firstPart, setFirstPart] = useState(true);
    const navigate = useNavigate();

    const goToMap = () => {
        localStorage.setItem('backLink', '/hidden/website');
        navigate("/hidden/website/experiences");
    }

    return (
        <div className={`flex flex-col items-center  transition-all duration-700 ease-in-out min-h-screen w-screen overflow-hidden bg-black ${!logoClicked ? "justify-center" : ""}`}>
            <BackButton to='/' />
            {!logoClicked && (
                <h1 className={`mt-5 text-[#E6E518] font-bold font-fontTitle transition-all duration-700 ease-in-out text-3xl ${logoClicked ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}>{ text["pt"].firstScreen.title }</h1>
            )}


            <div className={`relative flex ${logoClicked ? "mt-5 mb-[100px]" : "mt-10"} transition-all duration-700 ease-in-out`}>

                {!logoClicked && (
                    <div className='absolute w-full h-full rounded-full bg-white opacity-50 animate-pulsate z-0' />
                )}

                <img src={image} alt='J-U-S-T-I-Ç-A Logo' onClick={() => {
                    setLogoClicked(!logoClicked);
                    setFirstPart(true);
                }} className={`rounded-full z-10 cursor-pointer transition-all duration-700 ease-in-out ${logoClicked ? "w-20 h-20" : "w-64 h-64"}`} />

            </div>

            <AnimatePresence>
                {logoClicked && (
                    <div>
                        <AnimatePresence>
                            {firstPart && (
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.5 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center mt-10'>
                                        <p className='text-lg font-fontSnas'>{text["pt"].firstScreen.introductionMessage1}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 1 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center'>
                                        <p className='text-lg font-fontSnas'>{text["pt"].firstScreen.introductionMessage2}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 1.5 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center'>
                                        <div onClick={() => setFirstPart(false)} className="block border border-[#5690CC] active:bg-[#5690CC] rounded-xl mt-16 px-4 py-2" >
                                            <h2 className='text-lg text-white text-center font-bold font-fontBtnMenus'>Avançar</h2>
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
                                        <p className='text-lg font-fontSnas'>{text["pt"].firstScreen.introductionMessage3}</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 1 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center'>
                                        <div onClick={goToMap} className="block border border-[#5690CC] active:bg-[#5690CC] rounded-xl mt-16 px-4 py-2" >
                                            <h2 className='text-lg text-white text-center font-bold font-fontBtnMenus'>Começar</h2>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 1 } }}
                                        // exit={{ opacity: 0, y: 50, transition: { duration: 0 } }}

                                        className='m-5 text-center'>
                                        <Link to={"#"} className="block border border-[#5690CC] active:bg-[#5690CC] rounded-xl px-4 py-2" >
                                            <h2 className='text-lg text-white text-center font-bold font-fontBtnMenus'>Sobre Nós</h2>
                                        </Link>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                    </div>
                )}
            </AnimatePresence>
        </div>
    )

    // return (
    //     <div className={`min-h-screen w-screen bg-black flex items-center transition-all duration-700 ease-in-out space-y-4 ${logoClicked ? "flex-col justify-start" : "flex-col-reverse justify-center"}`}>
    //         <BackButton to='/' />
    //         <div className={`relative flex items-center justify-center transition-all duration-700 ease-in-out ${logoClicked ? "w-20 h-20" : "w-64 h-64"}`}>

    //             {!logoClicked && (
    //                 <div className='absolute w-full h-full rounded-full bg-white opacity-50 animate-pulsate z-0' />
    //             )}
                
    //             <img src={image} alt='Title image' onClick={() => setLogoClicked(!logoClicked)} className='w-full h-full rounded-full z-10 relative transition-all duration-700 ease-in-out' />
    //         </div>
            
    //         <h1 className={`text-[#E6E518] font-bold mb-12 font-fontTitle transition-all duration-700 ease-in-out ${logoClicked ? "text-xl" : "text-3xl"}`}>J-U-S-T-I-Ç-A À CHIADO</h1>

    //         {/* <h3 className='text-sm text-[#5690CC] font-bold mb-6 font-fontBtnMenus'>Are you ready?</h3>
    //         <div className='grid grid-cols-2 gap-[4rem] px-4'>
    //             <Link to={'/hidden/website/home'} className='block'>
    //                 <h2 className='text-lg text-[#5690CC] font-bold font-fontBtnMenus'>YES</h2>
    //             </Link>
    //             <h2 className='text-lg text-[#5690CC] font-bold font-fontBtnMenus'>NO</h2>
    //         </div> */}
            
    //     </div>
    // )
}

export default FirstScreen;