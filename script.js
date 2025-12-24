// Radii are now wider to use more of the screen space
const artifactsData = [
    { name: "Physical", r: 180 },
    { name: "Cognitive", r: 230 },
    { name: "Social", r: 280 },
    { name: "Technical", r: 330 },
    { name: "Creative", r: 380 },
    { name: "Financial", r: 430 },
    { name: "Spiritual", r: 480 },
];

function initMap() {
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const total = artifactsData.length;

    svg.innerHTML = '';

    // Center point is now 450 (half of 900px viewport)
    const center = 450;

    artifactsData.forEach((data, i) => {
        // 1. Draw Expanded Rings
        const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ring.setAttribute("cx", center);
        ring.setAttribute("cy", center);
        ring.setAttribute("r", data.r);
        ring.setAttribute("fill", "none");
        ring.setAttribute("stroke", "rgba(255, 255, 255, 0.04)"); // Very faint lines
        ring.setAttribute("stroke-width", "0.5");
        svg.appendChild(ring);

        // 2. Spread Out Logic
        const angle = (i * (2 * Math.PI / total)) - (Math.PI / 2);
        const x = center + data.r * Math.cos(angle);
        const y = center + data.r * Math.sin(angle);

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

// Parallax sensitivity - made smoother for the larger map
document.addEventListener('mousemove', (e) => {
    const moveX = (window.innerWidth / 2 - e.pageX) / 100;
    const moveY = (window.innerHeight / 2 - e.pageY) / 100;
    const viewport = document.getElementById('viewport');
    viewport.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

window.onload = initMap;
