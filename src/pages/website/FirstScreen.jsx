import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRef, useState } from "react";
import BackButton from '../../components/BackButton';

const FirstScreen = () => {
    const [permissionsPage, setPermissionsPage] = useState(false);
    const [startingPage, setStartingPage] = useState(false);
    const containerRef = useRef(null);

    const goToPermissions = () => {
        setPermissionsPage(true);
    };

    const requestCameraAccess = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            console.log("Camera permission granted.");
        } catch (e) {
            console.error("Camera permission denied:", e);
            alert("Camera access is required for AR experiences.");
        }
    };

    const requestLocationAccess = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                alert("Geolocation is not supported by your browser.");
                reject("Geolocation not supported");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Location permission granted.");
                    resolve(position);
                },
                (err) => {
                    console.error("Location permission denied:", err);
                    alert("Location access is required for location-based AR experiences.");
                    reject(err);
                }
            );
        });
    };

    const openWebsiteInFullscreen = () => {
        if (containerRef.current.requestFullscreen) { containerRef.current.requestFullscreen(); }
        else if (containerRef.current.webkitRequestFullscreen) { containerRef.current.webkitRequestFullscreen(); }
        else if (containerRef.current.msRequestFullscreen) { containerRef.current.msRequestFullscreen(); }
    }


    const grantPermissions = async () => {
        try {
            openWebsiteInFullscreen();
            await requestCameraAccess();
            await requestLocationAccess();
            

            // Optional: Check AR support
            if (navigator.xr) {
                const supported = await navigator.xr.isSessionSupported('immersive-ar');
                console.log("AR support:", supported);
            }

            // All good, move to experience
            setStartingPage(true);
            setPermissionsPage(false);
        } catch (e) {
            console.error("Permission request failed", e);
        }
    };

    return (
        <div ref={containerRef}>
            <BackButton to='/' />
            {!permissionsPage && !startingPage && (
                <div className='min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-center p-10'>
                    <motion.div
                        key="welcome"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0 }}
                    >
                        <h1 className='text-3xl font-bold mb-6'>Welcome</h1>
                    </motion.div>
                    <motion.div
                        key="introduction"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className='text-gray-400 mb-6 text-center'> Introduction to experience.</p>
                    </motion.div>
                    <motion.div
                        key="continue"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <button
                            onClick={goToPermissions}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                        >
                            Continue
                        </button>
                    </motion.div>
                </div>
            )}
            {permissionsPage && !startingPage && (
                <div className='min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-center p-10'>
                    <motion.div
                        key="permissions"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0 }}
                    >
                        <h1 className='text-3xl font-bold mb-6'>Permissions</h1>
                    </motion.div>
                    <motion.div
                        key="explanation"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className='text-gray-400 mb-6 text-center'> Introduction to experience.</p>
                    </motion.div>
                    <motion.div
                        key="continue"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <button
                            onClick={grantPermissions}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                        >
                            Grant Permissions
                        </button>
                    </motion.div>
                </div>
            )}
            {!permissionsPage && startingPage && (
                <div className='min-h-screen w-screen bg-gray-900 flex flex-col items-center justify-center p-10'>
                    <motion.div
                        key="ready"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0 }}
                    >
                        <h1 className='text-3xl font-bold mb-6'>Ready to Start!</h1>
                    </motion.div>
                    <motion.div
                        key="readyMessage"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className='text-gray-400 mb-6 text-center'>You are now ready to start the experiences.</p>
                    </motion.div>
                    <motion.div
                        key="start"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link to="/website/main"
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow"
                        >
                            Start
                        </Link>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default FirstScreen;