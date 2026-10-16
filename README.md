# CVTal — three portfolio routes and six museum exhibits

Routes: `/CVTal/` and `/CVTal/games/` (games first), `/CVTal/museums/` (museums first), `/CVTal/industrial/` (industrial first).

Files `data/projects.json` were copied exactly from the user upload. `data/translations.json` extends the user upload with routes and museum labels. Six museum exhibits are in `data/museum-projects.json`.

**Images:** Keep your existing `assets/images/` folder and PNGs. The six museum cards expect `museum-diffie-hellman.jpg`, `museum-smart-things.jpg`, `museum-eye-tracking.jpg`, `museum-lunar-module.jpg`, `museum-radio-history.jpg`, `museum-banknote.jpg` in `assets/images/`. Until supplied, they show `museum.svg` placeholder. No real museum photographs are included. Game images use the existing PNG names and fallback SVGs. Case-sensitive filenames matter on GitHub Pages.

Publish all files preserving folder structure. To test locally run `python -m http.server 8000` from the site root. Open `/`, `/games/`, `/museums/`, `/industrial/`.
