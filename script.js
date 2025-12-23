const artifactsData = [
    { id: 1, name: "Physical", radius: 120 },
    { id: 2, name: "Cognitive", radius: 160 },
    { id: 3, name: "Social", radius: 200 },
    { id: 4, name: "Technical", radius: 240 },
    { id: 5, name: "Creative", radius: 280 },
    { id: 6, name: "Financial", radius: 320 },
    { id: 7, name: "Spiritual", radius: 360 },
];

const viewport = document.getElementById('viewport');
const artifactsLayer = document.getElementById('artifacts-layer');
const orbitsSvg = document.getElementById('orbits-svg');
const hoverSfx = document.getElementById('hover-sound');

function initMap() {
    artifactsData.forEach((data, index) => {
        // 1. Draw SVG Ring
        const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ring.setAttribute("cx", "400");
        ring.setAttribute("cy", "400");
        ring.setAttribute("r", data.radius);
        ring.setAttribute("fill", "none");
        ring.setAttribute("stroke", "rgba(255,255,255,0.1)");
        ring.setAttribute("stroke-width", "0.5");
        orbitsSvg.appendChild(ring);

        // 2. Position Artifact
        const angle = (index * (360 / artifactsData.length)) * (Math.PI / 180);
        const x = 400 + data.radius * Math.cos(angle);
        const y = 400 + data.radius * Math.sin(angle);

        const node = document.createElement('div');
        node.className = 'artifact';
        node.style.left = `${x - 25}px`;
        node.style.top = `${y - 25}px`;

        node.innerHTML = `
            <img src="assets/World_Penacony.webp" alt="${data.name}">
            <img src="assets/hover.png" class="hover-glow">
        `;

        node.addEventListener('mouseenter', () => {
            hoverSfx.currentTime = 0;
            hoverSfx.play();
        });

        artifactsLayer.appendChild(node);
    });
}

// Parallax Effect
document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.pageX) / 50;
    const y = (window.innerHeight / 2 - e.pageY) / 50;
    
    // Maintain the 45deg base tilt while adding parallax
    viewport.style.transform = `rotateX(${45 + y}deg) rotateY(${x}deg)`;
});

initMap();
