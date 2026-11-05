/* ==========================================================
   Interactions
   ========================================================== */
function resetFilters(extra = {}) { S.f = { cats: [], brands: [], types: [], price: '', inStock: false, fitOnly: true, rating: 0, sale: false, ...extra }; S.q = ''; S.sort = 'recommended'; ui.filtersOpen = false; }
function addToCart(id, qty = 1) {
  const l = S.cart.find(x => x.id === id);
  if (l) l.qty += qty; else S.cart.push({ id, qty });
  S.saved = S.saved.filter(x => x.id !== id);
  save();
}
function rerender() { render(false); }
function createOrder() {
  const c = S.co, t = totals(S.cart, c.ship), now = new Date();
  S.order = {
    num: 'TB-' + S.seq, placed: now.toISOString(), items: S.cart.map(l => ({ id: l.id, qty: l.qty, price: eff(P(l.id)) })), totals: t,
    ship: c.ship, eta: etaRange(c.ship, now), last4: c.cardNum.replace(/\D/g, '').slice(-4) || '4242', vehicle: S.vehicle,
    addr: { first: c.first, last: c.last, addr1: c.addr1, addr2: c.addr2, city: c.city, state: c.state, zip: c.zip, country: c.country, email: c.email, phone: c.phone },
    status: 'New', carrier: null, tracking: null, payId: 'pi_3QxT8b2eZvKYlo2C0k9fN1aR',
    history: [{ s: 'Order Placed', t: now.toISOString(), by: 'Customer' }, { s: 'Payment Confirmed', t: new Date(+now + 4000).toISOString(), by: 'Stripe', note: `Visa ending in ${c.cardNum.replace(/\D/g, '').slice(-4)}` }],
  };
  S.order.items.forEach(l => { if (!P(l.id).digital) inv(l.id).reserved += l.qty; });
  S.seq++; S.cart = []; S.coupon = null; S.co.step = 1;
  save();
}

const ACT = {
  scrim(el, e) { if (e.target === el) closeModal(); },
  close() { closeModal(); ui.editVehicle = null; },
  menu() {
    openModal(`<aside class="drawer"><div class="modal-h">${logo()}<button class="icon-btn" data-act="close" aria-label="Close">${ic('x')}</button></div><div class="modal-b" style="gap:4px">
      <button class="btn btn-block" data-act="openVehicle" style="justify-content:flex-start">${ic('car')}${S.vehicle ? esc(vname(S.vehicle)) : 'Select Vehicle'}</button>
      <div class="acct-nav" style="padding:8px 0"><button data-act="shopAll">Shop all parts</button>${CATEGORIES.map(c => `<button data-act="shopCat" data-k="${esc(c.id)}">${ic(c.icon)}${esc(c.id)}</button>`).join('')}<hr><button data-go="brands">${ic('tag')}Brands</button><button data-go="deals">${ic('dollar')}Deals</button><button data-act="shopNew">${ic('bolt')}New Products</button><button data-go="support">${ic('headset')}Support</button><hr>
      <button data-go="${S.signedIn ? 'account' : 'signin'}">${ic('user')}${S.signedIn ? 'Account' : 'Sign in'}</button><button data-go="account-garage">${ic('car')}My Garage</button><button data-go="account-orders">${ic('box')}Orders</button><button data-go="account-wishlist">${ic('heart')}Wishlist</button><button data-go="track">${ic('truck')}Track order</button></div>
      <div class="small muted" style="margin-top:auto">Support (800) 555-0142</div></div></aside>`, 'side left');
  },
  nav(el) {
    const k = el.dataset.k; closeModal();
    if (k === 'shop') { resetFilters(); go('results'); }
    else if (k === 'deals') { resetFilters({ sale: true }); go('results'); }
    else if (k === 'new') { resetFilters(); S.sort = 'new'; go('results'); }
    else { if (curRoute !== 'home') go('home'); const t = $('#' + (k === 'cats' ? 'cats' : k === 'brands' ? 'brands' : 'support')); if (t) t.scrollIntoView({ behavior: 'smooth' }); }
  },
  openVehicle() { ui.editVehicle = null; ui.vs.modal = S.vehicle ? { ...S.vehicle, year: String(S.vehicle.year) } : { year: '', make: '', model: '', engine: '' }; openModal(vehicleModal()); },
  addVehicle() { ui.editVehicle = null; ui.vs.modal = { year: '', make: '', model: '', engine: '' }; openModal(vehicleModal()); },
  editVehicle(el) { const g = S.garage.find(x => x.id === el.dataset.id); ui.editVehicle = g.id; ui.vs.modal = { ...g, year: String(g.year) }; openModal(vehicleModal()); },
  fillDemo(el) { const k = el.dataset.k; ui.vs[k] = { ...DEMO_VEHICLE, year: String(DEMO_VEHICLE.year) }; $('#vsw-' + k).outerHTML = vselBlock(k, k === 'modal' ? (ui.editVehicle ? 'Save Vehicle' : 'Shop This Vehicle') : undefined); },
  applyVehicle(el) {
    const k = el.dataset.k, s = ui.vs[k];
    const v = { year: +s.year, make: s.make, model: s.model, engine: s.engine };
    if (ui.editVehicle) {
      const g = S.garage.find(x => x.id === ui.editVehicle); const wasActive = sameV(g, S.vehicle);
      Object.assign(g, v); if (wasActive) S.vehicle = v; ui.editVehicle = null; save(); closeModal(); rerender(); toast(`Vehicle updated to ${vname(v)}`); return;
    }
    S.vehicle = v; ui.ymmEdit = {}; ui.vs.bar = { ...s }; S.f.fitOnly = true; save(); closeModal();
    if (k === 'home' || curRoute === 'home' || curRoute.startsWith('account')) { resetFilters(); go('results'); }
    else rerender();
    toast(`Showing parts that fit your ${vname(v)}`);
  },
  useGarage(el) { const g = S.garage.find(x => x.id === el.dataset.id); S.vehicle = { year: g.year, make: g.make, model: g.model, engine: g.engine }; save(); closeModal(); resetFilters(); go('results'); toast(`Shopping for your ${vname(g)}`); },
  saveGarage() { const v = S.vehicle; if (!v || S.garage.some(g => sameV(g, v))) return; S.garage.unshift({ id: 'g-' + Date.now(), ...v }); save(); rerender(); toast(`${vname(v)} saved to My Garage`); },
  shopVehicle() { resetFilters(); go('results'); },
  shopGarage(el) { const g = el.dataset.id === 'active' ? S.vehicle : S.garage.find(x => x.id === el.dataset.id); S.vehicle = { year: g.year, make: g.make, model: g.model, engine: g.engine }; save(); resetFilters(); go('results'); },
  askRemove(el) { ui.confirmRemove = el.dataset.id; rerender(); },
  cancelRemove() { ui.confirmRemove = null; rerender(); },
  removeVehicle(el) { const g = S.garage.find(x => x.id === el.dataset.id); S.garage = S.garage.filter(x => x.id !== g.id); if (sameV(g, S.vehicle)) S.vehicle = null; ui.confirmRemove = null; save(); rerender(); toast(`${vname(g)} removed from My Garage`); },
  shopAll() { resetFilters(); go('results'); },
  shopDeals() { resetFilters({ sale: true }); go('results'); },
  shopNew() { resetFilters(); S.sort = 'new'; go('results'); },
  shopCat(el) { resetFilters({ cats: [el.dataset.k] }); go('results'); },
  shopBrand(el) { resetFilters({ brands: [el.dataset.k] }); go('results'); },
  toggleFilters() { ui.filtersOpen = !ui.filtersOpen; rerender(); },
  clearFilters() { const fo = S.f.fitOnly; resetFilters({ fitOnly: fo }); save(); rerender(); },
  unchip(el) { const k = el.dataset.key; if (Array.isArray(S.f[k])) S.f[k] = S.f[k].filter(x => x !== el.dataset.v); else S.f[k] = k === 'price' ? '' : false; save(); rerender(); },
  wish(el) { const id = el.dataset.id, on = S.wishlist.includes(id); S.wishlist = on ? S.wishlist.filter(x => x !== id) : [...S.wishlist, id]; save(); rerender(); toast(on ? 'Removed from wishlist' : 'Saved to your wishlist'); },
  add(el) { addToCart(el.dataset.id); rerender(); openModal(addedDrawer([el.dataset.id]), 'side'); },
  addPdp(el) { addToCart(el.dataset.id, ui.qty); rerender(); openModal(addedDrawer([el.dataset.id]), 'side'); },
  buyNow(el) { addToCart(el.dataset.id, ui.qty); go('checkout'); },
  addFbt(el) { const ids = el.dataset.ids.split(','); ids.forEach(id => addToCart(id)); rerender(); openModal(addedDrawer(ids), 'side'); },
  compare(el) {
    const id = el.dataset.id, on = S.compare.includes(id);
    if (!on && S.compare.length >= 4) { toast('You can compare up to 4 products', 'warn'); return; }
    S.compare = on ? S.compare.filter(x => x !== id) : [...S.compare, id]; save();
    const inModal = el.closest('.modal'); rerender();
    if (inModal) openModal(compareModal()); else toast(on ? 'Removed from compare' : `Added to compare (${S.compare.length} of 4)`);
  },
  openCompare() { openModal(compareModal()); },
  quickView(el) { openModal(quickViewModal(el.dataset.id)); },
  homeTab(el) { ui.homeTab = el.dataset.t; rerender(); },
  car(el) { const t = $('#' + el.dataset.id); if (t) t.scrollBy({ left: +el.dataset.d * t.clientWidth * 0.9, behavior: 'smooth' }); },
  fold(el) { ui.fold[el.dataset.k] = !ui.fold[el.dataset.k]; rerender(); },
  ymmEdit(el) { const k = el.dataset.k; ui.ymmEdit[k] = true; ui.vs[k] = { ...S.vehicle, year: String(S.vehicle.year) }; rerender(); },
  resetVs(el) { const k = el.dataset.k; ui.vs[k] = { year: '', make: '', model: '', engine: '' }; $('#vsw-' + k).outerHTML = vselBlock(k); },
  setActive(el) { const g = S.garage.find(x => x.id === el.dataset.id); S.vehicle = { year: g.year, make: g.make, model: g.model, engine: g.engine }; ui.vs.bar = null; save(); rerender(); toast(`${vname(g)} is now your active vehicle`); },
  share() { try { navigator.clipboard.writeText('https://turbobolton.example/p/' + ui.lastPid).then(() => toast('Product link copied'), () => toast('Share link: turbobolton.example/p/' + ui.lastPid, 'warn')); } catch (e) { toast('Share link: turbobolton.example/p/' + ui.lastPid, 'warn'); } },
  chat() { openModal(chatPanel(), 'side'); },
  heroVehicle() {
    if (S.vehicle) { ACT.openVehicle(); return; }
    const box = $('#selector'), sel = $('#vs-home-year');
    if (box) { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); box.classList.remove('pulse'); void box.offsetWidth; box.classList.add('pulse'); }
    if (sel) setTimeout(() => sel.focus({ preventScroll: true }), 350);
  },
  soon(el) { toast(el.dataset.m || 'Done'); },
  qty(el) { ui.qty = Math.max(1, Math.min(10, ui.qty + +el.dataset.d)); rerender(); },
  pdpImg(el) { ui.pdpImg = +el.dataset.i; rerender(); },
  pdpTab(el) { ui.pdpTab = el.dataset.t; rerender(); const t = $('#pdp-tabs'); if (t && el.closest('.pdp-meta')) t.scrollIntoView({ behavior: 'smooth' }); },
  cqty(el) { const l = S.cart.find(x => x.id === el.dataset.id); l.qty = Math.max(1, Math.min(10, l.qty + +el.dataset.d)); save(); rerender(); },
  remove(el) { const p = P(el.dataset.id); S.cart = S.cart.filter(x => x.id !== el.dataset.id); save(); rerender(); toast(`Removed ${p.brand} ${p.type.toLowerCase()} from cart`); },
  saveLater(el) { const l = S.cart.find(x => x.id === el.dataset.id); S.cart = S.cart.filter(x => x !== l); S.saved.push({ id: l.id, qty: 1 }); save(); rerender(); toast('Saved for later'); },
  moveToCart(el) { addToCart(el.dataset.id); rerender(); toast('Moved to cart'); },
  removeSaved(el) { S.saved = S.saved.filter(x => x.id !== el.dataset.id); save(); rerender(); },
  removeCoupon() { S.coupon = null; ui.couponErr = ''; save(); rerender(); },
  coNext() { const n = S.co.step; if (!validateStep(n)) { rerender(); toast('Check the highlighted fields', 'warn'); return; } S.co.step = n + 1; save(); rerender(); },
  coEdit(el) { S.co.step = +el.dataset.s; ui.errs = {}; save(); rerender(); },
  placeOrder() {
    const ov = document.createElement('div'); ov.className = 'processing';
    ov.innerHTML = `<div class="spinner"></div><h3>Confirming payment</h3><p class="muted">Securely processing with Stripe (test mode). Please don't close this page.</p>`;
    $('#overlay').appendChild(ov);
    setTimeout(() => { createOrder(); closeModal(); go('confirm'); toast(`Order ${S.order.num} placed`); }, 1600);
  },
  seedOrder() {
    if (!S.vehicle) S.vehicle = { ...DEMO_VEHICLE };
    S.cart = [{ id: 'brembo-gt6', qty: 1 }, { id: 'motul-rbf660', qty: 2 }];
    createOrder(); rerender(); toast(`Sample order ${S.order.num} created`);
  },
  refresh() { rerender(); toast('Order status is up to date'); },
  copy(el) { const v = el.dataset.v; try { navigator.clipboard.writeText(v).then(() => toast('Tracking number copied'), () => toast('Tracking number: ' + v, 'warn')); } catch (e) { toast('Tracking number: ' + v, 'warn'); } },
  logout() { S.signedIn = false; save(); toast('Signed out of the demo account'); go('home'); },

  /* admin */
  admMenu() { openModal(`<aside class="drawer" style="background:var(--ink)"><div class="modal-h" style="border-color:var(--ink-3)"><span class="logo"><span class="logo-mark">${LOGO_MARK}</span><span class="logo-word" style="color:#fff">Turbo<span>Bolton</span></span></span><button class="icon-btn" data-act="close" aria-label="Close">${ic('x')}</button></div><nav class="adm-nav" style="padding:8px 10px">${admNav(curRoute)}</nav></aside>`, 'side left'); },
  admLogout() { S.admin = false; save(); go('admin-login'); toast('Signed out of the admin portal'); },
  orderTab(el) { ui.orderTab = el.dataset.t; rerender(); },
  invTab(el) { ui.invTab = el.dataset.t; rerender(); },
  sampleOrder() { toast(`Sample order for illustration. Open ${S.order ? S.order.num : 'the demo order'} to run the workflow.`, 'warn'); },
  admStatus(el) {
    const o = S.order, s = el.dataset.s, now = new Date().toISOString();
    if (s === 'Shipped') {
      const tr = ($('#shipTrack').value || '').trim();
      if (tr.length < 8) { ui.errs = { track: 'Enter the carrier tracking number' }; rerender(); return; }
      o.carrier = $('#shipCarrier').value; o.tracking = tr;
      o.items.forEach(l => { if (!P(l.id).digital) { const iv = inv(l.id); iv.onHand -= l.qty; iv.reserved = Math.max(0, iv.reserved - l.qty); } });
      o.history.push({ s: 'Shipped', t: now, by: 'Jordan Ellis', note: `${o.carrier} ${tr}` });
    } else if (s === 'Delivered') {
      o.history.push({ s: 'Out for Delivery', t: new Date(Date.now() - 3 * 3600e3).toISOString(), by: o.carrier });
      o.history.push({ s: 'Delivered', t: now, by: o.carrier });
    } else o.history.push({ s, t: now, by: 'Jordan Ellis' });
    o.status = s; ui.errs = {}; save(); rerender();
    toast(s === 'Shipped' ? `Marked Shipped · tracking emailed to ${o.addr.first}` : `Order ${o.num} marked ${s}`);
  },
  adjust(el) { openModal(adjustModal(el.dataset.id)); },
  saveAdjust(el) {
    const id = el.dataset.id, iv = inv(id), q = Math.max(0, parseInt($('#adj-q').value, 10) || 0), t = $('#adj-type').value;
    iv.onHand = t === 'add' ? iv.onHand + q : t === 'remove' ? Math.max(0, iv.onHand - q) : q;
    save(); closeModal(); rerender(); toast(`${P(id).brand} inventory updated · ${avail(id)} available`);
  },
};

const FORMS = {
  search(f) { const q = f.querySelector('input').value.trim(); const fo = S.f.fitOnly; resetFilters({ fitOnly: fo }); S.q = q; save(); go('results'); },
  signin() { S.signedIn = true; save(); go('account'); toast('Signed in as Daniel Okafor'); },
  trackLookup(f) { const v = f.querySelector('input').value.trim().toUpperCase(); if (S.order && v === S.order.num) go('track'); else toast(v ? `No order found for ${v}. Try the demo order number.` : 'Enter an order number', 'warn'); },
  news() { toast('Thanks! Check your inbox for 10% off'); },
  coupon(f) { const v = f.querySelector('input').value.trim().toUpperCase(); if (v === 'TURBO10') { S.coupon = v; ui.couponErr = ''; toast('TURBO10 applied: 10% off'); } else { ui.couponErr = v ? `“${v}” isn't a valid code. Try TURBO10.` : 'Enter a coupon code'; } save(); rerender(); },
  admLogin() { S.admin = true; save(); go('admin'); toast('Signed in as Jordan Ellis'); },
  product(f) {
    const d = Object.fromEntries(new FormData(f).entries()), id = f.dataset.id;
    const e = {};
    if (!d.name.trim()) e.name = 'Enter a product name';
    if (!d.sku.trim()) e.sku = 'Enter a SKU';
    if (!(+d.price > 0)) e.price = 'Enter a price greater than 0';
    ui.errs = e; if (Object.keys(e).length) { rerender(); toast('Check the highlighted fields', 'warn'); return; }
    const fit = []; for (let i = 0; d['fmk-' + i] !== undefined; i++) if (d['fmk-' + i].trim()) fit.push({ make: d['fmk-' + i].trim(), model: d['fmd-' + i].trim(), from: +d['fy1-' + i], to: +d['fy2-' + i] });
    const patch = { name: d.name.trim(), sku: d.sku.trim(), brand: d.brand, cat: d.cat, desc: d.desc, price: +d.price, sale: d.sale === '' ? null : +d.sale, cost: d.cost === '' ? null : +d.cost, status: d.status, fit: fit.length ? fit : 'universal' };
    if (id) { S.edits[id] = { ...(S.edits[id] || {}), ...patch }; Object.assign(inv(id), { onHand: +d.stock || 0, threshold: +d.threshold || 0 }); }
    else {
      const nid = 'new-' + Date.now();
      S.added.push({ id: nid, ...patch, type: d.cat, rating: 0, reviews: 0, art: CAT_ART[d.cat], sold: 0, added: new Date().toISOString().slice(0, 10), blurb: '', features: [], specs: [], install: [], warranty: '', onHand: +d.stock || 0, threshold: +d.threshold || 0 });
      S.inv[nid] = { onHand: +d.stock || 0, reserved: 0, threshold: +d.threshold || 0 };
    }
    save(); go('admin-products'); toast(`${patch.name} saved${patch.status === 'Draft' ? ' as draft' : ''}`);
  },
};

const CHG = {
  facet(el) { const k = el.dataset.key; S.f[k] = el.checked ? [...S.f[k], el.value] : S.f[k].filter(x => x !== el.value); save(); rerender(); },
  fitOnly(el) { S.f.fitOnly = el.checked; save(); rerender(); },
  inStock(el) { S.f.inStock = el.checked; save(); rerender(); },
  sale(el) { S.f.sale = el.checked; save(); rerender(); },
  price(el) { S.f.price = el.value; save(); rerender(); },
  rating(el) { S.f.rating = +el.value; save(); rerender(); },
  sort(el) { S.sort = el.value; save(); rerender(); },
  ship(el) { S.co.ship = el.value; save(); rerender(); },
  billSame(el) { S.co.billSame = el.checked; save(); },
  apq(el) { ui.apq = el.value; rerender(); const i = $('#apq'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } },
  apcat(el) { ui.apcat = el.value; rerender(); },
};

document.addEventListener('click', e => {
  let a = e.target.closest('[data-act]');
  if (a && a.dataset.act === 'scrim' && e.target !== a) a = null;
  if (a && ACT[a.dataset.act]) { if (a.tagName !== 'INPUT') e.preventDefault(); ACT[a.dataset.act](a, e); return; }
  const g = e.target.closest('[data-go]');
  if (g) { e.preventDefault(); go(g.dataset.go); return; }
  const area = e.target.closest('[data-area]');
  if (area) { const k = area.dataset.area; go(k === 'brief' ? 'brief' : k === 'system' ? 'system' : k === 'admin' ? (S.admin ? 'admin' : 'admin-login') : 'home'); return; }
  const dev = e.target.closest('[data-dev]');
  if (dev) { S.device = dev.dataset.dev; save(); paintDemoBar(); return; }
  if (e.target.closest('#resetDemo')) { const d = S.device; S = defaults(); S.device = d; ui.vs = {}; ui.lastPid = null; save(); go('brief'); toast('Demo reset to a fresh start'); }
});
document.addEventListener('submit', e => { e.preventDefault(); const f = e.target.dataset.form; if (FORMS[f]) FORMS[f](e.target); });
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.vs) {
    const [key, field] = t.dataset.vs.split(':'); const s = vsState(key);
    s[field] = t.value;
    const order = ['year', 'make', 'model', 'engine'];
    order.slice(order.indexOf(field) + 1).forEach(f => s[f] = '');
    if (field !== 'engine' && s.year && s.make && s.model) { const en = enginesFor(+s.year, s.make, s.model); if (en.length === 1) s.engine = en[0]; }
    $('#vsw-' + key).outerHTML = vselBlock(key, key === 'modal' ? (ui.editVehicle ? 'Save Vehicle' : 'Shop This Vehicle') : undefined);
    const next = order.find(f => !s[f]);
    const el = next ? $(`#vs-${key}-${next}`) : $(`#vsw-${key} [data-act="applyVehicle"]`);
    if (el) el.focus();
    return;
  }
  if (t.dataset.chg && CHG[t.dataset.chg]) CHG[t.dataset.chg](t);
});
document.addEventListener('input', e => { const t = e.target; if (t.dataset.co) { S.co[t.dataset.co] = t.value; save(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#overlay').innerHTML) closeModal(); });

ACT.dsModal = () => openModal(modal('Remove vehicle?', `<p>Remove <b>2020 Toyota GR Supra</b> from My Garage? Products will no longer show fitment for this vehicle.</p>`, `<button class="btn" data-act="close">Cancel</button><button class="btn btn-dark" data-act="close">Remove vehicle</button>`));

/* ---------- Boot ---------- */
document.body.insertAdjacentHTML('afterbegin', ART_DEFS);
render(true);
