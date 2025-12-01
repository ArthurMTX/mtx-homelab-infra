const container = document.createElement('div');
document.body.appendChild(container);

// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.Camera();
camera.position.z = 1;

// Create the shaders (vertexShader and fragmentShader)
// Paramètres du shader
const vertexShader = `
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform vec2 resolution;
uniform float time;

void main() {
    // Convertir les coordonnées du fragment en un espace compris entre -1.0 et 1.0
    vec2 p = -1.0 + 1.7 * gl_FragCoord.xy / resolution.xy;

    // Définir une valeur d'angle en fonction du temps
    float a = time * 40.0;

    // Déclarer des variables pour les calculs
    float d, e, f, g = 1.0 / 10.0, h, i, r, q;

    // Calculer les coordonnées x et y en fonction du temps et de la position du fragment
    e = 400.0 * (p.x * 0.5 + 0.5);
    f = 400.0 * (p.y * 0.5 + 0.5);

    // Calculer les valeurs d'interpolation i et d
    i = 200.0 + sin(e * g + a / 150.0) * 20.0;
    d = 200.0 + cos(f * g / 2.0) * 18.0 + cos(e * g) * 7.0;

    // Calculer la distance entre le point (e, d) et le fragment (p.x, p.y)
    r = sqrt(pow(abs(i - e), 2.0) + pow(abs(d - f), 2.0));

    // Calculer la valeur q pour l'interpolation
    q = f / r;

    // Appliquer un effet de warp (distorsion) sur les coordonnées du fragment
    e = (r * cos(q)) - a / 100.0;
    f = (r * sin(q)) - a / 100.0;

    // Appliquer des calculs complexes sur les coordonnées pour obtenir i et h
    d = sin(e * g) * 176.0 + sin(e * g) * 164.0 + r;
    h = ((f + d) + a / 2.0) * g;
    i = cos(h + r * p.x / 1.3) * (e + e + a) + cos(q * g * 6.0) * (r + h / 3.0);

    // Calculer une valeur de couleur pour le fragment
    i += cos(h * 2.3 * sin(a / 350.0 - q)) * 184.0 * sin(q - (r * 4.3 + a / 12.0) * g) + tan(r * g + h) * 184.0 * cos(r * g + h);
    i = mod(i / 5.6, 100.0) / 64.0;

    // Appliquer une fonction de transformation pour ajuster la valeur de couleur
    if (i < 0.0) i += 4.0;
    if (i >= 2.0) i = 4.0 - i;
    d = r / 350.0;
    d += sin(d * d * 8.0) * 0.52;
    f = (sin(a * g) + 1.0) / 2.0;

    // Définir la couleur finale du fragment
    gl_FragColor = vec4(vec3(f * i / 1.6, i / 2.0 + d / 13.0, i) * d * p.x + vec3(i / 1.3 + d / 8.0, i / 2.0 + d / 18.0, i) * d * (1.0 - p.x), 1.0);       
}
`;

// Create the shader material
const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
    },
    vertexShader,
    fragmentShader,
});

// Create a full-screen quad for the shader
const geometry = new THREE.PlaneGeometry(2, 2);
const mesh = new THREE.Mesh(geometry, shaderMaterial);
scene.add(mesh);

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Handle window resize
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);

    shaderMaterial.uniforms.resolution.value.x = width;
    shaderMaterial.uniforms.resolution.value.y = height;
}

onWindowResize(); // Call the function once to set initial sizes

window.addEventListener("resize", onWindowResize, false);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update the time uniform for the shader
    shaderMaterial.uniforms.time.value += 0.05;

    mesh.drawMode = THREE.TriangleFanDrawMode;
    mesh.renderOrder = 1;


    renderer.render(scene, camera);
}

animate();

// Clean up the event listener on unmount
window.addEventListener("beforeunload", () => {
    window.removeEventListener("resize", onWindowResize);
    container.removeChild(renderer.domElement);
    renderer.dispose();
});