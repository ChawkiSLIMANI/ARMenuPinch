import * as THREE from 'three';

/**
 * Initialize the Three.js Engine
 * @returns {object} { scene, camera, renderer, carouselGroup }
 */
export function initEngine() {
    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    camera.position.z = 2; // Move camera back slightly to see items

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.xr.enabled = true; // DISABLED for iOS/Safari generic support
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // Carousel Group
    const carouselGroup = new THREE.Group();
    carouselGroup.position.set(0, 0, 0); // Recentered for overlay mode (was 0, 1.2, -0.5)
    scene.add(carouselGroup);

    // Placeholder Items for Carousel
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2); // Slightly larger
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xff0000 }),
        new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
        new THREE.MeshStandardMaterial({ color: 0x0000ff }),
    ];

    for (let i = 0; i < 3; i++) {
        const cube = new THREE.Mesh(geometry, materials[i].clone());
        cube.position.x = (i - 1) * 0.4; // Spread them out more
        cube.userData = { id: i, originalColor: materials[i].color.getHex() };
        carouselGroup.add(cube);
    }

    // Handle Window Resize
    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    return { scene, camera, renderer, carouselGroup };
}
