import { initEngine } from './src/engine.js';
import { initHandTracker, getHandStatus } from './src/handTracker.js';
import { updateInteraction } from './src/interaction.js';

async function main() {
    const videoElement = document.getElementById('camera-feed');

    // 1. Initialize Engine (Transparent, Non-WebXR)
    const { scene, camera, renderer, carouselGroup } = initEngine();

    // 2. Initialize Hand Tracker with the EXISTING video element
    // We need to ensure the camera starts. MediaPipe Camera Utils can handle this.
    await initHandTracker(videoElement);

    // 3. Animation Loop
    // Since we are not using WebXR 'setAnimationLoop' strictly requires XR, 
    // but Three.js standard loop works too.
    renderer.setAnimationLoop(() => {
        // Get latest hand data
        const handStatus = getHandStatus();

        // Update interaction logic
        updateInteraction(handStatus, camera, carouselGroup);

        // Render
        renderer.render(scene, camera);
    });
}

main();
