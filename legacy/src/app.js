/* ==========================================================
   TurboBolton prototype — state, router, storefront screens
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const money = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const vname = v => `${v.year} ${v.make} ${v.model}`;
const sameV = (a, b) => a && b && a.year === b.year && a.make === b.make && a.model === b.model && a.engine === b.engine;
const fmtDate = (d, opt = { month: 'short', day: 'numeric', year: 'numeric' }) => new Date(d).toLocaleDateString('en-US', opt);
const fmtTime = d => { const x = new Date(d); return `${fmtDate(x)} · ${x.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`; };
const CAT_ART = { Engine: 'intake', Exhaust: 'exhaust', Suspension: 'coilover', Brakes: 'rotor', 'Wheels & Tires': 'wheel', Exterior: 'lip', Interior: 'seat', Electronics: 'ecu', Performance: 'intercooler' };

/* ---------- State ---------- */
const KEY = 'turbobolton-demo-v1';
const RESERVED0 = { 'kw-v3': 2, 'hre-ff04': 4, 'michelin-ps4s': 8, 'ferodo-pads': 1 };
function defaults() {
  return {
    vehicle: null,
    garage: [{ id: 'g-supra', year: 2020, make: 'Toyota', model: 'GR Supra', engine: '3.0L B58 Turbo I6 (382 hp)' }],
    cart: [], saved: [], wishlist: ['eventuri-intake', 'hre-ff04'], recent: ['kw-v3', 'akrapovic-slipon', 'michelin-ps4s'],
    coupon: null, q: '', sort: 'recommended',
    f: { cats: [], brands: [], types: [], price: '', inStock: false, fitOnly: true, rating: 0, sale: false },
    co: { step: 1, ...CUSTOMER, ship: 'standard', cardName: 'Daniel Okafor', cardNum: '4242 4242 4242 4242', exp: '12 / 28', cvc: '123', billSame: true, updates: true },
    order: null, seq: 100482, edits: {}, added: [],
    inv: Object.fromEntries(PRODUCTS.map(p => [p.id, { onHand: p.onHand, reserved: RESERVED0[p.id] || 0, threshold: p.threshold }])),
    admin: false, device: 'desktop', signedIn: true, compare: [],
  };
}
function load() { try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(defaults(), JSON.parse(raw)); } catch (e) { } return defaults(); }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
let S = load();
const ui = { vs: {}, pdpTab: 'Description', pdpImg: 0, qty: 1, filtersOpen: false, errs: {}, couponErr: '', orderTab: 'All', invTab: 'All', apq: '', apcat: '', confirmRemove: null, editVehicle: null, lastPid: null, homeTab: 'Featured', ymmEdit: {}, fold: {} };

/* ---------- Catalog helpers ---------- */
const allProducts = () => PRODUCTS.concat(S.added || []);
function P(id) { const b = allProducts().find(p => p.id === id); return b ? { status: 'Active', ...b, ...(S.edits[id] || {}) } : null; }
const shopProducts = () => allProducts().map(p => P(p.id)).filter(p => p.status === 'Active');
const eff = p => p.sale != null && p.sale !== '' ? +p.sale : +p.price;
const onSale = p => p.sale != null && p.sale !== '' && +p.sale < +p.price;
const inv = id => S.inv[id] || (S.inv[id] = { onHand: 0, reserved: 0, threshold: 0 });
const avail = id => Math.max(0, inv(id).onHand - inv(id).reserved);
function stockState(p) {
  if (p.digital) return { k: 'in', t: 'Instant digital delivery' };
  const a = avail(p.id), th = inv(p.id).threshold;
  if (a <= 0) return { k: 'out', t: 'Backorder · ships in 2–3 weeks' };
  if (a <= th) return { k: 'low', t: `Only ${a} left in stock` };
  return { k: 'in', t: 'In stock · ships in 1–2 days' };
}
function fitOf(p, v = S.vehicle) {
  if (!v) return 'none';
  if (p.fit === 'universal') return 'universal';
  return p.fit.some(f => f.make === v.make && f.model === v.model && v.year >= f.from && v.year <= f.to) ? 'fits' : 'no';
}
function fitBadge(p) {
  const f = fitOf(p), v = S.vehicle;
  if (f === 'fits') return `<div class="fit fit-ok">${ic('check')}<span>Fits your ${esc(vname(v))}</span></div>`;
  if (f === 'universal') return `<div class="fit fit-warn">${ic('alert')}<span>Universal part · verify fitment</span></div>`;
  if (f === 'no') return `<div class="fit fit-no">${ic('x')}<span>Does not fit your ${esc(vname(v))}</span></div>`;
  return `<div class="fit fit-warn">${ic('alert')}<span>Verify vehicle fitment</span></div>`;
}
const stars = r => `<span class="stars" aria-label="${r} out of 5 stars">★★★★★<i style="width:${(r / 5) * 100}%">★★★★★</i></span>`;
const isNew = p => p.added >= '2026-08-01';
const fitText = p => p.fit === 'universal' ? 'Universal' : p.fit.map(f => `${f.from}–${f.to} ${f.make} ${f.model}`).join(', ');

/* ---------- Money ---------- */
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const cartCount = () => S.cart.reduce((a, l) => a + l.qty, 0);
function totals(lines = S.cart, method = null, coupon = S.coupon) {
  const sub = lines.reduce((a, l) => a + eff(P(l.id)) * l.qty, 0);
  const disc = coupon === 'TURBO10' ? Math.min(250, Math.round(sub * 10) / 100) : 0;
  const base = sub - disc;
  let ship;
  if (!method) ship = base >= 149 || !lines.length ? 0 : 12.95;
  else { const m = SHIP_METHODS.find(x => x.id === method); ship = m.id === 'standard' ? (base >= 149 ? 0 : 12.95) : m.cost; }
  const tax = Math.round(base * 0.0825 * 100) / 100;
  return { sub, disc, ship, tax, total: Math.round((base + ship + tax) * 100) / 100 };
}
function addBizDays(d, n) { const x = new Date(d); let k = 0; while (k < n) { x.setDate(x.getDate() + 1); const w = x.getDay(); if (w && w < 6) k++; } return x; }
function etaRange(method, from = new Date()) {
  const m = SHIP_METHODS.find(x => x.id === method);
  const a = addBizDays(from, m.days[0]), b = addBizDays(from, m.days[1]);
  const f = d => fmtDate(d, { weekday: 'short', month: 'short', day: 'numeric' });
  return m.days[0] === m.days[1] ? f(a) : `${f(a)} – ${f(b)}`;
}

/* ---------- Router ---------- */
let curRoute = (location.hash || '').slice(1) || 'brief';
function go(r) {
  curRoute = r; ui.errs = {}; closeModal(); render(true);
  try { if (location.hash.slice(1) !== r) location.hash = r; } catch (e) { }
}
addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h && h !== curRoute) { curRoute = h; render(true); } });

function render(top) {
  const r = curRoute;
  let html;
  if (r === 'brief') html = vBrief();
  else if (r === 'system') html = vSystem();
  else if (r === 'checkout') html = vCheckout();
  else if (r.startsWith('admin')) html = vAdminRoute(r);
  else html = storeShell(storeView(r));
  $('#app').innerHTML = html;
  if (top) $('#frame').scrollTop = 0;
  paintDemoBar();
}
function storeView(r) {
  if (r === 'home') return vHome();
  if (r === 'results') return vResults();
  if (r.startsWith('p-')) return vProduct(r.slice(2));
  if (r === 'cart') return vCart();
  if (r === 'confirm') return vConfirm();
  if (r === 'track') return vTrack();
  if (r === 'brands') return vBrands();
  if (r === 'deals') return vDeals();
  if (r === 'support') return vSupport();
  if (r === 'signin') return vSignin();
  if (r.startsWith('account')) return S.signedIn ? vAccount(r) : vSignin();
  return vHome();
}

/* ---------- Demo bar ---------- */
function paintDemoBar() {
  const r = curRoute;
  const area = r === 'brief' ? 'brief' : r === 'system' ? 'system' : r.startsWith('admin') ? 'admin' : 'store';
  document.querySelectorAll('#areaseg button').forEach(b => b.classList.toggle('on', b.dataset.area === area));
  document.querySelectorAll('#devseg button').forEach(b => b.classList.toggle('on', b.dataset.dev === S.device));
  $('#stage').dataset.device = S.device;
}

/* ---------- Overlays ---------- */
function openModal(inner, cls = '') { $('#overlay').innerHTML = `<div class="scrim ${cls}" data-act="scrim">${inner}</div>`; const f = $('#overlay [autofocus]'); if (f) f.focus(); }
function closeModal() { const o = $('#overlay'); if (o) o.innerHTML = ''; }
function modal(title, body, foot = '') {
  return `<div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-h"><h3>${title}</h3><button class="icon-btn" data-act="close" aria-label="Close">${ic('x')}</button></div><div class="modal-b">${body}</div>${foot ? `<div class="modal-f">${foot}</div>` : ''}</div>`;
}
function drawer(title, body, foot = '') {
  return `<aside class="drawer" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-h"><h3>${title}</h3><button class="icon-btn" data-act="close" aria-label="Close">${ic('x')}</button></div><div class="modal-b">${body}</div>${foot ? `<div class="modal-f">${foot}</div>` : ''}</aside>`;
}
function toast(msg, kind = '') {
  const t = document.createElement('div'); t.className = 'toast ' + kind;
  t.innerHTML = ic(kind === 'warn' ? 'info' : 'check') + `<span>${msg}</span>`;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3200);
}

/* ==========================================================
   Storefront shell
   ========================================================== */
const LOGO_MARK = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.6"/><path d="M12 9.4C12 6 14.5 4.5 16.6 4.9M14.6 12c3.4 0 4.9 2.5 4.5 4.6M12 14.6c0 3.4-2.5 4.9-4.6 4.5M9.4 12C6 12 4.5 9.5 4.9 7.4"/></svg>`;
const logo = (to = 'home') => `<button class="logo" data-go="${to}" aria-label="TurboBolton home"><span class="logo-mark">${LOGO_MARK}</span><span class="logo-word">Turbo<span>Bolton</span></span></button>`;
const NAV = [['Shop', 'shop'], ['Categories', 'cats'], ['Brands', 'brands'], ['Deals', 'deals'], ['New Products', 'new'], ['Support', 'support']];

/* ---------- Vehicle selector component ---------- */
function vsState(key) { return ui.vs[key] || (ui.vs[key] = { year: '', make: '', model: '', engine: '' }); }
function vselBlock(key, cta = 'Find Parts That Fit') {
  const s = vsState(key);
  const y = +s.year;
  const makes = y ? makesFor(y) : [], models = y && s.make ? modelsFor(y, s.make) : [], engines = y && s.make && s.model ? enginesFor(y, s.make, s.model) : [];
  const sel = (n, label, f, opts, val, dis) => `<div class="field"><label for="vs-${key}-${f}"><span class="stepn ${val ? 'done' : ''}">${val ? '✓' : n}</span>${label}</label>
    <select class="select" id="vs-${key}-${f}" data-vs="${key}:${f}" ${dis ? 'disabled' : ''}><option value="">Select ${label.toLowerCase()}</option>${opts.map(o => `<option ${String(o) === String(val) ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></div>`;
  const ready = s.year && s.make && s.model && s.engine;
  return `<div id="vsw-${key}">
    <div class="vsel-grid">${sel(1, 'Year', 'year', YEARS, s.year, false)}${sel(2, 'Make', 'make', makes, s.make, !y)}${sel(3, 'Model', 'model', models, s.model, !s.make)}${sel(4, 'Engine', 'engine', engines, s.engine, !s.model)}</div>
    <div class="vs-btns"><button class="btn btn-primary btn-lg" data-act="applyVehicle" data-k="${key}" ${ready ? '' : 'disabled'}>${ic('search')}${cta}</button>${key !== 'modal' ? `<button class="btn btn-lg" data-act="resetVs" data-k="${key}">Reset</button>` : ''}</div>
    <div class="vsel-foot"><button class="btn-link" data-act="fillDemo" data-k="${key}">Demo shortcut: 2022 BMW M3</button>${S.garage.length ? `<button class="btn-link" data-act="openVehicle">${ic('car')}Choose from My Garage</button>` : ''}</div>
  </div>`;
}
function yourVehicle() {
  const v = S.vehicle; if (!v) return '';
  const saved = S.garage.some(g => sameV(g, v));
  return `<div class="yourveh"><div class="yv-ic">${ic('car')}</div><div><div class="yv-l">Your Vehicle</div><div class="yv-n">${esc(vname(v))}</div><div class="yv-e">${esc(v.engine)}</div></div>
    <div class="yv-acts"><button class="btn btn-sm" data-act="openVehicle">${ic('refresh')}Change Vehicle</button>${saved ? `<span class="badge badge-ok">${ic('check')}Saved in My Garage</span>` : `<button class="btn btn-sm btn-dark" data-act="saveGarage">${ic('plus')}Save to My Garage</button>`}</div></div>`;
}
function vehicleModal() {
  const v = S.vehicle;
  const editing = ui.editVehicle;
  const list = S.garage.map(g => `<button class="radio-card ${sameV(g, v) ? 'on' : ''}" data-act="useGarage" data-id="${g.id}" style="text-align:left;background:var(--paper)">${ic('car')}<span class="rc-t"><b>${esc(vname(g))}</b><small>${esc(g.engine)}</small></span>${sameV(g, v) ? '<span class="badge badge-ok">Active</span>' : '<span class="btn-link">Shop</span>'}</button>`).join('');
  return modal(editing ? 'Edit vehicle' : 'Select your vehicle', `
    ${!editing && S.garage.length ? `<div class="stack" style="gap:8px"><span class="lbl">My Garage</span>${list}</div><div class="row" style="gap:10px"><hr class="hr" style="flex:1"><span class="small muted">or add a vehicle</span><hr class="hr" style="flex:1"></div>` : ''}
    ${vselBlock('modal', editing ? 'Save Vehicle' : 'Shop This Vehicle')}`);
}

/* ---------- Product card ---------- */
const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([l, to], i) => (i ? '<span class="sep">/</span>' : '') + (to ? `<button data-go="${to}">${esc(l)}</button>` : `<span>${esc(l)}</span>`)).join('')}</nav>`;

/* ==========================================================
   Home
   ========================================================== */
/* ==========================================================
   Results
   ========================================================== */
const PRICE_BANDS = [['0-100', 'Under $100', 0, 100], ['100-500', '$100 – $500', 100, 500], ['500-1500', '$500 – $1,500', 500, 1500], ['1500-', '$1,500 and up', 1500, 1e9]];
const SORTS = [['recommended', 'Recommended'], ['price-asc', 'Price: Low to High'], ['price-desc', 'Price: High to Low'], ['best', 'Best Selling'], ['new', 'Newest']];
function queryList() {
  let list = shopProducts();
  if (S.q) {
    const words = S.q.toLowerCase().split(/\s+/).filter(Boolean);
    list = list.filter(p => { const hay = `${p.name} ${p.brand} ${p.cat} ${p.type} ${p.sku} ${fitText(p)}`.toLowerCase(); return words.every(w => hay.includes(w.replace(/s$/, ''))); });
  }
  return list;
}
function applyFilters(list, skip = '') {
  const f = S.f;
  return list.filter(p =>
    (skip === 'cats' || !f.cats.length || f.cats.includes(p.cat)) &&
    (skip === 'brands' || !f.brands.length || f.brands.includes(p.brand)) &&
    (skip === 'types' || !f.types.length || f.types.includes(p.type)) &&
    (!f.price || (() => { const b = PRICE_BANDS.find(x => x[0] === f.price); return eff(p) >= b[2] && eff(p) < b[3]; })()) &&
    (!f.inStock || p.digital || avail(p.id) > 0) &&
    (!f.fitOnly || !S.vehicle || fitOf(p) !== 'no') &&
    (!f.rating || p.rating >= f.rating) &&
    (!f.sale || onSale(p)));
}
function sorted(list) {
  const l = list.slice();
  const fitRank = p => ({ fits: 0, universal: 1, none: 1, no: 2 }[fitOf(p)]);
  if (S.sort === 'price-asc') l.sort((a, b) => eff(a) - eff(b));
  else if (S.sort === 'price-desc') l.sort((a, b) => eff(b) - eff(a));
  else if (S.sort === 'best') l.sort((a, b) => b.sold - a.sold);
  else if (S.sort === 'new') l.sort((a, b) => (b.added || '').localeCompare(a.added || ''));
  else l.sort((a, b) => fitRank(a) - fitRank(b) || b.rating * b.reviews - a.rating * a.reviews);
  return l;
}
/* ==========================================================
   Product detail
   ========================================================== */
const PDP_TABS = ['Description', 'Specifications', 'Vehicle Fitment', 'Installation', 'Shipping', 'Warranty', 'Reviews', 'Questions & Answers'];
const VIEWS = ['', 'transform:scale(1.35) translate(4%,3%)', 'transform:rotate(-10deg) scale(.9)', 'transform:scaleX(-1)'];
function pdpPanel(p) {
  const v = S.vehicle;
  switch (ui.pdpTab) {
    case 'Description': return `<p>${esc(p.desc)}</p><h4>Highlights</h4><ul>${p.features.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    case 'Specifications': return `<table class="spec-tbl"><tbody><tr><th>Brand</th><td>${esc(p.brand)}</td></tr><tr><th>SKU</th><td class="mono">${esc(p.sku)}</td></tr><tr><th>Product type</th><td>${esc(p.type)}</td></tr>${p.specs.map(([k, val]) => `<tr><th>${esc(k)}</th><td>${esc(val)}</td></tr>`).join('')}</tbody></table>`;
    case 'Vehicle Fitment':
      if (p.fit === 'universal') return `<div class="callout">${ic('alert')}<div><b>Universal part.</b> This product isn't tied to a specific vehicle. Check the installation notes or contact support to confirm it suits your build.</div></div>`;
      return `<p class="muted">Confirmed vehicle applications. Your vehicle is highlighted.</p><div class="tbl-wrap card"><table class="tbl"><thead><tr><th>Year</th><th>Make</th><th>Model</th><th>Engine</th><th>Notes</th></tr></thead><tbody>${p.fit.flatMap(f => VEHICLES.filter(x => x.make === f.make && x.model === f.model && x.from <= f.to && x.to >= f.from).flatMap(x => x.engines.map(e => {
        const yrs = `${Math.max(f.from, x.from)}–${Math.min(f.to, x.to)}`; const mine = v && v.make === f.make && v.model === f.model && v.engine === e && v.year >= f.from && v.year <= f.to;
        return `<tr class="${mine ? 'hl' : ''}"><td class="num">${yrs}</td><td>${f.make}</td><td>${f.model}</td><td>${e}</td><td>${mine ? `<span class="badge badge-ok">${ic('check')}Your vehicle</span>` : 'Direct fit'}</td></tr>`;
      }))).join('')}</tbody></table></div>`;
    case 'Installation': return `<div class="video-ph" role="img" aria-label="Installation video placeholder"><span class="play">${ic('play')}</span><span><b>Installation walkthrough</b><br><span class="small">Video · 12:40 · sample placeholder</span></span></div><ul>${p.install.map(x => `<li>${esc(x)}</li>`).join('')}</ul><div class="callout info">${ic('info')}<div>Need an installer? Our support team can recommend a shop near ${esc(S.co.zip)}.</div></div>`;
    case 'Shipping': return p.digital ? `<p>This is a digital product. Your license is emailed within minutes of payment.</p>` : `<table class="spec-tbl"><tbody>${SHIP_METHODS.map(m => `<tr><th>${m.name}</th><td>${m.eta} · ${m.cost ? money(m.cost) : 'Free over $149, otherwise $12.95'}</td></tr>`).join('')}</tbody></table><p class="muted small">Orders placed before 2pm CT on business days ship the same day when in stock. Lower 48 states.</p>`;
    case 'Warranty': return `<p>${esc(p.warranty)}</p><p><b>TurboBolton Fitment Guarantee.</b> If a part we marked as fitting your vehicle doesn't fit, we cover return shipping and refund you in full.</p>`;
    case 'Reviews': return `<div class="row" style="gap:24px;align-items:flex-start"><div><div style="font-family:var(--f-display);font-size:48px;font-weight:700;line-height:1">${p.rating}</div>${stars(p.rating)}<div class="small muted">${p.reviews} reviews</div></div><div style="flex:1;min-width:200px;display:flex;flex-direction:column;gap:4px">${[5, 4, 3, 2, 1].map((s, i) => { const pct = [82, 13, 3, 1, 1][i]; return `<div class="row small" style="gap:8px;flex-wrap:nowrap"><span style="width:44px">${s} star</span><span style="flex:1;height:8px;background:var(--bg-2);border-radius:4px;overflow:hidden"><span style="display:block;height:100%;width:${pct}%;background:var(--star)"></span></span><span class="num muted" style="width:34px;text-align:right">${pct}%</span></div>`; }).join('')}</div><button class="btn btn-sm" data-act="soon" data-m="Reviews are moderated before publishing">Write a review</button></div>${REVIEWS.map(r => `<div class="review"><div class="row" style="gap:10px">${stars(r.stars)}<b>${esc(r.title)}</b></div><p>${esc(r.text)}</p><span class="small muted">${esc(r.name)} · ${esc(r.car)} · ${r.date} · <span class="badge badge-ok">Verified purchase</span></span></div>`).join('')}`;
    case 'Questions & Answers': return `${QUESTIONS.map(q => `<div class="review"><b>Q: ${esc(q.q)}</b><p><b style="color:var(--ok)">A:</b> ${esc(q.a)}</p><span class="small muted">Answered by ${q.by}</span></div>`).join('')}<div><button class="btn btn-sm" data-act="soon" data-m="Question sent to our support team">Ask a question</button></div>`;
  }
  return '';
}
function addedDrawer(ids) {
  const items = ids.map(P);
  const t = totals();
  return drawer('Added to your cart', `
    ${items.map(p => `<div class="mini-line"><div class="pimg">${art(p.art)}</div><div><b style="font-size:14px">${esc(p.brand)} ${esc(p.name)}</b>${fitOf(p) === 'fits' ? `<div class="fit fit-ok" style="margin-top:6px;padding:3px 8px;font-size:12px">${ic('check')}Fits your ${esc(vname(S.vehicle))}</div>` : ''}</div><b class="num">${money(eff(p))}</b></div>`).join('')}
    <hr class="hr"><div class="sumrow"><span>Cart subtotal (${plural(cartCount(), 'item')})</span><b>${money(t.sub)}</b></div>
    ${t.sub >= 149 ? `<div class="badge badge-ok" style="align-self:flex-start">${ic('truck')}Your order qualifies for free shipping</div>` : `<div class="small muted">Add ${money(149 - t.sub)} more for free shipping</div>`}`,
    `<button class="btn" data-act="close">Continue Shopping</button><button class="btn btn-dark" data-go="cart">View Cart</button><button class="btn btn-primary" data-go="checkout">Checkout</button>`);
}

/* ==========================================================
   Cart
   ========================================================== */
function vCart() {
  const t = totals(), v = S.vehicle;
  const line = (l, savedList) => {
    const p = P(l.id), st = stockState(p);
    return `<div class="cline"><div class="pimg" data-go="p-${p.id}">${art(p.art)}</div>
      <div class="cline-info"><span class="pbrand">${esc(p.brand)}</span><button class="pname" data-go="p-${p.id}">${esc(p.name)}</button><span class="small muted">SKU <span class="mono">${esc(p.sku)}</span></span>
        <span class="stock ${st.k}">${st.t}</span>${v ? `<div style="align-self:flex-start">${fitBadge(p)}</div>` : ''}
        <div class="cline-acts">${savedList ? `<button data-act="moveToCart" data-id="${p.id}">${ic('cart')}Move to cart</button>` : `<button data-act="saveLater" data-id="${p.id}">${ic('heart')}Save for later</button>`}<button data-act="${savedList ? 'removeSaved' : 'remove'}" data-id="${p.id}" style="color:var(--err)">${ic('trash')}Remove</button></div></div>
      <div class="cline-price">${savedList ? `<b class="num">${money(eff(p))}</b>` : `<span class="unit num">${money(eff(p))} each</span><div class="qty sm"><button data-act="cqty" data-id="${p.id}" data-d="-1" aria-label="Decrease">${ic('minus')}</button><span>${l.qty}</span><button data-act="cqty" data-id="${p.id}" data-d="1" aria-label="Increase">${ic('plus')}</button></div><span class="lt num">${money(eff(p) * l.qty)}</span>`}</div></div>`;
  };
  if (!S.cart.length) return `<div class="wrap">${crumbs([['Home', 'home'], ['Cart', '']])}<div class="card empty" style="margin-bottom:56px">${ic('cart')}<h2>Your cart is empty</h2><p class="muted">${v ? `Find parts that fit your ${esc(vname(v))}.` : 'Select your vehicle to find parts that fit.'}</p><button class="btn btn-primary" data-act="${v ? 'shopVehicle' : 'shopAll'}">Shop parts</button></div>
    ${S.saved.length ? `<div class="card" style="margin-bottom:56px"><div class="panel-h"><h3>Saved for later (${S.saved.length})</h3></div>${S.saved.map(l => line(l, true)).join('')}</div>` : ''}</div>`;
  return `<div class="wrap">${crumbs([['Home', 'home'], ['Cart', '']])}
    <div class="row between" style="margin-bottom:18px"><h1>Your Cart <span class="muted" style="font-size:.6em;font-weight:500">(${plural(cartCount(), 'item')})</span></h1>${v ? `<span class="badge badge-ok" style="font-size:13px;padding:6px 10px">${ic('car')}Shopping for ${esc(vname(v))}</span>` : ''}</div>
    <div class="cart-l">
      <div class="stack">
        <div class="card">${S.cart.map(l => line(l, false)).join('')}</div>
        <div><button class="btn" data-act="${v ? 'shopVehicle' : 'shopAll'}">${ic('chevL')}Continue Shopping</button></div>
        ${S.saved.length ? `<div class="card"><div class="panel-h"><h3>Saved for later (${S.saved.length})</h3></div>${S.saved.map(l => line(l, true)).join('')}</div>` : ''}
      </div>
      <aside class="card summary">
        <h3>Order Summary</h3>
        <div class="sumrow"><span>Subtotal</span><span>${money(t.sub)}</span></div>
        ${t.disc ? `<div class="sumrow disc"><span>Discount (TURBO10)</span><span>−${money(t.disc)}</span></div>` : `<div class="sumrow"><span>Discount</span><span class="muted">—</span></div>`}
        <div class="sumrow"><span>Shipping estimate</span><span>${t.ship ? money(t.ship) : '<b style="color:var(--ok)">FREE</b>'}</span></div>
        <div class="sumrow"><span>Estimated tax <span class="small muted">(TX 8.25%)</span></span><span>${money(t.tax)}</span></div>
        <div class="sumrow total"><span>Order total</span><span>${money(t.total)}</span></div>
        <form class="coupon" data-form="coupon"><input class="input ${ui.couponErr ? 'err' : ''}" id="coupon" placeholder="Coupon code" value="${S.coupon || ''}" aria-label="Coupon code"><button class="btn btn-sm">${S.coupon ? 'Applied' : 'Apply'}</button></form>
        ${ui.couponErr ? `<span class="field"><span class="errtxt">${ui.couponErr}</span></span>` : S.coupon ? `<span class="small" style="color:var(--ok);font-weight:600">TURBO10 applied · <button class="btn-link" data-act="removeCoupon">Remove</button></span>` : `<span class="small muted">Demo code: TURBO10</span>`}
        <button class="btn btn-primary btn-lg btn-block" data-go="checkout">${ic('lock')}Proceed to Checkout</button>
        <div class="secure">${ic('lock')}Secure checkout · payments by Stripe</div>
        <div class="paylogos"><span>VISA</span><span>MC</span><span>AMEX</span><span>DISCOVER</span><span>APPLE PAY</span></div>
      </aside>
    </div></div>`;
}

/* ==========================================================
   Checkout
   ========================================================== */
const CO_STEPS = ['Customer information', 'Shipping address', 'Shipping method', 'Payment', 'Review order'];
const STATES = ['AZ', 'CA', 'CO', 'FL', 'GA', 'IL', 'NC', 'NY', 'OH', 'OR', 'TX', 'WA'];
function inp(f, label, opt = {}) {
  const e = ui.errs[f];
  return `<div class="field" ${opt.style ? `style="${opt.style}"` : ''}><label for="co-${f}">${label}</label><input class="input ${e ? 'err' : ''}" id="co-${f}" data-co="${f}" value="${esc(S.co[f])}" ${opt.type ? `type="${opt.type}"` : ''} ${opt.ph ? `placeholder="${opt.ph}"` : ''} autocomplete="${opt.ac || 'on'}">${e ? `<span class="errtxt">${e}</span>` : opt.hint ? `<span class="hint">${opt.hint}</span>` : ''}</div>`;
}
function vCheckout() {
  if (!S.cart.length && !S.order) return `<div class="co-hdr"><div class="wrap">${logo()}</div></div><div class="wrap"><div class="card empty" style="margin:40px 0">${ic('cart')}<h2>Your cart is empty</h2><button class="btn btn-primary" data-go="home">Shop parts</button></div></div>`;
  if (!S.cart.length) return `<div class="co-hdr"><div class="wrap">${logo()}</div></div><div class="wrap"><div class="card empty" style="margin:40px 0">${ic('check')}<h2>Order already placed</h2><p class="muted">Your cart is empty because order ${S.order.num} was placed.</p><div class="row" style="justify-content:center"><button class="btn btn-primary" data-go="confirm">View confirmation</button><button class="btn" data-go="home">Continue shopping</button></div></div></div>`;
  const c = S.co, step = c.step, t = totals(S.cart, c.ship), v = S.vehicle;
  const m = SHIP_METHODS.find(x => x.id === c.ship);
  const summaries = [
    `${esc(c.email)} · ${esc(c.phone)}`,
    `${esc(c.first)} ${esc(c.last)}, ${esc(c.addr1)}${c.addr2 ? ', ' + esc(c.addr2) : ''}, ${esc(c.city)}, ${esc(c.state)} ${esc(c.zip)}`,
    `${m.name} · ${m.eta} · ${t.ship ? money(t.ship) : 'Free'}`,
    `Visa ending in ${esc(c.cardNum.replace(/\D/g, '').slice(-4))} · exp ${esc(c.exp)}`,
  ];
  const bodies = [
    () => `<div class="callout info">${ic('user')}<div>Signed in as <b>Daniel Okafor</b>. Order updates go to this email.</div></div>
      <div class="grid2">${inp('email', 'Email', { type: 'email', ac: 'email' })}${inp('phone', 'Phone', { type: 'tel', ac: 'tel', hint: 'For delivery questions only' })}</div>
      <label class="chk"><input type="checkbox" checked>Email me shipping and tracking updates</label>
      <div><button class="btn btn-dark" data-act="coNext">Continue to Shipping Address</button></div>`,
    () => `<div class="grid2 keep">${inp('first', 'First name', { ac: 'given-name' })}${inp('last', 'Last name', { ac: 'family-name' })}</div>
      ${inp('addr1', 'Street address', { ac: 'address-line1' })}${inp('addr2', 'Apartment, suite, unit (optional)', { ac: 'address-line2' })}
      <div class="grid3">${inp('city', 'City', { ac: 'address-level2' })}<div class="field"><label for="co-state">State</label><select class="select" id="co-state" data-co="state">${STATES.map(s => `<option ${s === c.state ? 'selected' : ''}>${s}</option>`).join('')}</select></div>${inp('zip', 'ZIP code', { ac: 'postal-code' })}</div>
      <div class="field"><label for="co-country">Country</label><select class="select" id="co-country" data-co="country"><option>United States</option></select></div>
      <div><button class="btn btn-dark" data-act="coNext">Continue to Shipping Method</button></div>`,
    () => `${SHIP_METHODS.map(x => { const cost = x.id === 'standard' ? (t.sub - t.disc >= 149 ? 0 : 12.95) : x.cost; return `<label class="radio-card ${c.ship === x.id ? 'on' : ''}"><input type="radio" name="ship" value="${x.id}" data-chg="ship" ${c.ship === x.id ? 'checked' : ''}><span class="rc-t"><b>${x.name}</b><small>${x.eta} · arrives ${etaRange(x.id)}</small></span><span class="rc-p">${cost ? money(cost) : 'FREE'}</span></label>`; }).join('')}
      <div><button class="btn btn-dark" data-act="coNext">Continue to Payment</button></div>`,
    () => `<div class="testnote">${ic('info')}<div><b>Prototype: Stripe test mode.</b> 4242 4242 4242 4242 is Stripe's public test card. No real payment is processed in this demo.</div></div>
      <div class="stripe"><div class="stripe-h"><span>${ic('lock')} Card details are sent directly to</span><b>stripe</b></div><div class="stripe-b">
        ${inp('cardName', 'Name on card', { ac: 'cc-name' })}
        <div class="field cardnum"><label for="co-cardNum">Card number</label><div style="position:relative"><input class="input ${ui.errs.cardNum ? 'err' : ''}" id="co-cardNum" data-co="cardNum" value="${esc(c.cardNum)}" inputmode="numeric" autocomplete="cc-number"><span class="brandmark">VISA</span></div>${ui.errs.cardNum ? `<span class="errtxt">${ui.errs.cardNum}</span>` : ''}</div>
        <div class="grid2 keep">${inp('exp', 'Expiry (MM / YY)', { ac: 'cc-exp' })}${inp('cvc', 'Security code', { ac: 'cc-csc' })}</div>
      </div></div>
      <label class="chk"><input type="checkbox" data-chg="billSame" ${c.billSame ? 'checked' : ''}>Billing address is the same as shipping</label>
      <div><button class="btn btn-dark" data-act="coNext">Continue to Review</button></div>`,
    () => `<div class="stack" style="gap:12px">${S.cart.map(l => { const p = P(l.id); return `<div class="mini-line"><div class="pimg">${art(p.art)}<span class="q">${l.qty}</span></div><div><b style="font-size:14px">${esc(p.brand)} ${esc(p.name)}</b><div style="margin-top:6px;display:inline-flex">${fitBadge(p)}</div></div><b class="num">${money(eff(p) * l.qty)}</b></div>`; }).join('')}</div>
      <hr class="hr"><dl class="kv"><dt>Ship to</dt><dd>${summaries[1]}</dd><dt>Shipping</dt><dd>${summaries[2]}</dd><dt>Estimated delivery</dt><dd>${etaRange(c.ship)}</dd><dt>Payment</dt><dd>${summaries[3]}</dd>${v ? `<dt>Vehicle</dt><dd>${esc(vname(v))} · ${esc(v.engine)}</dd>` : ''}</dl>
      <hr class="hr"><div class="stack" style="gap:8px">
        <div class="sumrow"><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.disc ? `<div class="sumrow disc"><span>Discount (TURBO10)</span><span>−${money(t.disc)}</span></div>` : ''}
        <div class="sumrow"><span>Shipping</span><span>${t.ship ? money(t.ship) : 'FREE'}</span></div><div class="sumrow"><span>Tax</span><span>${money(t.tax)}</span></div>
        <div class="sumrow total"><span>Total</span><span>${money(t.total)}</span></div></div>
      <p class="small muted">By placing your order you agree to TurboBolton's Terms of Sale and Return Policy.</p>
      <button class="btn btn-primary btn-lg btn-block" data-act="placeOrder">${ic('lock')}Place Order · ${money(t.total)}</button>`,
  ];
  return `<div class="co-hdr"><div class="wrap">${logo()}<span class="secure">${ic('lock')}Secure checkout</span></div></div>
  <div class="wrap">
    <div class="co-steps" aria-label="Checkout progress">${CO_STEPS.map((s, i) => `<div class="${i + 1 < step ? 'done' : i + 1 === step ? 'on' : ''}">Step ${i + 1} · ${s}</div>`).join('')}</div>
    <div class="co-l">
      <div>${CO_STEPS.map((s, i) => { const n = i + 1, state = n < step ? 'done' : n === step ? 'on' : 'todo';
        return `<section class="co-step ${state}"><div class="co-step-h"><span class="n">${state === 'done' ? ic('check') : n}</span><h3>${s}</h3>${state === 'done' ? `<button class="btn-link edit" data-act="coEdit" data-s="${n}">Edit</button>` : ''}</div>
          ${state === 'done' && summaries[i] ? `<div class="co-step-sum">${summaries[i]}</div>` : ''}${state === 'on' ? `<div class="co-step-b">${bodies[i]()}</div>` : ''}</section>`; }).join('')}
        <button class="btn btn-ghost btn-sm" data-go="cart">${ic('chevL')}Return to cart</button></div>
      <aside class="card summary">
        <h3>Order Summary</h3>
        ${S.cart.map(l => { const p = P(l.id); return `<div class="mini-line"><div class="pimg">${art(p.art)}<span class="q">${l.qty}</span></div><span style="font-size:13px;font-weight:600;line-height:1.3">${esc(p.brand)} ${esc(p.name)}</span><b class="num" style="font-size:14px">${money(eff(p) * l.qty)}</b></div>`; }).join('')}
        <hr class="hr">
        <div class="sumrow"><span>Subtotal</span><span>${money(t.sub)}</span></div>
        ${t.disc ? `<div class="sumrow disc"><span>Discount</span><span>−${money(t.disc)}</span></div>` : ''}
        <div class="sumrow"><span>Shipping</span><span>${step >= 3 ? (t.ship ? money(t.ship) : 'FREE') : '<span class="muted small">Next steps</span>'}</span></div>
        <div class="sumrow"><span>Tax</span><span>${money(t.tax)}</span></div>
        <div class="sumrow total"><span>Total</span><span>${money(t.total)}</span></div>
        ${v ? `<div class="fit fit-ok">${ic('check')}All parts checked against your ${esc(vname(v))}</div>` : ''}
        <div class="secure">${ic('lock')}256-bit encryption · Stripe</div>
      </aside>
    </div></div>`;
}
function validateStep(n) {
  const c = S.co, e = {};
  const req = (f, msg) => { if (!String(c[f] || '').trim()) e[f] = msg; };
  if (n === 1) { if (!/^\S+@\S+\.\S+$/.test(c.email)) e.email = 'Enter an email like name@example.com'; req('phone', 'Enter a phone number'); }
  if (n === 2) { req('first', 'Enter a first name'); req('last', 'Enter a last name'); req('addr1', 'Enter a street address'); req('city', 'Enter a city'); if (!/^\d{5}$/.test(c.zip)) e.zip = 'Enter a 5-digit ZIP code'; }
  if (n === 4) { if (c.cardNum.replace(/\D/g, '').length !== 16) e.cardNum = 'Enter the 16-digit card number'; if (!/^\d{2}\s*\/\s*\d{2}$/.test(c.exp)) e.exp = 'Use MM / YY'; if (!/^\d{3,4}$/.test(c.cvc)) e.cvc = 'Enter 3 or 4 digits'; req('cardName', 'Enter the name on the card'); }
  ui.errs = e; return !Object.keys(e).length;
}

/* ==========================================================
   Confirmation & tracking
   ========================================================== */
const TL = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
const TL_IC = ['doc', 'card', 'box', 'truck', 'pin', 'home'];
const doneIdx = s => ({ New: 1, Processing: 2, Shipped: 3, Delivered: 5 }[s]);
function noOrder() { return `<div class="card empty" style="margin:40px 0">${ic('box')}<h2>No demo order yet</h2><p class="muted">Place an order on the storefront first. The fastest path: add the Brembo kit and check out.</p><div class="row" style="justify-content:center"><button class="btn btn-primary" data-go="p-brembo-gt6">Open Brembo kit</button><button class="btn" data-act="seedOrder">Create sample order</button></div></div>`; }
function orderItems(o) {
  return o.items.map(l => { const p = P(l.id); return `<div class="mini-line"><div class="pimg">${art(p.art)}<span class="q">${l.qty}</span></div><div><b style="font-size:14px">${esc(p.brand)} ${esc(p.name)}</b><div class="small muted">SKU <span class="mono">${esc(p.sku)}</span> · ${money(l.price)} each</div></div><b class="num">${money(l.price * l.qty)}</b></div>`; }).join('');
}
function orderTotals(o) {
  const t = o.totals;
  return `<div class="stack" style="gap:8px"><div class="sumrow"><span>Subtotal</span><span>${money(t.sub)}</span></div>${t.disc ? `<div class="sumrow disc"><span>Discount (TURBO10)</span><span>−${money(t.disc)}</span></div>` : ''}<div class="sumrow"><span>Shipping</span><span>${t.ship ? money(t.ship) : 'FREE'}</span></div><div class="sumrow"><span>Tax</span><span>${money(t.tax)}</span></div><div class="sumrow total"><span>Total paid</span><span>${money(t.total)}</span></div></div>`;
}
const addrBlock = a => `${esc(a.first)} ${esc(a.last)}<br>${esc(a.addr1)}${a.addr2 ? ', ' + esc(a.addr2) : ''}<br>${esc(a.city)}, ${esc(a.state)} ${esc(a.zip)}<br>${esc(a.country)}`;
function vConfirm() {
  const o = S.order;
  if (!o) return `<div class="wrap">${noOrder()}</div>`;
  const m = SHIP_METHODS.find(x => x.id === o.ship);
  return `<div class="wrap" style="padding-bottom:56px">
    <div class="conf-hero"><span class="big-check">${ic('check')}</span><h1>Thank You for Your Order</h1>
      <p class="muted" style="font-size:17px">Order <b class="mono" style="color:var(--text)">${o.num}</b> is confirmed. A receipt is on its way to <b style="color:var(--text)">${esc(o.addr.email)}</b>.</p>
      <div class="row" style="justify-content:center;margin-top:10px"><button class="btn btn-primary" data-go="track">${ic('truck')}Track Order</button><button class="btn btn-dark" data-go="account-order">View Order</button><button class="btn" data-act="shopVehicle">Continue Shopping</button></div></div>
    <div class="conf-grid">
      <div class="card pad stack"><h3>Products purchased</h3>${orderItems(o)}<hr class="hr">${orderTotals(o)}</div>
      <div class="stack">
        <div class="card pad stack" style="gap:10px"><h3>Delivery</h3><dl class="kv"><dt>Ship to</dt><dd>${addrBlock(o.addr)}</dd><dt>Method</dt><dd>${m.name} (${m.eta})</dd><dt>Estimated delivery</dt><dd><b>${o.eta}</b></dd>${o.vehicle ? `<dt>Vehicle</dt><dd>${esc(vname(o.vehicle))}</dd>` : ''}</dl></div>
        <div class="card pad stack" style="gap:10px"><h3>Payment</h3><dl class="kv"><dt>Method</dt><dd>Visa ending in ${o.last4}</dd><dt>Status</dt><dd><span class="badge badge-ok">${ic('check')}Paid ${money(o.totals.total)}</span></dd><dt>Processor</dt><dd>Stripe (test mode)</dd></dl></div>
        <div class="callout info">${ic('info')}<div><b>What happens next:</b> our team picks and packs your order, then emails tracking as soon as it ships.</div></div>
      </div>
    </div></div>`;
}
function timeline(o) {
  const di = doneIdx(o.status);
  const at = name => { const h = o.history.find(x => x.s === name); return h ? fmtTime(h.t) : ''; };
  return `<div class="timeline">${TL.map((s, i) => { const st = i <= di ? 'done' : i === di + 1 ? 'cur' : 'todo';
    return `<div class="tl-step ${st}"><span class="tl-dot">${st === 'done' ? ic('check') : ic(TL_IC[i])}</span><span class="tl-txt"><b>${s}</b><small>${st === 'done' ? at(s) || 'Complete' : st === 'cur' ? 'Up next' : 'Pending'}</small></span></div>`; }).join('')}</div>`;
}
function vTrack() {
  const o = S.order;
  if (!o) return `<div class="wrap">${crumbs([['Home', 'home'], ['Track order', '']])}${noOrder()}</div>`;
  const shipped = o.status === 'Shipped' || o.status === 'Delivered';
  return `<div class="wrap" style="padding-bottom:56px">
    ${crumbs([['Account', 'account'], ['Orders', 'account-orders'], [o.num, '']])}
    <div class="row between" style="margin-bottom:22px"><div><h1>Track Order <span class="mono" style="font-size:.6em">${o.num}</span></h1><p class="muted" style="margin-top:6px">Placed ${fmtTime(o.placed)} · ${plural(o.items.reduce((a, l) => a + l.qty, 0), 'item')} · ${money(o.totals.total)}</p></div><div class="row"><span class="st st-${o.status}" style="font-size:13px;padding:6px 12px">${o.status === 'New' ? 'Order received' : o.status}</span><button class="btn btn-sm" data-act="refresh">${ic('refresh')}Refresh</button></div></div>
    <div class="card pad" style="padding:28px 20px">${timeline(o)}</div>
    <div class="tracking-box" style="margin-top:16px">
      <div><small>Carrier</small><b>${shipped ? esc(o.carrier) : '—'}</b><span class="small muted">${shipped ? SHIP_METHODS.find(x => x.id === o.ship).name : 'Assigned when shipped'}</span></div>
      <div><small>Tracking number</small><b class="mono">${shipped ? esc(o.tracking) : '—'}</b>${shipped ? `<button class="btn-link small" data-act="copy" data-v="${esc(o.tracking)}">${ic('copy')}Copy</button>` : '<span class="small muted">Emailed when your order ships</span>'}</div>
      <div><small>Estimated delivery</small><b>${o.status === 'Delivered' ? 'Delivered ' + fmtDate(o.history.find(h => h.s === 'Delivered').t) : o.eta}</b><span class="small muted">to ${esc(o.addr.city)}, ${esc(o.addr.state)} ${esc(o.addr.zip)}</span></div>
    </div>
    ${!shipped ? `<div class="callout" style="margin-top:16px">${ic('info')}<div><b>Presenter tip:</b> switch to the Admin portal, open order ${o.num} and mark it Processing, then Shipped with a tracking number. Come back here and this page shows the carrier and tracking. <button class="btn-link" data-go="admin-order">Open order in Admin portal</button></div></div>` : ''}
    <div class="conf-grid" style="margin-top:20px">
      <div class="card pad stack"><h3>Items in this order</h3>${orderItems(o)}</div>
      <div class="card pad stack" style="gap:10px"><h3>Shipping to</h3><p style="font-size:14px">${addrBlock(o.addr)}</p><hr class="hr"><p class="small muted">Questions about this order? Call (800) 555-0142 and mention <span class="mono">${o.num}</span>.</p></div>
    </div></div>`;
}

/* ==========================================================
   Account
   ========================================================== */
const ACCT_NAV = [['account', 'Dashboard', 'gauge'], ['account-profile', 'Profile', 'user'], ['account-garage', 'My Garage', 'car'], ['account-orders', 'Orders', 'box'], ['account-addresses', 'Addresses', 'pin'], ['account-wishlist', 'Wishlist', 'heart'], ['account-recent', 'Recently Viewed', 'clock'], ['account-settings', 'Account Settings', 'cog']];
const PAST = [{ num: 'TB-100317', date: 'Aug 14, 2026', what: 'Michelin Pilot Sport 4S 275/35ZR19 × 4', total: 1554.47, status: 'Delivered' }, { num: 'TB-100122', date: 'Mar 3, 2026', what: 'NGK Ruthenium HX Spark Plugs, Set of 6', total: 97.36, status: 'Delivered' }];
function vAccount(r) {
  const nav = `<nav class="card acct-nav" aria-label="Account">${ACCT_NAV.map(([to, l, i]) => `<button class="${(r === to || (r === 'account-order' && to === 'account-orders')) ? 'on' : ''}" data-go="${to}">${ic(i)}${l}</button>`).join('')}<hr><button data-act="logout">${ic('logout')}Logout</button></nav>`;
  const title = (ACCT_NAV.find(x => x[0] === r) || [, 'Order details'])[1];
  return `<div class="wrap">${crumbs([['Home', 'home'], ['Account', r === 'account' ? '' : 'account'], ...(r === 'account' ? [] : [[title, '']])])}
    <div class="acct">${nav}<section class="stack" style="gap:20px;min-width:0">${acctPage(r)}</section></div></div>`;
}
function ordersTable() {
  const o = S.order;
  const rows = (o ? [`<tr class="click hl-new" data-go="track"><td class="mono">${o.num}</td><td>${fmtDate(o.placed)}</td><td>${o.items.map(l => esc(P(l.id).brand + ' ' + P(l.id).name)).join(', ')}</td><td class="r num">${money(o.totals.total)}</td><td><span class="st st-${o.status}">${o.status}</span></td><td><button class="btn btn-sm" data-go="track">Track</button></td></tr>`] : [])
    .concat(PAST.map(x => `<tr><td class="mono">${x.num}</td><td>${x.date}</td><td>${x.what}</td><td class="r num">${money(x.total)}</td><td><span class="st st-${x.status}">${x.status}</span></td><td><button class="btn btn-sm" data-act="soon" data-m="Sample order history">Details</button></td></tr>`));
  return `<div class="card tbl-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Date</th><th>Items</th><th class="r">Total</th><th>Status</th><th></th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}
function acctPage(r) {
  const v = S.vehicle, o = S.order;
  switch (r) {
    case 'account': return `<div><h1>Welcome back, Daniel</h1><p class="muted" style="margin-top:6px">Member since March 2025 · daniel.okafor@example.com</p></div>
      <div class="acct-tiles">
        <div class="card pad stack" style="gap:8px"><span class="lbl muted">Active vehicle</span>${v ? `<b style="font-family:var(--f-display);font-size:22px">${esc(vname(v))}</b><span class="small muted">${esc(v.engine)}</span><button class="btn btn-sm" data-act="shopVehicle">Shop parts</button>` : `<span>No vehicle selected</span><button class="btn btn-sm" data-act="openVehicle">Select vehicle</button>`}</div>
        <div class="card pad stack" style="gap:8px"><span class="lbl muted">Latest order</span>${o ? `<b class="mono">${o.num}</b><span class="st st-${o.status}" style="align-self:flex-start">${o.status}</span><button class="btn btn-sm" data-go="track">Track order</button>` : `<b class="mono">TB-100317</b><span class="st st-Delivered" style="align-self:flex-start">Delivered</span><button class="btn btn-sm" data-go="account-orders">View orders</button>`}</div>
        <div class="card pad stack" style="gap:8px"><span class="lbl muted">Wishlist</span><b style="font-family:var(--f-display);font-size:22px">${S.wishlist.length} saved parts</b><span class="small muted">${S.garage.length + (v && !S.garage.some(g => sameV(g, v)) ? 1 : 0)} vehicles in My Garage</span><button class="btn btn-sm" data-go="account-wishlist">View wishlist</button></div>
      </div>
      <div class="stack" style="gap:10px"><div class="row between"><h3>Recent orders</h3><button class="btn-link" data-go="account-orders">All orders ${ic('arrowR')}</button></div>${ordersTable()}</div>
      <div class="stack" style="gap:10px"><h3>Recently viewed</h3><div class="pgrid">${S.recent.slice(0, 4).map(P).filter(Boolean).map(pcard).join('')}</div></div>`;
    case 'account-profile': return `<h1>Profile</h1><div class="card form-sec"><div class="grid2"><div class="field"><label for="pf1">First name</label><input class="input" id="pf1" value="Daniel"></div><div class="field"><label for="pf2">Last name</label><input class="input" id="pf2" value="Okafor"></div><div class="field"><label for="pf3">Email</label><input class="input" id="pf3" value="daniel.okafor@example.com"></div><div class="field"><label for="pf4">Phone</label><input class="input" id="pf4" value="(512) 555-0187"></div></div><div><button class="btn btn-dark" data-act="soon" data-m="Profile saved">Save changes</button></div></div>`;
    case 'account-garage': {
      const list = S.garage.slice();
      if (v && !list.some(g => sameV(g, v))) list.unshift({ id: 'active', ...v, unsaved: true });
      return `<div class="row between"><div><h1>My Garage</h1><p class="muted" style="margin-top:6px">Save your vehicles. The active vehicle shows fitment on every product.</p></div><button class="btn btn-primary" data-act="addVehicle">${ic('plus')}Add Another Vehicle</button></div>
      <div class="garage-grid">${list.map(g => { const active = sameV(g, v);
        return `<div class="card vcard ${active ? 'active' : ''}"><div class="vc-top"><span class="vc-ic">${ic('car')}</span><div style="flex:1;min-width:0"><div class="row" style="gap:8px">${active ? `<span class="badge badge-ok">${ic('check')}Active vehicle</span>` : ''}${g.unsaved ? '<span class="badge badge-warn">Not saved</span>' : ''}</div><div class="vc-n" style="margin-top:6px">${esc(vname(g))}</div><div class="small muted">${esc(g.engine)}</div></div></div>
          ${ui.confirmRemove === g.id ? `<div class="callout" style="padding:10px 12px">${ic('alert')}<div>Remove ${esc(vname(g))} from My Garage? <div class="row" style="margin-top:8px"><button class="btn btn-sm btn-dark" data-act="removeVehicle" data-id="${g.id}">Remove</button><button class="btn btn-sm" data-act="cancelRemove">Cancel</button></div></div></div>` :
          `<div class="vc-acts"><button class="btn btn-sm btn-primary" data-act="shopGarage" data-id="${g.id}">${ic('search')}Shop Parts</button>${!active && !g.unsaved ? `<button class="btn btn-sm btn-dark" data-act="setActive" data-id="${g.id}">${ic('check')}Set as active</button>` : ''}${g.unsaved ? `<button class="btn btn-sm btn-dark" data-act="saveGarage">${ic('plus')}Save</button>` : `<button class="btn btn-sm" data-act="editVehicle" data-id="${g.id}">${ic('edit')}Edit Vehicle</button><button class="btn btn-sm btn-ghost" data-act="askRemove" data-id="${g.id}" style="color:var(--err)">${ic('trash')}Remove Vehicle</button>`}</div>`}</div>`; }).join('')}
        <button class="addveh" data-act="addVehicle">${ic('plus')}Add Another Vehicle</button></div>`;
    }
    case 'account-orders': return `<h1>Orders</h1>${ordersTable()}`;
    case 'account-order': {
      if (!o) return noOrder();
      const m = SHIP_METHODS.find(x => x.id === o.ship);
      return `<div class="row between"><div><h1>Order <span class="mono" style="font-size:.7em">${o.num}</span></h1><p class="muted" style="margin-top:6px">Placed ${fmtTime(o.placed)}</p></div><div class="row"><span class="st st-${o.status}">${o.status}</span><button class="btn btn-primary btn-sm" data-go="track">${ic('truck')}Track Order</button></div></div>
        <div class="card pad stack">${orderItems(o)}<hr class="hr">${orderTotals(o)}</div>
        <div class="grid2"><div class="card pad stack" style="gap:8px"><h4>Shipping address</h4><p class="small">${addrBlock(o.addr)}</p></div><div class="card pad stack" style="gap:8px"><h4>Delivery & payment</h4><p class="small">${m.name} · ${m.eta}<br>Estimated ${o.eta}<br>Visa ending in ${o.last4} · Paid</p></div></div>`;
    }
    case 'account-addresses': return `<div class="row between"><h1>Addresses</h1><button class="btn btn-dark btn-sm" data-act="soon" data-m="Address form opens here">${ic('plus')}Add address</button></div>
      <div class="garage-grid"><div class="card pad stack" style="gap:8px"><span class="badge badge-dark" style="align-self:flex-start">Default shipping</span><p>${addrBlock(S.co)}</p><div class="row"><button class="btn btn-sm">Edit</button></div></div>
      <div class="card pad stack" style="gap:8px"><span class="badge" style="align-self:flex-start">Work</span><p>Daniel Okafor<br>410 Congress Ave, Floor 9<br>Austin, TX 78701<br>United States</p><div class="row"><button class="btn btn-sm">Edit</button><button class="btn btn-sm btn-ghost">Set as default</button></div></div></div>`;
    case 'account-wishlist': return `<h1>Wishlist</h1>${S.wishlist.length ? `<div class="pgrid c3">${S.wishlist.map(P).filter(Boolean).map(pcard).join('')}</div>` : `<div class="card empty">${ic('heart')}<h3>No saved parts yet</h3><p class="muted">Tap the heart on any product to save it here.</p></div>`}`;
    case 'account-recent': return `<h1>Recently Viewed</h1><div class="pgrid c3">${S.recent.map(P).filter(Boolean).map(pcard).join('')}</div>`;
    case 'account-settings': return `<h1>Account Settings</h1>
      <div class="card form-sec"><h3>Password</h3><div class="grid2"><div class="field"><label for="pw1">Current password</label><input class="input" id="pw1" type="password" value="password123"></div><div class="field"><label for="pw2">New password</label><input class="input" id="pw2" type="password" placeholder="At least 10 characters"></div></div><div><button class="btn btn-dark btn-sm" data-act="soon" data-m="Password updated">Update password</button></div></div>
      <div class="card form-sec"><h3>Email preferences</h3><label class="chk"><input type="checkbox" checked>Order and shipping updates</label><label class="chk"><input type="checkbox" checked>New parts for vehicles in My Garage</label><label class="chk"><input type="checkbox">Deals and promotions</label></div>
      <div class="card form-sec"><h3>Close account</h3><p class="small muted">Closing your account removes your garage, wishlist and saved addresses. Order history is kept for tax records.</p><div><button class="btn btn-sm" style="color:var(--err)" data-act="soon" data-m="Account closure requires email confirmation">Close account</button></div></div>`;
  }
  return '';
}
