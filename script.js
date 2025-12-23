// Each domain gets a specific radius (distance from center)
const artifactsData = [
    { name: "Physical", r: 130 },
    { name: "Cognitive", r: 170 },
    { name: "Social", r: 210 },
    { name: "Technical", r: 250 },
    { name: "Creative", r: 290 },
    { name: "Financial", r: 330 },
    { name: "Spiritual", r: 370 },
];

function initMap() {
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const hoverSfx = document.getElementById('hover-sound');
    const total = artifactsData.length;

    // Clear previous elements
    svg.innerHTML = '';

    artifactsData.forEach((data, i) => {
        // 1. Create the SVG Orbital Ring
        const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ring.setAttribute("cx", "400");
        ring.setAttribute("cy", "400");
        ring.setAttribute("r", data.r);
        ring.setAttribute("fill", "none");
        ring.setAttribute("stroke", "rgba(255, 255, 255, 0.08)");
        ring.setAttribute("stroke-width", "0.5");
        svg.appendChild(ring);

        // 2. EQUAL SPREAD MATH
        // Distribute nodes evenly around 360 degrees
        const angle = (i * (2 * Math.PI / total)) - (Math.PI / 2);
        const x = 400 + data.r * Math.cos(angle);
        const y = 400 + data.r * Math.sin(angle);

        // 3. Create the Artifact Node
        const node = document.createElement('div');
        node.className = 'artifact';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        // translate(-50%, -50%) ensures the CENTER of the div is on the coordinate
        node.style.transform = `translate(-50%, -50%)`;

        node.innerHTML = `
            <img src="assets/hover.png" class="hover-bg">
            <img src="assets/World_Penacony.webp" class="artifact-icon" alt="${data.name}">
        `;

        // Interaction
        node.addEventListener('mouseenter', () => {
            if (hoverSfx) {
                hoverSfx.currentTime = 0;
                hoverSfx.play().catch(() => {}); 
            }
        });

        viewport.appendChild(node);
    });
}

// Subtle Parallax (Moves the viewport slightly with mouse)
document.addEventListener('mousemove', (e) => {
    const moveX = (window.innerWidth / 2 - e.pageX) / 70;
    const moveY = (window.innerHeight / 2 - e.pageY) / 70;
    const viewport = document.getElementById('viewport');
    viewport.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

window.onload = initMap;
