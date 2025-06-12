import { useRef } from 'react';

const MindARFaceTracking = () => {
    const containerRef = useRef(null);

    return (
        <div ref={containerRef} style={{ width: '100vw', height: '100vh' }}>
            <iframe 
            src='/facetracking.html'
            title='AR Face Tracking with MindAR'
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            allow='camera; fullscreen; autoplay' />
        </div>
    );
}

export default MindARFaceTracking;