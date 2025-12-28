window.addEventListener('DOMContentLoaded', () => {
    // --- 1. CONFIGURATION & DATA ---
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    
    // UI Elements
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const canvas = document.getElementById('warp-canvas');
    const mainUI = document.getElementById('main-ui');
    const backBtn = document.getElementById('back-btn');
    const terminal = document.getElementById('terminal-overlay');
    
    // Panel Elements
    const missionList = document.getElementById('mission-list');
    const achievementGrid = document.getElementById('achievement-grid');
    const progressFill = document.getElementById('progress-fill');
    const completionText = document.getElementById('completion-text');
    const panelTitle = document.getElementById('panel-title');

    // Audio Elements
    const bgMusic = document.getElementById('bg-music');
    const sfxHover = document.getElementById('sfx-hover');
    const sfxZoom = document.getElementById('sfx-zoom');

    const ctx = canvas.getContext('2d');

    // --- 2. TERMINAL BOOT SEQUENCE ---
    const bootLogs = [
        "INITIALIZING ZENITH_OS...",
        "LOADING SECTOR_MAP_07...",
        "MOUNTING NEURAL_INTERFACE... [OK]",
        "CHECKING ORBITAL_STABILITY... 98%",
        "CONNECTING TO PENACONY_NODE...",
        "DECRYPTING ARCHIVE_DATA...",
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

    // Create star field
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
        
        // Acceleration logic
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

    // --- 4. START SEQUENCE CONTROL ---
    runTerminal();
    drawWarp();

    setTimeout(() => {
        canvas.style.opacity = '0';
        mainUI.style.opacity = '1';
        
        // Background music (Handle browser autoplay restrictions)
        bgMusic.volume = 0.4;
        bgMusic.play().catch(() => console.log("User interaction required for audio"));
        
        setTimeout(() => {
            warping = false;
            canvas.remove();
            terminal.remove();
        }, 1000);
        
        initEnvironment();
    }, 3800);

    // --- 5. ENVIRONMENT (Meteors) ---
    function initEnvironment() {
        const container = document.getElementById('debris-container');
        setInterval(() => {
            if (viewport.classList.contains('is-zoomed')) return;
            const m = document.createElement('div');
            m.className = 'meteor';
            m.style.left = `${Math.random() * 140 - 20}%`;
            m.style.top = `${Math.random() * -10}%`;
            const duration = Math.random() * 1.2 + 0.6;
            m.style.animation = `meteorSlide ${duration}s linear forwards`;
            container.appendChild(m);
            setTimeout(() => m.remove(), 2000);
        }, 800);
    }

    // --- 6. DATA PANEL LOGIC ---
    function updatePanel(name) {
        const data = domainDatabase[name] || { completion: "0%", missions: [], achievements: [] };
        
        // Update Stats
        progressFill.style.width = data.completion;
        completionText.innerText = `SYNC: ${data.completion}`;
        
        // Update Missions
        missionList.innerHTML = data.missions.map(m => `
            <li class="mission-item">
                <span style="color:#00ff00;">[${m.status}]</span>
                <span>${m.title}</span>
                <span style="opacity:0.4">+${m.xp}xp</span>
            </li>
        `).join('');

        // Update Achievements
        achievementGrid.innerHTML = data.achievements.map(a => `
            <div class="achievement-badge">★ ${a}</div>
        `).join('');
    }

    // --- 7. STAR CHART GENERATION ---
    function initMap() {
        const center = 500;
        const radius = 390;
        svg.innerHTML = `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`;

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

            // Hover SFX
            node.addEventListener('mouseenter', () => {
                if (!viewport.classList.contains('is-zoomed')) {
                    sfxHover.currentTime = 0;
                    sfxHover.play();
                }
            });

            // Click Zoom Logic
            node.addEventListener('click', () => {
                if (viewport.classList.contains('is-zoomed')) return;
                
                sfxZoom.currentTime = 0;
                sfxZoom.play();

                viewport.classList.add('is-zoomed');
                mainUI.classList.add('is-zoomed');
                node.classList.add('is-active');
                backBtn.classList.add('show');
                
                panelTitle.innerText = name.toUpperCase();
                updatePanel(name);

                document.querySelectorAll('.artifact').forEach(other => {
                    if (other !== node) other.classList.add('is-hidden');
                });
            });

            viewport.appendChild(node);
        });
    }

    // --- 8. GLOBAL EVENT LISTENERS ---
    backBtn.addEventListener('click', () => {
        sfxZoom.currentTime = 0;
        sfxZoom.play();

        viewport.classList.remove('is-zoomed');
        mainUI.classList.remove('is-zoomed');
        backBtn.classList.remove('show');
        
        document.querySelectorAll('.artifact').forEach(n => {
            n.classList.remove('is-active', 'is-hidden');
        });
    });

    // Parallax Effect
    document.addEventListener('mousemove', (e) => {
        if (viewport.classList.contains('is-zoomed')) return;
        const mx = (window.innerWidth / 2 - e.pageX) / 45;
        const my = (window.innerHeight / 2 - e.pageY) / 45;
        viewport.style.transform = `translate(${mx}px, ${my}px)`;
    });

    initMap();
});
