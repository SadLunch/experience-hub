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
            //this.el.enterAR();
            getCamera();

            const camera = new AFRAME.THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
            this.el.object3D.add(camera);

            const geometry = new AFRAME.THREE.BoxGeometry();
            const material = new AFRAME.THREE.MeshBasicMaterial({ color: 0x4cc3d9, wireframe: true });
            const box = new AFRAME.THREE.Mesh(geometry, material);
            box.position.set(-1, 0.5, -3).applyMatrix4(camera.matrixWorld);
            box.quaternion.setFromRotationMatrix(camera.matrixWorld);

            this.el.object3D.add(box);
        } catch (error) {
            document.getElementById("log").innerText = error;
        }

    }
});

// AFRAME.registerComponent('apply-camera-quat', {
//     init: function () {
//         this.el.object3D.position.set(-1, 0.5, -3).applyMatrix4(this.el.sceneEl.camera.matrixWorld);
//         this.el.object3D.quaternion.setFromRotationMatrix(this.el.sceneEl.camera.matrixWorld);
//         //.applyQuaternion(AFRAME.scenes[0].camera.quaternion);
//     }
// })

const AFrameExperiment = () => {

    return (
        <div>
            <div id='log'></div>
            <a-scene enter-ar xr-mode-ui="enabled: false; XRMode: ar">
                {/* <a-entity camera position="0 1.6 0"></a-entity>
            <a-box apply-camera-quat position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box> */}
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