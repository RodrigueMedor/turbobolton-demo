/* ==========================================================
   Storefront layout — modeled on GoTurbo's information architecture
   (promo strip → dark header → colored nav band with menus → event hero →
   "search by vehicle" box → product tabs/carousels), in TurboBolton's own identity.
   ========================================================== */
const SUBCATS = {
  Engine: ['Air Intakes', 'Spark Plugs & Ignition', 'Cooling', 'Engine Components'],
  Exhaust: ['Slip-On Systems', 'Cat-Back Systems', 'Downpipes', 'Exhaust Tips'],
  Suspension: ['Coilovers', 'Lowering Springs', 'Sway Bars', 'Camber Kits'],
  Brakes: ['Big Brake Kits', 'Brake Pads', 'Rotors', 'Brake Fluid'],
  'Wheels & Tires': ['Wheels', 'Tires', 'Lug Nuts', 'TPMS Sensors'],
  Exterior: ['Carbon Aero', 'Lighting', 'Grilles'],
  Interior: ['Seats', 'Steering Wheels', 'Shift Knobs'],
  Electronics: ['ECU Tunes', 'Gauges', 'Data Logging'],
  Performance: ['Intercoolers', 'Turbo Upgrades', 'Charge Pipes'],
};
const HOME_TABS = ['Featured', 'Performance Parts', 'New Products', 'Deals'];
function homeTabList(t) {
  const all = shopProducts();
  if (t === 'Performance Parts') return ['wagner-ic', 'bm3-stage1', 'eventuri-intake', 'akrapovic-slipon', 'kw-v3', 'ngk-plugs'].map(P);
  if (t === 'New Products') return all.slice().sort((a, b) => (b.added || '').localeCompare(a.added || '')).slice(0, 6);
  if (t === 'Deals') return all.filter(onSale);
  return ['brembo-gt6', 'akrapovic-slipon', 'kw-v3', 'eventuri-intake', 'hre-ff04', 'michelin-ps4s'].map(P);
}

/* ---------- Shell ---------- */
function megaCats() {
  return `<div class="mega" role="menu"><div class="wrap mega-grid">${CATEGORIES.map(c => `<div><button class="mega-h" data-act="shopCat" data-k="${esc(c.id)}">${ic(c.icon)}${esc(c.id)}</button><ul>${SUBCATS[c.id].map(s => `<li><button data-act="shopCat" data-k="${esc(c.id)}">${s}</button></li>`).join('')}</ul></div>`).join('')}</div></div>`;
}
function megaBrands() {
  return `<div class="mega" role="menu"><div class="wrap"><div class="mega-brands">${BRANDS.map(b => `<button class="brandtile sm" data-act="shopBrand" data-k="${esc(b)}">${esc(b)}</button>`).join('')}</div><div class="mega-foot"><button class="btn-link" data-go="brands">View all brands ${ic('arrowR')}</button></div></div></div>`;
}
function storeShell(main) {
  const n = cartCount(), t = totals(), v = S.vehicle;
  const saved = v && S.garage.some(g => sameV(g, v));
  return `
  <div class="promo"><div class="wrap"><span>${ic('bolt')}<b>Fall Boost Event:</b> use code <b class="mono">TURBO10</b> for 10% off · Free shipping over $149</span></div></div>
  <header class="hdr">
    <div class="hdr-top"><div class="wrap hdr-main">
      <button class="hact burger" data-act="menu" aria-label="Open menu">${ic('menu')}</button>
      ${logo()}
      <form class="hsearch" data-form="search" role="search"><input id="hq" type="search" placeholder="Search by part, brand or SKU" value="${esc(S.q)}" aria-label="Search parts"><button aria-label="Search">${ic('search')}</button></form>
      <div class="hacts">
        <button class="hact garage" data-act="openVehicle">${ic('car')}<span class="t"><small>${v ? 'My Garage' : 'Select Vehicle'}</small><b>${v ? esc(vname(v)) : 'Add your vehicle'}</b></span></button>
        <button class="hact" data-go="${S.signedIn ? 'account' : 'signin'}" aria-label="Account">${ic('user')}<span class="t"><small>${S.signedIn ? 'Hello, Daniel' : 'Welcome'}</small><b>${S.signedIn ? 'Account' : 'Sign in'}</b></span></button>
        <button class="hact compare" data-act="openCompare" aria-label="Compare">${ic('compare')}${S.compare.length ? `<span class="cnt">${S.compare.length}</span>` : ''}</button>
        <button class="hact wishlist" data-go="account-wishlist" aria-label="Wishlist">${ic('heart')}${S.wishlist.length ? `<span class="cnt">${S.wishlist.length}</span>` : ''}</button>
        <button class="hact" data-go="cart" aria-label="Cart, ${n} items">${ic('cart')}${n ? `<span class="cnt">${n}</span>` : ''}<span class="t"><small>Cart</small><b class="num">${money(t.sub)}</b></span></button>
      </div>
    </div></div>
    <nav class="hnav" aria-label="Main"><div class="wrap hnav-in">
      <button data-act="shopAll">Shop</button>
      <div class="hn-dd"><button data-act="shopAll" aria-haspopup="true">Categories ${ic('chevD')}</button>${megaCats()}</div>
      <div class="hn-dd"><button data-go="brands" aria-haspopup="true">Brands ${ic('chevD')}</button>${megaBrands()}</div>
      <button data-go="deals">Deals</button>
      <button data-act="shopNew">New Products</button>
      <button data-go="support">Support</button>
    </div></nav>
  </header>
  ${v && curRoute !== 'results' && curRoute !== 'home' ? `<div class="vbar"><div class="wrap"><span class="vb-car">${ic('check')}Your vehicle: ${esc(vname(v))}</span><span class="vb-eng">${esc(v.engine)}</span><span class="vb-acts"><button class="btn-link" data-act="openVehicle">Change vehicle</button>${saved ? '' : `<button class="btn-link" data-act="saveGarage">Save to My Garage</button>`}</span></div></div>` : ''}
  <main>${main}</main>
  ${footer()}
  <button class="chat-fab ${curRoute.startsWith('p-') ? 'on-pdp' : ''}" data-act="chat" aria-label="Chat with a parts specialist">${ic('chat')}<span>Chat with us</span></button>`;
}
function footer() {
  const col = (h, items) => `<div><h4>${h}</h4><ul>${items.map(([l, to]) => `<li><button ${to.startsWith('act:') ? `data-act="${to.slice(4)}"` : `data-go="${to}"`}>${l}</button></li>`).join('')}</ul></div>`;
  return `<footer class="ftr">
    <div class="ftr-news"><div class="wrap"><div><h3>Get deals for your build</h3><p>New parts for the vehicles in your garage, plus members-only codes.</p></div><form class="news" data-form="news"><input id="news" type="email" placeholder="Your email address" aria-label="Email"><button class="btn btn-primary">Subscribe</button></form></div></div>
    <div class="wrap">
    <div class="ftr-cols">
      <div><span class="logo"><span class="logo-mark">${LOGO_MARK}</span><span class="logo-word">Turbo<span>Bolton</span></span></span>
        <p style="margin-top:14px;max-width:34ch">Performance parts matched to your vehicle, shipped fast and backed by people who build cars.</p>
        <p style="margin-top:12px;color:#fff"><b>(800) 555-0142</b><br><span class="small">support@turbobolton.example · Mon–Sat 8–6 CT</span></p>
        <div class="social"><span>Facebook</span><span>Instagram</span><span>YouTube</span></div></div>
      ${col('Shop', [['All parts', 'act:shopAll'], ['Brands', 'brands'], ['Deals', 'deals'], ['New products', 'act:shopNew'], ['My Garage', 'account-garage']])}
      ${col('Support', [['Contact us', 'support'], ['Track an order', 'track'], ['Shipping policy', 'support'], ['Returns & refunds', 'support'], ['Fitment guarantee', 'support']])}
      ${col('Account', [['Sign in', 'signin'], ['Orders', 'account-orders'], ['Wishlist', 'account-wishlist'], ['Settings', 'account-settings']])}
      ${col('Company', [['About TurboBolton', 'support'], ['Terms & conditions', 'support'], ['Privacy policy', 'support'], ['Sitemap', 'brief']])}
    </div>
    <div class="ftr-bottom"><span>© 2026 TurboBolton. Prototype with sample data. Third-party brand names are used for demonstration only.</span><span class="paylogos"><span>VISA</span><span>MC</span><span>AMEX</span><span>DISCOVER</span><span>APPLE PAY</span><span>GOOGLE PAY</span></span></div>
  </div></footer>`;
}

/* ---------- Vehicle search box ("Search by vehicle") ---------- */
function ymmBox(key) {
  const v = S.vehicle;
  if (v && !ui.ymmEdit[key]) {
    const saved = S.garage.some(g => sameV(g, v));
    return `<div class="ymm-active"><div class="ymm-car">${ic('car')}</div><div class="ymm-txt"><span class="yv-l">Your Vehicle</span><span class="yv-n">${esc(vname(v))}</span><span class="yv-e">${esc(v.engine)}</span></div>
      <div class="fit fit-ok ymm-fit">${ic('check')}Parts are checked against this vehicle</div>
      <div class="ymm-acts">${key === 'home' ? `<button class="btn btn-primary" data-act="shopVehicle">${ic('search')}Shop parts for my ${esc(v.model)}</button>` : ''}<button class="btn" data-act="ymmEdit" data-k="${key}">${ic('refresh')}Change</button>${saved ? `<span class="badge badge-ok">${ic('check')}In My Garage</span>` : `<button class="btn btn-dark" data-act="saveGarage">${ic('plus')}Save to My Garage</button>`}</div></div>`;
  }
  return `<div class="ymm-title"><h2>${ic('car')}Search by Vehicle</h2><p>Year · Make · Model · Engine. We only show parts that fit.</p></div>${vselBlock(key)}`;
}

/* ---------- Product card (image over a dark detail panel) ---------- */
function pcard(p) {
  const st = stockState(p), wished = S.wishlist.includes(p.id), cmp = S.compare.includes(p.id);
  return `<article class="pcard">
    <div class="pimg" data-go="p-${p.id}" role="presentation">${art(p.art)}
      <span class="flags">${onSale(p) ? '<span class="badge badge-sale">Sale</span>' : ''}${isNew(p) ? '<span class="badge badge-dark">New</span>' : ''}</span>
      <button class="wish ${wished ? 'on' : ''}" data-act="wish" data-id="${p.id}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist">${ic('heart')}</button>
      <button class="qv" data-act="quickView" data-id="${p.id}">${ic('search')}Quick view</button></div>
    <div class="pbody">
      <span class="pbrand">${esc(p.brand)}</span>
      <button class="pname" data-go="p-${p.id}">${esc(p.name)}</button>
      <span class="psku mono">SKU ${esc(p.sku)}</span>
      <span class="rating">${stars(p.rating)}<span class="num">${p.rating} (${p.reviews})</span></span>
      <div class="price ${onSale(p) ? 'sale' : ''}">${onSale(p) ? `<span class="msrp">MSRP <s>${money(p.price)}</s></span>` : ''}<b>${money(eff(p))}</b></div>
      <span class="stock ${st.k}">${st.t}</span>
      <div class="pfoot">${fitBadge(p)}<div class="pf-row"><button class="btn btn-primary btn-sm" data-act="add" data-id="${p.id}">${ic('cart')}Add to Cart</button><button class="icon-btn cmp ${cmp ? 'on' : ''}" data-act="compare" data-id="${p.id}" aria-label="${cmp ? 'Remove from' : 'Add to'} compare">${ic('compare')}</button></div></div>
    </div></article>`;
}
const carousel = (list, id) => `<div class="car"><button class="car-btn prev" data-act="car" data-id="${id}" data-d="-1" aria-label="Previous">${ic('arrowL')}</button><div class="car-track" id="${id}">${list.map(pcard).join('')}</div><button class="car-btn next" data-act="car" data-id="${id}" data-d="1" aria-label="Next">${ic('arrowR')}</button></div>`;
const secTitle = (t, sub) => `<div class="sec-title"><span class="st-rule"></span><div><h2>${t}</h2>${sub ? `<p>${sub}</p>` : ''}</div><span class="st-rule"></span></div>`;

/* ---------- Home ---------- */
function vHome() {
  const popular = shopProducts().slice().sort((a, b) => b.sold - a.sold).slice(0, 8);
  const newest = shopProducts().slice().sort((a, b) => (b.added || '').localeCompare(a.added || '')).slice(0, 8);
  return `
  <section class="lux-hero" aria-label="TurboBolton performance parts">
    <div class="lux-media"><img class="lux-img" src="${HERO_IMG}" alt="Black BMW M4 Competition coupe lit in a dark studio" width="1900" height="903"><span class="lux-glow"></span></div>
    <div class="wrap lux-in">
      <div class="lux-copy">
        <span class="lux-brand"><span class="logo-mark">${LOGO_MARK}</span>TurboBolton <i>·</i> Performance Parts</span>
        <h1>Performance<br>starts <em>here</em></h1>
        <p>Find performance parts engineered for your vehicle.</p>
        <div class="lux-ctas"><button class="btn btn-primary btn-lg" data-act="shopAll">Shop Performance Parts ${ic('chevR')}</button><button class="btn btn-lg lux-ghost" data-act="heroVehicle">${ic('car')}Select Your Vehicle</button></div>
        <div class="lux-trust"><span>${ic('shield')}Fitment guaranteed</span><span>${ic('truck')}Free shipping over $149</span><span>${ic('headset')}Enthusiast support</span></div>
      </div>
      <div class="lux-build"><span>Featured build</span><b>S58 M4 · Stage 1 + Titanium Exhaust</b><button class="btn-link" data-act="shopBrand" data-k="Akrapovič">Shop the exhaust ${ic('arrowR')}</button></div>
    </div>
    <span class="lux-credit">Photo: Sunder Muthukumaran / Unsplash</span>
  </section>

  <section class="ymm-wrap"><div class="wrap"><div class="ymm" id="selector">${ymmBox('home')}</div></div></section>

  <section class="band"><div class="wrap">
    ${secTitle('Our Products', S.vehicle ? `Showing fitment for your ${esc(vname(S.vehicle))}` : 'Select your vehicle to see what fits')}
    <div class="ptabs" role="tablist">${HOME_TABS.map(t => `<button role="tab" class="${ui.homeTab === t ? 'on' : ''}" data-act="homeTab" data-t="${t}">${t}</button>`).join('')}</div>
    ${carousel(homeTabList(ui.homeTab), 'car-tabs')}
  </div></section>

  <section class="band band-white" id="cats"><div class="wrap">
    ${secTitle('Shop by Category')}
    <div class="cats">${CATEGORIES.map(c => `<button class="cat" data-act="shopCat" data-k="${esc(c.id)}"><span class="cat-ic">${ic(c.icon)}</span><b>${esc(c.id)}</b><small>${c.blurb}</small></button>`).join('')}</div>
  </div></section>

  <section class="band"><div class="wrap"><div class="deals">
    <div class="deal deal-a"><span class="eyebrow" style="color:#FFD2D5">Brake Week · ends Oct 7</span><h3>Save up to $400 on Brembo</h3><p>Big brake kits, pads and racing fluid at sale prices while stock lasts.</p><button class="btn" data-act="shopCat" data-k="Brakes">Shop brakes ${ic('arrowR')}</button>${art('rotor')}</div>
    <div class="deal deal-b"><span class="eyebrow">Sitewide</span><h3>10% off your build</h3><p>Use code <span class="code">TURBO10</span> at checkout, up to $250 off.</p><button class="btn btn-primary" data-go="deals">See all deals</button>${art('intake')}</div>
  </div></div></section>

  <section class="band band-white"><div class="wrap">${secTitle('Most Popular Products', 'Best sellers this month')}${carousel(popular, 'car-pop')}</div></section>
  <section class="band"><div class="wrap">${secTitle('New Products', 'Just landed in the warehouse')}${carousel(newest, 'car-new')}</div></section>

  <section class="why-band"><div class="wrap why">
    <div><span class="w-ic">${ic('shield')}</span><h4>Fitment guarantee</h4><p>Matched to year, make, model and engine. If it doesn't fit, we cover return shipping.</p></div>
    <div><span class="w-ic">${ic('dollar')}</span><h4>Honest pricing</h4><p>Competitive prices with no hidden fees. Shipping cost is shown before checkout.</p></div>
    <div><span class="w-ic">${ic('truck')}</span><h4>Fast shipping</h4><p>Most orders ship in 1–2 business days with tracking to your door.</p></div>
    <div><span class="w-ic">${ic('headset')}</span><h4>Real enthusiast support</h4><p>Call, email or chat with people who build cars.</p></div>
  </div></section>

  <section class="band band-white" id="brands"><div class="wrap">
    ${secTitle('Trusted Brands')}
    <div class="brands">${BRANDS.slice(0, 8).map(b => `<button class="brandtile" data-act="shopBrand" data-k="${esc(b)}">${esc(b)}</button>`).join('')}</div>
    <div style="text-align:center;margin-top:18px"><button class="btn" data-go="brands">View all brands</button></div>
  </div></section>

  <section class="band" id="support"><div class="wrap"><div class="svcstrip">
    <div>${ic('truck')}<span><b>Free shipping over $149</b><small>Ground, lower 48 states</small></span></div>
    <div>${ic('ret')}<span><b>30-day returns</b><small>Uninstalled parts</small></span></div>
    <div>${ic('headset')}<span><b>(800) 555-0142</b><small>Mon–Sat, 8am–6pm CT</small></span></div>
    <div>${ic('box')}<span><b>Track your order</b><small><button class="btn-link" data-go="track">Order status</button></small></span></div>
  </div></div></section>`;
}

/* ---------- Results ---------- */
function vResults() {
  const base = queryList();
  const list = sorted(applyFilters(base));
  const f = S.f, v = S.vehicle;
  if (v && !ui.vs.bar) ui.vs.bar = { ...v, year: String(v.year) };
  const facet = (key, field, values) => {
    const pool = applyFilters(base, key);
    return values.map(val => ({ val, c: pool.filter(p => p[field] === val).length })).filter(x => x.c || f[key].includes(x.val))
      .map(({ val, c }) => `<label class="chk"><input type="checkbox" data-chg="facet" data-key="${key}" value="${esc(val)}" ${f[key].includes(val) ? 'checked' : ''}>${esc(val)}<span class="cnt">${c}</span></label>`).join('');
  };
  const group = (k, title, body) => `<div class="fgroup"><button class="fgroup-h" data-act="fold" data-k="${k}" aria-expanded="${!ui.fold[k]}">${title}${ic(ui.fold[k] ? 'plus' : 'minus')}</button>${ui.fold[k] ? '' : `<div class="fgroup-b">${body}</div>`}</div>`;
  const types = [...new Set(base.map(p => p.type))].sort();
  const title = S.q ? `Results for “${esc(S.q)}”` : f.cats.length === 1 ? esc(f.cats[0]) : f.sale ? 'Deals' : f.brands.length === 1 ? esc(f.brands[0]) : S.sort === 'new' ? 'New Products' : 'All Parts';
  const chips = [...f.cats.map(c => ['cats', c]), ...f.brands.map(c => ['brands', c]), ...f.types.map(c => ['types', c])].map(([k, val]) => `<span class="chip">${esc(val)}<button class="btn-link" data-act="unchip" data-key="${k}" data-v="${esc(val)}" aria-label="Remove ${esc(val)}">${ic('x')}</button></span>`)
    .concat(f.price ? [`<span class="chip">${PRICE_BANDS.find(b => b[0] === f.price)[1]}<button class="btn-link" data-act="unchip" data-key="price" aria-label="Remove price filter">${ic('x')}</button></span>`] : [])
    .concat(f.sale ? [`<span class="chip">On sale<button class="btn-link" data-act="unchip" data-key="sale" aria-label="Remove sale filter">${ic('x')}</button></span>`] : [])
    .concat(f.inStock ? [`<span class="chip">In stock<button class="btn-link" data-act="unchip" data-key="inStock" aria-label="Remove in-stock filter">${ic('x')}</button></span>`] : []);
  const hiddenNoFit = v && f.fitOnly ? base.filter(p => fitOf(p) === 'no').length : 0;
  return `<section class="ymm-band"><div class="wrap"><div class="ymm ymm-bar">${ymmBox('bar')}</div></div></section>
  <div class="wrap">
    <div class="list-head">${crumbs([['Home', 'home'], ['Shop', ''], [S.q ? 'Search' : title.replace(/&[^;]+;/g, ''), '']])}<h1>${title}</h1>${v ? `<p class="muted">Compatible parts for your ${esc(vname(v))} · ${esc(v.engine)}</p>` : ''}</div>
    <div class="res">
      <aside class="filters ${ui.filtersOpen ? 'open' : ''}" aria-label="Filters">
        <div class="fhead"><b>Refine by</b><span>${chips.length ? `${chips.length} applied · <button class="btn-link" data-act="clearFilters">Clear</button>` : 'No filters applied'}</span></div>
        ${chips.length ? `<div class="chips fchips">${chips.join('')}</div>` : ''}
        ${group('fit', 'Vehicle Fitment', v ? `<label class="chk"><input type="checkbox" data-chg="fitOnly" ${f.fitOnly ? 'checked' : ''}>Only parts that fit my ${esc(v.model)}</label>` : `<button class="btn btn-sm btn-block" data-act="openVehicle">${ic('car')}Select vehicle</button>`)}
        ${group('cats', 'Category', facet('cats', 'cat', CATEGORIES.map(c => c.id)))}
        ${group('brands', 'Brand', facet('brands', 'brand', BRANDS.slice().sort((a, b) => a.localeCompare(b))))}
        ${group('types', 'Product Type', facet('types', 'type', types))}
        ${group('price', 'Price', PRICE_BANDS.map(([k, l]) => `<label class="chk"><input type="radio" name="price" data-chg="price" value="${k}" ${f.price === k ? 'checked' : ''}>${l}</label>`).join('') + `<label class="chk"><input type="radio" name="price" data-chg="price" value="" ${!f.price ? 'checked' : ''}>Any price</label>`)}
        ${group('avail', 'Availability', `<label class="chk"><input type="checkbox" data-chg="inStock" ${f.inStock ? 'checked' : ''}>In stock only</label><label class="chk"><input type="checkbox" data-chg="sale" ${f.sale ? 'checked' : ''}>On sale</label>`)}
        ${group('rating', 'Rating', [4.8, 4.5, 0].map(r => `<label class="chk"><input type="radio" name="rating" data-chg="rating" value="${r}" ${+f.rating === r ? 'checked' : ''}>${r ? `${stars(r)} ${r} &amp; up` : 'Any rating'}</label>`).join(''))}
      </aside>
      <section>
        <div class="res-bar">
          <button class="btn btn-sm ftoggle-btn" data-act="toggleFilters">${ic('filter')}${ui.filtersOpen ? 'Hide' : 'Show'} filters${chips.length ? ` (${chips.length})` : ''}</button>
          <span class="count"><b class="num" style="color:var(--text)">${list.length}</b> ${list.length === 1 ? 'product' : 'products'}${hiddenNoFit ? ` · ${hiddenNoFit} that don't fit hidden` : ''}</span>
          <label class="sort" for="sort">Sort by <select class="select" id="sort" data-chg="sort">${SORTS.map(([k, l]) => `<option value="${k}" ${S.sort === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
        </div>
        ${list.length ? `<div class="pgrid c3">${list.map(pcard).join('')}</div>
        <div class="row between" style="margin-top:24px"><span class="small muted">Showing 1–${list.length} of ${list.length}</span><div class="pager"><button aria-label="Previous page" disabled>${ic('chevL')}</button><button class="on">1</button><button aria-label="Next page" disabled>${ic('chevR')}</button></div></div>` :
      `<div class="card empty">${ic('search')}<h3>No parts match these filters</h3><p class="muted">Try removing a filter or searching a different term.</p><button class="btn" data-act="clearFilters">Clear filters</button></div>`}
      </section>
    </div></div>`;
}

/* ---------- Product detail ---------- */
function vProduct(id) {
  const p = P(id);
  if (!p) return `<div class="wrap"><div class="card empty" style="margin:40px 0">${ic('alert')}<h3>Product not found</h3><button class="btn" data-go="results">Back to results</button></div></div>`;
  if (ui.lastPid !== id) { ui.lastPid = id; ui.pdpTab = 'Description'; ui.pdpImg = 0; ui.qty = 1; S.recent = [id, ...S.recent.filter(x => x !== id)].slice(0, 8); save(); }
  const st = stockState(p), fit = fitOf(p), v = S.vehicle, wished = S.wishlist.includes(p.id), cmp = S.compare.includes(p.id);
  let fitBox;
  if (fit === 'fits') fitBox = `<div class="fit fit-lg fit-ok">${ic('check')}<div><span class="fit-cap">This product fits your ${esc(vname(v))}</span><small>${esc(v.engine)} · Confirmed against ${esc(p.brand)} application data</small></div></div>`;
  else if (fit === 'universal') fitBox = `<div class="fit fit-lg fit-warn">${ic('alert')}<div><span class="fit-cap">Verify vehicle fitment</span><small>Universal part. Installation on your ${esc(vname(v))} may need vehicle-specific hardware. Ask our team to confirm.</small></div></div>`;
  else if (fit === 'no') fitBox = `<div class="fit fit-lg fit-no">${ic('x')}<div><span class="fit-cap">Does not fit your ${esc(vname(v))}</span><small>Fits ${esc(fitText(p))}. <button class="btn-link" data-act="shopVehicle">Shop parts for your ${esc(v.model)}</button></small></div></div>`;
  else fitBox = `<div class="fit fit-lg fit-warn">${ic('alert')}<div><span class="fit-cap">Verify vehicle fitment</span><small>Select your vehicle to confirm this part fits. <button class="btn-link" data-act="openVehicle">Select vehicle</button></small></div></div>`;
  const fbtIds = p.id === 'brembo-gt6' ? ['ferodo-pads', 'motul-rbf660'] : shopProducts().filter(x => x.id !== p.id && x.cat === p.cat && fitOf(x) !== 'no').map(x => x.id).concat(['motul-rbf660', 'ngk-plugs']).filter((x, i, a) => x !== p.id && a.indexOf(x) === i).slice(0, 2);
  const fbt = [p, ...fbtIds.map(P)];
  const fbtTotal = fbt.reduce((a, x) => a + eff(x), 0);
  const pool = shopProducts().filter(x => x.id !== p.id && !fbtIds.includes(x.id));
  const similar = pool.filter(x => x.cat === p.cat || x.type === p.type).concat(pool.filter(x => x.brand === p.brand)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 6);
  const related = pool.filter(x => !similar.includes(x) && (fitOf(x) === 'fits' || !v)).slice(0, 8);
  const shipTxt = p.digital ? 'Digital delivery by email' : eff(p) >= 149 ? 'Free ground shipping' : '$12.95 ground, free over $149';
  return `<div class="wrap">
    ${crumbs([['Home', 'home'], ['Shop', ''], [p.cat, ''], [p.brand, '']])}
    <div class="pdp">
      <div class="gallery">
        <div class="gal-thumbs">${VIEWS.map((s, i) => `<button class="${ui.pdpImg === i ? 'on' : ''}" data-act="pdpImg" data-i="${i}" aria-label="Image ${i + 1}"><span style="display:block;width:100%;height:100%;overflow:hidden"><span style="display:block;width:100%;height:100%;${s}">${art(p.art)}</span></span></button>`).join('')}</div>
        <div class="gal-main"><span style="display:grid;place-items:center;width:100%;height:100%;overflow:hidden;border-radius:inherit"><span style="display:grid;place-items:center;width:100%;height:100%;${VIEWS[ui.pdpImg]}">${art(p.art)}</span></span><span class="gal-note">Illustration · product photography in production</span></div>
      </div>
      <div class="pdp-info">
        <div class="row">${onSale(p) ? '<span class="badge badge-sale">On Sale</span>' : ''}${isNew(p) ? '<span class="badge badge-dark">New</span>' : ''}</div>
        <h1>${esc(p.name)}</h1>
        <button class="brandlink" data-act="shopBrand" data-k="${esc(p.brand)}">${esc(p.brand)}</button>
        <button class="rating btn-link" style="color:var(--muted);font-weight:500;align-self:flex-start" data-act="pdpTab" data-t="Reviews">${stars(p.rating)}<span class="num">${p.rating} · ${p.reviews} reviews</span></button>
        <div class="pdp-price ${onSale(p) ? 'sale' : ''}">${onSale(p) ? `<span class="was">Was <s>${money(p.price)}</s></span>` : ''}<b>${onSale(p) ? '<small>On Sale</small>' : ''}${money(eff(p))}</b>${onSale(p) ? `<span class="badge badge-sale">You save ${money(p.price - eff(p))}</span>` : ''}</div>
        <dl class="pdp-dl"><dt>SKU</dt><dd class="mono">${esc(p.sku)}</dd><dt>Condition</dt><dd>New</dd><dt>Availability</dt><dd><span class="stock ${st.k}">${st.t}</span></dd><dt>Shipping</dt><dd>${shipTxt}${p.digital ? '' : ` · arrives ${etaRange('standard')}`}</dd></dl>
        ${fitBox}
        <div class="row" style="gap:14px"><span class="lbl">Quantity</span><div class="qty"><button data-act="qty" data-d="-1" aria-label="Decrease">${ic('minus')}</button><span>${ui.qty}</span><button data-act="qty" data-d="1" aria-label="Increase">${ic('plus')}</button></div></div>
        <div class="buy-row"><button class="btn btn-primary btn-lg" data-act="addPdp" data-id="${p.id}">${ic('cart')}Add to Cart</button><button class="btn btn-dark btn-lg" data-act="buyNow" data-id="${p.id}">Buy Now</button></div>
        <div class="sub-acts"><button class="${wished ? 'on' : ''}" data-act="wish" data-id="${p.id}">${ic('heart')}${wished ? 'In your wishlist' : 'Add to Wishlist'}</button><button class="${cmp ? 'on' : ''}" data-act="compare" data-id="${p.id}">${ic('compare')}${cmp ? 'In compare' : 'Compare'}</button><button data-act="share">${ic('external')}Share</button></div>
        <div class="ship-note">
          <div>${ic('shield')}<span>Fitment guarantee: if it doesn't fit, we pay return shipping</span></div>
          <div>${ic('ret')}<span>30-day returns on uninstalled parts</span></div>
          <div>${ic('headset')}<span>Questions? Call (800) 555-0142 or <button class="btn-link" data-act="chat">chat with a specialist</button></span></div>
        </div>
      </div>
    </div>

    <div class="pdp-tabs" id="pdp-tabs">
      <div class="tabs" role="tablist">${PDP_TABS.map(t => `<button role="tab" class="${ui.pdpTab === t ? 'on' : ''}" data-act="pdpTab" data-t="${t}">${t}${t === 'Reviews' ? ` (${p.reviews})` : t === 'Questions & Answers' ? ` (${QUESTIONS.length})` : ''}</button>`).join('')}</div>
      <div class="tabpanel" role="tabpanel">${pdpPanel(p)}</div>
    </div>

    <section class="band" style="padding-top:8px">
      ${secTitle('Frequently Bought Together')}
      <div class="card pad"><div class="fbt">
        ${fbt.map((x, i) => `${i ? `<span class="fbt-plus">${ic('plus')}</span>` : ''}<div class="fbt-item"><div class="pimg" data-go="p-${x.id}">${art(x.art)}</div><span class="small" style="font-weight:600;line-height:1.3">${i === 0 ? 'This item: ' : ''}${esc(x.brand)} ${esc(x.name)}</span><b class="num">${money(eff(x))}</b></div>`).join('')}
        <div class="fbt-sum"><span class="small muted">Total for all ${fbt.length}</span><b class="num" style="font-family:var(--f-display);font-size:28px">${money(fbtTotal)}</b><button class="btn btn-primary" data-act="addFbt" data-ids="${fbt.map(x => x.id).join(',')}">Add All ${fbt.length} to Cart</button></div>
      </div></div>
    </section>
    ${similar.length ? `<section class="band" style="padding-top:0">${secTitle('Similar Products', `Other ${esc(p.cat.toLowerCase())} options`)}${carousel(similar, 'car-sim')}</section>` : ''}
    ${related.length ? `<section class="band" style="padding-top:0">${secTitle('Related Products', v ? `More parts that fit your ${esc(vname(v))}` : '')}${carousel(related, 'car-rel')}</section>` : ''}
  </div>
  <div class="pdp-sticky"><div><div class="small muted">${esc(p.brand)}</div><b class="num" style="font-family:var(--f-display);font-size:22px">${money(eff(p))}</b></div><button class="btn btn-primary" data-act="addPdp" data-id="${p.id}">${ic('cart')}Add to Cart</button></div>`;
}

/* ---------- Quick view & compare ---------- */
function quickViewModal(id) {
  const p = P(id), st = stockState(p);
  return `<div class="modal wide" role="dialog" aria-modal="true" aria-label="Quick view"><div class="modal-h"><h3>Quick view</h3><button class="icon-btn" data-act="close" aria-label="Close">${ic('x')}</button></div>
    <div class="modal-b qv-grid"><div class="pimg qv-img">${art(p.art)}</div><div class="stack" style="gap:10px">
      <span class="pbrand" style="color:var(--muted)">${esc(p.brand)}</span><h3 style="font-size:24px">${esc(p.name)}</h3><span class="mono small muted">SKU ${esc(p.sku)}</span>
      <span class="rating">${stars(p.rating)}<span class="num">${p.rating} (${p.reviews})</span></span>
      <div class="pdp-price ${onSale(p) ? 'sale' : ''}" style="gap:8px">${onSale(p) ? `<span class="was">Was <s>${money(p.price)}</s></span>` : ''}<b style="font-size:30px">${money(eff(p))}</b></div>
      <span class="stock ${st.k}">${st.t}</span>${fitBadge(p)}<p class="small muted">${esc(p.blurb)}</p>
      <div class="row"><button class="btn btn-primary" data-act="add" data-id="${p.id}">${ic('cart')}Add to Cart</button><button class="btn" data-go="p-${p.id}">View full details</button></div></div></div></div>`;
}
function compareModal() {
  const ps = S.compare.map(P).filter(Boolean);
  if (!ps.length) return modal('Compare products', `<div class="empty" style="padding:20px">${ic('compare')}<p class="muted">Select Compare on up to 4 products to see them side by side.</p></div>`);
  const row = (l, fn) => `<tr><th>${l}</th>${ps.map(p => `<td>${fn(p)}</td>`).join('')}</tr>`;
  return `<div class="modal wide" role="dialog" aria-modal="true" aria-label="Compare products"><div class="modal-h"><h3>Compare products (${ps.length} of 4)</h3><button class="icon-btn" data-act="close" aria-label="Close">${ic('x')}</button></div>
    <div class="modal-b"><div class="tbl-wrap"><table class="tbl cmp-tbl"><tbody>
      ${row('', p => `<div class="pimg" style="border-radius:6px;max-width:160px">${art(p.art)}</div><b style="display:block;margin-top:8px;font-size:14px">${esc(p.brand)} ${esc(p.name)}</b>`)}
      ${row('Price', p => `<b>${money(eff(p))}</b>${onSale(p) ? ` <s class="muted small">${money(p.price)}</s>` : ''}`)}
      ${row('Fitment', p => fitBadge(p))}
      ${row('Category', p => esc(p.cat + ' · ' + p.type))}
      ${row('Rating', p => `${stars(p.rating)} ${p.rating}`)}
      ${row('Availability', p => `<span class="stock ${stockState(p).k}">${stockState(p).t}</span>`)}
      ${row('', p => `<div class="stack" style="gap:6px"><button class="btn btn-primary btn-sm" data-act="add" data-id="${p.id}">Add to Cart</button><button class="btn-link small" data-act="compare" data-id="${p.id}">Remove</button></div>`)}
    </tbody></table></div></div></div>`;
}

/* ---------- Brands, deals, support, sign in ---------- */
function vBrands() {
  const counts = b => shopProducts().filter(p => p.brand === b).length;
  return `<div class="wrap" style="padding-bottom:56px"><div class="list-head">${crumbs([['Home', 'home'], ['Brands', '']])}<h1>Shop by Brand</h1><p class="muted">Authorized dealer for every brand we carry</p></div>
    <div class="brand-grid">${BRANDS.slice().sort((a, b) => a.localeCompare(b)).map(b => `<button class="brandcard" data-act="shopBrand" data-k="${esc(b)}"><span class="bc-name">${esc(b)}</span><span class="small muted">${counts(b)} ${counts(b) === 1 ? 'product' : 'products'}</span></button>`).join('')}</div></div>`;
}
function vDeals() {
  const promos = [
    ['TURBO10', '10% off sitewide', 'Up to $250 off any order. Enter at checkout.', 'act:shopAll', 'Shop all parts'],
    ['Brembo', 'Brake Week pricing', 'Up to $400 off GT big brake kits through Oct 7.', 'brand:Brembo', 'Shop Brembo'],
    ['Michelin', '$30 off per tire', 'Pilot Sport 4S in OEM M3/M4 sizes.', 'brand:Michelin', 'Shop Michelin'],
    ['Eventuri', '$100 off intakes', 'Carbon intake systems for S58 and B58.', 'brand:Eventuri', 'Shop Eventuri'],
  ];
  return `<section class="deals-hero"><div class="wrap"><span class="ev-tag">Fall Boost Event · Oct 1–14</span><h1>Current Deals</h1><p>Sale prices are applied automatically. Codes stack with sale prices unless noted.</p></div></section>
  <div class="wrap" style="padding-bottom:56px">
    ${crumbs([['Home', 'home'], ['Current Deals', '']])}
    <div class="promo-grid">${promos.map(([k, t, d, to, cta]) => `<div class="card promo-card"><span class="promo-k">${esc(k)}</span><h3>${t}</h3><p class="small muted">${d}</p><button class="btn btn-sm" ${to.startsWith('act:') ? `data-act="${to.slice(4)}"` : `data-act="shopBrand" data-k="${to.slice(6)}"`}>${cta} ${ic('arrowR')}</button></div>`).join('')}</div>
    <div style="margin-top:32px">${secTitle('On Sale Now', S.vehicle ? `Fitment shown for your ${esc(vname(S.vehicle))}` : '')}</div>
    <div class="pgrid">${shopProducts().filter(onSale).map(pcard).join('')}</div></div>`;
}
function vSupport() {
  const faq = [
    ['How does the fitment guarantee work?', 'If a part we marked as fitting your selected vehicle doesn\'t fit, contact us within 30 days. We send a prepaid return label and refund you in full.'],
    ['When will my order ship?', 'In-stock orders placed before 2pm CT on business days ship the same day. Most orders ship within 1–2 business days.'],
    ['What is your return policy?', 'Uninstalled parts in original packaging can be returned within 30 days. Electrical parts and tunes are final sale once activated.'],
    ['Do you help with installation?', 'Our team can recommend an installer near you and answer technical questions before and after you buy.'],
    ['Is checkout secure?', 'Card payments are processed by Stripe. TurboBolton never stores your full card number.'],
  ];
  return `<div class="wrap" style="padding-bottom:56px"><div class="list-head">${crumbs([['Home', 'home'], ['Support', '']])}<h1>How can we help?</h1><p class="muted">Real enthusiasts, Monday to Saturday, 8am–6pm Central</p></div>
    <div class="support-grid">
      <div class="card pad stack" style="gap:8px">${ic('headset')}<h3>Call us</h3><b class="num" style="font-size:20px">(800) 555-0142</b><span class="small muted">Average wait under 2 minutes</span></div>
      <div class="card pad stack" style="gap:8px">${ic('chat')}<h3>Live chat</h3><span class="small muted">Talk to a parts specialist now</span><div><button class="btn btn-primary btn-sm" data-act="chat">Start chat</button></div></div>
      <div class="card pad stack" style="gap:8px">${ic('doc')}<h3>Email</h3><b style="overflow-wrap:anywhere">support@turbobolton.example</b><span class="small muted">Replies within one business day</span></div>
      <div class="card pad stack" style="gap:10px">${ic('truck')}<h3>Track an order</h3><form class="stack" style="gap:8px" data-form="trackLookup"><input class="input" id="tl-num" placeholder="Order number, e.g. TB-100482" value="${S.order ? S.order.num : ''}" aria-label="Order number"><button class="btn btn-dark btn-sm">Track</button></form></div>
    </div>
    <div style="margin-top:32px">${secTitle('Frequently Asked Questions')}</div>
    <div class="faq">${faq.map(([q, a], i) => `<details ${i === 0 ? 'open' : ''}><summary>${q}${ic('chevD')}</summary><p>${a}</p></details>`).join('')}</div></div>`;
}
function vSignin() {
  return `<div class="wrap" style="padding-bottom:56px"><div class="list-head">${crumbs([['Home', 'home'], ['Sign in', '']])}<h1>Sign in or create an account</h1></div>
    <div class="signin-grid">
      <form class="card form-sec" data-form="signin"><h3>Sign in</h3><div class="field"><label for="si-e">Email</label><input class="input" id="si-e" type="email" value="daniel.okafor@example.com" autocomplete="username"></div><div class="field"><label for="si-p">Password</label><input class="input" id="si-p" type="password" value="demo-password" autocomplete="current-password"></div><div class="row between"><label class="chk"><input type="checkbox" checked>Keep me signed in</label><button type="button" class="btn-link small" data-act="soon" data-m="Password reset email sent">Forgot password?</button></div><button class="btn btn-dark btn-lg btn-block">Sign In</button></form>
      <form class="card form-sec" data-form="signin"><h3>New to TurboBolton?</h3><p class="small muted">Save vehicles to My Garage, track orders and check out faster.</p><div class="grid2 keep"><div class="field"><label for="ca-f">First name</label><input class="input" id="ca-f" placeholder="First name"></div><div class="field"><label for="ca-l">Last name</label><input class="input" id="ca-l" placeholder="Last name"></div></div><div class="field"><label for="ca-e">Email</label><input class="input" id="ca-e" type="email" placeholder="name@example.com"></div><div class="field"><label for="ca-p">Password</label><input class="input" id="ca-p" type="password" placeholder="At least 10 characters"></div><button class="btn btn-primary btn-lg btn-block">Create Account</button></form>
    </div></div>`;
}
function chatPanel() {
  return drawer('Chat with TurboBolton', `<div class="chat-log"><div class="msg them"><b>Marco · Parts specialist</b><p>Hi Daniel! I see a ${S.vehicle ? esc(vname(S.vehicle)) : 'vehicle'} in your garage. What are you working on?</p></div><div class="msg me"><p>Will the Brembo GT kit clear my factory 19" wheels?</p></div><div class="msg them"><b>Marco · Parts specialist</b><p>Yes. The 380mm GT kit clears the OEM 19" wheels on the G80 M3. No spacers needed.</p></div></div><p class="small muted">Prototype: sample conversation. Production uses a live chat service.</p>`,
    `<input class="input" id="chat-in" placeholder="Type a message" aria-label="Message" style="flex:1"><button class="btn btn-primary" data-act="soon" data-m="Message sent">Send</button>`);
}
