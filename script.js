// Radii adjusted for a 600px viewport
const artifactsData = [
    { name: "Physical", r: 100 },
    { name: "Cognitive", r: 130 },
    { name: "Social", r: 160 },
    { name: "Technical", r: 190 },
    { name: "Creative", r: 220 },
    { name: "Financial", r: 250 },
    { name: "Spiritual", r: 280 },
];

function initMap() {
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const total = artifactsData.length;

    svg.innerHTML = '';

    artifactsData.forEach((data, i) => {
        // 1. Draw Ring (Center is 300, 300 for a 600px viewport)
        const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ring.setAttribute("cx", "300");
        ring.setAttribute("cy", "300");
        ring.setAttribute("r", data.r);
        ring.setAttribute("fill", "none");
        ring.setAttribute("stroke", "rgba(255, 255, 255, 0.05)");
        ring.setAttribute("stroke-width", "0.5");
        svg.appendChild(ring);

        // 2. Equal Spread Logic
        const angle = (i * (2 * Math.PI / total)) - (Math.PI / 2);
        const x = 300 + data.r * Math.cos(angle);
        const y = 300 + data.r * Math.sin(angle);

        const node = document.createElement('div');
        node.className = 'artifact';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.transform = `translate(-50%, -50%)`;

        node.innerHTML = `
            <img src="assets/hover.png" class="hover-bg">
            <img src="assets/World_Penacony.webp" class="artifact-icon" alt="${data.name}">
        `;

        viewport.appendChild(node);
    });
}

document.addEventListener('mousemove', (e) => {
    const moveX = (window.innerWidth / 2 - e.pageX) / 80;
    const moveY = (window.innerHeight / 2 - e.pageY) / 80;
    const viewport = document.getElementById('viewport');
    viewport.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

window.onload = initMap;
