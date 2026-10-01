import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const $ = (s, el = document) => el.querySelector(s);
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

$("#year").textContent = new Date().getFullYear();

/* CSWP placeholder: until a real link is set, the button explains itself instead of jumping to the top */
const cswp = $("#cswpLink");
if (cswp.getAttribute("href") === "#") {
  cswp.classList.add("is-placeholder");
  cswp.title = "CSWP certificate link coming soon";
  cswp.removeAttribute("target");
  cswp.addEventListener("click", e => e.preventDefault());
}

/* ---------- loaders (SOLIDWORKS glTF export uses Draco compression) ---------- */
const draco = new DRACOLoader().setDecoderPath("./vendor/three/addons/libs/draco/");
const gltfLoader = new GLTFLoader().setDRACOLoader(draco);

/* ---------- video block ---------- */
const ytId = u => (u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
const videoBlock = (p, n) => {
  const v = p.video || "";
  let inner;
  if (!v) {
    inner = `<div class="video-ph">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M10 8.5v7l5.5-3.5z"/></svg>
      <span>Video of the fixture in use, coming soon</span></div>`;
  } else if (ytId(v)) {
    inner = `<iframe src="https://www.youtube-nocookie.com/embed/${ytId(v)}" title="${esc(p.title)} video" loading="lazy"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else {
    inner = `<video src="${esc(v)}" controls playsinline preload="metadata"></video>`;
  }
  return `<div class="p-video"><p class="eyebrow mono">${n} · In the lab</p><div class="video-frame">${inner}</div></div>`;
};

/* ---------- render projects ---------- */
const list = $("#projectList");
(window.PROJECTS || []).forEach((p, i) => {
  const n = String(i + 1).padStart(2, "0");
  const specs = Object.entries(p.specs || {}).filter(([, v]) => v);
  const el = document.createElement("article");
  el.className = "project" + (i % 2 ? " flip" : "");
  el.innerHTML = `
    <div class="p-row">
      <div class="p-media">
        <div class="media-frame"><div class="stage"><div class="viewer-msg">Loading model…</div></div></div>
        <p class="caption">Interactive model · drag to rotate, scroll to zoom</p>
      </div>
      <div class="p-body">
        <div class="p-num">${n}</div>
        <h3>${esc(p.title)}</h3>
        ${p.subtitle ? `<p class="p-sub">${esc(p.subtitle)}</p>` : ""}
        ${p.summary ? `<p class="p-summary">${esc(p.summary)}</p>` : ""}
        ${(p.highlights || []).length ? `<ul class="p-highlights">${p.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
        ${specs.length ? `<div class="p-specs">${specs.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>` : ""}
        ${(p.tags || []).length ? `<div class="chips">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
      </div>
    </div>
    ${videoBlock(p, n)}`;
  list.appendChild(el);

  const frame = $(".media-frame", el);
  if (!p.model) { $(".stage", el).innerHTML = `<div class="viewer-msg">Model coming soon</div>`; $(".caption", el).textContent = ""; return; }
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); createViewer(frame, p.model); } }, { rootMargin: "300px" });
  io.observe(el);
});

/* ---------- 3D viewer ---------- */
function createViewer(frame, url) {
  const stage = $(".stage", frame);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 4 / 3, 0.001, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6e4f2, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(3, 5, 4); scene.add(key);
  const rim = new THREE.DirectionalLight(0xcfe0f5, 0.9); rim.position.set(-4, 2, -3); scene.add(rim);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.autoRotate = true; controls.autoRotateSpeed = 1.2;
  renderer.domElement.addEventListener("pointerdown", () => controls.autoRotate = false);

  const tools = document.createElement("div");
  tools.className = "viewer-tools";
  tools.innerHTML = `<button title="Reset view" aria-label="Reset view">⟲</button><button title="Toggle auto-rotate" aria-label="Toggle auto-rotate">⟳</button>`;

  let fit = () => {}, visible = true;
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight || w * .75;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  };
  const loop = () => { requestAnimationFrame(loop); if (!visible) return; controls.update(); renderer.render(scene, camera); };

  gltfLoader.load(url, g => {
    const obj = g.scene;
    // SOLIDWORKS colors often export dark/flat; brighten for a clean white page
    obj.traverse(m => {
      if (m.isMesh && m.material) {
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach(mt => { if ("metalness" in mt) { mt.metalness = Math.min(mt.metalness, .35); mt.roughness = Math.max(mt.roughness, .45); } });
      }
    });
    const box = new THREE.Box3().setFromObject(obj), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
    obj.position.sub(c);
    const d = size.length();
    const grid = new THREE.GridHelper(d * 2, 20, 0x9fbfe2, 0xe3edf8);
    grid.position.y = -size.y / 2 - d * 0.002; scene.add(grid);
    scene.add(obj);
    fit = () => {
      camera.near = d / 200; camera.far = d * 50; camera.updateProjectionMatrix();
      camera.position.set(d * 0.62, d * 0.42, d * 0.78); controls.target.set(0, 0, 0); controls.update();
    };
    fit();
    stage.innerHTML = ""; stage.append(renderer.domElement); frame.append(tools);
    resize(); loop();
  }, undefined, () => stage.innerHTML = `<div class="viewer-msg">Model could not be loaded</div>`);

  tools.children[0].onclick = () => fit();
  tools.children[1].onclick = () => controls.autoRotate = !controls.autoRotate;
  new ResizeObserver(resize).observe(stage);
  new IntersectionObserver(es => visible = es[0].isIntersecting).observe(frame);
}
