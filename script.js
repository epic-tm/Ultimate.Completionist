const artifacts = [
    "Physical", "Cognitive", "Social", "Technical", 
    "Creative", "Financial", "Spiritual"
];

function initMap() {
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const hoverSfx = document.getElementById('hover-sound');
    
    // Configuration
    const center = 400; // Center of our 800px viewport
    const orbitRadius = 280; // All artifacts sit on this one line
    const total = artifacts.length;

    svg.innerHTML = '';

    // 1. Draw the single shared orbital ring
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("cx", center);
    ring.setAttribute("cy", center);
    ring.setAttribute("r", orbitRadius);
    ring.setAttribute("fill", "none");
    ring.setAttribute("stroke", "rgba(255, 255, 255, 0.1)");
    ring.setAttribute("stroke-width", "1");
    svg.appendChild(ring);

    // 2. Distribute all 7 artifacts on that one ring
    artifacts.forEach((name, i) => {
        const angle = (i * (2 * Math.PI / total)) - (Math.PI / 2);
        const x = center + orbitRadius * Math.cos(angle);
        const y = center + orbitRadius * Math.sin(angle);

        const node = document.createElement('div');
        node.className = 'artifact';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.transform = `translate(-50%, -50%)`;

        node.innerHTML = `
            <img src="assets/hover.png" class="hover-bg">
            <img src="assets/World_Penacony.webp" class="artifact-icon" alt="${name}">
        `;

        // Sound trigger
        node.addEventListener('mouseenter', () => {
            if(hoverSfx) { hoverSfx.currentTime = 0; hoverSfx.play().catch(()=>{}); }
        });

        viewport.appendChild(node);
    });
}

// Very subtle parallax to keep it feeling high-end without being dizzying
document.addEventListener('mousemove', (e) => {
    const moveX = (window.innerWidth / 2 - e.pageX) / 80;
    const moveY = (window.innerHeight / 2 - e.pageY) / 80;
    const viewport = document.getElementById('viewport');
    viewport.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

window.onload = initMap;
