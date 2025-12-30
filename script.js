window.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION & DATA ---
    const domains = ["Physical", "Mental", "Intellectual", "Social", "Creative", "Financial", "Spiritual"];
    let mainRadar, subRadar;
    
    // UI Elements
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const canvas = document.getElementById('warp-canvas');
    const mainUI = document.getElementById('main-ui');
    const backBtn = document.getElementById('back-btn');
    const terminal = document.getElementById('terminal-overlay');
    
    // Panel Elements
    const missionList = document.getElementById('mission-list');
    const panelTitle = document.getElementById('panel-title');
    const verificationText = document.getElementById('verification-text');

    // Audio Elements
    const bgMusic = document.getElementById('bg-music');
    const sfxHover = document.getElementById('sfx-hover');
    const sfxZoom = document.getElementById('sfx-zoom');

    const ctx = canvas.getContext('2d');

    // --- 2. TERMINAL BOOT SEQUENCE ---
    const bootLogs = [
        "INITIALIZING ZENITH_OS...",
        "SYNCING 1,470 ACHIEVEMENT_NODES...",
        "MOUNTING NEURAL_INTERFACE... [OK]",
        "ESTABLISHING_RADAR_LINK... [OK]",
        "BYPASSING SECURITY_LAYER_4...",
        "WARP_DRIVE_ACTIVE",
        "COORDINATES_LOCKED",
        "ESTABLISHING_VISUAL_LINK..."
    ];

    function runTerminal() {
        let i = 0;
        const interval = setInterval(() => {
            if (i >= bootLogs.length || !warping) {
                clearInterval(interval);
                setTimeout(() => terminal.style.opacity = '0', 500);
                return;
            }
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerText = `> ${bootLogs[i]}`;
            terminal.appendChild(line);
            i++;
        }, 200);
    }

    // --- 3. HYPERSPACE WARP ENGINE ---
    let stars = [];
    let speed = 0.2;
    let warping = true;
    let startTime = Date.now();

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 600; i++) {
        stars.push({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * canvas.width
        });
    }

    function drawWarp() {
        if (!warping) return;
        const elapsed = (Date.now() - startTime) / 1000;
        
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        if (elapsed > 1.5) speed += 1.3; 
        else speed += 0.04;

        stars.forEach(s => {
            let xPrev = s.x / (s.z / canvas.width);
            let yPrev = s.y / (s.z / canvas.width);
            s.z -= speed;
            if (s.z <= 0) s.z = canvas.width;
            let xNext = s.x / (s.z / canvas.width);
            let yNext = s.y / (s.z / canvas.width);
            
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(xPrev, yPrev);
            ctx.lineTo(xNext, yNext);
            ctx.stroke();
        });
        
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        requestAnimationFrame(drawWarp);
    }

    // --- 4. RADAR CHART SYSTEM ---
    function initGlobalRadar() {
        const rCtx = document.getElementById('mainRadarChart').getContext('2d');
        mainRadar = new Chart(rCtx, {
            type: 'radar',
            data: {
                labels: domains,
                datasets: [{
                    data: [60, 60, 60, 60, 60, 60, 60],
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1, pointRadius: 0
                }]
            },
            options: { 
                scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false }, pointLabels: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } } }, 
                plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false 
            }
        });
    }

    function updateSubRadar(labels, values) {
        const sCtx = document.getElementById('subRadarChart').getContext('2d');
        if (subRadar) subRadar.destroy();
        subRadar = new Chart(sCtx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    borderColor: '#00ff00',
                    borderWidth: 1, pointRadius: 2, pointBackgroundColor: '#00ff00'
                }]
            },
            options: { 
                scales: { r: { grid: { color: 'rgba(0,255,0,0.1)' }, ticks: { display: false }, pointLabels: { color: '#00ff00', font: { size: 8 } } } }, 
                plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false 
            }
        });
    }

    // --- 5. DATA INJECTION ---
    async function loadDomainIntel(domain) {
        try {
            const response = await fetch(`${domain}.json`);
            const data = await response.json();
            
            panelTitle.innerText = data.domain.toUpperCase();
            
            // Sub-Radar: Using actual stats from JSON
            const randomStats = data.stats.map(() => Math.floor(Math.random() * 50) + 50);
            updateSubRadar(data.stats, randomStats);

            missionList.innerHTML = data.achievements.slice(0, 25).map(a => `
                <li class="mission-item" onclick="window.showProof(\`${a.description.replace(/'/g, "\\'")}\`, \`${a.verification.replace(/'/g, "\\'")}\`)">
                    <span class="rank-tag">[${a.rankName}]</span>
                    <span>${a.title}</span>
                </li>
            `).join('');
        } catch (e) { console.error("Intel fetch failed", e); }
    }

    window.showProof = (desc, proof) => {
        sfxHover.currentTime = 0; sfxHover.play();
        verificationText.innerHTML = `<strong>OBJ:</strong> ${desc}<br><br><strong>REQ:</strong> ${proof}`;
    };

    // --- 6. STAR CHART GENERATION ---
    function initMap() {
        const center = 500;
        const radius = 390;
        svg.innerHTML = `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />`;

        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.innerHTML = `
                <img src="assets/hover.png" class="hover-bg">
                <img src="assets/World_Penacony.webp" class="artifact-icon">
                <span class="artifact-label">${name}</span>
            `;
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.transform = `translate(-50%, -50%)`;

            node.addEventListener('mouseenter', () => {
                if (!viewport.classList.contains('is-zoomed')) {
                    sfxHover.currentTime = 0;
                    sfxHover.play();
                }
            });

            node.addEventListener('click', () => {
                if (viewport.classList.contains('is-zoomed')) return;
                sfxZoom.play();
                viewport.classList.add('is-zoomed');
                node.classList.add('is-active');
                backBtn.classList.add('show');
                loadDomainIntel(name);
                document.querySelectorAll('.artifact').forEach(o => { if (o !== node) o.classList.add('is-hidden'); });
            });

            viewport.appendChild(node);
        });
    }

    // --- 7. SEQUENCE CONTROL ---
    runTerminal();
    drawWarp();

    setTimeout(() => {
        canvas.style.opacity = '0';
        mainUI.style.opacity = '1';
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => {});
        
        setTimeout(() => {
            warping = false;
            canvas.remove();
            terminal.remove();
        }, 1000);
        
        initGlobalRadar();
        initMap();
    }, 3800);

    // --- 8. GLOBAL LISTENERS ---
    backBtn.addEventListener('click', () => {
        sfxZoom.play();
        viewport.classList.remove('is-zoomed');
        backBtn.classList.remove('show');
        document.querySelectorAll('.artifact').forEach(n => n.classList.remove('is-active', 'is-hidden'));
        verificationText.innerText = "SELECT DATA_NODE...";
    });

    document.addEventListener('mousemove', (e) => {
        if (viewport.classList.contains('is-zoomed')) return;
        const mx = (window.innerWidth / 2 - e.pageX) / 45;
        const my = (window.innerHeight / 2 - e.pageY) / 45;
        viewport.style.transform = `translate(${mx}px, ${my}px)`;
    });
});
