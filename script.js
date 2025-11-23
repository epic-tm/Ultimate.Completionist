// Updated script.js — improved interface & hover/tier/junction UI
// Keeps achievements.json untouched and still uses localStorage for progress.

// -- Canvas setup & asset loading --
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

// Images (do not edit files, just referencing)
const assets = {
  center: new Image(),
  planet: new Image(),
  lock: new Image(),
  pulse: new Image(),
  node: new Image(),
  junction: new Image()
};
assets.center.src = './assets/center.png';
assets.planet.src = './assets/planet.png';
assets.lock.src = './assets/lock.png';
assets.pulse.src = './assets/pulse.png';
assets.node.src = './assets/node.png';
assets.junction.src = './assets/junction.png';

// Sounds (optional)
const sounds = {
  hover: new Audio('./assets/hover.mp3'),
  zoom: new Audio('./assets/zoom.mp3'),
  background: new Audio('./assets/background.mp3')
};
sounds.background.loop = true;
sounds.background.volume = 0.35;
try{ sounds.background.play().catch(()=>{}); } catch(e){ /* autoplay blocked sometimes */ }

// Achievements (loaded from file, don't modify achievements.json)
let achievements = {};
fetch('./achievements.json')
  .then(r => r.json())
  .then(data => {
    achievements = data;
    // merge saved progress (backwards compatible)
    const saved = localStorage.getItem('progress');
    if (saved) {
      try {
        const progress = JSON.parse(saved);
        if (progress.planets) {
          progress.planets.forEach((p, i) => {
            p.tiers.forEach((t, j) => {
              t.achievements.forEach((a, k) => {
                if (achievements.planets?.[i]?.tiers?.[j]?.achievements?.[k]) {
                  achievements.planets[i].tiers[j].achievements[k].status = a.status;
                  achievements.planets[i].tiers[j].achievements[k].dateCompleted = a.dateCompleted || null;
                }
              });
            });
          });
        }
      } catch(e){}
    }
    buildSidePanel(); // show minimal UI if data present
  })
  .catch(err => {
    console.error('Failed to load achievements.json', err);
  });

// -- Camera & navigation setup --
let camera = { x: 0, y: 0, scale: 0.6 };
let targetCamera = { x: 0, y: 0, scale: 0.6 };
const easing = 0.12;

let focusedCore = null;   // planet index
let focusedTier = null;   // tier index
let hovered = null;       // hover info object

// Visual constants (tweakable)
const coreRadius = 380;
const tierRadius = 120;
const planetSize = 60;
const tierSize = 36;
const achievementSize = 12;

// Starfield
let starParticles = [];
for (let i = 0; i < 220; i++) {
  starParticles.push({
    x: Math.random() * 2000 - 1000,
    y: Math.random() * 2000 - 1000,
    size: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.6 + 0.2,
    alpha: Math.random() * 0.7 + 0.3
  });
}
let time = 0;

// DOM elements for UI
const hoverInfo = document.getElementById('hoverInfo');
const sidePanel = document.getElementById('sidePanel');
const planetNameEl = document.getElementById('planetName');
const planetMetaEl = document.getElementById('planetMeta');
const tiersSection = document.getElementById('tiersSection');
const tiersList = document.getElementById('tiersList');
const junctionSection = document.getElementById('junctionSection');
const junctionList = document.getElementById('junctionList');
const popup = document.getElementById('popup');
const junctionModal = document.getElementById('junctionModal');
const junctionTasks = document.getElementById('junctionTasks');
const junctionTitle = document.getElementById('junctionTitle');
const junctionClose = document.getElementById('junctionClose');
const junctionComplete = document.getElementById('junctionComplete');

document.getElementById('zoomOutBtn').addEventListener('click', () => { targetCamera.scale = 0.6; focusedCore = focusedTier = null; hideSidePanel(); });
document.getElementById('recenterBtn').addEventListener('click', () => { targetCamera.x = 0; targetCamera.y = 0; });

junctionClose.addEventListener('click', () => junctionModal.style.display = 'none');
junctionComplete.addEventListener('click', () => {
  // For demo we just close — specific logic can be wired into achievement completion
  junctionModal.style.display = 'none';
});

// build side panel skeleton
function buildSidePanel(){
  if (!achievements.planets?.length) return;
  sidePanel.style.display = 'flex';
  document.getElementById('sideTitle').innerText = 'Star Chart — Achievements';
}

// -- Main render loop --
function draw() {
  time += 0.016;
  // camera easing
  camera.x += (targetCamera.x - camera.x) * easing;
  camera.y += (targetCamera.y - camera.y) * easing;
  camera.scale += (targetCamera.scale - camera.scale) * easing;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(camera.scale, camera.scale);
  ctx.translate(camera.x, camera.y);

  // starfield
  starParticles.forEach(p => {
    ctx.globalAlpha = p.alpha * 0.8;
    ctx.fillStyle = 'white';
    ctx.fillRect(p.x, p.y, p.size, p.size);
    p.x -= p.speed;
    if (p.x < -1200) p.x = 1200;
  });
  ctx.globalAlpha = 1;

  // center image
  ctx.save();
  ctx.drawImage(assets.center, -60, -60, 120, 120);
  ctx.restore();

  // planets rendering
  if (achievements.planets) {
    achievements.planets.forEach((planet, i) => {
      const angle = i * (2 * Math.PI / achievements.planets.length) - Math.PI/2;
      const px = Math.cos(angle) * coreRadius;
      const py = Math.sin(angle) * coreRadius;

      // when hovered, draw an outer glow ring
      if (hovered && hovered.type === 'core' && hovered.index === i) {
        ctx.beginPath();
        ctx.lineWidth = 6 / camera.scale;
        ctx.strokeStyle = 'rgba(100,223,255,0.12)';
        ctx.arc(px, py, planetSize*0.9 + 12 + Math.sin(time*3)*3, 0, Math.PI*2);
        ctx.stroke();
      }

      // planet sprite
      ctx.drawImage(assets.planet, px - planetSize/2, py - planetSize/2, planetSize, planetSize);

      // planet label (only when zoomed in)
      if (camera.scale > 0.9) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = '600 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(planet.planetName || `Planet ${i+1}`, px, py + planetSize/2 + 14);
      }

      // draw tiers around planet
      planet.tiers.forEach((tier, j) => {
        const tangle = j * (2 * Math.PI / planet.tiers.length);
        const tx = px + Math.cos(tangle) * tierRadius;
        const ty = py + Math.sin(tangle) * tierRadius;

        // connecting line
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 2 / camera.scale;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(tx, ty); ctx.stroke();

        // tier icon
        ctx.drawImage(assets.planet, tx - tierSize/2, ty - tierSize/2, tierSize, tierSize);

        // highlight when focused
        if (focusedCore === i && focusedTier === j) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(100,223,255,0.6)';
          ctx.lineWidth = 3 / camera.scale;
          ctx.arc(tx, ty, tierSize, 0, Math.PI*2); ctx.stroke();
        }

        // junction markers between tiers (improved icon)
        if (j < planet.tiers.length - 1) {
          const jangle = (j + 0.5) * (2 * Math.PI / planet.tiers.length);
          const jx = px + Math.cos(jangle) * (tierRadius + 22);
          const jy = py + Math.sin(jangle) * (tierRadius + 22);
          ctx.drawImage(assets.junction, jx - 8, jy - 8, 16, 16);

          // subtle pulse for junctions if near focus
          if (focusedCore === i && focusedTier === j) {
            ctx.beginPath();
            ctx.globalAlpha = 0.6 + Math.sin(time*3) * 0.2;
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 6 / camera.scale;
            ctx.arc(jx, jy, 18, 0, Math.PI*2); ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // show achievements when focused on this tier
        if (focusedCore === i && focusedTier === j) {
          tier.achievements.forEach((ach, k) => {
            const numAch = tier.achievements.length;
            const aangle = k * (2 * Math.PI / numAch);
            const ax = tx + Math.cos(aangle) * 48;
            const ay = ty + Math.sin(aangle) * 48;

            // connector
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255,255,255,0.08)';
            ctx.lineWidth = 1.5 / camera.scale;
            ctx.moveTo(tx, ty); ctx.lineTo(ax, ay); ctx.stroke();

            // pulse if available
            if (ach.status === 'available') {
              ctx.drawImage(assets.pulse, ax - 10, ay - 10, 20, 20);
            }

            // node or lock
            if (ach.status === 'locked') {
              ctx.drawImage(assets.lock, ax - achievementSize/2, ay - achievementSize/2, achievementSize, achievementSize);
            } else {
              ctx.drawImage(assets.node, ax - achievementSize/2, ay - achievementSize/2, achievementSize, achievementSize);
            }

            // hover highlight
            if (hovered && hovered.type === 'achievement' && hovered.core === i && hovered.tier === j && hovered.ach === k) {
              ctx.beginPath();
              ctx.strokeStyle = 'rgba(100,223,255,0.85)';
              ctx.lineWidth = 2 / camera.scale;
              ctx.arc(ax, ay, 10, 0, Math.PI*2); ctx.stroke();
            }
          });
        }
      });
    });
  }

  ctx.restore();
  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

// -- Input handling / interactions --
let isDragging = false;
let startX = 0, startY = 0;
let dragCamX = 0, dragCamY = 0;

canvas.addEventListener('mousedown', e => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  dragCamX = targetCamera.x;
  dragCamY = targetCamera.y;
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mouseup', e => {
  isDragging = false;
  canvas.style.cursor = 'default';
  // interpret click if mouse didn't move much
  if (Math.hypot(e.clientX - startX, e.clientY - startY) < 6) {
    if (hovered) handleClick(hovered);
  }
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  canvas.style.cursor = 'default';
  setHovered(null);
});

canvas.addEventListener('mousemove', e => {
  if (isDragging) {
    const dx = (e.clientX - startX) / camera.scale;
    const dy = (e.clientY - startY) / camera.scale;
    targetCamera.x = dragCamX + dx;
    targetCamera.y = dragCamY + dy;
    return;
  }
  // compute world coords
  const mx = (e.clientX - width/2) / camera.scale - camera.x;
  const my = (e.clientY - height/2) / camera.scale - camera.y;
  const newHover = detectHover(mx, my);
  setHovered(newHover);
  // position hoverInfo near cursor (dom)
  hoverInfo.style.left = (e.clientX + 18) + 'px';
  hoverInfo.style.top = (e.clientY + 18) + 'px';
});

canvas.addEventListener('wheel', e => {
  const delta = -e.deltaY * 0.0012;
  targetCamera.scale = Math.max(0.25, Math.min(6, targetCamera.scale + delta));
  try{ sounds.zoom.play().catch(()=>{}); }catch(e){}
});

// Touch support (basic)
canvas.addEventListener('touchstart', e => {
  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    dragCamX = targetCamera.x;
    dragCamY = targetCamera.y;
  }
});
canvas.addEventListener('touchmove', e => {
  if (e.touches.length === 1 && isDragging) {
    const dx = (e.touches[0].clientX - startX) / camera.scale;
    const dy = (e.touches[0].clientY - startY) / camera.scale;
    targetCamera.x = dragCamX + dx;
    targetCamera.y = dragCamY + dy;
  }
});
canvas.addEventListener('touchend', e => { isDragging = false; });

// Detect hover over cores / tiers / achievements
function detectHover(mx, my) {
  if (!achievements.planets) return null;
  for (let i = 0; i < achievements.planets.length; i++) {
    const angle = i * (2 * Math.PI / achievements.planets.length) - Math.PI/2;
    const px = Math.cos(angle) * coreRadius;
    const py = Math.sin(angle) * coreRadius;
    if (distance(mx, my, px, py) < planetSize * 0.6) {
      return { type: 'core', index: i };
    }

    const planet = achievements.planets[i];
    for (let j = 0; j < planet.tiers.length; j++) {
      const tangle = j * (2 * Math.PI / planet.tiers.length);
      const tx = px + Math.cos(tangle) * tierRadius;
      const ty = py + Math.sin(tangle) * tierRadius;
      if (distance(mx, my, tx, ty) < tierSize * 0.7) {
        return { type: 'tier', core: i, tier: j };
      }

      // achievements when focused on that tier
      if (focusedCore === i && focusedTier === j) {
        const tier = planet.tiers[j];
        for (let k = 0; k < tier.achievements.length; k++) {
          const aangle = k * (2 * Math.PI / tier.achievements.length);
          const ax = tx + Math.cos(aangle) * 48;
          const ay = ty + Math.sin(aangle) * 48;
          if (distance(mx, my, ax, ay) < achievementSize * 0.9) {
            return { type: 'achievement', core: i, tier: j, ach: k };
          }
        }
      }
    }
  }
  return null;
}

function setHovered(h) {
  hovered = h;
  if (!h) {
    hoverInfo.classList.remove('show');
    hoverInfo.setAttribute('aria-hidden','true');
    return;
  }
  hoverInfo.classList.add('show');
  hoverInfo.setAttribute('aria-hidden','false');

  // update hover content
  if (h.type === 'core') {
    const p = achievements.planets[h.index];
    hoverInfo.querySelector('.hi-title').innerText = p.planetName || `Planet ${h.index+1}`;
    // show resources if available
    let resHtml = '';
    if (p.resources && p.resources.length) {
      resHtml = '<strong>Resources:</strong><br>' + p.resources.slice(0,6).map(r => `• ${r}`).join('<br>');
    } else {
      resHtml = '<em>No resource data in JSON</em>';
    }
    hoverInfo.querySelector('.hi-resources').innerHTML = resHtml;
    try{ sounds.hover.play().catch(()=>{}); }catch(e){}
  } else if (h.type === 'tier') {
    const p = achievements.planets[h.core];
    const t = p.tiers[h.tier];
    hoverInfo.querySelector('.hi-title').innerText = `${t.tierName}`;
    hoverInfo.querySelector('.hi-resources').innerHTML = `${t.achievements.length} achievements • Click to open tier`;
    try{ sounds.hover.play().catch(()=>{}); }catch(e){}
  } else if (h.type === 'achievement') {
    const a = achievements.planets[h.core].tiers[h.tier].achievements[h.ach];
    hoverInfo.querySelector('.hi-title').innerText = a.title;
    hoverInfo.querySelector('.hi-resources').innerHTML = `${a.description || ''}<br>Status: ${a.status}`;
    try{ sounds.hover.play().catch(()=>{}); }catch(e){}
  }
}

// click handling
function handleClick(hit) {
  if (!hit) return;
  if (hit.type === 'core') {
    const i = hit.index;
    const angle = i * (2 * Math.PI / achievements.planets.length) - Math.PI/2;
    targetCamera.x = -Math.cos(angle) * coreRadius;
    targetCamera.y = -Math.sin(angle) * coreRadius;
    targetCamera.scale = 1.6;
    focusedCore = i;
    focusedTier = null;
    populateSidePanelForPlanet(i);
    try{ sounds.zoom.play().catch(()=>{}); }catch(e){}
  } else if (hit.type === 'tier') {
    const i = hit.core, j = hit.tier;
    const angle = i * (2 * Math.PI / achievements.planets.length) - Math.PI/2;
    const px = Math.cos(angle) * coreRadius;
    const py = Math.sin(angle) * coreRadius;
    const tangle = j * (2 * Math.PI / achievements.planets[i].tiers.length);
    const tx = px + Math.cos(tangle) * tierRadius;
    const ty = py + Math.sin(tangle) * tierRadius;
    targetCamera.x = -tx;
    targetCamera.y = -ty;
    targetCamera.scale = 3.4;
    focusedCore = i; focusedTier = j;
    populateSidePanelForTier(i, j);
    try{ sounds.zoom.play().catch(()=>{}); }catch(e){}
  } else if (hit.type === 'achievement') {
    const { core, tier, ach } = hit;
    showAchievementPopup(core, tier, ach);
  }
}

// show achievement popup
function showAchievementPopup(core, tier, k) {
  const a = achievements.planets[core].tiers[tier].achievements[k];
  const content = document.createElement('div');
  content.innerHTML = `<h2>${a.title}</h2><p>${a.description || ''}</p>
    <div style="margin-top:8px;">
      <strong>Status:</strong> ${a.status || 'locked'}
    </div>
    <div style="margin-top:12px; text-align:right;">
      ${a.status !== 'completed' ? `<button id="compBtn">Complete</button>` : ''}
      <button id="closeBtn">Close</button>
    </div>`;
  popup.innerHTML = '';
  popup.appendChild(content);
  popup.style.display = 'block';

  document.getElementById('closeBtn').addEventListener('click', () => popup.style.display = 'none');
  const compBtn = document.getElementById('compBtn');
  if (compBtn) {
    compBtn.addEventListener('click', () => {
      completeAchievement(core, tier, k);
      popup.style.display = 'none';
      populateSidePanelForTier(core, tier);
    });
  }
}

// populate side panel when selecting a planet
function populateSidePanelForPlanet(i) {
  const p = achievements.planets[i];
  if (!p) return;
  document.getElementById('planetName').innerText = p.planetName || `Planet ${i+1}`;
  planetMetaEl.innerText = `Tiers: ${p.tiers.length} • Achievements: ${p.tiers.reduce((s,t)=>s+t.achievements.length,0)}`;
  document.getElementById('planetSummary').classList.remove('hidden');
  tiersSection.classList.remove('hidden');
  junctionSection.classList.remove('hidden');
  // fill tiers list
  tiersList.innerHTML = '';
  p.tiers.forEach((t, j) => {
    const card = document.createElement('div');
    card.className = 'tier-card';
    const meta = document.createElement('div'); meta.className = 'tier-meta';
    meta.innerHTML = `<div class="tier-title">${t.tierName || 'Tier ' + (j+1)}</div>
      <div class="tier-desc">${t.achievements.length} achievements</div>`;
    const achWrap = document.createElement('div'); achWrap.className = 'tier-achievements';
    t.achievements.forEach((a,k) => {
      const pill = document.createElement('div');
      pill.className = 'ach-pill';
      pill.innerText = `${a.title} [${a.status}]`;
      pill.setAttribute('role','button');
      pill.onclick = () => { focusedCore = i; focusedTier = j; populateSidePanelForTier(i, j); targetCamera.scale = Math.max(targetCamera.scale, 2.2); };
      achWrap.appendChild(pill);
    });
    const btnCol = document.createElement('div');
    btnCol.style.display = 'flex'; btnCol.style.gap='6px';
    const openBtn = document.createElement('button');
    openBtn.innerText = 'Open';
    openBtn.onclick = () => { focusedCore = i; focusedTier = j; populateSidePanelForTier(i, j); targetCamera.scale = 3.6; };
    btnCol.appendChild(openBtn);
    card.appendChild(meta);
    card.appendChild(achWrap);
    card.appendChild(btnCol);
    tiersList.appendChild(card);
  });

  // junctions: gather junction tasks if present in data or show hint
  junctionList.innerHTML = '';
  // attempt to find dedicated junction info in planet object (if author added it)
  if (p.junction && p.junction.tasks && p.junction.tasks.length) {
    p.junction.tasks.forEach(t => {
      const node = document.createElement('div'); node.className = 'junction-task';
      node.innerText = t;
      junctionList.appendChild(node);
    });
  } else {
    // fallback: show next tier achievements as tasks (if any)
    const fallback = document.createElement('div'); fallback.className = 'junction-task';
    const nextTierIndex = 0; // user may pick which junction; show info
    fallback.innerHTML = `<strong>Junction tasks will appear here</strong><div style="color:var(--muted); margin-top:6px;">If JSON doesn't include junction tasks, view individual tier achievements to see what is required to progress.</div>`;
    junctionList.appendChild(fallback);
  }
}

// populate side panel for a specific tier
function populateSidePanelForTier(coreIndex, tierIndex) {
  const p = achievements.planets[coreIndex];
  if (!p) return;
  const t = p.tiers[tierIndex];
  document.getElementById('planetName').innerText = `${p.planetName} — ${t.tierName}`;
  planetMetaEl.innerText = `${t.achievements.length} achievements • Tier ${tierIndex+1}`;
  // show achievements
  tiersList.innerHTML = '';
  const card = document.createElement('div'); card.className = 'tier-card';
  const meta = document.createElement('div'); meta.className = 'tier-meta';
  meta.innerHTML = `<div class="tier-title">${t.tierName}</div><div class="tier-desc">${t.achievements.length} achievements</div>`;
  card.appendChild(meta);
  const achWrap = document.createElement('div'); achWrap.className = 'tier-achievements';
  t.achievements.forEach((a,k) => {
    const pill = document.createElement('div'); pill.className = 'ach-pill';
    pill.innerText = `${a.title}`;
    pill.onclick = () => { showAchievementPopup(coreIndex, tierIndex, k); };
    achWrap.appendChild(pill);
  });
  card.appendChild(achWrap);
  tiersList.appendChild(card);

  // junction section — attempt to show junction tasks or link to next tier
  junctionList.innerHTML = '';
  if (t.junctionTasks && t.junctionTasks.length) {
    junctionTitle.innerText = `${p.planetName} — ${t.tierName} Junction`;
    t.junctionTasks.forEach(task => {
      const node = document.createElement('div'); node.className = 'junction-task';
      node.innerText = task;
      junctionList.appendChild(node);
    });
  } else {
    // fallback: show the top 3 achievements as junction hints
    junctionTitle.innerText = `${p.planetName} — Tier ${tierIndex+1} Hints`;
    t.achievements.slice(0,4).forEach(a => {
      const node = document.createElement('div'); node.className = 'junction-task';
      node.innerHTML = `<strong>${a.title}</strong><div style="color:var(--muted); font-size:13px;">${a.description || ''}</div>`;
      junctionList.appendChild(node);
    });
    const openModalBtn = document.createElement('button');
    openModalBtn.innerText = 'Open Junction Modal';
    openModalBtn.onclick = () => {
      showJunctionModal(p.planetName, t);
    };
    junctionList.appendChild(openModalBtn);
  }
}

// shows junction modal
function showJunctionModal(planetName, tierObj) {
  junctionModal.style.display = 'flex';
  junctionTitle.innerText = `${planetName} — Junction`;
  junctionTasks.innerHTML = '';
  if (tierObj.achievements && tierObj.achievements.length) {
    tierObj.achievements.forEach((a, idx) => {
      const div = document.createElement('div');
      div.className = 'junction-task';
      div.innerHTML = `<strong>${a.title}</strong><div style="color:var(--muted)">${a.description || ''}</div>`;
      junctionTasks.appendChild(div);
    });
  } else {
    junctionTasks.innerHTML = '<div class="junction-task">No explicit tasks found.</div>';
  }
}

// utility distance
function distance(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

// complete achievement function (keeps original semantics)
window.completeAchievement = (core, tier, ach) => {
  const a = achievements.planets[core].tiers[tier].achievements[ach];
  if (!a) return;
  a.status = 'completed';
  a.dateCompleted = new Date().toISOString();
  localStorage.setItem('progress', JSON.stringify(achievements));
  // Unlock next tier achievements if fully complete
  const allCompleted = achievements.planets[core].tiers[tier].achievements.every(x => x.status === 'completed');
  if (allCompleted && tier < achievements.planets[core].tiers.length - 1) {
    achievements.planets[core].tiers[tier + 1].achievements.forEach(x => {
      if (x.status === 'locked') x.status = 'available';
    });
  }
  // refresh UI
  populateSidePanelForTier(core, tier);
};

// Admin functions (kept but with nicer UI hooks)
const adminPanel = document.getElementById('adminPanel');
const editContent = document.getElementById('editContent');

window.showAdminPanel = () => { adminPanel.style.display = 'block'; };
window.closeAdmin = () => { adminPanel.style.display = 'none'; editContent.style.display = 'none'; };

window.loginAdmin = () => {
  if (document.getElementById('adminPassword').value === 'admin') {
    // build editable form
    let html = '';
    achievements.planets.forEach((p, i) => {
      html += `<h3 style="margin-top:6px;">${p.planetName}</h3>`;
      p.tiers.forEach((t, j) => {
        html += `<h4>${t.tierName}</h4>`;
        t.achievements.forEach((a, k) => {
          html += `<label style="display:flex; gap:8px; align-items:center;">
            <input style="flex:1" type="text" value="${escapeHtml(a.title)}" onchange="editTitle(${i},${j},${k},this.value)" />
            <input style="flex:2" type="text" value="${escapeHtml(a.description||'')}" onchange="editDesc(${i},${j},${k},this.value)" />
            <select onchange="editStatus(${i},${j},${k},this.value)">
              <option${a.status==='locked'?' selected':''}>locked</option>
              <option${a.status==='available'?' selected':''}>available</option>
              <option${a.status==='completed'?' selected':''}>completed</option>
            </select>
          </label>`;
        });
      });
    });
    html += `<div style="margin-top:12px;"><button onclick="downloadJson()">Download JSON</button>
      <button onclick="bulkUnlock()">Bulk Unlock</button>
      <button onclick="bulkReset()">Bulk Reset</button></div>`;
    editContent.innerHTML = html;
    editContent.style.display = 'block';
    document.getElementById('adminPassword').style.display = 'none';
  } else {
    alert('Wrong password');
  }
};

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
window.editTitle = (i,j,k,value) => { achievements.planets[i].tiers[j].achievements[k].title = value; };
window.editDesc = (i,j,k,value) => { achievements.planets[i].tiers[j].achievements[k].description = value; };
window.editStatus = (i,j,k,value) => {
  const a = achievements.planets[i].tiers[j].achievements[k];
  a.status = value;
  a.dateCompleted = value === 'completed' ? new Date().toISOString() : null;
};

window.downloadJson = () => {
  const blob = new Blob([JSON.stringify(achievements, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'achievements.json'; a.click();
};

window.bulkUnlock = () => {
  achievements.planets.forEach(p => p.tiers.forEach(t => t.achievements.forEach(a => a.status = 'available')));
  alert('All unlocked');
};

window.bulkReset = () => {
  achievements.planets.forEach(p => p.tiers.forEach((t,j) => t.achievements.forEach(a => {
    a.status = j === 0 ? 'available' : 'locked';
    a.dateCompleted = null;
  })));
  alert('All reset');
};
