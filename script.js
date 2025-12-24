window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    
    const centerPoint = 500; // Center of our 1000px viewport
    const orbitRadius = 400; // Large spread

    function initMap() {
        if (!viewport || !svg) return;

        // Clear existing artifacts
        viewport.querySelectorAll('.artifact').forEach(n => n.remove());

        // 1. Draw the massive Orbital Ring
        svg.innerHTML = `
            <circle cx="${centerPoint}" cy="${centerPoint}" r="${orbitRadius}" 
                    fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
        `;

        // 2. Distribute Domains
        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = centerPoint + orbitRadius * Math.cos(angle);
            const y = centerPoint + orbitRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.transform = `translate(-50%, -50%)`; // CRITICAL FOR ALIGNMENT

            node.innerHTML = `
                <img src="assets/hover.png" class="hover-bg" style="position:absolute; width:180%; opacity:0; transition:0.4s; pointer-events:none; z-index:1;">
                <img src="assets/World_Penacony.webp" class="artifact-icon" style="z-index:2;">
                <span class="artifact-label">${name}</span>
            `;

            // Hover effects
            node.addEventListener('mouseenter', () => {
                node.querySelector('.hover-bg').style.opacity = "0.7";
                node.querySelector('.hover-bg').style.transform = "scale(1.1) rotate(20deg)";
            });
            node.addEventListener('mouseleave', () => {
                node.querySelector('.hover-bg').style.opacity = "0";
                node.querySelector('.hover-bg').style.transform = "scale(1) rotate(0deg)";
            });

            viewport.appendChild(node);
        });
    }

    // Centered Parallax with Background Drift
    document.addEventListener('mousemove', (e) => {
        const mouseX = (window.innerWidth / 2 - e.pageX) / 40;
        const mouseY = (window.innerHeight / 2 - e.pageY) / 40;
        
        // Move main map
        viewport.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        
        // Move clouds slowly in opposite direction for 3D feel
        const nebula = document.querySelector('.cosmic-nebula');
        if (nebula) {
            nebula.style.transform = `translate(${-mouseX * 0.3}px, ${-mouseY * 0.3}px)`;
        }
    });

    initMap();
});
