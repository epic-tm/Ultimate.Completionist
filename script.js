window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const center = 500;
    const orbitRadius = 380; // Large, spread out orbit

    function init() {
        if (!svg) return;

        // One massive, clean orbital ring
        svg.innerHTML = `
            <circle cx="${center}" cy="${center}" r="${orbitRadius}" 
                    fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
        `;

        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = center + orbitRadius * Math.cos(angle);
            const y = center + orbitRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            node.style.transform = `translate(-50%, -50%)`;

            node.innerHTML = `
                <img src="assets/hover.png" class="hover-bg" style="position:absolute; width:180%; opacity:0; transition:0.4s; pointer-events:none;">
                <img src="assets/World_Penacony.webp" class="artifact-icon">
                <span style="color:white; font-size:12px; margin-top:10px; letter-spacing:3px; font-family:monospace; opacity:0.6;">${name}</span>
            `;

            node.addEventListener('mouseenter', () => {
                node.querySelector('.hover-bg').style.opacity = "0.8";
                node.querySelector('.hover-bg').style.transform = "scale(1.1) rotate(45deg)";
            });
            node.addEventListener('mouseleave', () => {
                node.querySelector('.hover-bg').style.opacity = "0";
                node.querySelector('.hover-bg').style.transform = "scale(1) rotate(0deg)";
            });

            viewport.appendChild(node);
        });
    }

    // Advanced Parallax: UI moves one way, Cosmic Background moves the other
    document.addEventListener('mousemove', (e) => {
        const mouseX = (window.innerWidth / 2 - e.pageX) / 40;
        const mouseY = (window.innerHeight / 2 - e.pageY) / 40;
        
        // Move UI Viewport
        viewport.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        
        // Move Cosmic Clouds more slowly in the opposite direction
        const bg = document.querySelector('.cosmic-background');
        if (bg) {
            bg.style.transform = `translate(${-mouseX * 0.5}px, ${-mouseY * 0.5}px)`;
        }
    });

    init();
});
