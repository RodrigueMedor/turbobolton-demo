/* ==========================================================
   Project brief (deliverables A–E) and design system
   ========================================================== */
function docTop() {
  return `<div class="co-hdr"><div class="wrap" style="max-width:1120px">${logo('home')}<span class="badge badge-dark" style="margin-left:8px">MVP · Phase 1</span><span class="secure" style="color:var(--muted);font-weight:500">Prototype for client review · Oct 2026</span></div></div>`;
}
const chain = steps => `<div class="journey">${steps.map(([l, to], i) => `${i ? `<span class="jarrow">${ic('chevR')}</span>` : ''}<button class="jstep" ${to.startsWith('act:') ? `data-act="${to.slice(4)}"` : `data-go="${to}"`}><span class="n">${String(i + 1).padStart(2, '0')}</span>${l}</button>`).join('')}</div>`;
function sec(letter, title, lead, body) {
  return `<section class="doc-sec"><header>${letter ? `<span class="letter">${letter}</span>` : ''}<h2>${title}</h2></header>${lead ? `<p class="lead">${lead}</p>` : ''}${body}</section>`;
}
function screenTable(rows) {
  return `<div class="card tbl-wrap"><table class="tbl"><thead><tr><th>Screen</th><th>What it's for</th><th></th></tr></thead><tbody>${rows.map(([n, d, to]) => `<tr><td><b>${n}</b></td><td class="small">${d}</td><td>${to ? `<button class="btn btn-sm" ${to.startsWith('act:') ? `data-act="${to.slice(4)}"` : `data-go="${to}"`}>Open</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`;
}
function vBrief() {
  const store = [
    ['Home', 'Brand, vehicle selector, categories, brands, deals, featured and popular parts', 'home'],
    ['Vehicle selector', 'Year → Make → Model → Engine, plus pick from My Garage', 'act:openVehicle'],
    ['Search results / category listing', '“Search by vehicle” bar, Refine-by filters, sorting, fitment badges', 'results'],
    ['Categories & Brands menus', 'Dropdown menus from the main nav (hover or tap)', 'home'],
    ['Brands index', 'All brands with product counts', 'brands'],
    ['Deals', 'Event banner, brand promotions, sale products', 'deals'],
    ['Quick view & Compare', 'Product preview from any card; side-by-side compare (up to 4)', 'act:shopAll'],
    ['Product detail', 'Gallery, price, stock, fitment check, tabs, frequently bought together', 'p-brembo-gt6'],
    ['Cart', 'Line items with fitment, quantities, save for later, coupon, totals', 'cart'],
    ['Checkout (5 steps)', 'Contact, address, shipping method, Stripe card payment, review', 'checkout'],
    ['Order confirmation', 'Thank-you page with order number, items, total, delivery', 'confirm'],
    ['Track order', 'Six-step timeline with carrier, tracking number and ETA', 'track'],
    ['Sign in / Create account', 'Customer login and registration', 'signin'],
    ['Support', 'Phone, chat, email, order lookup, FAQ', 'support'],
    ['Account dashboard', 'Active vehicle, latest order, wishlist, recent orders', 'account'],
    ['My Garage', 'Saved vehicles: shop, edit, remove, add another', 'account-garage'],
    ['Orders, addresses, wishlist, recently viewed, settings', 'Standard account pages', 'account-orders'],
  ];
  const admin = [
    ['Admin sign in', 'Staff login', 'admin-login'],
    ['Dashboard', "Today's sales, orders, revenue, customers, low stock, pending orders", 'admin'],
    ['Orders list', 'Filter by status; new orders highlighted', 'admin-orders'],
    ['Order details', 'Customer, items, vehicle, payment, shipping; change status and add tracking', 'admin-order'],
    ['Products list', 'Search and filter the catalog', 'admin-products'],
    ['Add / Edit product', 'All product fields including fitment, specs, images and shipping', 'admin-product-new'],
    ['Inventory', 'On hand, reserved, available; low stock highlighted; adjust stock', 'admin-inventory'],
    ['Categories, Brands, Vehicle Fitment, Customers, Promotions, Returns, Reports, Users, Settings', 'Simple list and settings pages for the MVP', 'admin-x-fitment'],
  ];
  const map = [
    ['Home', 'Choose 2022 BMW M3 and select “Find Parts That Fit”', 'Search results, filtered to parts that fit'],
    ['Header', 'Select Vehicle / My Garage', 'Vehicle selector dialog'],
    ['Search results', 'Change a filter or sort', 'Results update in place'],
    ['Search results', 'Select a product card', 'Product detail'],
    ['Product detail', 'Add to Cart', '“Added to cart” panel → View Cart or Checkout'],
    ['Product detail', 'Buy Now', 'Checkout'],
    ['Cart', 'Proceed to Checkout', 'Checkout, step 1'],
    ['Checkout', 'Continue on each step', 'Next step opens; finished steps collapse with Edit'],
    ['Checkout', 'Place Order', 'Payment processing → Order confirmation'],
    ['Confirmation', 'Track Order / View Order / Continue Shopping', 'Track order / Account order / Results'],
    ['Admin sign in', 'Sign In', 'Admin dashboard'],
    ['Dashboard', 'Open the new order alert', 'Order details'],
    ['Order details', 'Mark as Processing', 'Status changes; customer timeline moves to Processing'],
    ['Order details', 'Enter carrier and tracking, then Mark as Shipped', 'Customer Track Order shows Shipped, carrier and tracking'],
    ['Inventory', 'Adjust', 'Adjustment dialog → updated stock'],
  ];
  return `${docTop()}<div class="doc">
    <div class="doc-hero">
      <div><span class="eyebrow">TurboBolton · Responsive web MVP</span><h1 style="margin-top:10px">What customers experience.<br>How the team runs it.</h1>
        <p>A clickable prototype of the TurboBolton online store and admin portal. It's one responsive website for desktop, laptop, tablet and phone browsers, not a native app. Use the bar at the top to switch device sizes while you present.</p>
        <p class="small" style="margin-top:10px">All products, prices, customers and orders are sample data. Payments are simulated. No real charges are made.</p></div>
      <div class="doc-cta card pad">
        <span class="lbl">Start a demo</span>
        <button class="btn btn-primary btn-lg" data-go="home">Customer demo ${ic('arrowR')}</button>
        <button class="btn btn-dark btn-lg" data-go="${S.admin ? 'admin' : 'admin-login'}">Admin demo ${ic('arrowR')}</button>
        <button class="btn btn-lg" data-go="system">Design system ${ic('arrowR')}</button>
        <span class="small muted">Use “Reset demo” in the top bar to start over.</span>
      </div>
    </div>

    ${sec('', 'Reference: GoTurbo', 'The storefront follows the layout and shopping flow of goturbo.net. TurboBolton keeps its own name, logo, colors, type, copy and imagery.', `<div class="bound">
      <div class="card"><h4 style="color:var(--ok)">Adapted from GoTurbo</h4><ul><li>Promo strip with a live code above a dark header</li><li>Colored menu bar with Categories and Brands menus</li><li>Full-width event banner with a “Search by vehicle” box right below it</li><li>The same vehicle box at the top of every listing page</li><li>“Our Products” tabs and product carousels</li><li>Product cards with an image over a dark detail panel, crossed-out MSRP and Quick view</li><li>“Refine by” filter panel with brand counts and Sort by</li><li>Product page details: brand link, was/sale price, SKU, condition, availability, shipping; related products</li><li>Trusted brands, value statements, support contacts, chat, newsletter, payment icons</li></ul></div>
      <div class="card"><h4 style="color:var(--brand-d)">Improved or changed for TurboBolton</h4><ul><li>Engine step added; the vehicle is remembered and saved to My Garage</li><li>Fitment badges on every card, product page, cart line and checkout item</li><li>Search is a visible bar, not a hidden icon</li><li>Banner text is real text, readable on phones</li><li>9 curated categories instead of a 250-item list</li><li>Reviews, Q&amp;A, warranty, installation and fitment tabs on product pages</li><li>Our own palette (graphite + Ignition Orange), typefaces, logo and copy</li></ul></div></div>`)}

    ${sec('A', 'Proposed screen inventory', '25 storefront and admin screens cover the full MVP. Each row opens the live screen.', `<div class="inv-grid"><div class="stack" style="gap:10px"><h3>Customer storefront</h3>${screenTable(store)}</div><div class="stack" style="gap:10px"><h3>Admin portal</h3>${screenTable(admin)}</div></div>`)}

    ${sec('B', 'Customer journey', 'A customer with a 2022 BMW M3 buys a brake kit. Every step is clickable.', `${chain([['Home', 'home'], ['Select vehicle', 'act:openVehicle'], ['Search compatible parts', 'act:shopVehicle'], ['Browse & filter', 'act:shopVehicle'], ['Open product', 'p-brembo-gt6'], ['Verify fitment', 'p-brembo-gt6'], ['Add to cart', 'p-brembo-gt6'], ['Review cart', 'cart'], ['Checkout', 'checkout'], ['Shipping', 'checkout'], ['Payment', 'checkout'], ['Place order', 'checkout'], ['Confirmation', 'confirm'], ['Track order', 'track']])}
      <div class="callout info">${ic('info')}<div><b>Presenter script:</b> On Home, select <b>Demo shortcut: 2022 BMW M3</b> (or choose each dropdown), then <b>Find Parts That Fit</b>. Open the Brembo GT kit, show the green fitment check, add it to the cart, apply code <b>TURBO10</b>, and check out. All checkout fields are prefilled.</div></div>`)}

    ${sec('C', 'Administrator journey', 'Staff process the same order the customer just placed. The customer\'s tracking page updates as the status changes.', `${chain([['Admin sign in', S.admin ? 'admin' : 'admin-login'], ['Dashboard', 'admin'], ['Orders', 'admin-orders'], ['New order', 'admin-orders'], ['Order details', 'admin-order'], ['Mark Processing', 'admin-order'], ['Mark Shipped + tracking', 'admin-order'], ['Customer: Track order', 'track']])}
      <div class="grid2"><div class="card pad stack" style="gap:8px"><h4>Also in the admin portal</h4><p class="small muted">Products: list, add, edit (fitment, specs, images, shipping, status). Inventory: on hand, reserved and available, low-stock highlights, stock adjustments.</p></div>
      <div class="card pad stack" style="gap:8px"><h4>How it connects</h4><p class="small muted">Placing an order reserves stock. Shipping it deducts stock and sends the carrier and tracking number to the customer's Track Order page.</p></div></div>`)}

    ${sec('', 'Navigation structure', '', `<div class="resp-grid">
      <div class="card"><h4>Storefront header</h4><ul><li>Logo · Search · Select Vehicle / My Garage · Account · Wishlist · Cart</li><li>Shop · Categories · Brands · Deals · New Products · Support</li><li>Vehicle bar under the header once a vehicle is active</li></ul></div>
      <div class="card"><h4>Customer account</h4><ul><li>Dashboard · Profile · My Garage · Orders</li><li>Addresses · Wishlist · Recently Viewed</li><li>Account Settings · Logout</li></ul></div>
      <div class="card"><h4>Admin sidebar</h4><ul><li>Overview: Dashboard</li><li>Catalog: Products, Categories, Brands, Vehicle Fitment, Inventory</li><li>Sales: Orders, Customers, Promotions, Returns</li><li>Business: Reports, Users, Settings</li></ul></div></div>`)}

    ${sec('', 'Important interactions', '', `<div class="bound"><div class="card"><ul>
      <li>The vehicle selector unlocks one step at a time and fills in the engine when there's only one option.</li>
      <li>Once a vehicle is active, every product card, product page, cart line and checkout item shows a fitment badge.</li>
      <li>“Only show parts that fit” is on by default. Turning it off reveals parts marked “Does not fit”.</li>
      <li>Filters and sorting update results instantly. On tablet and phone they collapse behind a Filters button.</li></ul></div>
      <div class="card"><ul>
      <li>Add to Cart opens a side panel with View Cart and Checkout, so customers keep their place.</li>
      <li>Checkout is one page with five steps. Finished steps collapse to a summary with Edit.</li>
      <li>Card payment is a simulated Stripe form in test mode with a processing state.</li>
      <li>Admin status changes appear on the customer's Track Order timeline right away.</li></ul></div></div>`)}

    ${sec('D', 'Component & design system', 'Automotive, premium and trustworthy: graphite and steel neutrals, one high-visibility orange for actions, condensed display type that reads like motorsport signage, and green kept for “fits your vehicle”.', `<div class="row"><button class="btn btn-dark" data-go="system">${ic('palette')}Open the full design system</button><span class="small muted">Colors, type, buttons, inputs, dropdowns, search, vehicle selector, product card, badges, modal, toast, tables, tabs, pagination, breadcrumbs, navigation, footer, order status and fitment badges.</span></div>`)}

    ${sec('E', 'Prototype interaction map', 'What each action does in the clickable prototype.', `<div class="card tbl-wrap"><table class="tbl map-tbl"><thead><tr><th>Screen</th><th>Action</th><th>Result</th></tr></thead><tbody>${map.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>`)}

    ${sec('', 'Responsive behavior', 'One website adapts to the screen. There are no app-store apps.', `<div class="resp-grid">
      <div class="card"><div class="row">${ic('monitor')}<h4>Desktop & laptop · 1081px and up</h4></div><ul><li>Full header with category navigation</li><li>Filters in a left sidebar; 3–4 product columns</li><li>Product gallery beside buying options</li><li>Order summary stays visible in cart and checkout</li><li>Admin sidebar always visible</li></ul></div>
      <div class="card"><div class="row">${ic('tablet')}<h4>Tablet · 681–1080px</h4></div><ul><li>Menu button replaces the category bar</li><li>Filters open from a Filters button</li><li>2–3 product columns; product page stacks</li><li>Order summary moves below the form</li><li>Admin menu opens from a button; tables scroll sideways</li></ul></div>
      <div class="card"><div class="row">${ic('phone')}<h4>Phone browser · up to 680px</h4></div><ul><li>Menu button, full-width search, cart always reachable</li><li>Two-column compact product cards</li><li>Sticky Add to Cart bar on product pages</li><li>Single-column checkout with large tap targets (44px+)</li><li>Vertical order timeline; KPI tiles in two columns</li></ul></div></div>`)}

    ${sec('', 'MVP boundary', '', `<div class="bound">
      <div class="card"><h4 style="color:var(--ok)">In Phase 1 (this prototype)</h4><ul><li>Vehicle selection, My Garage, fitment badges</li><li>Search, filters, product pages, cart, coupon</li><li>Checkout with Stripe card payments</li><li>Order confirmation, emails and tracking</li><li>Admin: orders, products, fitment, inventory, basic lists</li></ul></div>
      <div class="card"><h4 style="color:var(--muted)">Later phases (not in this prototype)</h4><ul><li>AI recommendations</li><li>Native iOS / Android apps</li><li>ERP, advanced CRM and warehouse management</li><li>Supplier integrations and dropshipping</li><li>Marketplace / multi-vendor and advanced analytics</li></ul></div></div>`)}

    ${sec('', 'Bringing this into Figma', '', `<div class="card pad stack" style="gap:8px"><p>This prototype is built in HTML so it already behaves responsively. To get editable Figma frames, open it in Chrome at each width (1440, 834 and 390 px) and import screens with a webpage-to-Figma plugin such as html.to.design. Then link the frames in Figma's Prototype tab, following the interaction map above.</p></div>`)}
  </div>`;
}

function vSystem() {
  const sw = (name, token, hex, use) => `<div class="sw"><div class="chipc" style="background:var(${token})"></div><div><b>${name}</b><code>${hex}</code><span class="small muted">${use}</span></div></div>`;
  const demoP = P('brembo-gt6');
  return `${docTop()}<div class="doc">
    <div><span class="eyebrow">TurboBolton design system</span><h1 style="margin-top:8px;font-size:48px;text-transform:uppercase">Components & tokens</h1><p class="muted" style="margin-top:10px;max-width:64ch">Every screen in the prototype is built from these parts. In production they map to React components styled with Tailwind CSS. In Figma they become components with variants and Auto Layout.</p></div>
    ${sec('', 'Color', '', `<div class="stack"><h4>Brand & surfaces</h4><div class="swatches">
      ${sw('Primary · Ignition Orange', '--brand', '#E4570F', 'Main actions, sale, highlights')}${sw('Primary hover', '--brand-d', '#C0470A', 'Hover and pressed')}
      ${sw('Secondary · Graphite', '--ink', '#0D1520', 'Header, footer, dark buttons')}${sw('Graphite 2', '--ink-2', '#162130', 'Header body, admin')}
      ${sw('Link · Steel Blue', '--link', '#1D5CB8', 'Links, focus, info')}${sw('Background', '--bg', '#F2F4F7', 'Page background')}
      ${sw('Surface', '--paper', '#FFFFFF', 'Cards, inputs')}${sw('Border', '--line', '#D9DFE7', 'Dividers, outlines')}</div>
      <h4>Text & status</h4><div class="swatches">
      ${sw('Text', '--text', '#121A24', 'Body and headings')}${sw('Muted text', '--muted', '#566275', 'Secondary text')}
      ${sw('Success · Fits', '--ok', '#157046', 'Fitment, paid, delivered')}${sw('Warning', '--warn', '#8F5B00', 'Verify fitment, low stock')}
      ${sw('Error', '--err', '#B42525', 'Doesn\'t fit, errors')}${sw('Rating', '--star', '#E99A0C', 'Stars')}</div></div>`)}
    ${sec('', 'Typography', 'Barlow Condensed for display, Barlow for reading, IBM Plex Mono for SKUs, order numbers and tracking.', `<div class="card pad typeset">
      <div><code>H1 · Condensed 700 · 42/46</code><h1>Parts that fit your M3</h1></div>
      <div><code>H2 · Condensed 700 · 30/33</code><h2>Featured Products</h2></div>
      <div><code>H3 · Condensed 600 · 21/23</code><h3>Order Summary</h3></div>
      <div><code>Body · Barlow 400 · 15/23</code><p>Track-proven stopping power with forged monobloc calipers and floating two-piece rotors.</p></div>
      <div><code>Small · Barlow 400 · 13/19</code><p class="small muted">Orders placed before 2pm CT ship the same day.</p></div>
      <div><code>Button · Condensed 600 · 16 caps</code><span><button class="btn btn-primary">Add to Cart</button></span></div>
      <div><code>Data · Plex Mono 500</code><span class="mono">BRM-1N1.9005A · TB-100482 · 1Z84V9X20344718826</span></div></div>`)}
    ${sec('', 'Components', '', `<div class="ds-grid">
      <div class="card ds-cell"><span class="lbl">Buttons</span><div class="row"><button class="btn btn-primary">Primary</button><button class="btn btn-dark">Secondary</button><button class="btn">Outline</button><button class="btn btn-ghost">Ghost</button></div><div class="row"><button class="btn btn-primary btn-sm">Small</button><button class="btn btn-primary btn-lg">Large</button><button class="btn btn-primary" disabled>Disabled</button><button class="btn-link">Text link ${ic('arrowR')}</button></div></div>
      <div class="card ds-cell"><span class="lbl">Inputs & dropdowns</span><div class="grid2"><div class="field"><label for="ds1">Email</label><input class="input" id="ds1" value="daniel.okafor@example.com"></div><div class="field"><label for="ds2">State</label><select class="select" id="ds2"><option>TX</option></select></div><div class="field"><label for="ds3">ZIP code</label><input class="input err" id="ds3" value="787"><span class="errtxt">Enter a 5-digit ZIP code</span></div><div class="field"><label for="ds4">Disabled</label><select class="select" id="ds4" disabled><option>Select model</option></select></div></div><label class="chk"><input type="checkbox" checked>Checkbox</label></div>
      <div class="card ds-cell"><span class="lbl">Search</span><form class="hsearch" data-form="search" style="max-width:none"><input id="ds-search" type="search" placeholder="Search parts, brands or part numbers" style="border:1px solid var(--line-2);border-right:0" aria-label="Search"><button aria-label="Search">${ic('search')}</button></form></div>
      <div class="card ds-cell"><span class="lbl">Fitment badges</span><div class="stack" style="gap:8px"><div class="fit fit-ok" style="align-self:flex-start">${ic('check')}Fits your 2022 BMW M3</div><div class="fit fit-warn" style="align-self:flex-start">${ic('alert')}Verify vehicle fitment</div><div class="fit fit-no" style="align-self:flex-start">${ic('x')}Does not fit your 2022 BMW M3</div><div class="fit fit-lg fit-ok">${ic('check')}<div>This product fits your 2022 BMW M3<small>3.0L S58 Twin-Turbo I6 (473 hp)</small></div></div></div></div>
      <div class="card ds-cell"><span class="lbl">Vehicle selector</span><div class="vsel" style="box-shadow:none;border:1px solid var(--line);padding:16px">${vselBlock('ds')}</div></div>
      <div class="card ds-cell"><span class="lbl">Product card</span><div style="max-width:280px">${pcard(demoP)}</div></div>
      <div class="card ds-cell"><span class="lbl">Badges</span><div class="row"><span class="badge badge-sale">Save $400</span><span class="badge badge-dark">New</span><span class="badge badge-ok">${ic('check')}Paid</span><span class="badge badge-warn">Low stock</span><span class="badge badge-err">Out of stock</span><span class="badge badge-info">Demo</span></div><div class="row"><span class="stock in">In stock</span><span class="stock low">Only 3 left</span><span class="stock out">Backorder</span></div></div>
      <div class="card ds-cell"><span class="lbl">Order status</span><div class="row"><span class="st st-New">New</span><span class="st st-Processing">Processing</span><span class="st st-Shipped">Shipped</span><span class="st st-Delivered">Delivered</span></div></div>
      <div class="card ds-cell"><span class="lbl">Modal & toast</span><div class="row"><button class="btn" data-act="dsModal">Open modal</button><button class="btn" data-act="soon" data-m="Saved to your wishlist">Show toast</button></div></div>
      <div class="card ds-cell"><span class="lbl">Breadcrumbs & pagination</span>${crumbs([['Home', 'home'], ['Brakes', ''], ['Brembo', '']])}<div class="pager" style="justify-content:flex-start"><button aria-label="Previous">${ic('chevL')}</button><button class="on">1</button><button>2</button><button>3</button><button aria-label="Next">${ic('chevR')}</button></div></div>
      <div class="card ds-cell" style="grid-column:1/-1"><span class="lbl">Tabs</span><div class="tabs"><button class="on">Description</button><button>Specifications</button><button>Vehicle Fitment</button><button>Reviews (128)</button></div></div>
      <div class="card ds-cell" style="grid-column:1/-1"><span class="lbl">Table</span><div class="tbl-wrap" style="border:1px solid var(--line);border-radius:var(--r-lg)">${ordersTbl(ADMIN_ORDERS.slice(0, 3), false)}</div></div>
      <div class="card ds-cell" style="grid-column:1/-1"><span class="lbl">Order status timeline</span>${timeline({ status: 'Processing', history: [{ s: 'Order Placed', t: '2026-10-01T14:12:00' }, { s: 'Payment Confirmed', t: '2026-10-01T14:12:04' }, { s: 'Processing', t: '2026-10-01T15:30:00' }] })}</div>
      <div class="card ds-cell" style="grid-column:1/-1"><span class="lbl">Navigation & footer</span><p class="small muted">Storefront header (promo bar, main bar, category bar, vehicle bar), admin sidebar and footer are live in the <button class="btn-link" data-go="home">storefront</button> and <button class="btn-link" data-go="${S.admin ? 'admin' : 'admin-login'}">admin portal</button>.</p></div>
    </div>`)}
    ${sec('', 'Spacing, radius & elevation', '', `<div class="card pad"><dl class="kv"><dt>Spacing scale</dt><dd>4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 px (Tailwind 1–12)</dd><dt>Radius</dt><dd>6px controls · 10px cards · 12px dialogs</dd><dt>Elevation</dt><dd>Borders for structure; shadows only on hover, dialogs and the vehicle selector</dd><dt>Tap targets</dt><dd>Minimum 44px on all buttons and inputs</dd><dt>Breakpoints</dt><dd>Phone ≤680px · Tablet 681–1080px · Desktop ≥1081px</dd></dl></div>`)}
  </div>`;
}
