window.addEventListener('DOMContentLoaded', async () => {
    // Domain names must match your .json filenames exactly
    const domains = ["Physical", "Mental", "Intellectual", "Social", "Creative", "Financial", "Spiritual"];
    let mainRadar, subRadar;

    const viewport = document.getElementById('viewport');
    const backBtn = document.getElementById('back-btn');
    const sfxZoom = document.getElementById('sfx-zoom');
    const sfxHover = document.getElementById('sfx-hover');

    // --- 1. INITIALIZE GLOBAL RADAR (CENTER) ---
    function initGlobalRadar() {
        const ctx = document.getElementById('mainRadarChart').getContext('2d');
        mainRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: domains,
                datasets: [{
                    label: 'SYSTEM SYNC',
                    data: [40, 40, 40, 40, 40, 40, 40], // Base levels
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 1,
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    r: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { display: false },
                        pointLabels: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
                    }
                },
                plugins: { legend: { display: false } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // --- 2. DATA INJECTION ---
    async function loadDomainPanel(domainName) {
        try {
            // Fetch your uploaded JSON files
            const response = await fetch(`${domainName}.json`);
            const data = await response.json();

            document.getElementById('panel-title').innerText = data.domain;

            // Update Sub-Radar (The domain stats from JSON)
            updateSubRadar(data.stats, [60, 75, 40, 90, 55, 70]); // Placeholder values for stats

            // Update Mission List
            const list = document.getElementById('mission-list');
            list.innerHTML = data.achievements.slice(0, 20).map(ach => `
                <li class="mission-item">
                    <span class="rank-tag">[${ach.rankName}]</span>
                    <span>${ach.title}</span>
                    <span style="margin-left: auto; opacity: 0.5;">${ach.points}pt</span>
                </li>
            `).join('');

        } catch (err) {
            console.error("Error loading domain data:", err);
        }
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
                    backgroundColor: 'rgba(0, 255, 0, 0.15)',
                    borderColor: '#00ff00',
                    borderWidth: 2,
                    pointBackgroundColor: '#00ff00'
                }]
            },
            options: {
                scales: {
                    r: {
                        grid: { display: true, color: 'rgba(0, 255, 0, 0.1)' },
                        angleLines: { color: 'rgba(0, 255, 0, 0.1)' },
                        ticks: { display: false },
                        pointLabels: { color: '#00ff00', font: { size: 9 } }
                    }
                },
                plugins: { legend: { display: false } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // --- 3. UI GENERATION & EVENTS ---
    function initMap() {
        const svg = document.getElementById('orbits-svg');
        svg.innerHTML = `<circle cx="500" cy="500" r="390" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1" />`;

        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = 500 + 390 * Math.cos(angle);
            const y = 500 + 390 * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.innerHTML = `
                <img src="assets/World_Penacony.webp" style="width:100%; opacity:0.6;">
                <div style="font-size:10px; margin-top:5px; letter-spacing:2px;">${name}</div>
            `;
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.transform = `translate(-50%, -50%)`;

            node.addEventListener('mouseenter', () => sfxHover.play());

            node.addEventListener('click', () => {
                if (viewport.classList.contains('is-zoomed')) return;
                
                sfxZoom.play();
                viewport.classList.add('is-zoomed');
                node.classList.add('is-active');
                backBtn.classList.add('show');
                
                loadDomainPanel(name);

                document.querySelectorAll('.artifact').forEach(other => {
                    if (other !== node) other.classList.add('is-hidden');
                });
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

    // --- 4. STARTUP ---
    initGlobalRadar();
    initMap();

    // Remove warp canvas after 3 seconds
    setTimeout(() => {
        document.getElementById('warp-canvas').style.opacity = '0';
        document.getElementById('main-ui').style.opacity = '1';
        document.getElementById('bg-music').play().catch(() => {});
        setTimeout(() => document.getElementById('warp-canvas').remove(), 1000);
    }, 3000);
});
