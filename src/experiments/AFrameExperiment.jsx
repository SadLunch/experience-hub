import AFRAME from 'aframe';

const getCamera = async () => {
    const video = document.getElementById("webcam");
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { exact: "environment" } // <-- This tries to get the rear camera
            }
        });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing webcam: ", err);
    }
};


AFRAME.registerComponent('enter-ar', {
    init: function () {
        try {
            getCamera();
        } catch (error) {
            document.getElementById("log").innerText = error;
        }

    },
});

const AFrameExperiment = () => {

    return (
        <div>
            <div id='log'></div>
            <a-scene enter-ar xr-mode-ui="enabled: false">
                <a-camera position="0 1.6 0" look-controls="touchEnabled: false; mouseEnabled: false;"></a-camera>
                <a-box position="0 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
                {/* <a-sphere apply-camera-quat position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
            <a-cylinder apply-camera-quat position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
            <a-plane apply-camera-quat position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane> */}
                {/* <!-- <a-sky color="#ECECEC"></a-sky> --> */}
            </a-scene>
            <video id="webcam" autoPlay playsInline muted
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: -1,
                }}
            ></video>
        </div>
    );
}

export default AFrameExperiment;