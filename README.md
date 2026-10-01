# Conor Burns — Engineering Portfolio

Static site for GitHub Pages (`conorrburns.github.io`). No build step.

## Common edits
- **CSWP link:** in `index.html`, find `id="cswpLink"` and replace `href="#"` with the certificate URL.
- **Videos:** in `projects.js`, set `video:` for each project to a repo file
  (`assets/videos/name.mp4`, keep under ~25 MB) or a YouTube link. Empty = placeholder.
- **Project text:** edit `projects.js` (title, subtitle, summary, highlights, specs, tags).
- **Headshot:** upload a square photo as `assets/headshot.jpg`; it replaces the placeholder automatically.
- **Resume:** replace `assets/Conor_Burns_Resume.pdf` (same filename).
- **3D models:** SOLIDWORKS › File › Save As › glTF Binary (.glb) into `assets/projects/`.

## Preview locally
`python -m http.server` in this folder, then open http://localhost:8000
