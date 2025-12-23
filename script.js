const artifactsData = [
    { id: 1, name: "Physical", radius: 150 },
    { id: 2, name: "Cognitive", radius: 180 },
    { id: 3, name: "Social", radius: 210 },
    { id: 4, name: "Technical", radius: 240 },
    { id: 5, name: "Creative", radius: 270 },
    { id: 6, name: "Financial", radius: 300 },
    { id: 7, name: "Spiritual", radius: 330 },
];

const viewport = document.getElementById('viewport');
const orbitsSvg = document.getElementById('orbits-svg');
const hoverSfx = document.getElementById('hover-sound');

function initMap() {
    orbitsSvg.innerHTML = '';
    const total = artifactsData.length;

    artifactsData.forEach((data, index) => {
        // 1. Create the Orbital Ring
        const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        ring.setAttribute("cx", "400");
        ring.setAttribute("cy", "400");
        ring.setAttribute("r", data.radius);
        ring.setAttribute("fill", "none");
        ring.setAttribute("stroke", "rgba(255, 255, 255, 0.1)");
        ring.setAttribute("stroke-width", "0.5");
        orbitsSvg.appendChild(ring);

        // 2. EQUAL SPREAD LOGIC
        // Dividing 360 degrees (2 * PI) by the number of artifacts
        const angle = (index * (2 * Math.PI / total)) - (Math.PI / 2); // -Math.PI/2 starts at the top
        
        const x = 400 + data.radius * Math.cos(angle);
        const y = 400 + data.radius * Math.sin(angle);

        // 3. Create Artifact Element
        const node = document.createElement('div');
        node.className = 'artifact';
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.transform = `translate(-50%, -50%)`;

        node.innerHTML = `
            <img src="assets/hover.png" class="hover-bg">
            <img src="assets/World_Penacony.webp" class="artifact-icon" alt="${data.name}">
            <span class="artifact-label">${data.name}</span>
        `;

        node.addEventListener('mouseenter', () => {
            if(hoverSfx) { hoverSfx.currentTime = 0; hoverSfx.play().catch(()=>{}); }
        });

        viewport.appendChild(node);
    });
}

initMap();
