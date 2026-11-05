/* ==========================================================
   Interactions. `useActions()` returns plain functions that
   components call from event handlers; they replace the
   legacy data-act / data-form / data-chg delegation tables.
   ========================================================== */
import { DEMO_VEHICLE, enginesFor } from '../data';
import { CAT_ART, EMPTY_VS, sameV, vname } from '../lib/util';
import { P, eff, etaRange, totals, validateStep, inv, avail } from './selectors';
import { defaults, useStore } from './StoreContext';

const FILTERS0 = () => ({ cats: [], brands: [], types: [], price: '', inStock: false, fitOnly: true, rating: 0, sale: false });

/* Mutators that run inside an immer draft */
function resetFiltersIn(s, extra = {}) { s.f = { ...FILTERS0(), ...extra }; s.q = ''; s.sort = 'recommended'; }
function addToCartIn(s, id, qty = 1) {
  const l = s.cart.find(x => x.id === id);
  if (l) l.qty += qty; else s.cart.push({ id, qty });
  s.saved = s.saved.filter(x => x.id !== id);
}
function invIn(s, id) { return s.inv[id] || (s.inv[id] = { onHand: 0, reserved: 0, threshold: 0 }); }
function createOrderIn(s) {
  const c = s.co, t = totals(s, s.cart, c.ship), now = new Date();
  s.order = {
    num: 'TB-' + s.seq, placed: now.toISOString(), items: s.cart.map(l => ({ id: l.id, qty: l.qty, price: eff(P(s, l.id)) })), totals: t,
    ship: c.ship, eta: etaRange(c.ship, now), last4: c.cardNum.replace(/\D/g, '').slice(-4) || '4242', vehicle: s.vehicle,
    addr: { first: c.first, last: c.last, addr1: c.addr1, addr2: c.addr2, city: c.city, state: c.state, zip: c.zip, country: c.country, email: c.email, phone: c.phone },
    status: 'New', carrier: null, tracking: null, payId: 'pi_3QxT8b2eZvKYlo2C0k9fN1aR',
    history: [{ s: 'Order Placed', t: now.toISOString(), by: 'Customer' }, { s: 'Payment Confirmed', t: new Date(+now + 4000).toISOString(), by: 'Stripe', note: `Visa ending in ${c.cardNum.replace(/\D/g, '').slice(-4)}` }],
  };
  s.order.items.forEach(l => { if (!P(s, l.id).digital) invIn(s, l.id).reserved += l.qty; });
  s.seq++; s.cart = []; s.coupon = null; s.co.step = 1;
}

export function useActions() {
  const { S, ui, route, update, setUi, setS, setUiState, go, openModal, closeModal, toast } = useStore();

  const resetFilters = (extra = {}) => { update(s => resetFiltersIn(s, extra)); setUi(u => { u.filtersOpen = false; }); };
  const toVehicle = g => ({ year: g.year, make: g.make, model: g.model, engine: g.engine });
  const vsOf = k => ui.vs[k] || EMPTY_VS();

  const A = {
    /* ---------- overlays ---------- */
    close() { closeModal(); setUi(u => { u.editVehicle = null; }); },
    menu() { openModal('menu', {}, 'side left'); },
    chat() { openModal('chat', {}, 'side'); },
    openCompare() { openModal('compare'); },
    quickView(id) { openModal('quickView', { id }); },
    dsModal() { openModal('dsModal'); },

    /* ---------- vehicle ---------- */
    openVehicle() {
      setUi(u => { u.editVehicle = null; u.vs.modal = S.vehicle ? { ...S.vehicle, year: String(S.vehicle.year) } : EMPTY_VS(); });
      openModal('vehicle');
    },
    addVehicle() { setUi(u => { u.editVehicle = null; u.vs.modal = EMPTY_VS(); }); openModal('vehicle'); },
    editVehicle(id) {
      const g = S.garage.find(x => x.id === id);
      setUi(u => { u.editVehicle = g.id; u.vs.modal = { ...g, year: String(g.year) }; });
      openModal('vehicle');
    },
    fillDemo(k) { setUi(u => { u.vs[k] = { ...DEMO_VEHICLE, year: String(DEMO_VEHICLE.year) }; }); },
    resetVs(k) { setUi(u => { u.vs[k] = EMPTY_VS(); }); },
    vsChange(k, field, value) {
      const s = { ...vsOf(k) };
      s[field] = value;
      const order = ['year', 'make', 'model', 'engine'];
      order.slice(order.indexOf(field) + 1).forEach(f => { s[f] = ''; });
      if (field !== 'engine' && s.year && s.make && s.model) { const en = enginesFor(+s.year, s.make, s.model); if (en.length === 1) s.engine = en[0]; }
      setUi(u => { u.vs[k] = s; });
      const next = order.find(f => !s[f]);
      setTimeout(() => {
        const el = next ? document.getElementById(`vs-${k}-${next}`) : document.querySelector(`#vsw-${k} [data-apply]`);
        if (el) el.focus();
      }, 0);
    },
    applyVehicle(k) {
      const s0 = vsOf(k);
      const v = { year: +s0.year, make: s0.make, model: s0.model, engine: s0.engine };
      if (ui.editVehicle) {
        const id = ui.editVehicle;
        const g = S.garage.find(x => x.id === id);
        const wasActive = sameV(g, S.vehicle);
        update(s => { const gg = s.garage.find(x => x.id === id); Object.assign(gg, v); if (wasActive) s.vehicle = v; });
        setUi(u => { u.editVehicle = null; });
        closeModal();
        toast(`Vehicle updated to ${vname(v)}`);
        return;
      }
      update(s => { s.vehicle = v; s.f.fitOnly = true; });
      setUi(u => { u.ymmEdit = {}; u.vs.bar = { ...s0 }; });
      closeModal();
      if (k === 'home' || route === 'home' || route.startsWith('account')) { resetFilters(); go('results'); }
      toast(`Showing parts that fit your ${vname(v)}`);
    },
    useGarage(id) {
      const g = S.garage.find(x => x.id === id);
      update(s => { s.vehicle = toVehicle(g); });
      closeModal(); resetFilters(); go('results');
      toast(`Shopping for your ${vname(g)}`);
    },
    saveGarage() {
      const v = S.vehicle; if (!v || S.garage.some(g => sameV(g, v))) return;
      update(s => { s.garage.unshift({ id: 'g-' + Date.now(), ...v }); });
      toast(`${vname(v)} saved to My Garage`);
    },
    shopVehicle() { resetFilters(); go('results'); },
    shopGarage(id) {
      const g = id === 'active' ? S.vehicle : S.garage.find(x => x.id === id);
      update(s => { s.vehicle = toVehicle(g); });
      resetFilters(); go('results');
    },
    askRemove(id) { setUi(u => { u.confirmRemove = id; }); },
    cancelRemove() { setUi(u => { u.confirmRemove = null; }); },
    removeVehicle(id) {
      const g = S.garage.find(x => x.id === id);
      update(s => { s.garage = s.garage.filter(x => x.id !== g.id); if (sameV(g, s.vehicle)) s.vehicle = null; });
      setUi(u => { u.confirmRemove = null; });
      toast(`${vname(g)} removed from My Garage`);
    },
    setActive(id) {
      const g = S.garage.find(x => x.id === id);
      update(s => { s.vehicle = toVehicle(g); });
      setUi(u => { u.vs.bar = null; });
      toast(`${vname(g)} is now your active vehicle`);
    },
    ymmEdit(k) { setUi(u => { u.ymmEdit[k] = true; u.vs[k] = { ...S.vehicle, year: String(S.vehicle.year) }; }); },
    heroVehicle() {
      if (S.vehicle) { A.openVehicle(); return; }
      const box = document.getElementById('selector'), sel = document.getElementById('vs-home-year');
      if (box) { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); box.classList.remove('pulse'); void box.offsetWidth; box.classList.add('pulse'); }
      if (sel) setTimeout(() => sel.focus({ preventScroll: true }), 350);
    },

    /* ---------- browsing ---------- */
    shopAll() { resetFilters(); go('results'); },
    shopDeals() { resetFilters({ sale: true }); go('results'); },
    shopNew() { update(s => { resetFiltersIn(s); s.sort = 'new'; }); setUi(u => { u.filtersOpen = false; }); go('results'); },
    shopCat(k) { resetFilters({ cats: [k] }); go('results'); },
    shopBrand(k) { resetFilters({ brands: [k] }); go('results'); },
    toggleFilters() { setUi(u => { u.filtersOpen = !u.filtersOpen; }); },
    clearFilters() { const fo = S.f.fitOnly; resetFilters({ fitOnly: fo }); },
    unchip(key, v) { update(s => { if (Array.isArray(s.f[key])) s.f[key] = s.f[key].filter(x => x !== v); else s.f[key] = key === 'price' ? '' : false; }); },
    facet(key, value, checked) { update(s => { s.f[key] = checked ? [...s.f[key], value] : s.f[key].filter(x => x !== value); }); },
    fitOnly(c) { update(s => { s.f.fitOnly = c; }); },
    inStock(c) { update(s => { s.f.inStock = c; }); },
    sale(c) { update(s => { s.f.sale = c; }); },
    price(v) { update(s => { s.f.price = v; }); },
    rating(v) { update(s => { s.f.rating = +v; }); },
    sort(v) { update(s => { s.sort = v; }); },
    fold(k) { setUi(u => { u.fold[k] = !u.fold[k]; }); },
    homeTab(t) { setUi(u => { u.homeTab = t; }); },
    search(q) { const fo = S.f.fitOnly; update(s => { resetFiltersIn(s, { fitOnly: fo }); s.q = q; }); setUi(u => { u.filtersOpen = false; }); go('results'); },

    /* ---------- product ---------- */
    wish(id) {
      const on = S.wishlist.includes(id);
      update(s => { s.wishlist = on ? s.wishlist.filter(x => x !== id) : [...s.wishlist, id]; });
      toast(on ? 'Removed from wishlist' : 'Saved to your wishlist');
    },
    add(id) { update(s => addToCartIn(s, id)); openModal('added', { ids: [id] }, 'side'); },
    addPdp(id) { update(s => addToCartIn(s, id, ui.qty)); openModal('added', { ids: [id] }, 'side'); },
    buyNow(id) { update(s => addToCartIn(s, id, ui.qty)); go('checkout'); },
    addFbt(ids) { update(s => ids.forEach(id => addToCartIn(s, id))); openModal('added', { ids }, 'side'); },
    compare(id, fromModal = false) {
      const on = S.compare.includes(id);
      if (!on && S.compare.length >= 4) { toast('You can compare up to 4 products', 'warn'); return; }
      const n = on ? S.compare.length - 1 : S.compare.length + 1;
      update(s => { s.compare = on ? s.compare.filter(x => x !== id) : [...s.compare, id]; });
      if (!fromModal) toast(on ? 'Removed from compare' : `Added to compare (${n} of 4)`);
    },
    qty(d) { setUi(u => { u.qty = Math.max(1, Math.min(10, u.qty + d)); }); },
    pdpImg(i) { setUi(u => { u.pdpImg = i; }); },
    pdpTab(t, scroll = false) {
      setUi(u => { u.pdpTab = t; });
      if (scroll) { const el = document.getElementById('pdp-tabs'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }
    },
    share() {
      const url = 'https://turbobolton.example/p/' + ui.lastPid;
      try { navigator.clipboard.writeText(url).then(() => toast('Product link copied'), () => toast('Share link: turbobolton.example/p/' + ui.lastPid, 'warn')); }
      catch (e) { toast('Share link: turbobolton.example/p/' + ui.lastPid, 'warn'); }
    },
    soon(m) { toast(m || 'Done'); },

    /* ---------- cart & checkout ---------- */
    cqty(id, d) { update(s => { const l = s.cart.find(x => x.id === id); l.qty = Math.max(1, Math.min(10, l.qty + d)); }); },
    remove(id) { const p = P(S, id); update(s => { s.cart = s.cart.filter(x => x.id !== id); }); toast(`Removed ${p.brand} ${p.type.toLowerCase()} from cart`); },
    saveLater(id) { update(s => { const l = s.cart.find(x => x.id === id); s.cart = s.cart.filter(x => x !== l); s.saved.push({ id: l.id, qty: 1 }); }); toast('Saved for later'); },
    moveToCart(id) { update(s => addToCartIn(s, id)); toast('Moved to cart'); },
    removeSaved(id) { update(s => { s.saved = s.saved.filter(x => x.id !== id); }); },
    coupon(v) {
      const code = v.trim().toUpperCase();
      if (code === 'TURBO10') { update(s => { s.coupon = code; }); setUi(u => { u.couponErr = ''; }); toast('TURBO10 applied: 10% off'); }
      else setUi(u => { u.couponErr = code ? `“${code}” isn't a valid code. Try TURBO10.` : 'Enter a coupon code'; });
    },
    removeCoupon() { update(s => { s.coupon = null; }); setUi(u => { u.couponErr = ''; }); },
    coInput(f, v) { update(s => { s.co[f] = v; }); },
    ship(v) { update(s => { s.co.ship = v; }); },
    billSame(c) { update(s => { s.co.billSame = c; }); },
    coNext() {
      const n = S.co.step, e = validateStep(S, n);
      setUi(u => { u.errs = e; });
      if (Object.keys(e).length) { toast('Check the highlighted fields', 'warn'); return; }
      update(s => { s.co.step = n + 1; });
    },
    coEdit(n) { update(s => { s.co.step = n; }); setUi(u => { u.errs = {}; }); },
    placeOrder() {
      const num = 'TB-' + S.seq;
      setUi(u => { u.processing = true; });
      setTimeout(() => {
        update(s => createOrderIn(s));
        setUi(u => { u.processing = false; });
        closeModal(); go('confirm');
        toast(`Order ${num} placed`);
      }, 1600);
    },
    seedOrder() {
      const num = 'TB-' + S.seq;
      update(s => { if (!s.vehicle) s.vehicle = { ...DEMO_VEHICLE }; s.cart = [{ id: 'brembo-gt6', qty: 1 }, { id: 'motul-rbf660', qty: 2 }]; createOrderIn(s); });
      toast(`Sample order ${num} created`);
    },
    refresh() { toast('Order status is up to date'); },
    copy(v) {
      try { navigator.clipboard.writeText(v).then(() => toast('Tracking number copied'), () => toast('Tracking number: ' + v, 'warn')); }
      catch (e) { toast('Tracking number: ' + v, 'warn'); }
    },
    trackLookup(v) {
      const num = v.trim().toUpperCase();
      if (S.order && num === S.order.num) go('track');
      else toast(num ? `No order found for ${num}. Try the demo order number.` : 'Enter an order number', 'warn');
    },
    news() { toast('Thanks! Check your inbox for 10% off'); },
    signin() { update(s => { s.signedIn = true; }); go('account'); toast('Signed in as Daniel Okafor'); },
    logout() { update(s => { s.signedIn = false; }); toast('Signed out of the demo account'); go('home'); },

    /* ---------- admin ---------- */
    admLogin() { update(s => { s.admin = true; }); go('admin'); toast('Signed in as Jordan Ellis'); },
    admMenu() { openModal('admMenu', {}, 'side left'); },
    admLogout() { update(s => { s.admin = false; }); go('admin-login'); toast('Signed out of the admin portal'); },
    orderTab(t) { setUi(u => { u.orderTab = t; }); },
    invTab(t) { setUi(u => { u.invTab = t; }); },
    apq(v) { setUi(u => { u.apq = v; }); },
    apcat(v) { setUi(u => { u.apcat = v; }); },
    sampleOrder() { toast(`Sample order for illustration. Open ${S.order ? S.order.num : 'the demo order'} to run the workflow.`, 'warn'); },
    admStatus(st, form = {}) {
      const now = new Date().toISOString();
      if (st === 'Shipped') {
        const tr = (form.track || '').trim();
        if (tr.length < 8) { setUi(u => { u.errs = { track: 'Enter the carrier tracking number' }; }); return; }
        update(s => {
          const o = s.order;
          o.carrier = form.carrier; o.tracking = tr;
          o.items.forEach(l => { if (!P(s, l.id).digital) { const iv = invIn(s, l.id); iv.onHand -= l.qty; iv.reserved = Math.max(0, iv.reserved - l.qty); } });
          o.history.push({ s: 'Shipped', t: now, by: 'Jordan Ellis', note: `${o.carrier} ${tr}` });
          o.status = st;
        });
      } else if (st === 'Delivered') {
        update(s => {
          const o = s.order;
          o.history.push({ s: 'Out for Delivery', t: new Date(Date.now() - 3 * 3600e3).toISOString(), by: o.carrier });
          o.history.push({ s: 'Delivered', t: now, by: o.carrier });
          o.status = st;
        });
      } else {
        update(s => { s.order.history.push({ s: st, t: now, by: 'Jordan Ellis' }); s.order.status = st; });
      }
      setUi(u => { u.errs = {}; });
      toast(st === 'Shipped' ? `Marked Shipped · tracking emailed to ${S.order.addr.first}` : `Order ${S.order.num} marked ${st}`);
    },
    adjust(id) { openModal('adjust', { id }); },
    saveAdjust(id, form) {
      const q = Math.max(0, parseInt(form.q, 10) || 0), t = form.type;
      const cur = inv(S, id);
      const onHand = t === 'add' ? cur.onHand + q : t === 'remove' ? Math.max(0, cur.onHand - q) : q;
      update(s => { invIn(s, id).onHand = onHand; });
      closeModal();
      toast(`${P(S, id).brand} inventory updated · ${Math.max(0, onHand - cur.reserved)} available`);
    },
    product(form, id) {
      const d = Object.fromEntries(new FormData(form).entries());
      const e = {};
      if (!d.name.trim()) e.name = 'Enter a product name';
      if (!d.sku.trim()) e.sku = 'Enter a SKU';
      if (!(+d.price > 0)) e.price = 'Enter a price greater than 0';
      setUi(u => { u.errs = e; });
      if (Object.keys(e).length) { toast('Check the highlighted fields', 'warn'); return; }
      const fit = []; for (let i = 0; d['fmk-' + i] !== undefined; i++) if (d['fmk-' + i].trim()) fit.push({ make: d['fmk-' + i].trim(), model: d['fmd-' + i].trim(), from: +d['fy1-' + i], to: +d['fy2-' + i] });
      const patch = { name: d.name.trim(), sku: d.sku.trim(), brand: d.brand, cat: d.cat, desc: d.desc, price: +d.price, sale: d.sale === '' ? null : +d.sale, cost: d.cost === '' ? null : +d.cost, status: d.status, fit: fit.length ? fit : 'universal' };
      update(s => {
        if (id) { s.edits[id] = { ...(s.edits[id] || {}), ...patch }; Object.assign(invIn(s, id), { onHand: +d.stock || 0, threshold: +d.threshold || 0 }); }
        else {
          const nid = 'new-' + Date.now();
          s.added.push({ id: nid, ...patch, type: d.cat, rating: 0, reviews: 0, art: CAT_ART[d.cat], sold: 0, added: new Date().toISOString().slice(0, 10), blurb: '', features: [], specs: [], install: [], warranty: '', onHand: +d.stock || 0, threshold: +d.threshold || 0 });
          s.inv[nid] = { onHand: +d.stock || 0, reserved: 0, threshold: +d.threshold || 0 };
        }
      });
      go('admin-products');
      toast(`${patch.name} saved${patch.status === 'Draft' ? ' as draft' : ''}`);
    },

    /* ---------- demo bar ---------- */
    area(k) { go(k === 'brief' ? 'brief' : k === 'system' ? 'system' : k === 'admin' ? (S.admin ? 'admin' : 'admin-login') : 'home'); },
    device(d) { update(s => { s.device = d; }); },
    resetDemo() {
      const d = S.device;
      setS(() => ({ ...defaults(), device: d }));
      setUiState(u => ({ ...u, vs: {}, lastPid: null }));
      go('brief');
      toast('Demo reset to a fresh start');
    },

    /* Navigate to a route or run an action from a 'act:name' token */
    goOrAct(to) { if (to.startsWith('act:')) A[to.slice(4)](); else go(to); },
  };
  return A;
}

/* Re-exported for pages that need read-only inventory helpers next to actions */
export { inv, avail };
