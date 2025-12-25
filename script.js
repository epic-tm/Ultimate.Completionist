window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const canvas = document.getElementById('warp-canvas');
    const mainUI = document.getElementById('main-ui');
    const backBtn = document.getElementById('back-btn');
    const missionList = document.getElementById('mission-list');
    const achievementGrid = document.getElementById('achievement-grid');
    const progressFill = document.getElementById('progress-fill');
    const completionText = document.getElementById('completion-text');
    const ctx = canvas.getContext('2d');

    // --- WARP ENGINE ---
    let stars = []; let speed = 0.2; let warping = true; let startTime = Date.now();
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    for (let i = 0; i < 600; i++) { stars.push({ x: Math.random() * canvas.width - canvas.width / 2, y: Math.random() * canvas.height - canvas.height / 2, z: Math.random() * canvas.width }); }
    function drawWarp() {
        if (!warping) return;
        const elapsed = (Date.now() - startTime) / 1000;
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.translate(canvas.width / 2, canvas.height / 2);
        if (elapsed > 1.5) speed += 1.3; else speed += 0.04;
        stars.forEach(s => {
            let xPrev = s.x / (s.z / canvas.width); let yPrev = s.y / (s.z / canvas.width);
            s.z -= speed; if (s.z <= 0) s.z = canvas.width;
            let xNext = s.x / (s.z / canvas.width); let yNext = s.y / (s.z / canvas.width);
            ctx.strokeStyle = "white"; ctx.beginPath(); ctx.moveTo(xPrev, yPrev); ctx.lineTo(xNext, yNext); ctx.stroke();
        });
        ctx.setTransform(1, 0, 0, 1, 0, 0); requestAnimationFrame(drawWarp);
    }
    setTimeout(() => { canvas.style.opacity = '0'; mainUI.style.opacity = '1'; setTimeout(() => { warping = false; canvas.remove(); }, 800); initEnvironment(); }, 3000);
    drawWarp();

    // --- ENVIRONMENT ---
    function initEnvironment() {
        const container = document.getElementById('debris-container');
        setInterval(() => {
            if (viewport.classList.contains('is-zoomed')) return;
            const m = document.createElement('div'); m.className = 'meteor';
            m.style.left = `${Math.random() * 140 - 20}%`; m.style.top = `${Math.random() * -10}%`;
            m.style.animation = `meteorSlide ${Math.random() * 1.2 + 0.6}s linear forwards`;
            container.appendChild(m); setTimeout(() => m.remove(), 2000);
        }, 600);
    }

    // --- DATA PANEL POPULATION ---
    function updatePanel(name) {
        const data = domainDatabase[name];
        progressFill.style.width = data.completion;
        completionText.innerText = `SYNC: ${data.completion}`;
        missionList.innerHTML = data.missions.map(m => `
            <li class="mission-item">
                <span style="color:#00ff00;">[${m.status}]</span>
                <span>${m.title}</span>
                <span style="opacity:0.4">+${m.xp}xp</span>
            </li>`).join('');
        achievementGrid.innerHTML = data.achievements.map(a => `<div class="achievement-badge">★ ${a}</div>`).join('');
    }

    // --- STAR CHART GENERATION ---
    function initMap() {
        svg.innerHTML = `<circle cx="500" cy="500" r="390" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`;
        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = 500 + 390 * Math.cos(angle);
            const y = 500 + 390 * Math.sin(angle);
            const node = document.createElement('div');
            node.className = 'artifact';
            node.innerHTML = `<img src="assets/hover.png" class="hover-bg"><img src="assets/World_Penacony.webp" class="artifact-icon"><span class="artifact-label">${name}</span>`;
            node.style.left = `${x}px`; node.style.top = `${y}px`; node.style.transform = `translate(-50%, -50%)`;

            node.addEventListener('click', () => {
                if (viewport.classList.contains('is-zoomed')) return;
                viewport.classList.add('is-zoomed'); mainUI.classList.add('is-zoomed');
                node.classList.add('is-active'); backBtn.classList.add('show');
                document.getElementById('panel-title').innerText = name.toUpperCase();
                updatePanel(name);
                document.querySelectorAll('.artifact').forEach(o => { if (o !== node) o.classList.add('is-hidden'); });
            });
            viewport.appendChild(node);
        });
    }

    backBtn.addEventListener('click', () => {
        viewport.classList.remove('is-zoomed'); mainUI.classList.remove('is-zoomed');
        backBtn.classList.remove('show');
        document.querySelectorAll('.artifact').forEach(n => n.classList.remove('is-active', 'is-hidden'));
    });

    document.addEventListener('mousemove', (e) => {
        if (viewport.classList.contains('is-zoomed')) return;
        const mx = (window.innerWidth / 2 - e.pageX) / 45;
        const my = (window.innerHeight / 2 - e.pageY) / 45;
        viewport.style.transform = `translate(${mx}px, ${my}px)`;
    });

    initMap();
});
