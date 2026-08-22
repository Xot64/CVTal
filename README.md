# XOT Games Portfolio

Static GitHub Pages portfolio for Dmitry Tal.

## Files
- `index.html`
- `style.css`
- `script.js`
- `data/translations.json`
- `data/projects.json`
- `assets/images/`

## Important
Because language/project data is loaded with `fetch()`, opening `index.html` directly as a `file://` may not work in some browsers.
Preview it with a local server, for example:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

On GitHub Pages it works normally.

## Publish on GitHub Pages
1. Create a public repository named `YOUR_LOGIN.github.io`.
2. Upload all files and folders from this package.
3. Open `Settings → Pages`.
4. Select `Deploy from a branch`.
5. Select `main` and `/ (root)`.
6. Save.

## Replace placeholders
- Replace SVG project covers in `assets/images/`.
- Add `resume.pdf` to the root folder.
- Replace email in `index.html`.
- Add YouTube embed URLs in `script.js`.
