import { Hands, HAND_CONNECTIONS } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import * as THREE from 'three';

let hands;
let camera;
let latestLandmarks = null;
let isPinching = false;

// Config for pinch detection
const PINCH_THRESHOLD = 0.05;

/**
 * Initialize MediaPipe Hands
 * @param {HTMLVideoElement} inputVideo - REQUIRED: Video element for camera feed
 * @returns {Promise<void>}
 */
export async function initHandTracker(inputVideo) {
    if (!inputVideo) {
        console.error("initHandTracker: inputVideo element is required.");
        return;
    }

    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    // Use standard getUserMedia to select 'environment' (rear) camera
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Request rear camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        inputVideo.srcObject = stream;
        await inputVideo.play();

        // Start processing loop
        processVideo(inputVideo);

    } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Camera access denied or unavailable.");
    }
}

function processVideo(videoElement) {
    async function step() {
        if (videoElement.readyState >= 2) {
            await hands.send({ image: videoElement });
        }
        requestAnimationFrame(step);
    }
    step();
}

function onResults(results) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        latestLandmarks = results.multiHandLandmarks[0];
        checkPinch(latestLandmarks);
    } else {
        latestLandmarks = null;
        isPinching = false;
    }
}

function checkPinch(landmarks) {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];

    // Normalized coordinates distance
    const distance = Math.sqrt(
        Math.pow(thumbTip.x - indexTip.x, 2) +
        Math.pow(thumbTip.y - indexTip.y, 2)
    );

    isPinching = distance < PINCH_THRESHOLD;
}

export function getHandStatus() {
    return {
        landmarks: latestLandmarks,
        isPinching: isPinching
    };
}
