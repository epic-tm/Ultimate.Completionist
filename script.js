window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    
    // Detailed intelligence data for sub-nodes
    const intelData = {
        "Physical": [
            { x: 35, y: 40, label: "BIOMETRIC_SYNC", detail: "Deep sleep cycle: 2h 45m. Recovery status: 88%." },
            { x: 60, y: 65, label: "KINETIC_OUTPUT", detail: "Last session: 450 kcal burned. Intensity: High." }
        ],
        "Financial": [
            { x: 45, y: 30, label: "ASSET_VAULT", detail: "Portfolio diversity: Balanced. Yield: +3.2% Monthly." },
            { x: 50, y: 70, label: "LEDGER_01", detail: "Fixed costs optimized. Liquidity: High." }
        ]
    };

    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const canvas = document.getElementById('warp-canvas');
    const mainUI = document.getElementById('main-ui');
    const backBtn = document.getElementById('back-btn');
    const panelTitle = document.getElementById('panel-title');
    const nodeInfo = document.getElementById('node-info');
    const ctx = canvas.getContext('2d');

    // --- 1. HYPERSPACE WARP ENGINE ---
    let stars = []; let speed = 0.2; let warping = true; let startTime = Date.now();
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize); resize();
    for (let i = 0; i < 600; i++) { stars.push({ x: Math.random() * canvas.width - canvas.width / 2, y: Math.random() * canvas.height - canvas.height / 2, z: Math.random() * canvas.width }); }

    function drawWarp() {
        if (!warping) return;
        const elapsed = (Date.now() - startTime) / 1000;
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // The 1.5s Acceleration Boost
        if (elapsed > 1.5) speed += 1.3; else speed += 0.04;

        stars.forEach(s => {
            let xPrev = s.x / (s.z / canvas.width); let yPrev = s.y / (s.z / canvas.width);
            s.z -= speed; if (s.z <= 0) s.z = canvas.width;
            let xNext = s.x / (s.z / canvas.width); let yNext = s.y / (s.z / canvas.width);
            ctx.strokeStyle = "white"; ctx.beginPath(); ctx.moveTo(xPrev, yPrev); ctx.lineTo(xNext, yNext); ctx.stroke();
        });
        ctx.setTransform(1, 0, 0, 1, 0, 0); requestAnimationFrame(drawWarp);
    }

    // --- 2. TRANSITION REVEAL ---
    setTimeout(() => {
        canvas.style.opacity = '0'; mainUI.style.opacity = '1';
        setTimeout(() => { warping = false; canvas.remove(); }, 800);
        initEnvironment(); 
    }, 3000);
    drawWarp();

    // --- 3. METEOR SHOWER ---
    function initEnvironment() {
        const container = document.getElementById('debris-container');
        setInterval(() => {
            if (viewport.classList.contains('is-zoomed')) return;
            const meteor = document.createElement('div');
            meteor.className = 'meteor';
            meteor.style.left = `${Math.random() * 140 - 20}%`;
            meteor.style.top = `${Math.random() * -10}%`;
            meteor.style.animation = `meteorSlide ${Math.random() * 1.2 + 0.6}s linear forwards`;
            container.appendChild(meteor);
            setTimeout(() => meteor.remove(), 2000);
        }, 600); 
    }

    // --- 4. MAP & INTEL LOGIC ---
    function initMap() {
        const centerPoint = 500;
        const orbitRadius = 390;
        svg.innerHTML = `<circle cx="${centerPoint}" cy="${centerPoint}" r="${orbitRadius}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`;

        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = centerPoint + orbitRadius * Math.cos(angle);
            const y = centerPoint + orbitRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.innerHTML = `<img src="assets/hover.png" class="hover-bg"><img src="assets/World_Penacony.webp" class="artifact-icon"><span class="artifact-label">${name}</span>`;
            node.style.left = `${x}px`; node.style.top = `${y}px`; node.style.transform = `translate(-50%, -50%)`;

            node.addEventListener('click', () => {
                if (viewport.classList.contains('is-zoomed')) return;
                
                viewport.classList.add('is-zoomed');
                mainUI.classList.add('is-zoomed');
                node.classList.add('is-active');
                backBtn.classList.add('show');
                panelTitle.innerText = name.toUpperCase();

                // Spawn Intellectual Sub-Nodes
                if (intelData[name]) {
                    intelData[name].forEach(data => {
                        const sn = document.createElement('div');
                        sn.className = 'sub-node';
                        sn.style.left = `${data.x}%`; sn.style.top = `${data.y}%`;
                        sn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            nodeInfo.innerHTML = `<h3 style="color: #00ff00; letter-spacing: 2px; font-size: 14px;">${data.label}</h3><p style="font-size: 12px; line-height: 1.4; opacity: 0.9;">${data.detail}</p>`;
                        });
                        node.appendChild(sn);
                    });
                }
                document.querySelectorAll('.artifact').forEach(other => { if (other !== node) other.classList.add('is-hidden'); });
            });
            viewport.appendChild(node);
        });
    }

    // --- 5. SYSTEM DISENGAGE ---
    backBtn.addEventListener('click', () => {
        viewport.classList.remove('is-zoomed');
        mainUI.classList.remove('is-zoomed');
        backBtn.classList.remove('show');
        document.querySelectorAll('.artifact').forEach(n => {
            n.classList.remove('is-active', 'is-hidden');
            n.querySelectorAll('.sub-node').forEach(s => s.remove());
        });
        nodeInfo.innerHTML = `<p style="font-size: 10px; opacity: 0.5; letter-spacing: 2px;">WAITING FOR SUB-NODE SELECTION...</p>`;
    });

    document.addEventListener('mousemove', (e) => {
        if (viewport.classList.contains('is-zoomed')) return;
        const mx = (window.innerWidth / 2 - e.pageX) / 45;
        const my = (window.innerHeight / 2 - e.pageY) / 45;
        viewport.style.transform = `translate(${mx}px, ${my}px)`;
    });

    initMap();
});
