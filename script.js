const artifactsData = [
    { name: "Physical", icon: "assets/World_Penacony.webp" },
    { name: "Cognitive", icon: "assets/World_Penacony.webp" },
    { name: "Social", icon: "assets/World_Penacony.webp" },
    { name: "Technical", icon: "assets/World_Penacony.webp" },
    { name: "Creative", icon: "assets/World_Penacony.webp" },
    { name: "Financial", icon: "assets/World_Penacony.webp" },
    { name: "Spiritual", icon: "assets/World_Penacony.webp" },
];

function initMap() {
    const viewport = document.getElementById('viewport');
    const svg = document.getElementById('orbits-svg');
    const center = 450; // Half of 900px viewport
    const orbitRadius = 380; // WIDE orbit to make it feel big
    const total = artifactsData.length;

    // Draw the big orbital ring
    svg.innerHTML = `
        <circle cx="${center}" cy="${center}" r="${orbitRadius}" 
                fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
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
            <img src="${data.icon}" class="artifact-icon">
            <span class="artifact-label">${data.name}</span>
        `;

        viewport.appendChild(node);
    });
}

// Parallax for depth
document.addEventListener('mousemove', (e) => {
    const moveX = (window.innerWidth / 2 - e.pageX) / 50;
    const moveY = (window.innerHeight / 2 - e.pageY) / 50;
    document.getElementById('viewport').style.transform = `translate(${moveX}px, ${moveY}px)`;
});

window.onload = initMap;
