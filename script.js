// Star Chart Engine - Asset Integrated & Debugged Version
const canvas = document.getElementById('starChart');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// --- Asset Loading ---
const assets = {
  center: new Image(),
  planet: new Image(),
  lock: new Image(),
  pulse: new Image(),
  node: new Image(),
  junction: new Image(),
  hover: new Image()
};

assets.center.src = './assets/World_Penacony.webp';
assets.planet.src = './assets/planet.png';
assets.lock.src = './assets/lock.png';
assets.pulse.src = './assets/pulse.png';
assets.node.src = './assets/node.png';
assets.junction.src = './assets/junction.png';
assets.hover.src = './assets/hover.png'; 

// --- Sound Engine ---
const sounds = {
  hover: new Audio('./assets/hover.mp3'),
  zoom: new Audio('./assets/zoom.mp3'),
  background: new Audio('./assets/background.mp3')
};
sounds.background.loop = true;
sounds.background.volume = 0.4;

// Play music on first user interaction
window.addEventListener('mousedown', () => {
    if (sounds.background.paused) sounds.background.play().catch(()=>{});
}, { once: true });

// --- Data Management ---
let achievements = {};
fetch('./achievements.json')
  .then(r => r.json())
  .then(data => {
    achievements = data;
    const saved = localStorage.getItem('progress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        // Progress merging logic can go here
      } catch(e){}
    }
    buildSidePanel(); // FIXED: Now defined below
  })
  .catch(err => console.error("Could not load achievements.json", err));

// --- Camera & State ---
let camera = { x: 0, y: 0, scale: 0.6 };
let targetCamera = { x: 0, y: 0, scale: 0.6 };
const easing = 0.12;
let focusedCore = null;
let focusedTier = null;
let hovered = null;
let time = 0;

const coreRadius = 400;
const tierRadius = 140;
const planetSize = 80;
const tierSize = 40;

// --- Helper Functions (The Missing Pieces) ---

function distance(ax, ay, bx, by) { 
    return Math.hypot(ax - bx, ay - by); 
}

function detectHover(mx, my) {
  if (!achievements.planets) return null;
  for (let i = 0; i < achievements.planets.length; i++) {
    const angle = i * (2 * Math.PI / achievements.planets.length) - Math.PI/2;
    const px = Math.cos(angle) * coreRadius;
    const py = Math.sin(angle) * coreRadius;
    
    // Check Planet hover
    if (distance(mx, my, px, py) < planetSize * 0.7) {
      return { type: 'core', index: i };
    }

    // Check Tier hover
    const planet = achievements.planets[i];
    for (let j = 0; j < planet.tiers.length; j++) {
      const tangle = j * (2 * Math.PI / planet.tiers.length);
      const tx = px + Math.cos(tangle) * tierRadius;
      const ty = py + Math.sin(tangle) * tierRadius;
      if (distance(mx, my, tx, ty) < tierSize * 0.8) {
        return { type: 'tier', core: i, tier: j };
      }
    }
  }
  return null;
}

function buildSidePanel() {
  const sidePanel = document.getElementById('sidePanel');
  if (sidePanel) sidePanel.style.display = 'flex';
}

function setHovered(h) {
  const hoverInfo = document.getElementById('hoverInfo');
  if (!h) {
    if (hoverInfo) hoverInfo.classList.remove('show');
    hovered = null;
    return;
  }
  
  if (!hovered || hovered.index !== h.index || hovered.type !== h.type) {
      sounds.hover.currentTime = 0;
      sounds.hover.play().catch(()=>{});
  }
  
  hovered = h;
  if (hoverInfo) {
    hoverInfo.classList.add('show');
    const title = hoverInfo.querySelector('.hi-title');
    if (h.type === 'core') title.innerText = achievements.planets[h.index].planetName;
  }
}

function handleClick(hit) {
  if (hit.type === 'core') {
    const i = hit.index;
    const angle = i * (2 * Math.PI / achievements.planets.length) - Math.PI/2;
    targetCamera.x = -Math.cos(angle) * coreRadius;
    targetCamera.y = -Math.sin(angle) * coreRadius;
    targetCamera.scale = 1.6;
    focusedCore = i;
  }
}

// --- Main Render Loop ---
function draw() {
  time += 0.016;
  camera.x += (targetCamera.x - camera.x) * easing;
  camera.y += (targetCamera.y - camera.y) * easing;
  camera.scale += (targetCamera.scale - camera.scale) * easing;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(camera.scale, camera.scale);
  ctx.translate(camera.x, camera.y);

  // Center (Penacony)
  ctx.save();
  const pulseScale = 1 + Math.sin(time * 2) * 0.05;
  ctx.globalAlpha = 0.3;
  ctx.drawImage(assets.pulse, -300 * pulseScale, -300 * pulseScale, 600 * pulseScale, 600 * pulseScale);
  ctx.globalAlpha = 1;
  ctx.drawImage(assets.center, -150, -150, 300, 300);
  ctx.restore();

  // Planets
  if (achievements.planets) {
    achievements.planets.forEach((planet, i) => {
      const angle = i * (2 * Math.PI / achievements.planets.length) - Math.PI/2;
      const px = Math.cos(angle) * coreRadius;
      const py = Math.sin(angle) * coreRadius;

      if (hovered && hovered.type === 'core' && hovered.index === i) {
        ctx.drawImage(assets.hover, px - 75, py - 75, 150, 150);
      }

      ctx.drawImage(assets.planet, px - planetSize/2, py - planetSize/2, planetSize, planetSize);
    });
  }

  ctx.restore();
  requestAnimationFrame(draw);
}

// --- Events ---
canvas.addEventListener('mousemove', e => {
  const mx = (e.clientX - width/2) / camera.scale - camera.x;
  const my = (e.clientY - height/2) / camera.scale - camera.y;
  setHovered(detectHover(mx, my));
  
  const hoverInfo = document.getElementById('hoverInfo');
  if (hoverInfo) {
      hoverInfo.style.left = (e.clientX + 20) + 'px';
      hoverInfo.style.top = (e.clientY + 20) + 'px';
  }
});

canvas.addEventListener('mousedown', e => {
    if (hovered) {
        sounds.zoom.currentTime = 0;
        sounds.zoom.play().catch(()=>{});
        handleClick(hovered);
    }
});

requestAnimationFrame(draw);
