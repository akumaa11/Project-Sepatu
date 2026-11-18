import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// Ganti baris ini dengan file dari Tripo (misalnya "sepatu-1A-tripo.glb").
// Ukuran dan posisinya disesuaikan otomatis.
const MODEL_URL = "sepatu-1A.glb";
// Jika model dari Tripo menghadap ke arah lain, ubah sudut ini (derajat).
const MODEL_ROTATE_Y = 0;

const stage = document.getElementById("stage");
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loader-text");

// ---------- Renderer, scene, kamera ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 30;
controls.autoRotateSpeed = 1.1;

const key = new THREE.DirectionalLight(0xffffff, 2.1);
key.position.set(6, 12, 8);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 });
key.shadow.radius = 6;
scene.add(key);
scene.add(new THREE.HemisphereLight(0xfff8f0, 0xb8a898, 0.9));
const under = new THREE.DirectionalLight(0xfff4ea, 1.0);
under.position.set(-3, -10, 4);
scene.add(under);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.2 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ---------- Sudut kamera ----------
const VIEWS = {
  hero:    { pos: [5.5, 4.2, 12.5], target: [0, 1.9, 0] },
  side:    { pos: [0, 2.2, 15], target: [0, 1.9, 0] },
  top:     { pos: [0.01, 15, 0.01], target: [0, 1.5, 0] },
  bottom:  { pos: [0.01, -13, 2], target: [0, 0.5, 0] },
  sole:    { pos: [2.5, 0.6, 9.5], target: [0.5, 0.8, 0] },
  stripes: { pos: [0.6, 2.8, 8], target: [0.6, 2.2, 0] },
  laces:   { pos: [4.5, 9, 5], target: [1.2, 3.4, 0] },
};

const viewButtons = document.querySelectorAll(".view-buttons button");
const detailCards = document.querySelectorAll(".detail-card");
const spinBtn = document.getElementById("btn-spin");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let tween = null;
const clock = new THREE.Clock();

function setSpin(on) {
  controls.autoRotate = on;
  spinBtn.setAttribute("aria-pressed", String(on));
}
function markActive(name) {
  viewButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === name)));
  detailCards.forEach((c) => c.classList.toggle("is-active", c.dataset.view === name));
}
function goTo(name, { instant = false } = {}) {
  const v = VIEWS[name];
  markActive(name);
  const to = new THREE.Vector3(...v.pos), tTo = new THREE.Vector3(...v.target);
  if (instant || reduceMotion) {
    camera.position.copy(to);
    controls.target.copy(tTo);
    tween = null;
    return;
  }
  tween = { from: camera.position.clone(), to, tFrom: controls.target.clone(), tTo, k: 0 };
}

viewButtons.forEach((b) => b.addEventListener("click", () => {
  setSpin(b.dataset.view === "hero" && controls.autoRotate);
  goTo(b.dataset.view);
}));
detailCards.forEach((c) => c.addEventListener("click", () => {
  setSpin(false);
  goTo(c.dataset.view);
  document.getElementById("viewer").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
}));
spinBtn.addEventListener("click", () => setSpin(!controls.autoRotate));
controls.addEventListener("start", () => { tween = null; markActive(null); });

goTo("hero", { instant: true });
setSpin(!reduceMotion);

// ---------- Muat model ----------
// Model disamakan ukurannya: panjang 10 unit, di tengah, menapak di lantai.
function fitModel(root) {
  root.rotation.y = THREE.MathUtils.degToRad(MODEL_ROTATE_Y);
  root.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const scale = 10 / Math.max(size.x, size.z);
  root.scale.multiplyScalar(scale);
  root.updateMatrixWorld(true);
  box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= box.min.y;
  root.traverse((o) => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });
}

new GLTFLoader().load(
  MODEL_URL,
  (gltf) => {
    fitModel(gltf.scene);
    scene.add(gltf.scene);
    loader.classList.add("is-done");
  },
  (e) => {
    if (e.total) loaderText.textContent = `Memuat model 3D… ${Math.round((e.loaded / e.total) * 100)}%`;
  },
  () => {
    loaderText.textContent = "Model 3D gagal dimuat. Periksa koneksi internet, lalu muat ulang halaman.";
    loader.querySelector(".loader-ring").hidden = true;
  }
);

// ---------- Ukuran & animasi ----------
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.fov = w < 640 ? 42 : 32; // layar kecil butuh sudut lebih lebar
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();

renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  if (tween) {
    tween.k = Math.min(1, tween.k + dt / 0.9);
    const e = 1 - Math.pow(1 - tween.k, 3);
    camera.position.lerpVectors(tween.from, tween.to, e);
    controls.target.lerpVectors(tween.tFrom, tween.tTo, e);
    if (tween.k >= 1) tween = null;
  }
  controls.update();
  ground.visible = camera.position.y > 0;
  renderer.render(scene, camera);
});
