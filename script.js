window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const warpCanvas = document.getElementById('warp-canvas');
    const meteorCanvas = document.createElement('canvas'); // We'll add this to the UI
    const mainUI = document.getElementById('main-ui');

    // Setup Meteor Canvas
    meteorCanvas.id = "meteor-canvas";
    mainUI.prepend(meteorCanvas);
    const mctx = meteorCanvas.getContext('2d');
    const wctx = warpCanvas.getContext('2d');

    let stars = [], meteors = [];
    let warping = true;
    let startTime = Date.now();

    function resize() {
        warpCanvas.width = meteorCanvas.width = window.innerWidth;
        warpCanvas.height = meteorCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Init Stars & Meteors
    for (let i = 0; i < 800; i++) stars.push({ x: Math.random() * warpCanvas.width - warpCanvas.width/2, y: Math.random() * warpCanvas.height - warpCanvas.height/2, z: Math.random() * warpCanvas.width });
    for (let i = 0; i < 15; i++) meteors.push({ x: Math.random() * -500, y: Math.random() * window.innerHeight, speed: 2 + Math.random() * 5, len: 50 + Math.random() * 100 });

    // 1. HYPERSPACE ENGINE
    function drawWarp() {
        if (!warping) return;
        const elapsed = (Date.now() - startTime) / 1000;
        let warpSpeed = elapsed > 1.5 ? (elapsed - 1.5) * 15 : 0.5;

        wctx.fillStyle = "black";
        wctx.fillRect(0, 0, warpCanvas.width, warpCanvas.height);
        
        // Add a monochromatic glow core
        let grad = wctx.createRadialGradient(warpCanvas.width/2, warpCanvas.height/2, 0, warpCanvas.width/2, warpCanvas.height/2, 400);
        grad.addColorStop(0, "rgba(255,255,255,0.05)");
        grad.addColorStop(1, "transparent");
        wctx.fillStyle = grad;
        wctx.fillRect(0,0, warpCanvas.width, warpCanvas.height);

        wctx.translate(warpCanvas.width/2, warpCanvas.height/2);
        wctx.strokeStyle = "rgba(255,255,255,0.5)";
        
        stars.forEach(s => {
            let xPrev = s.x / (s.z / warpCanvas.width);
            let yPrev = s.y / (s.z / warpCanvas.width);
            s.z -= warpSpeed;
            if (s.z <= 0) s.z = warpCanvas.width;
            let xNext = s.x / (s.z / warpCanvas.width);
            let yNext = s.y / (s.z / warpCanvas.width);
            wctx.beginPath();
            wctx.moveTo(xPrev, yPrev);
            wctx.lineTo(xNext, yNext);
            wctx.stroke();
        });
        wctx.setTransform(1, 0, 0, 1, 0, 0);
        requestAnimationFrame(drawWarp);
    }

    // 2. METEOR SHOWER ENGINE (Left to Right)
    function drawMeteors() {
        mctx.clearRect(0, 0, meteorCanvas.width, meteorCanvas.height);
        mctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        mctx.lineWidth = 1;

        meteors.forEach(m => {
            mctx.beginPath();
            mctx.moveTo(m.x, m.y);
            mctx.lineTo(m.x + m.len, m.y + (m.len * 0.1)); // Slight downward angle
            mctx.stroke();

            m.x += m.speed;
            if (m.x > meteorCanvas.width + 200) {
                m.x = -200;
                m.y = Math.random() * meteorCanvas.height;
            }
        });
        requestAnimationFrame(drawMeteors);
    }

    // Sequence Transition
    setTimeout(() => {
        warpCanvas.style.opacity = '0';
        mainUI.style.opacity = '1';
        mainUI.classList.add('exit-flash');
        setTimeout(() => { warping = false; warpCanvas.remove(); }, 1000);
    }, 3000);

    drawWarp();
    drawMeteors();
    initMap();

    function initMap() {
        const cp = 500, rad = 390;
        svg.innerHTML = `<circle cx="${cp}" cy="${cp}" r="${rad}" fill="none" stroke="rgba(255,255,255,0.1)" />`;
        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = cp + rad * Math.cos(angle), y = cp + rad * Math.sin(angle);
            const node = document.createElement('div');
            node.className = 'artifact';
            node.style.left = `${x}px`; node.style.top = `${y}px`;
            node.style.transform = `translate(-50%, -50%)`;
            node.innerHTML = `<img src="assets/hover.png" class="hover-bg"><img src="assets/World_Penacony.webp" class="artifact-icon"><span class="artifact-label">${name}</span>`;
            viewport.appendChild(node);
        });
    }

    document.addEventListener('mousemove', (e) => {
        const mx = (window.innerWidth / 2 - e.pageX) / 50;
        const my = (window.innerHeight / 2 - e.pageY) / 50;
        viewport.style.transform = `translate(${mx}px, ${my}px)`;
        document.querySelector('.nebula-cloud').style.transform = `translate(${-mx}px, ${-my}px)`;
    });
});
