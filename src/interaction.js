import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
let previousPinchState = false;
let intersectedObject = null;

// Temporary vector for calculations
const tempMatrix = new THREE.Matrix4();

/**
 * Update interaction logic
 * @param {object} handStatus - { landmarks, isPinching }
 * @param {THREE.Camera} camera - The active camera
 * @param {THREE.Group} carouselGroup - The group containing interactive items
 */
export function updateInteraction(handStatus, camera, carouselGroup) {
    const { landmarks, isPinching } = handStatus;

    // Reset visual feedback if no hand or no intersection
    if (intersectedObject) {
        // Basic scaling reset - simplified. In a real app, rely on a stored original scale or state.
        // intersectedObject.scale.set(1, 1, 1);
        // intersectedObject = null;
        // Actually, we want persistence or a specific "hover" state. 
        // Let's implement a simple hover effect: scale up when hovered.
    }

    if (!landmarks) {
        if (intersectedObject) {
            intersectedObject.scale.set(1, 1, 1);
            intersectedObject = null;
        }
        return;
    }

    // 1. Map Hand to World (Approximate cursor position)
    // We use the index finger tip (8) or a midpoint between thumb/index for the cursor.
    // Let's use Index Tip (8) for pointing.
    const indexTip = landmarks[8];

    // Convert 2D MediaPipe (0..1) to NDC (-1..1)
    const ndcX = (indexTip.x) * 2 - 1;
    const ndcY = -(indexTip.y) * 2 + 1;

    // Raycast from Camera
    raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);

    // Check intersections
    const intersects = raycaster.intersectObjects(carouselGroup.children);

    if (intersects.length > 0) {
        const object = intersects[0].object;

        if (intersectedObject !== object) {
            // New hover
            if (intersectedObject) intersectedObject.scale.set(1, 1, 1);
            intersectedObject = object;
            intersectedObject.scale.set(1.2, 1.2, 1.2); // Visual feedback: Enlarge
        }

        // Pinch Logic (Click)
        if (isPinching && !previousPinchState) {
            // Transition False -> True (Click Start)
            onSelect(object);
        }
    } else {
        if (intersectedObject) {
            intersectedObject.scale.set(1, 1, 1);
            intersectedObject = null;
        }
    }

    previousPinchState = isPinching;
}

function onSelect(object) {
    // Visual Feedback: Change color
    // Toggle between random color and original? 
    // Let's just set a random color to indicate "Activé".
    object.material.color.setHex(Math.random() * 0xffffff);

    console.log(`Selected object ID: ${object.userData.id}`);
}
