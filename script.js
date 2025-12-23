const domains = [
    { id: 'monolith', name: 'THE MONOLITH', angle: 0, dist: 350 },
    { id: 'cipher', name: 'THE CIPHER', angle: 51, dist: 300 },
    { id: 'forge', name: 'THE FORGE', angle: 102, dist: 350 },
    { id: 'catalyst', name: 'THE CATALYST', angle: 153, dist: 300 },
    { id: 'sovereign', name: 'THE SOVEREIGN', angle: 204, dist: 350 },
    { id: 'horizon', name: 'THE HORIZON', angle: 255, dist: 300 },
    { id: 'zenith', name: 'THE ZENITH', angle: 306, dist: 350 }
];

const nodesLayer = document.getElementById('nodes-layer');
const titleDisplay = document.getElementById('node-title');
const zoomSound = new Audio('assets/zoom.mp3');
const hoverSound = new Audio('assets/hover.mp3');

domains.forEach(domain => {
    // Calculate position in a circle around Penacony
    const radian = (domain.angle * Math.PI) / 180;
    const x = Math.cos(radian) * domain.dist;
    const y = Math.sin(radian) * domain.dist;

    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'node';
    nodeDiv.style.left = `calc(50% + ${x}px - 40px)`;
    nodeDiv.style.top = `calc(50% + ${y}px - 40px)`;
    
    nodeDiv.innerHTML = `
        <img src="assets/node.png" alt="${domain.name}">
        <div style="color:white; font-size:10px; text-align:center;">${domain.name}</div>
    `;

    // Interaction
    nodeDiv.addEventListener('mouseenter', () => {
        hoverSound.play();
        titleDisplay.innerText = domain.name;
    });

    nodeDiv.addEventListener('click', () => {
        zoomSound.play();
        // Here we trigger the transition to the Roadmap page
        document.body.style.transform = "scale(3)";
        document.body.style.opacity = "0";
        setTimeout(() => {
            window.location.href = `roadmap.html?domain=${domain.id}`;
        }, 500);
    });

    nodesLayer.appendChild(nodeDiv);
});
