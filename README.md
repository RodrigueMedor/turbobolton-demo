# turbobolton-demo

Clickable TurboBolton prototype — live at https://turbobolton-demo.netlify.app/

React 18 + Vite. No UI framework; the original hand-written CSS is used as-is.

## Run

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs dist/
npm run preview    # serves the production build
```

## Layout

- `index.html` — page shell (fonts, `#root`)
- `src/main.jsx` — mounts `<App>` inside `<StoreProvider>`
- `src/App.jsx` — demo bar, device stage, hash router, modal host, toasts
- `src/store/` — `StoreContext.jsx` (persisted demo state, UI state, routing, modals, toasts), `selectors.js` (pure derived data), `actions.js` (`useActions()` hook with every interaction)
- `src/components/` — shared pieces: product card, carousel, fitment badge, dialogs, vehicle selector, storefront shell
- `src/pages/` — storefront screens (home, results, product, cart, checkout, confirmation, tracking, account, brands, deals, support, sign in)
- `src/admin/Admin.jsx` — admin portal (sign in, dashboard, orders, products, inventory, list sections)
- `src/docs/Docs.jsx` — project brief and design system pages
- `src/data.js` — sample catalog, vehicles, customers and orders (demo data only)
- `src/lib/` — icons, product illustrations, formatting helpers
- `src/styles.css` — stylesheet carried over from the original prototype
- `legacy/` — the original vanilla HTML/CSS/JS prototype and its `build.sh`, kept for reference

Routes are hash-based (`#home`, `#results`, `#p-brembo-gt6`, `#checkout`, `#admin`, …) and demo state persists in `localStorage` under `turbobolton-demo-v1`, the same key the original used.

## Deploy

```sh
npm run build
netlify deploy --prod --dir=dist
```
