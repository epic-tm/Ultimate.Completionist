window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Mental", "Intellectual", "Social", "Creative", "Financial", "Spiritual"];
    let mainRadar, subRadar;

    const viewport = document.getElementById('viewport');
    const backBtn = document.getElementById('back-btn');
    const sfxZoom = document.getElementById('sfx-zoom');

    // --- 1. RADAR INITIALIZATION ---
    function initGlobalRadar() {
        const canvas = document.getElementById('mainRadarChart');
        if (!canvas) return; // Error Prevention

        const ctx = canvas.getContext('2d');
        mainRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: domains,
                datasets: [{
                    data: [50, 50, 50, 50, 50, 50, 50],
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 1,
                    pointRadius: 0
                }]
            },
            options: {
                scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false }, pointLabels: { color: '#888' } } },
                plugins: { legend: { display: false } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    function updateSubRadar(labels, values) {
        const canvas = document.getElementById('subRadarChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (subRadar) subRadar.destroy();

        subRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    borderColor: '#00ff00',
                    borderWidth: 2
                }]
            },
            options: {
                scales: { r: { grid: { color: 'rgba(0,255,0,0.1)' }, ticks: { display: false }, pointLabels: { color: '#00ff00', font: { size: 9 } } } },
                plugins: { legend: { display: false } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // --- 2. DATA LOADING ---
    async function loadDomainData(domain) {
        try {
            // Fetching the local JSON files you uploaded
            const response = await fetch(`${domain}.json`);
            const data = await response.json();

            document.getElementById('panel-title').innerText = data.domain;
            
            // Random stats for the radar (You can map this to real progress later)
            const mockStats = data.stats.map(() => Math.floor(Math.random() * 60) + 40);
            updateSubRadar(data.stats, mockStats);

            const list = document.getElementById('mission-list');
            list.innerHTML = data.achievements.slice(0, 15).map(a => `
                <li class="mission-item">
                    <span class="rank-tag">[${a.rankName}]</span>
                    <span>${a.title}</span>
                </li>
            `).join('');

        } catch (e) {
            console.error("Data load failed for " + domain, e);
        }
    }

    // --- 3. CORE LOGIC ---
    function initMap() {
        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = 500 + 390 * Math.cos(angle);
            const y = 500 + 390 * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.innerHTML = `<img src="assets/World_Penacony.webp" style="width:70px;"><div style="font-size:10px;">${name}</div>`;
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.transform = `translate(-50%, -50%)`;

            node.addEventListener('click', () => {
                sfxZoom.play();
                viewport.classList.add('is-zoomed');
                node.classList.add('is-active');
                backBtn.classList.add('show');
                loadDomainData(name);
                document.querySelectorAll('.artifact').forEach(o => { if (o !== node) o.classList.add('is-hidden'); });
            });
            viewport.appendChild(node);
        });
    }

    backBtn.addEventListener('click', () => {
        viewport.classList.remove('is-zoomed');
        backBtn.classList.remove('show');
        document.querySelectorAll('.artifact').forEach(n => n.classList.remove('is-active', 'is-hidden'));
        sfxZoom.play();
    });

    // Start
    initGlobalRadar();
    initMap();

    // Warp Out
    setTimeout(() => {
        document.getElementById('warp-canvas').style.opacity = '0';
        document.getElementById('main-ui').style.opacity = '1';
        setTimeout(() => document.getElementById('warp-canvas').remove(), 1000);
    }, 2500);
});
