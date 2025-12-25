:root {
    --obsidian: #000;
    --zenith-size: 220px;
    --node-size: 110px;
    --white-glow: drop-shadow(0 0 25px rgba(255, 255, 255, 0.8));
}

body, html {
    margin: 0; padding: 0;
    background: #000;
    overflow: hidden;
    height: 100vh; width: 100vw;
    font-family: 'Courier New', monospace;
}

/* WARP CANVAS */
#warp-canvas {
    position: fixed; inset: 0; z-index: 999;
    background: #000; transition: opacity 0.8s ease-out;
}

/* MAIN HUD LAYERS */
#main-ui {
    opacity: 0; transition: opacity 1.5s ease-in;
    position: relative; width: 100%; height: 100%;
    display: flex; justify-content: center; align-items: center;
    overflow: hidden;
}

.bg-zoom-wrapper {
    position: absolute; inset: 0;
    background: url('assets/background.jfif') center/cover no-repeat;
    z-index: 0;
    transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}

#main-ui.is-zoomed .bg-zoom-wrapper {
    transform: scale(1.6); /* Creates the deep zoom feel */
}

.nebula-layer {
    position: absolute; inset: -20%; z-index: 1; pointer-events: none;
    background: 
        radial-gradient(circle at 20% 30%, rgba(100, 50, 255, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(0, 200, 255, 0.06) 0%, transparent 40%);
    filter: blur(60px);
    animation: nebulaPulse 25s infinite alternate ease-in-out;
}

#debris-container { position: absolute; inset: 0; z-index: 2; pointer-events: none; }

.meteor {
    position: absolute; width: 1px; height: 80px;
    background: linear-gradient(to top, #fff, transparent);
    filter: drop-shadow(0 0 5px white);
}

.scanlines {
    position: absolute; inset: 0; z-index: 50; pointer-events: none;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
    background-size: 100% 4px;
}

/* VIEWPORT & ARTIFACTS */
.viewport {
    position: relative; z-index: 10;
    width: 1000px; height: 1000px;
    display: flex; justify-content: center; align-items: center;
    transition: transform 0.1s ease-out;
}

.viewport.is-zoomed .zenith,
.viewport.is-zoomed .orbits-svg {
    opacity: 0; pointer-events: none;
    transition: 0.8s ease-out;
}

.zenith {
    position: absolute; width: var(--zenith-size); height: var(--zenith-size);
    z-index: 20; top: 50%; left: 50%; transform: translate(-50%, -50%);
    filter: var(--white-glow);
    transition: 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.zenith img { width: 100%; height: 100%; animation: coreBreathe 6s infinite ease-in-out; }

.artifact {
    position: absolute; width: var(--node-size); height: var(--node-size);
    z-index: 15; display: flex; flex-direction: column; align-items: center; cursor: pointer;
    transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.artifact-icon { width: 100%; z-index: 2; filter: grayscale(1) brightness(0.5); transition: 0.8s; }
.artifact:hover .artifact-icon { filter: grayscale(0) brightness(1.3) var(--white-glow); transform: scale(1.1); }

.hover-bg {
    position: absolute; top: 50%; left: 50%;
    width: 180%; height: 180%; margin-top: -90%; margin-left: -90%;
    opacity: 0.35; pointer-events: none; z-index: 1;
    animation: rotateSlow 20s linear infinite;
    transition: opacity 0.8s ease;
}

.artifact:hover .hover-bg { opacity: 1; animation: rotateFast 2s linear infinite; }

/* ZOOM STATES */
.artifact.is-hidden { opacity: 0; transform: translate(-50%, -50%) scale(0) !important; pointer-events: none; }

.artifact.is-active { 
    left: 25% !important; 
    top: 50% !important; 
    transform: translate(-50%, -50%) scale(3.5) !important; 
    z-index: 100;
}

.artifact.is-active .hover-bg { opacity: 0 !important; } /* Clear view for zoom */

/* SUB-NODES (Missions on Planet) */
.sub-node {
    position: absolute; width: 10px; height: 10px;
    background: #fff; border-radius: 50%; z-index: 110; cursor: pointer;
    box-shadow: 0 0 10px white; opacity: 0; transform: scale(0);
    transition: all 0.5s ease 1s;
}

.artifact.is-active .sub-node { opacity: 1; transform: scale(1); }

.sub-node:hover { transform: scale(1.5); background: #00ff00; box-shadow: 0 0 20px #00ff00; }

.sub-node::before {
    content: ''; position: absolute; inset: -5px; border: 1px solid rgba(255,255,255,0.5);
    border-radius: 50%; animation: pulseNode 1.5s infinite;
}

/* DATA PANEL (Right side) */
#data-panel {
    position: absolute; right: 8%; top: 50%; transform: translateY(-50%) translateX(50px);
    width: 320px; color: white; opacity: 0; pointer-events: none;
    transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s; z-index: 200;
}
.viewport.is-zoomed ~ #data-panel { opacity: 1; pointer-events: auto; transform: translateY(-50%) translateX(0); }

.separator { height: 1px; background: rgba(255,255,255,0.2); margin: 20px 0; }

/* KEYFRAMES */
@keyframes nebulaPulse { 0% { opacity: 0.6; transform: scale(1); } 100% { opacity: 1; transform: scale(1.1); } }
@keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes rotateFast { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes coreBreathe { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.08); opacity: 1; } }
@keyframes pulseNode { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
@keyframes meteorSlide {
    0% { transform: translate(0, 0) rotate(45deg) scaleY(0); opacity: 0; }
    20% { opacity: 1; transform: translate(-200px, 200px) rotate(45deg) scaleY(1); }
    100% { transform: translate(-1200px, 1200px) rotate(45deg) scaleY(1); opacity: 0; }
}

#back-btn { position: fixed; bottom: 50px; left: 50%; transform: translateX(-50%); background: none; border: 1px solid white; color: white; padding: 12px 30px; cursor: pointer; opacity: 0; pointer-events: none; transition: 0.5s; z-index: 1000; letter-spacing: 5px; }
#back-btn.show { opacity: 1; pointer-events: auto; }
