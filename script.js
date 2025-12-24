const artifactsData = [
    { name: "PHYSICAL" }, { name: "COGNITIVE" }, 
    { name: "SOCIAL" }, { name: "TECHNICAL" }, 
    { name: "CREATIVE" }, { name: "FINANCIAL" }, 
    { name: "SPIRITUAL" }
];

function initMap() {
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const center = 500; // Half of 1000px viewport
    const orbitRadius = 400; // Large spread
    const total = artifactsData.length;

    svg.innerHTML = `
        <circle cx="${center}" cy="${center}" r="${orbitRadius}" 
                fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
    `;

    artifactsData.forEach((data, i) => {
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
            <img src="assets/World_Penacony.webp" class="artifact-icon">
            <div class="artifact-label" style="color: white; margin-top: 10px; font-size: 10px; letter-spacing: 2px;">${data.name}</div>
        `;

        viewport.appendChild(node);
    });
}

// Advanced Multi-Layer Parallax
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const moveX = (centerX - clientX);
    const moveY = (centerY - clientY);

    // Nebula (Slowest)
    document.querySelector('.nebula-bg').style.transform = 
        `translate(${moveX / 40}px, ${moveY / 40}px)`;

    // Grid (Medium)
    document.querySelector('.grid-overlay').style.transform = 
        `translate(${moveX / 30}px, ${moveY / 30}px)`;

    // Main Viewport (Fastest/Responsive)
    document.getElementById('viewport').style.transform = 
        `translate(${moveX / 20}px, ${moveY / 20}px)`;
});

window.onload = initMap;
