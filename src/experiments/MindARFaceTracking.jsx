// import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import download from '../assets/download_icon.png';
import photo from '../assets/photo_take.png';
import text from '../data/localization';
import propTypes from 'prop-types';

const MindARFaceTracking = ({ onFinish }) => {
    const containerRef = useRef(null);
    const iframeRef = useRef(null);
    const [imageURL, setImageURL] = useState(null);

    const [lang] = useState(localStorage.getItem("lang") || 'pt');

    useEffect(() => {
        const handleImage = (event) => {
            if (event.data?.type === 'canvasImage') {
                setImageURL(event.data.dataURL)
            }
        };

        window.addEventListener('message', handleImage);
        return () => window.removeEventListener('message', handleImage);
    }, [])

    const downloadImage = () => {
        const link = document.createElement("a");
        const now = new Date();
        const timestamp = now.toISOString().replace(/[:.]/g, '-');
        link.download = `screenshot_${timestamp}.png`;
        link.href = imageURL;
        link.click();
        onFinish();
    }

    const triggerIframePhoto = () => {
        iframeRef.current.contentWindow.postMessage({ type: 'TAKE_PHOTO' }, '*');
    };



    return (
        <div ref={containerRef} className='w-screen min-h-screen'>
            <iframe
                ref={iframeRef}
                src='/facetracking.html'
                title='AR Face Tracking with MindAR'
                className='w-screen min-h-screen m-0 '
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                allow='camera; fullscreen; autoplay'
                allowFullScreen />
            {!imageURL && (
                <div className='absolute bottom-20 left-1/2 -translate-x-1/2 z-9998 py-4 inline-flex flex-col items-center'>
                    <span className='text-xl'>{ text[lang].experiences["selfie"].takePhoto }</span>
                    <img src={photo} alt='Take Photo' width={96} height={96}
                        onClick={triggerIframePhoto}
                        className='' />
                </div>
            )}
            {imageURL && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className='relative animate-scale-in'>
                        {/* Close Button */}
                        <span className="absolute top-2 right-2 w-10 h-10 rounded-full border-2 border-white bg-black cursor-pointer text-white flex items-center justify-center shadow-md" onClick={() => {
                            setImageURL(null);
                        }}>
                            ✕
                        </span>
                        <div className="border-2 rounded-xl border-white bg-black overflow-hidden">

                            <img src={imageURL} alt="Picture taken" className="block max-w-[99vw] max-h-[90vh]" />
                            {/* Your content here */}
                        </div>
                        <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full cursor-pointer text-white flex items-center justify-center" onClick={() => {
                            downloadImage();
                        }}>
                            <img src={download} alt="Download Icon" width={32} height={32} />
                            <span className='ml-2 text-[#E6E518] font-fontBtnMenus'>Download</span>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

MindARFaceTracking.propTypes = {
    onFinish: propTypes.func.isRequired,
}

export default MindARFaceTracking;