window.addEventListener('DOMContentLoaded', () => {
    const artifacts = [
        "Physical", "Cognitive", "Social", "Technical", 
        "Creative", "Financial", "Spiritual"
    ];

    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const center = 500; // Half of 1000px viewport
    const orbitRadius = 350;

    function init() {
        if (!viewport || !svg) return;

        svg.innerHTML = `
            <circle cx="${center}" cy="${center}" r="${orbitRadius}" 
                    fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        `;

        artifacts.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / artifacts.length)) - (Math.PI / 2);
            const x = center + orbitRadius * Math.cos(angle);
            const y = center + orbitRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.transform = `translate(-50%, -50%)`;

            node.innerHTML = `
                <img src="assets/hover.png" class="hover-bg" style="position:absolute; width:150%; opacity:0; transition:0.3s;">
                <img src="assets/World_Penacony.webp" class="artifact-icon">
                <span class="artifact-label">${name}</span>
            `;

            // Hover BG Logic
            node.addEventListener('mouseenter', () => {
                node.querySelector('.hover-bg').style.opacity = "0.7";
            });
            node.addEventListener('mouseleave', () => {
                node.querySelector('.hover-bg').style.opacity = "0";
            });

            viewport.appendChild(node);
        });
    }

    // Parallax logic for background and viewport
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        
        viewport.style.transform = `translate(${x}px, ${y}px)`;
        
        // Clouds move in opposite direction for depth
        const bgFx = document.getElementById('bg-fx');
        if (bgFx) bgFx.style.transform = `translate(${-x/2}px, ${-y/2}px)`;
    });

    init();
});
