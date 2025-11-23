
# Warframe-style Star Chart - GitHub Pages site

This package is a ready-to-upload static site for GitHub Pages showcasing a Warframe-style interactive star chart with achievement data.

## Files
- `index.html` - main app
- `style.css` - visuals and animations
- `app.js` - main logic (loads `achievements.json`)
- `achievements.json` - data (included)
- `config.json` - layout and asset configuration
- `admin.html` / `admin.js` - lightweight client-side admin tools (local preview)
- `assets/` - images and audio files

## How to use
1. Upload the entire folder to a GitHub repository and enable GitHub Pages (serve from `main` branch / `docs/` or root).
2. The app will load `achievements.json` and render the chart.
3. Use the Admin button and enter the client-side password from `config.json` to open the admin page for local preview/edit.
4. Changes made via Admin will only be stored locally (via `localStorage`). Use Export in the main panel to download updated JSON.

## Notes & Limitations
- Admin is client-side only and cannot write files to the server from a static GitHub Pages site. Use export to get a JSON file you can replace in the repository.
- Audio auto-play may be blocked by some browsers until user interaction.
- This is intentionally lightweight and avoids external libraries so it can run as a static site.
