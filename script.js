window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    
    const centerPoint = 500; // Half of 1000px viewport
    const orbitRadius = 390; 

    function init() {
        if (!viewport || !svg) return;

        // Draw the orbital ring in the SVG
        svg.innerHTML = `
            <circle cx="${centerPoint}" cy="${centerPoint}" r="${orbitRadius}" 
                    fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
        `;

        domains.forEach((name, i) => {
            // Calculate perfect circular distribution
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = centerPoint + orbitRadius * Math.cos(angle);
            const y = centerPoint + orbitRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            // Critical: translate(-50%, -50%) ensures the element is centered on the point
            node.style.transform = `translate(-50%, -50%)`;

            node.innerHTML = `
                <img src="assets/hover.png" class="hover-bg">
                <img src="assets/World_Penacony.webp" class="artifact-icon">
                <span class="artifact-label">${name}</span>
            `;

            viewport.appendChild(node);
        });
    }

    // Parallax logic for depth feel
    document.addEventListener('mousemove', (e) => {
        const mouseX = (window.innerWidth / 2 - e.pageX) / 45;
        const mouseY = (window.innerHeight / 2 - e.pageY) / 45;
        
        // Move the UI
        viewport.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        
        // Move the background nebula slightly differently for a 3D effect
        const nebula = document.querySelector('.cosmic-nebula');
        if (nebula) {
            nebula.style.transform = `translate(${-mouseX * 0.4}px, ${-mouseY * 0.4}px)`;
        }
    });

    init();
});
