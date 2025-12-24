window.addEventListener('DOMContentLoaded', () => {
    const domains = ["Physical", "Cognitive", "Social", "Technical", "Creative", "Financial", "Spiritual"];
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    
    // We use 500 because the viewport is 1000px wide
    const centerX = 500;
    const centerY = 500;
    const orbitRadius = 380; 

    function init() {
        if (!svg || !viewport) return;

        // Clear existing artifacts to prevent duplication
        const existingNodes = viewport.querySelectorAll('.artifact');
        existingNodes.forEach(n => n.remove());

        // Draw the orbital ring
        svg.innerHTML = `
            <circle cx="${centerX}" cy="${centerY}" r="${orbitRadius}" 
                    fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
        `;

        domains.forEach((name, i) => {
            const angle = (i * (2 * Math.PI / domains.length)) - (Math.PI / 2);
            const x = centerX + orbitRadius * Math.cos(angle);
            const y = centerY + orbitRadius * Math.sin(angle);

            const node = document.createElement('div');
            node.className = 'artifact';
            node.style.left = `${x}px`;
            node.style.top = `${y}px`;
            // Ensure the node's center sits on the coordinate
            node.style.transform = `translate(-50%, -50%)`;

            node.innerHTML = `
                <img src="assets/hover.png" class="hover-bg" style="position:absolute; width:180%; opacity:0; transition:0.4s; pointer-events:none; z-index:1;">
                <img src="assets/World_Penacony.webp" class="artifact-icon" style="position:relative; z-index:2; width:100%;">
                <span class="label" style="color:white; font-family:monospace; margin-top:10px; font-size:14px; letter-spacing:2px;">${name}</span>
            `;

            viewport.appendChild(node);
        });
    }

    // Centered Parallax
    document.addEventListener('mousemove', (e) => {
        const moveX = (window.innerWidth / 2 - e.pageX) / 45;
        const moveY = (window.innerHeight / 2 - e.pageY) / 45;
        viewport.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    init();
});
