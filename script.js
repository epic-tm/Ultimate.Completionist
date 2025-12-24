window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const canvas = document.getElementById('warp-canvas');
    const mainUI = document.getElementById('main-ui');
    const ctx = canvas.getContext('2d');

    let stars = [];
    const starCount = 600;
    let speed = 0.5;
    let warping = true;

    // --- HYPERSPACE SEQUENCE ---
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * canvas.width
        });
    }

    function drawWarp() {
        if (!warping) return;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.strokeStyle = "white";
        
        stars.forEach(s => {
            let xPrev = s.x / (s.z / canvas.width);
            let yPrev = s.y / (s.z / canvas.width);
            
            s.z -= speed;
            if (s.z <= 0) s.z = canvas.width;

            let xNext = s.x / (s.z / canvas.width);
            let yNext = s.y / (s.z / canvas.width);

            ctx.beginPath();
            ctx.moveTo(xPrev, yPrev);
            ctx.lineTo(xNext, yNext);
            ctx.stroke();
        });

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        
        if (speed < 50) speed += 0.2; // Accelerate

        requestAnimationFrame(drawWarp);
    }

    // End warp after 3 seconds
    setTimeout(() => {
        canvas.style.opacity = '0';
        mainUI.classList.add('active');
        setTimeout(() => {
            warping = false;
            canvas.remove();
        }, 1500);
    }, 3000);

    drawWarp();

    // --- STAR CHART LOGIC ---
    function initMap() {
        const centerPoint = 500;
        const orbitRadius = 390;
        svg.innerHTML = `<circle cx="${centerPoint}" cy="${centerPoint}" r="${orbitRadius}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />`;

        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = centerPoint + orbitRadius * Math.cos(angle);
            const y = centerPoint + orbitRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.transform = `translate(-50%, -50%)`;

            node.innerHTML = `
                <img src="assets/hover.png" class="hover-bg">
                <img src="assets/World_Penacony.webp" class="artifact-icon">
                <span class="artifact-label">${name}</span>
            `;
            viewport.appendChild(node);
        });
    }

    document.addEventListener('mousemove', (e) => {
        const mouseX = (window.innerWidth / 2 - e.pageX) / 45;
        const mouseY = (window.innerHeight / 2 - e.pageY) / 45;
        viewport.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    initMap();
});
