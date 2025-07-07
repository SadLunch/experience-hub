import * as THREE from 'three';

export const takeXRScreenshot = async (renderer, scene, camera) => {
    if (!renderer || !scene || !camera) return;

    // const renderer = rendererRef.current;
    // const scene = sceneRef.current;
    // const camera = cameraRef.current;

    const pixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth * pixelRatio;
    const height = window.innerHeight * pixelRatio;

    // --- STEP 1: Capture camera frame from getUserMedia ---
    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.width = window.innerWidth;
    video.height = window.innerHeight;

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
        video.srcObject = stream;

        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve();
            };
        });
    } catch (e) {
        console.error('Failed to access camera:', e);
        return;
    }

    // Use the actual video dimensions
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoAspect = videoWidth / videoHeight;
    const canvasAspect = width / height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (videoAspect > canvasAspect) {
        // Video is wider than canvas: crop sides
        drawHeight = height;
        drawWidth = height * videoAspect;
        offsetX = (width - drawWidth) / 2;
        offsetY = 0;
    } else {
        // Video is taller than canvas: crop top/bottom
        drawWidth = width;
        drawHeight = width / videoAspect;
        offsetX = 0;
        offsetY = (height - drawHeight) / 2;
    }

    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = width;
    bgCanvas.height = height;
    const bgCtx = bgCanvas.getContext('2d');

    // Clear first to avoid leftovers
    bgCtx.clearRect(0, 0, width, height);

    // Draw video centered and scaled properly
    bgCtx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

    // bgCtx.drawImage(video, 0, 0, width, height);

    if (video) {
        // Stop video stream immediately to release camera
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }

    // --- STEP 2: Render 3D content to offscreen render target ---
    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
        encoding: THREE.sRGBEncoding,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: true,
        stencilBuffer: false,
        colorSpace: THREE.SRGBColorSpace,
    });

    const wasXREnabled = renderer.xr.enabled;
    const currentXRSession = renderer.xr.getSession();
    const oldRenderTarget = renderer.getRenderTarget();

    renderer.xr.enabled = false;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    // renderer.setRenderTarget(null);

    // --- Cleanup ---
    renderer.xr.enabled = wasXREnabled;
    renderer.setRenderTarget(oldRenderTarget);
    renderer.render(scene, camera);

    if (wasXREnabled && currentXRSession) {
        renderer.xr.setSession(currentXRSession);
    }

    const pixels = new Uint8Array(4 * width * height);
    renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, pixels);

    

    const vrCanvas = document.createElement('canvas');
    vrCanvas.width = width;
    vrCanvas.height = height;
    const vrCtx = vrCanvas.getContext('2d');
    const vrImageData = vrCtx.createImageData(width, height);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const srcIdx = (y * width + x) * 4;
            const destIdx = ((height - y - 1) * width + x) * 4;
            vrImageData.data[srcIdx] = pixels[destIdx];
            vrImageData.data[srcIdx + 1] = pixels[destIdx + 1];
            vrImageData.data[srcIdx + 2] = pixels[destIdx + 2];
            vrImageData.data[srcIdx + 3] = pixels[destIdx + 3];
        }
    }

    vrCtx.putImageData(vrImageData, 0, 0);

    // --- STEP 3: Composite camera + 3D content ---
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = width;
    finalCanvas.height = height;
    const finalCtx = finalCanvas.getContext('2d');

    finalCtx.drawImage(bgCanvas, 0, 0, width, height); // Camera feed
    finalCtx.drawImage(vrCanvas, 0, 0, width, height); // Virtual content

    const dataURL = finalCanvas.toDataURL('image/png');

    return dataURL;
    // const link = document.createElement('a');
    // link.href = dataURL;
    // const now = new Date();
    // const timestamp = now.toISOString().replace(/[:.]/g, '-');
    // link.download = `xr_screenshot_${timestamp}.png`;

    // link.click();
};