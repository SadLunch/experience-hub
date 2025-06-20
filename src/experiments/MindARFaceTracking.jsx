// import html2canvas from 'html2canvas';
import { useEffect, useRef } from 'react';

const MindARFaceTracking = () => {
    const containerRef = useRef(null);
    const iframeRef = useRef(null);

    const enterFullscreen = () => {
        if (!containerRef.current) return;

        if (containerRef.current.requestFullscreen) {
            containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
            containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.msRequestFullscreen) {
            containerRef.current.msRequestFullscreen();
        }
    };

    useEffect(() => {
        enterFullscreen();
    }, [])

    const triggerIframePhoto = () => {
        iframeRef.current.contentWindow.postMessage({ type: 'TAKE_PHOTO' }, '*');
    };

    return (
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
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
            <button
                onClick={triggerIframePhoto}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    padding: '10px 20px',
                    fontSize: '16px'
                }}
            >
                📸 Take Screenshot
            </button>
        </div>
    );
}

export default MindARFaceTracking;