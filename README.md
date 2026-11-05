# turbobolton-demo

Clickable TurboBolton prototype — live at https://turbobolton-demo.netlify.app/

Plain HTML/CSS/JS, no framework or dependencies.

- `src/` — source (`shell.html`, `styles.css`, JS modules, hero image)
- `build.sh` — bundles `src/` into `dist/index.html` (standalone page) and `dist/turbobolton.html`

## Build & deploy

```sh
./build.sh
netlify deploy --prod --dir=dist
```
