/* ==========================================================
   Project brief (deliverables A–E) and design system pages
   ========================================================== */
import { ADMIN_ORDERS } from '../data';
import { Icon } from '../lib/icons';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { P } from '../store/selectors';
import { Crumbs, Go, GoAct, Logo, OrdersTbl, ProductCard, SearchForm, Soon, Timeline } from '../components/common';
import { VselBlock } from '../components/VehicleSelector';

const DocTop = () => (
  <div className="co-hdr"><div className="wrap" style={{ maxWidth: 1120 }}><Logo /><span className="badge badge-dark" style={{ marginLeft: 8 }}>MVP · Phase 1</span><span className="secure" style={{ color: 'var(--muted)', fontWeight: 500 }}>Prototype for client review · Oct 2026</span></div></div>
);
const Chain = ({ steps }) => (
  <div className="journey">{steps.map(([l, to], i) => <span key={i} style={{ display: 'contents' }}>{i ? <span className="jarrow"><Icon n="chevR" /></span> : null}<GoAct to={to} className="jstep"><span className="n">{String(i + 1).padStart(2, '0')}</span>{l}</GoAct></span>)}</div>
);
const Sec = ({ letter, title, lead, children }) => (
  <section className="doc-sec"><header>{letter ? <span className="letter">{letter}</span> : null}<h2>{title}</h2></header>{lead ? <p className="lead">{lead}</p> : null}{children}</section>
);
const ScreenTable = ({ rows }) => (
  <div className="card tbl-wrap"><table className="tbl"><thead><tr><th>Screen</th><th>What it's for</th><th></th></tr></thead><tbody>{rows.map(([n, d, to]) => <tr key={n}><td><b>{n}</b></td><td className="small">{d}</td><td>{to ? <GoAct to={to} className="btn btn-sm">Open</GoAct> : null}</td></tr>)}</tbody></table></div>
);

export function Brief() {
  const { S } = useStore();
  const adminTo = S.admin ? 'admin' : 'admin-login';
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
  return (
    <>
      <DocTop />
      <div className="doc">
        <div className="doc-hero">
          <div><span className="eyebrow">TurboBolton · Responsive web MVP</span><h1 style={{ marginTop: 10 }}>What customers experience.<br />How the team runs it.</h1>
            <p>A clickable prototype of the TurboBolton online store and admin portal. It's one responsive website for desktop, laptop, tablet and phone browsers, not a native app. Use the bar at the top to switch device sizes while you present.</p>
            <p className="small" style={{ marginTop: 10 }}>All products, prices, customers and orders are sample data. Payments are simulated. No real charges are made.</p></div>
          <div className="doc-cta card pad">
            <span className="lbl">Start a demo</span>
            <Go to="home" className="btn btn-primary btn-lg">Customer demo <Icon n="arrowR" /></Go>
            <Go to={adminTo} className="btn btn-dark btn-lg">Admin demo <Icon n="arrowR" /></Go>
            <Go to="system" className="btn btn-lg">Design system <Icon n="arrowR" /></Go>
            <span className="small muted">Use “Reset demo” in the top bar to start over.</span>
          </div>
        </div>

        <Sec title="Reference: GoTurbo" lead="The storefront follows the layout and shopping flow of goturbo.net. TurboBolton keeps its own name, logo, colors, type, copy and imagery.">
          <div className="bound">
            <div className="card"><h4 style={{ color: 'var(--ok)' }}>Adapted from GoTurbo</h4><ul><li>Promo strip with a live code above a dark header</li><li>Colored menu bar with Categories and Brands menus</li><li>Full-width event banner with a “Search by vehicle” box right below it</li><li>The same vehicle box at the top of every listing page</li><li>“Our Products” tabs and product carousels</li><li>Product cards with an image over a dark detail panel, crossed-out MSRP and Quick view</li><li>“Refine by” filter panel with brand counts and Sort by</li><li>Product page details: brand link, was/sale price, SKU, condition, availability, shipping; related products</li><li>Trusted brands, value statements, support contacts, chat, newsletter, payment icons</li></ul></div>
            <div className="card"><h4 style={{ color: 'var(--brand-d)' }}>Improved or changed for TurboBolton</h4><ul><li>Engine step added; the vehicle is remembered and saved to My Garage</li><li>Fitment badges on every card, product page, cart line and checkout item</li><li>Search is a visible bar, not a hidden icon</li><li>Banner text is real text, readable on phones</li><li>9 curated categories instead of a 250-item list</li><li>Reviews, Q&amp;A, warranty, installation and fitment tabs on product pages</li><li>Our own palette (graphite + Ignition Orange), typefaces, logo and copy</li></ul></div>
          </div>
        </Sec>

        <Sec letter="A" title="Proposed screen inventory" lead="25 storefront and admin screens cover the full MVP. Each row opens the live screen.">
          <div className="inv-grid"><div className="stack" style={{ gap: 10 }}><h3>Customer storefront</h3><ScreenTable rows={store} /></div><div className="stack" style={{ gap: 10 }}><h3>Admin portal</h3><ScreenTable rows={admin} /></div></div>
        </Sec>

        <Sec letter="B" title="Customer journey" lead="A customer with a 2022 BMW M3 buys a brake kit. Every step is clickable.">
          <Chain steps={[['Home', 'home'], ['Select vehicle', 'act:openVehicle'], ['Search compatible parts', 'act:shopVehicle'], ['Browse & filter', 'act:shopVehicle'], ['Open product', 'p-brembo-gt6'], ['Verify fitment', 'p-brembo-gt6'], ['Add to cart', 'p-brembo-gt6'], ['Review cart', 'cart'], ['Checkout', 'checkout'], ['Shipping', 'checkout'], ['Payment', 'checkout'], ['Place order', 'checkout'], ['Confirmation', 'confirm'], ['Track order', 'track']]} />
          <div className="callout info"><Icon n="info" /><div><b>Presenter script:</b> On Home, select <b>Demo shortcut: 2022 BMW M3</b> (or choose each dropdown), then <b>Find Parts That Fit</b>. Open the Brembo GT kit, show the green fitment check, add it to the cart, apply code <b>TURBO10</b>, and check out. All checkout fields are prefilled.</div></div>
        </Sec>

        <Sec letter="C" title="Administrator journey" lead="Staff process the same order the customer just placed. The customer's tracking page updates as the status changes.">
          <Chain steps={[['Admin sign in', adminTo], ['Dashboard', 'admin'], ['Orders', 'admin-orders'], ['New order', 'admin-orders'], ['Order details', 'admin-order'], ['Mark Processing', 'admin-order'], ['Mark Shipped + tracking', 'admin-order'], ['Customer: Track order', 'track']]} />
          <div className="grid2"><div className="card pad stack" style={{ gap: 8 }}><h4>Also in the admin portal</h4><p className="small muted">Products: list, add, edit (fitment, specs, images, shipping, status). Inventory: on hand, reserved and available, low-stock highlights, stock adjustments.</p></div>
            <div className="card pad stack" style={{ gap: 8 }}><h4>How it connects</h4><p className="small muted">Placing an order reserves stock. Shipping it deducts stock and sends the carrier and tracking number to the customer's Track Order page.</p></div></div>
        </Sec>

        <Sec title="Navigation structure">
          <div className="resp-grid">
            <div className="card"><h4>Storefront header</h4><ul><li>Logo · Search · Select Vehicle / My Garage · Account · Wishlist · Cart</li><li>Shop · Categories · Brands · Deals · New Products · Support</li><li>Vehicle bar under the header once a vehicle is active</li></ul></div>
            <div className="card"><h4>Customer account</h4><ul><li>Dashboard · Profile · My Garage · Orders</li><li>Addresses · Wishlist · Recently Viewed</li><li>Account Settings · Logout</li></ul></div>
            <div className="card"><h4>Admin sidebar</h4><ul><li>Overview: Dashboard</li><li>Catalog: Products, Categories, Brands, Vehicle Fitment, Inventory</li><li>Sales: Orders, Customers, Promotions, Returns</li><li>Business: Reports, Users, Settings</li></ul></div>
          </div>
        </Sec>

        <Sec title="Important interactions">
          <div className="bound">
            <div className="card"><ul>
              <li>The vehicle selector unlocks one step at a time and fills in the engine when there's only one option.</li>
              <li>Once a vehicle is active, every product card, product page, cart line and checkout item shows a fitment badge.</li>
              <li>“Only show parts that fit” is on by default. Turning it off reveals parts marked “Does not fit”.</li>
              <li>Filters and sorting update results instantly. On tablet and phone they collapse behind a Filters button.</li></ul></div>
            <div className="card"><ul>
              <li>Add to Cart opens a side panel with View Cart and Checkout, so customers keep their place.</li>
              <li>Checkout is one page with five steps. Finished steps collapse to a summary with Edit.</li>
              <li>Card payment is a simulated Stripe form in test mode with a processing state.</li>
              <li>Admin status changes appear on the customer's Track Order timeline right away.</li></ul></div>
          </div>
        </Sec>

        <Sec letter="D" title="Component & design system" lead="Automotive, premium and trustworthy: graphite and steel neutrals, one high-visibility orange for actions, condensed display type that reads like motorsport signage, and green kept for “fits your vehicle”.">
          <div className="row"><Go to="system" className="btn btn-dark"><Icon n="palette" />Open the full design system</Go><span className="small muted">Colors, type, buttons, inputs, dropdowns, search, vehicle selector, product card, badges, modal, toast, tables, tabs, pagination, breadcrumbs, navigation, footer, order status and fitment badges.</span></div>
        </Sec>

        <Sec letter="E" title="Prototype interaction map" lead="What each action does in the clickable prototype.">
          <div className="card tbl-wrap"><table className="tbl map-tbl"><thead><tr><th>Screen</th><th>Action</th><th>Result</th></tr></thead><tbody>{map.map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody></table></div>
        </Sec>

        <Sec title="Responsive behavior" lead="One website adapts to the screen. There are no app-store apps.">
          <div className="resp-grid">
            <div className="card"><div className="row"><Icon n="monitor" /><h4>Desktop & laptop · 1081px and up</h4></div><ul><li>Full header with category navigation</li><li>Filters in a left sidebar; 3–4 product columns</li><li>Product gallery beside buying options</li><li>Order summary stays visible in cart and checkout</li><li>Admin sidebar always visible</li></ul></div>
            <div className="card"><div className="row"><Icon n="tablet" /><h4>Tablet · 681–1080px</h4></div><ul><li>Menu button replaces the category bar</li><li>Filters open from a Filters button</li><li>2–3 product columns; product page stacks</li><li>Order summary moves below the form</li><li>Admin menu opens from a button; tables scroll sideways</li></ul></div>
            <div className="card"><div className="row"><Icon n="phone" /><h4>Phone browser · up to 680px</h4></div><ul><li>Menu button, full-width search, cart always reachable</li><li>Two-column compact product cards</li><li>Sticky Add to Cart bar on product pages</li><li>Single-column checkout with large tap targets (44px+)</li><li>Vertical order timeline; KPI tiles in two columns</li></ul></div>
          </div>
        </Sec>

        <Sec title="MVP boundary">
          <div className="bound">
            <div className="card"><h4 style={{ color: 'var(--ok)' }}>In Phase 1 (this prototype)</h4><ul><li>Vehicle selection, My Garage, fitment badges</li><li>Search, filters, product pages, cart, coupon</li><li>Checkout with Stripe card payments</li><li>Order confirmation, emails and tracking</li><li>Admin: orders, products, fitment, inventory, basic lists</li></ul></div>
            <div className="card"><h4 style={{ color: 'var(--muted)' }}>Later phases (not in this prototype)</h4><ul><li>AI recommendations</li><li>Native iOS / Android apps</li><li>ERP, advanced CRM and warehouse management</li><li>Supplier integrations and dropshipping</li><li>Marketplace / multi-vendor and advanced analytics</li></ul></div>
          </div>
        </Sec>

        <Sec title="Bringing this into Figma">
          <div className="card pad stack" style={{ gap: 8 }}><p>This prototype is built in React so it already behaves responsively. To get editable Figma frames, open it in Chrome at each width (1440, 834 and 390 px) and import screens with a webpage-to-Figma plugin such as html.to.design. Then link the frames in Figma's Prototype tab, following the interaction map above.</p></div>
        </Sec>
      </div>
    </>
  );
}

export function System() {
  const { S } = useStore();
  const A = useActions();
  const Sw = ({ name, token, hex, use }) => <div className="sw"><div className="chipc" style={{ background: `var(${token})` }}></div><div><b>{name}</b><code>{hex}</code><span className="small muted">{use}</span></div></div>;
  const demoP = P(S, 'brembo-gt6');
  return (
    <>
      <DocTop />
      <div className="doc">
        <div><span className="eyebrow">TurboBolton design system</span><h1 style={{ marginTop: 8, fontSize: 48, textTransform: 'uppercase' }}>Components & tokens</h1><p className="muted" style={{ marginTop: 10, maxWidth: '64ch' }}>Every screen in the prototype is built from these parts. In production they map to React components styled with Tailwind CSS. In Figma they become components with variants and Auto Layout.</p></div>
        <Sec title="Color">
          <div className="stack"><h4>Brand & surfaces</h4><div className="swatches">
            <Sw name="Primary · Ignition Orange" token="--brand" hex="#E4570F" use="Main actions, sale, highlights" /><Sw name="Primary hover" token="--brand-d" hex="#C0470A" use="Hover and pressed" />
            <Sw name="Secondary · Graphite" token="--ink" hex="#0D1520" use="Header, footer, dark buttons" /><Sw name="Graphite 2" token="--ink-2" hex="#162130" use="Header body, admin" />
            <Sw name="Link · Steel Blue" token="--link" hex="#1D5CB8" use="Links, focus, info" /><Sw name="Background" token="--bg" hex="#F2F4F7" use="Page background" />
            <Sw name="Surface" token="--paper" hex="#FFFFFF" use="Cards, inputs" /><Sw name="Border" token="--line" hex="#D9DFE7" use="Dividers, outlines" /></div>
            <h4>Text & status</h4><div className="swatches">
            <Sw name="Text" token="--text" hex="#121A24" use="Body and headings" /><Sw name="Muted text" token="--muted" hex="#566275" use="Secondary text" />
            <Sw name="Success · Fits" token="--ok" hex="#157046" use="Fitment, paid, delivered" /><Sw name="Warning" token="--warn" hex="#8F5B00" use="Verify fitment, low stock" />
            <Sw name="Error" token="--err" hex="#B42525" use="Doesn't fit, errors" /><Sw name="Rating" token="--star" hex="#E99A0C" use="Stars" /></div></div>
        </Sec>
        <Sec title="Typography" lead="Barlow Condensed for display, Barlow for reading, IBM Plex Mono for SKUs, order numbers and tracking.">
          <div className="card pad typeset">
            <div><code>H1 · Condensed 700 · 42/46</code><h1>Parts that fit your M3</h1></div>
            <div><code>H2 · Condensed 700 · 30/33</code><h2>Featured Products</h2></div>
            <div><code>H3 · Condensed 600 · 21/23</code><h3>Order Summary</h3></div>
            <div><code>Body · Barlow 400 · 15/23</code><p>Track-proven stopping power with forged monobloc calipers and floating two-piece rotors.</p></div>
            <div><code>Small · Barlow 400 · 13/19</code><p className="small muted">Orders placed before 2pm CT ship the same day.</p></div>
            <div><code>Button · Condensed 600 · 16 caps</code><span><button type="button" className="btn btn-primary">Add to Cart</button></span></div>
            <div><code>Data · Plex Mono 500</code><span className="mono">BRM-1N1.9005A · TB-100482 · 1Z84V9X20344718826</span></div></div>
        </Sec>
        <Sec title="Components">
          <div className="ds-grid">
            <div className="card ds-cell"><span className="lbl">Buttons</span><div className="row"><button type="button" className="btn btn-primary">Primary</button><button type="button" className="btn btn-dark">Secondary</button><button type="button" className="btn">Outline</button><button type="button" className="btn btn-ghost">Ghost</button></div><div className="row"><button type="button" className="btn btn-primary btn-sm">Small</button><button type="button" className="btn btn-primary btn-lg">Large</button><button type="button" className="btn btn-primary" disabled>Disabled</button><button type="button" className="btn-link">Text link <Icon n="arrowR" /></button></div></div>
            <div className="card ds-cell"><span className="lbl">Inputs & dropdowns</span><div className="grid2"><div className="field"><label htmlFor="ds1">Email</label><input className="input" id="ds1" defaultValue="daniel.okafor@example.com" /></div><div className="field"><label htmlFor="ds2">State</label><select className="select" id="ds2" defaultValue="TX"><option>TX</option></select></div><div className="field"><label htmlFor="ds3">ZIP code</label><input className="input err" id="ds3" defaultValue="787" /><span className="errtxt">Enter a 5-digit ZIP code</span></div><div className="field"><label htmlFor="ds4">Disabled</label><select className="select" id="ds4" disabled defaultValue=""><option value="">Select model</option></select></div></div><label className="chk"><input type="checkbox" defaultChecked />Checkbox</label></div>
            <div className="card ds-cell"><span className="lbl">Search</span><SearchForm id="ds-search" style={{ maxWidth: 'none' }} inputStyle={{ border: '1px solid var(--line-2)', borderRight: 0 }} placeholder="Search parts, brands or part numbers" /></div>
            <div className="card ds-cell"><span className="lbl">Fitment badges</span><div className="stack" style={{ gap: 8 }}><div className="fit fit-ok" style={{ alignSelf: 'flex-start' }}><Icon n="check" />Fits your 2022 BMW M3</div><div className="fit fit-warn" style={{ alignSelf: 'flex-start' }}><Icon n="alert" />Verify vehicle fitment</div><div className="fit fit-no" style={{ alignSelf: 'flex-start' }}><Icon n="x" />Does not fit your 2022 BMW M3</div><div className="fit fit-lg fit-ok"><Icon n="check" /><div>This product fits your 2022 BMW M3<small>3.0L S58 Twin-Turbo I6 (473 hp)</small></div></div></div></div>
            <div className="card ds-cell"><span className="lbl">Vehicle selector</span><div className="vsel" style={{ boxShadow: 'none', border: '1px solid var(--line)', padding: 16 }}><VselBlock k="ds" /></div></div>
            <div className="card ds-cell"><span className="lbl">Product card</span><div style={{ maxWidth: 280 }}><ProductCard p={demoP} /></div></div>
            <div className="card ds-cell"><span className="lbl">Badges</span><div className="row"><span className="badge badge-sale">Save $400</span><span className="badge badge-dark">New</span><span className="badge badge-ok"><Icon n="check" />Paid</span><span className="badge badge-warn">Low stock</span><span className="badge badge-err">Out of stock</span><span className="badge badge-info">Demo</span></div><div className="row"><span className="stock in">In stock</span><span className="stock low">Only 3 left</span><span className="stock out">Backorder</span></div></div>
            <div className="card ds-cell"><span className="lbl">Order status</span><div className="row"><span className="st st-New">New</span><span className="st st-Processing">Processing</span><span className="st st-Shipped">Shipped</span><span className="st st-Delivered">Delivered</span></div></div>
            <div className="card ds-cell"><span className="lbl">Modal & toast</span><div className="row"><button type="button" className="btn" onClick={A.dsModal}>Open modal</button><Soon m="Saved to your wishlist" className="btn">Show toast</Soon></div></div>
            <div className="card ds-cell"><span className="lbl">Breadcrumbs & pagination</span><Crumbs items={[['Home', 'home'], ['Brakes', ''], ['Brembo', '']]} /><div className="pager" style={{ justifyContent: 'flex-start' }}><button type="button" aria-label="Previous"><Icon n="chevL" /></button><button type="button" className="on">1</button><button type="button">2</button><button type="button">3</button><button type="button" aria-label="Next"><Icon n="chevR" /></button></div></div>
            <div className="card ds-cell" style={{ gridColumn: '1/-1' }}><span className="lbl">Tabs</span><div className="tabs"><button type="button" className="on">Description</button><button type="button">Specifications</button><button type="button">Vehicle Fitment</button><button type="button">Reviews (128)</button></div></div>
            <div className="card ds-cell" style={{ gridColumn: '1/-1' }}><span className="lbl">Table</span><div className="tbl-wrap" style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)' }}><OrdersTbl rows={ADMIN_ORDERS.slice(0, 3)} compact={false} /></div></div>
            <div className="card ds-cell" style={{ gridColumn: '1/-1' }}><span className="lbl">Order status timeline</span><Timeline o={{ status: 'Processing', history: [{ s: 'Order Placed', t: '2026-10-01T14:12:00' }, { s: 'Payment Confirmed', t: '2026-10-01T14:12:04' }, { s: 'Processing', t: '2026-10-01T15:30:00' }] }} /></div>
            <div className="card ds-cell" style={{ gridColumn: '1/-1' }}><span className="lbl">Navigation & footer</span><p className="small muted">Storefront header (promo bar, main bar, category bar, vehicle bar), admin sidebar and footer are live in the <Go to="home" className="btn-link">storefront</Go> and <Go to={S.admin ? 'admin' : 'admin-login'} className="btn-link">admin portal</Go>.</p></div>
          </div>
        </Sec>
        <Sec title="Spacing, radius & elevation">
          <div className="card pad"><dl className="kv"><dt>Spacing scale</dt><dd>4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 px (Tailwind 1–12)</dd><dt>Radius</dt><dd>6px controls · 10px cards · 12px dialogs</dd><dt>Elevation</dt><dd>Borders for structure; shadows only on hover, dialogs and the vehicle selector</dd><dt>Tap targets</dt><dd>Minimum 44px on all buttons and inputs</dd><dt>Breakpoints</dt><dd>Phone ≤680px · Tablet 681–1080px · Desktop ≥1081px</dd></dl></div>
        </Sec>
      </div>
    </>
  );
}

/** "Remove vehicle?" sample dialog opened from the design system page */
export function DsModal() {
  const A = useActions();
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Remove vehicle?">
      <div className="modal-h"><h3>Remove vehicle?</h3><button type="button" className="icon-btn" onClick={A.close} aria-label="Close"><Icon n="x" /></button></div>
      <div className="modal-b"><p>Remove <b>2020 Toyota GR Supra</b> from My Garage? Products will no longer show fitment for this vehicle.</p></div>
      <div className="modal-f"><button type="button" className="btn" onClick={A.close}>Cancel</button><button type="button" className="btn btn-dark" onClick={A.close}>Remove vehicle</button></div>
    </div>
  );
}
