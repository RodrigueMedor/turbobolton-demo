/* ==========================================================
   Pure selectors over the persisted state `S`.
   Every function takes the state as its first argument so
   components and actions share one implementation.
   ========================================================== */
import { PRODUCTS, SHIP_METHODS, VEHICLES, ADMIN_ORDERS } from '../data';
import { fmtDate, fmtTime, vname } from '../lib/util';

/* ---------- Catalog ---------- */
export const allProducts = S => PRODUCTS.concat(S.added || []);
export function P(S, id) {
  const b = allProducts(S).find(p => p.id === id);
  return b ? { status: 'Active', ...b, ...(S.edits[id] || {}) } : null;
}
export const shopProducts = S => allProducts(S).map(p => P(S, p.id)).filter(p => p.status === 'Active');
export const eff = p => (p.sale != null && p.sale !== '' ? +p.sale : +p.price);
export const onSale = p => p.sale != null && p.sale !== '' && +p.sale < +p.price;
export const inv = (S, id) => S.inv[id] || { onHand: 0, reserved: 0, threshold: 0 };
export const avail = (S, id) => Math.max(0, inv(S, id).onHand - inv(S, id).reserved);
export function stockState(S, p) {
  if (p.digital) return { k: 'in', t: 'Instant digital delivery' };
  const a = avail(S, p.id), th = inv(S, p.id).threshold;
  if (a <= 0) return { k: 'out', t: 'Backorder · ships in 2–3 weeks' };
  if (a <= th) return { k: 'low', t: `Only ${a} left in stock` };
  return { k: 'in', t: 'In stock · ships in 1–2 days' };
}
export function fitOf(S, p, v = S.vehicle) {
  if (!v) return 'none';
  if (p.fit === 'universal') return 'universal';
  return p.fit.some(f => f.make === v.make && f.model === v.model && v.year >= f.from && v.year <= f.to) ? 'fits' : 'no';
}
export const isNew = p => p.added >= '2026-08-01';
export const fitText = p => (p.fit === 'universal' ? 'Universal' : p.fit.map(f => `${f.from}–${f.to} ${f.make} ${f.model}`).join(', '));

/* ---------- Money ---------- */
export const cartCount = S => S.cart.reduce((a, l) => a + l.qty, 0);
export function totals(S, lines = S.cart, method = null, coupon = S.coupon) {
  const sub = lines.reduce((a, l) => a + eff(P(S, l.id)) * l.qty, 0);
  const disc = coupon === 'TURBO10' ? Math.min(250, Math.round(sub * 10) / 100) : 0;
  const base = sub - disc;
  let ship;
  if (!method) ship = base >= 149 || !lines.length ? 0 : 12.95;
  else { const m = SHIP_METHODS.find(x => x.id === method); ship = m.id === 'standard' ? (base >= 149 ? 0 : 12.95) : m.cost; }
  const tax = Math.round(base * 0.0825 * 100) / 100;
  return { sub, disc, ship, tax, total: Math.round((base + ship + tax) * 100) / 100 };
}
export function addBizDays(d, n) { const x = new Date(d); let k = 0; while (k < n) { x.setDate(x.getDate() + 1); const w = x.getDay(); if (w && w < 6) k++; } return x; }
export function etaRange(method, from = new Date()) {
  const m = SHIP_METHODS.find(x => x.id === method);
  const a = addBizDays(from, m.days[0]), b = addBizDays(from, m.days[1]);
  const f = d => fmtDate(d, { weekday: 'short', month: 'short', day: 'numeric' });
  return m.days[0] === m.days[1] ? f(a) : `${f(a)} – ${f(b)}`;
}

/* ---------- Results ---------- */
export const PRICE_BANDS = [['0-100', 'Under $100', 0, 100], ['100-500', '$100 – $500', 100, 500], ['500-1500', '$500 – $1,500', 500, 1500], ['1500-', '$1,500 and up', 1500, 1e9]];
export const SORTS = [['recommended', 'Recommended'], ['price-asc', 'Price: Low to High'], ['price-desc', 'Price: High to Low'], ['best', 'Best Selling'], ['new', 'Newest']];
export function queryList(S) {
  let list = shopProducts(S);
  if (S.q) {
    const words = S.q.toLowerCase().split(/\s+/).filter(Boolean);
    list = list.filter(p => { const hay = `${p.name} ${p.brand} ${p.cat} ${p.type} ${p.sku} ${fitText(p)}`.toLowerCase(); return words.every(w => hay.includes(w.replace(/s$/, ''))); });
  }
  return list;
}
export function applyFilters(S, list, skip = '') {
  const f = S.f;
  return list.filter(p =>
    (skip === 'cats' || !f.cats.length || f.cats.includes(p.cat)) &&
    (skip === 'brands' || !f.brands.length || f.brands.includes(p.brand)) &&
    (skip === 'types' || !f.types.length || f.types.includes(p.type)) &&
    (!f.price || (() => { const b = PRICE_BANDS.find(x => x[0] === f.price); return eff(p) >= b[2] && eff(p) < b[3]; })()) &&
    (!f.inStock || p.digital || avail(S, p.id) > 0) &&
    (!f.fitOnly || !S.vehicle || fitOf(S, p) !== 'no') &&
    (!f.rating || p.rating >= f.rating) &&
    (!f.sale || onSale(p)));
}
export function sorted(S, list) {
  const l = list.slice();
  const fitRank = p => ({ fits: 0, universal: 1, none: 1, no: 2 }[fitOf(S, p)]);
  if (S.sort === 'price-asc') l.sort((a, b) => eff(a) - eff(b));
  else if (S.sort === 'price-desc') l.sort((a, b) => eff(b) - eff(a));
  else if (S.sort === 'best') l.sort((a, b) => b.sold - a.sold);
  else if (S.sort === 'new') l.sort((a, b) => (b.added || '').localeCompare(a.added || ''));
  else l.sort((a, b) => fitRank(a) - fitRank(b) || b.rating * b.reviews - a.rating * a.reviews);
  return l;
}
export const HOME_TABS = ['Featured', 'Performance Parts', 'New Products', 'Deals'];
export function homeTabList(S, t) {
  const all = shopProducts(S);
  if (t === 'Performance Parts') return ['wagner-ic', 'bm3-stage1', 'eventuri-intake', 'akrapovic-slipon', 'kw-v3', 'ngk-plugs'].map(id => P(S, id));
  if (t === 'New Products') return all.slice().sort((a, b) => (b.added || '').localeCompare(a.added || '')).slice(0, 6);
  if (t === 'Deals') return all.filter(onSale);
  return ['brembo-gt6', 'akrapovic-slipon', 'kw-v3', 'eventuri-intake', 'hre-ff04', 'michelin-ps4s'].map(id => P(S, id));
}

/* ---------- Checkout ---------- */
export function validateStep(S, n) {
  const c = S.co, e = {};
  const req = (f, msg) => { if (!String(c[f] || '').trim()) e[f] = msg; };
  if (n === 1) { if (!/^\S+@\S+\.\S+$/.test(c.email)) e.email = 'Enter an email like name@example.com'; req('phone', 'Enter a phone number'); }
  if (n === 2) { req('first', 'Enter a first name'); req('last', 'Enter a last name'); req('addr1', 'Enter a street address'); req('city', 'Enter a city'); if (!/^\d{5}$/.test(c.zip)) e.zip = 'Enter a 5-digit ZIP code'; }
  if (n === 4) { if (c.cardNum.replace(/\D/g, '').length !== 16) e.cardNum = 'Enter the 16-digit card number'; if (!/^\d{2}\s*\/\s*\d{2}$/.test(c.exp)) e.exp = 'Use MM / YY'; if (!/^\d{3,4}$/.test(c.cvc)) e.cvc = 'Enter 3 or 4 digits'; req('cardName', 'Enter the name on the card'); }
  return e;
}

/* ---------- Admin ---------- */
export function demoOrderRow(S) {
  const o = S.order; if (!o) return null;
  return { num: o.num, date: fmtTime(o.placed), customer: `${o.addr.first} ${o.addr.last}`, email: o.addr.email, items: o.items.reduce((a, l) => a + l.qty, 0), total: o.totals.total, status: o.status, vehicle: o.vehicle ? vname(o.vehicle) : '—', demo: true };
}
export const allOrders = S => [demoOrderRow(S), ...ADMIN_ORDERS].filter(Boolean);
export const pendingCount = S => allOrders(S).filter(o => o.status === 'New' || o.status === 'Processing').length;
export const lowStock = S => allProducts(S).filter(p => !p.digital && avail(S, p.id) <= inv(S, p.id).threshold);

/* ---------- Fitment table rows for the product page ---------- */
export function fitmentRows(p, v) {
  return p.fit.flatMap(f => VEHICLES.filter(x => x.make === f.make && x.model === f.model && x.from <= f.to && x.to >= f.from).flatMap(x => x.engines.map(e => {
    const yrs = `${Math.max(f.from, x.from)}–${Math.min(f.to, x.to)}`;
    const mine = !!(v && v.make === f.make && v.model === f.model && v.engine === e && v.year >= f.from && v.year <= f.to);
    return { key: `${f.make}-${f.model}-${yrs}-${e}`, yrs, make: f.make, model: f.model, engine: e, mine };
  })));
}
