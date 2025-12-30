window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Mental", "Intellectual", "Social", "Creative", "Financial", "Spiritual"];
    let mainRadar, subRadar;

    const viewport = document.getElementById('viewport');
    const backBtn = document.getElementById('back-btn');
    const bgMusic = document.getElementById('bg-music');
    const sfxZoom = document.getElementById('sfx-zoom');
    const sfxHover = document.getElementById('sfx-hover');

    // --- RADAR LOGIC ---
    function initGlobalRadar() {
        const ctx = document.getElementById('mainRadarChart').getContext('2d');
        mainRadar = new Chart(ctx, {
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
            options: { scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { display: false }, ticks: { display: false }, pointLabels: { color: 'rgba(255,255,255,0.3)', font: { size: 9 } } } }, plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
        });
    }

    function updateSubRadar(labels, values) {
        const ctx = document.getElementById('subRadarChart').getContext('2d');
        if (subRadar) subRadar.destroy();
        subRadar = new Chart(ctx, {
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
            options: { scales: { r: { grid: { color: 'rgba(0,255,0,0.1)' }, angleLines: { color: 'rgba(0,255,0,0.1)' }, ticks: { display: false }, pointLabels: { color: '#00ff00', font: { size: 8 } } } }, plugins: { legend: { display: false } }, responsive: true, maintainAspectRatio: false }
        });
    }

    // --- DATA LOADING ---
    async function loadDomainIntel(domain) {
        try {
            const response = await fetch(`${domain}.json`);
            const data = await response.json();
            
            document.getElementById('panel-title').innerText = data.domain.toUpperCase();
            
            // Generate Sub-Radar from actual stats in JSON
            const randomStats = data.stats.map(() => Math.floor(Math.random() * 50) + 50);
            updateSubRadar(data.stats, randomStats);

            const list = document.getElementById('mission-list');
            list.innerHTML = data.achievements.slice(0, 20).map(a => `
                <li class="mission-item" onclick="showProof('${a.description.replace(/'/g, "\\'")}', '${a.verification.replace(/'/g, "\\'")}')">
                    <span class="rank-tag">[${a.rankName}]</span>
                    <span>${a.title}</span>
                </li>
            `).join('');
        } catch (e) { console.error("Intel fetch failed", e); }
    }

    window.showProof = (desc, proof) => {
        sfxHover.currentTime = 0; sfxHover.play();
        document.getElementById('verification-text').innerHTML = `<strong>OBJ:</strong> ${desc}<br><br><strong>REQ:</strong> ${proof}`;
    };

    // --- UI INIT ---
    function initStarChart() {
        const svg = document.getElementById('orbits-svg');
        svg.innerHTML = `<circle cx="500" cy="500" r="390" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />`;

        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = 500 + 390 * Math.cos(angle);
            const y = 500 + 390 * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.innerHTML = `
                <img src="assets/hover.png" class="hover-bg">
                <img src="assets/World_Penacony.webp" class="artifact-icon">
                <span class="artifact-label">${name}</span>
            `;
            node.style.left = `${x}px`; node.style.top = `${y}px`; node.style.transform = `translate(-50%, -50%)`;

            node.addEventListener('mouseenter', () => { if(!viewport.classList.contains('is-zoomed')) sfxHover.play(); });

            node.addEventListener('click', () => {
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

    backBtn.addEventListener('click', () => {
        sfxZoom.play();
        viewport.classList.remove('is-zoomed');
        backBtn.classList.remove('show');
        document.querySelectorAll('.artifact').forEach(n => n.classList.remove('is-active', 'is-hidden'));
        document.getElementById('verification-text').innerText = "SELECT DATA_NODE...";
    });

    // --- STARTUP ---
    initGlobalRadar();
    initStarChart();

    setTimeout(() => {
        document.getElementById('warp-canvas').style.opacity = '0';
        document.getElementById('main-ui').style.opacity = '1';
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => {});
        setTimeout(() => document.getElementById('warp-canvas').remove(), 1000);
    }, 2800);
});
