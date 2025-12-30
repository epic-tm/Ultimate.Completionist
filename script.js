/* Import Minecraft-accurate font */
@font-face {
    font-family: 'Minecraft';
    src: url('https://cdn.rawgit.com/hloeffler/Minecraft-Font/master/Minecraft-Regular.ttf');
}

:root {
    --mc-bg: #C6C6C6;
    --mc-border-light: #FFFFFF;
    --mc-border-dark: #555555;
    --mc-panel-shadow: #373737;
    --mc-green: #55FF55;
    --mc-button-hover: #3c8527;
}

body, html { 
    margin: 0; padding: 0; background: #1e1e1e; 
    overflow: hidden; height: 100vh; 
    font-family: 'Minecraft', 'Courier New', monospace; 
}

/* --- 1. MINECRAFT TERMINAL (CHAT BOX) --- */
#terminal-overlay {
    position: fixed; bottom: 30px; left: 20px;
    width: 450px; height: 180px; z-index: 1001;
    pointer-events: none; font-size: 16px;
    color: white; text-shadow: 2px 2px #3f3f3f;
    display: flex; flex-direction: column; justify-content: flex-end;
    background: rgba(0, 0, 0, 0.4); padding: 10px;
}

.terminal-line { margin-bottom: 2px; line-height: 1.2; }

/* --- 2. THE WORLD VIEWPORT --- */
#main-ui {
    opacity: 0; transition: opacity 1.5s ease;
    width: 100%; height: 100vh;
    display: flex; justify-content: center; align-items: center;
}

/* ITEM SLOTS (The Domain Nodes) */
.artifact {
    position: absolute; width: 90px; height: 90px;
    background: #8B8B8B; cursor: pointer;
    border: 4px solid;
    border-color: var(--mc-border-light) var(--mc-border-dark) var(--mc-border-dark) var(--mc-border-light);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    image-rendering: pixelated; transition: 0.15s;
}

.artifact:hover {
    background: rgba(255, 255, 255, 0.2);
    outline: 5px solid #FFFFFF;
    z-index: 50;
}

.artifact-icon { width: 50px; height: 50px; image-rendering: pixelated; }

.artifact-label {
    position: absolute; bottom: -35px; color: white;
    text-shadow: 2px 2px #3f3f3f; font-size: 14px; white-space: nowrap;
}

/* --- 3. INVENTORY CONTAINER (DATA PANEL) --- */
#data-panel {
    position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
    width: 420px; height: 80vh; padding: 20px;
    background: var(--mc-bg);
    border: 5px solid;
    border-color: var(--mc-border-light) var(--mc-border-dark) var(--mc-border-dark) var(--mc-border-light);
    box-shadow: 8px 8px 0px rgba(0,0,0,0.6);
    opacity: 0; pointer-events: none; transition: 0.4s;
    display: flex; flex-direction: column;
}

.is-zoomed ~ #data-panel { opacity: 1; pointer-events: auto; }

#panel-title { 
    text-align: center; margin: 0 0 15px 0; font-size: 22px; 
    color: #373737; border-bottom: 3px solid #555; padding-bottom: 5px;
}

/* RADAR BOX */
.sub-chart-container {
    width: 100%; height: 180px; background: #000;
    border: 4px inset #373737; margin-bottom: 15px;
}

/* ACHIEVEMENT LIST (INVENTORY SLOTS) */
#mission-list {
    list-style: none; padding: 5px; overflow-y: auto; flex-grow: 1;
    background: #8B8B8B; border: 4px inset #373737;
}

.mission-item {
    padding: 10px; border-bottom: 2px solid #555;
    font-size: 14px; color: white; text-shadow: 1px 1px #000;
    cursor: pointer;
}

.mission-item:hover { background: #5555FF; }

/* --- 4. MINECRAFT BUTTONS --- */
#back-btn {
    position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
    background: #AAAAAA; color: white; 
    border: 4px solid;
    border-color: #FFFFFF #555555 #555555 #FFFFFF;
    padding: 12px 30px; font-size: 20px; font-family: 'Minecraft';
    text-shadow: 2px 2px #3f3f3f; cursor: pointer;
    opacity: 0; transition: 0.2s;
}

#back-btn:hover { background: var(--mc-button-hover); border-color: #5dca3e #1e4511 #1e4511 #5dca3e; }
#back-btn.show { opacity: 1; }

/* --- 5. HYPERSPACE --- */
#warp-canvas { position: fixed; inset: 0; z-index: 999; background: #000; }
