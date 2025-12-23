// Star Chart Engine - Asset Integrated Version
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
  hover: new Image() // Using your hover.png
};

assets.center.src = './assets/World_Penacony.webp'; // Your center asset
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

// Play music on first user interaction (browser restriction)
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
        // ... progress merging logic ...
      } catch(e){}
    }
    buildSidePanel();
  });

// --- Camera & State ---
let camera = { x: 0, y: 0, scale: 0.6 };
let targetCamera = { x: 0, y: 0, scale: 0.6 };
const easing = 0.12;
let focusedCore = null;
let focusedTier = null;
let hovered = null;
let time = 0;

// Visual constants
const coreRadius = 400;
const tierRadius = 140;
const planetSize = 80;
const tierSize = 40;

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

  // 1. Draw Center (World_Penacony)
  ctx.save();
  const pulseScale = 1 + Math.sin(time * 2) * 0.05;
  ctx.globalAlpha = 0.8;
  ctx.drawImage(assets.pulse, -250 * pulseScale, -250 * pulseScale, 500 * pulseScale, 500 * pulseScale);
  ctx.globalAlpha = 1;
  ctx.drawImage(assets.center, -150, -150, 300, 300);
  ctx.restore();

  // 2. Render Planets (Domains)
  if (achievements.planets) {
    achievements.planets.forEach((planet, i) => {
      const angle = i * (2 * Math.PI / achievements.planets.length) - Math.PI/2;
      const px = Math.cos(angle) * coreRadius;
      const py = Math.sin(angle) * coreRadius;

      // Draw hover.png if this planet is hovered
      if (hovered && hovered.type === 'core' && hovered.index === i) {
        ctx.save();
        ctx.globalAlpha = 0.6 + Math.sin(time * 4) * 0.2;
        ctx.drawImage(assets.hover, px - 70, py - 70, 140, 140);
        ctx.restore();
      }

      ctx.drawImage(assets.planet, px - planetSize/2, py - planetSize/2, planetSize, planetSize);

      // Render Tiers
      planet.tiers.forEach((tier, j) => {
        const tangle = j * (2 * Math.PI / planet.tiers.length);
        const tx = px + Math.cos(tangle) * tierRadius;
        const ty = py + Math.sin(tangle) * tierRadius;

        // Line to core
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke();

        ctx.drawImage(assets.node, tx - tierSize/2, ty - tierSize/2, tierSize, tierSize);
        
        // Focused Glow
        if (focusedCore === i && focusedTier === j) {
           ctx.drawImage(assets.hover, tx - 40, ty - 40, 80, 80);
        }
      });
    });
  }

  ctx.restore();
  requestAnimationFrame(draw);
}

// --- Interaction Logic ---
canvas.addEventListener('mousemove', e => {
  const mx = (e.clientX - width/2) / camera.scale - camera.x;
  const my = (e.clientY - height/2) / camera.scale - camera.y;
  
  const newHover = detectHover(mx, my);
  if (newHover && (!hovered || hovered.index !== newHover.index)) {
      sounds.hover.currentTime = 0;
      sounds.hover.play().catch(()=>{});
  }
  setHovered(newHover);
  
  hoverInfo.style.left = (e.clientX + 20) + 'px';
  hoverInfo.style.top = (e.clientY + 20) + 'px';
});

canvas.addEventListener('mousedown', e => {
    if (hovered) {
        sounds.zoom.currentTime = 0;
        sounds.zoom.play().catch(()=>{});
        handleClick(hovered);
    }
});

// Reuse your existing helper functions (detectHover, handleClick, distance, etc.)
// ... (Included in the full project file on GitHub)
requestAnimationFrame(draw);
