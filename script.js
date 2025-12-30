window.addEventListener('DOMContentLoaded', async () => {
    const domains = ["Physical", "Mental", "Intellectual", "Social", "Creative", "Financial", "Spiritual"];
    let mainChart, subChart;

    // --- 1. INITIALIZE MAIN RADAR CHART ---
    function initMainChart() {
        const ctx = document.getElementById('mainRadarChart').getContext('2d');
        mainChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: domains,
                datasets: [{
                    label: 'Global Sync',
                    data: [65, 59, 80, 81, 56, 55, 40], // Example data
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white',
                    borderWidth: 1,
                    pointRadius: 2
                }]
            },
            options: {
                scales: { r: { grid: { color: 'rgba(255,255,255,0.1)' }, angleLines: { color: 'rgba(255,255,255,0.1)' }, ticks: { display: false }, pointLabels: { color: 'white' } } },
                plugins: { legend: { display: false } }
            }
        });
    }

    // --- 2. DATA FETCHER ---
    async function updateDomainPanel(domainName) {
        // Fetch the specific JSON file uploaded
        try {
            const response = await fetch(`${domainName}.json`);
            const data = await response.json();

            // Update Text
            document.getElementById('panel-title').innerText = data.domain.toUpperCase();

            // Update Sub-Radar Chart
            updateSubChart(data.stats, [40, 50, 60, 70, 80, 90]); // Simulated stats for now

            // Update Missions
            const list = document.getElementById('mission-list');
            list.innerHTML = data.achievements.slice(0, 15).map(m => `
                <li class="mission-item">
                    <span class="rank-tag">[${m.rankName}]</span>
                    <span>${m.title}</span>
                    <span style="opacity:0.5">${m.points}P</span>
                </li>
            `).join('');
            
        } catch (e) { console.error("Could not load domain file", e); }
    }

    function updateSubChart(labels, values) {
        const ctx = document.getElementById('subRadarChart').getContext('2d');
        if (subChart) subChart.destroy();
        
        subChart = new Chart(ctx, {
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
                scales: { r: { grid: { display: false }, ticks: { display: false }, pointLabels: { color: 'rgba(255,255,255,0.7)', font: { size: 8 } } } },
                plugins: { legend: { display: false } },
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // --- 3. STAR CHART LOGIC ---
    function initMap() {
        const viewport = document.getElementById('viewport');
        const svg = document.getElementById('orbits-svg');
        const backBtn = document.getElementById('back-btn');

        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = 500 + 390 * Math.cos(angle);
            const y = 500 + 390 * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.innerHTML = `<img src="assets/World_Penacony.webp" class="artifact-icon"><span class="artifact-label">${name}</span>`;
            node.style.left = `${x}px`; node.style.top = `${y}px`;

            node.addEventListener('click', () => {
                viewport.classList.add('is-zoomed');
                node.classList.add('is-active');
                backBtn.classList.add('show');
                updateDomainPanel(name);
                document.querySelectorAll('.artifact').forEach(o => { if (o !== node) o.classList.add('is-hidden'); });
                document.getElementById('sfx-zoom').play();
            });

            viewport.appendChild(node);
        });

        backBtn.addEventListener('click', () => {
            viewport.classList.remove('is-zoomed');
            backBtn.classList.remove('show');
            document.querySelectorAll('.artifact').forEach(n => n.classList.remove('is-active', 'is-hidden'));
        });
    }

    // Initialize
    initMainChart();
    initMap();
    // (Add your warp and debris logic from previous scripts here)
});
