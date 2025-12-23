const artifactsData = [
    { name: "Physical", r: 120 },
    { name: "Cognitive", r: 160 },
    { name: "Social", r: 200 },
    { name: "Technical", r: 240 },
    { name: "Creative", r: 280 },
    { name: "Financial", r: 320 },
    { name: "Spiritual", r: 360 },
];

function init() {
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const total = artifactsData.length;

    artifactsData.forEach((data, i) => {
        // Draw Ring
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "400");
        circle.setAttribute("cy", "400");
        circle.setAttribute("r", data.r);
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", "rgba(255,255,255,0.1)");
        circle.setAttribute("stroke-width", "1");
        svg.appendChild(circle);

        // Equal Spread Math
        const angle = (i * (2 * Math.PI / total)) - (Math.PI / 2);
        const x = 400 + data.r * Math.cos(angle);
        const y = 400 + data.r * Math.sin(angle);

        // Create Artifact
        const el = document.createElement('div');
        el.className = 'artifact';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `translate(-50%, -50%)`;

        el.innerHTML = `
            <img src="assets/hover.png" class="hover-bg">
            <img src="assets/World_Penacony.webp" class="artifact-icon" alt="${data.name}">
        `;

        viewport.appendChild(el);
    });
}

window.onload = init;
