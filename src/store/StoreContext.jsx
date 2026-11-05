/* ==========================================================
   Store: persisted demo state (S), ephemeral UI state (ui),
   hash router, modal host descriptor and toasts.
   ========================================================== */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { produce } from 'immer';
import { CUSTOMER, PRODUCTS } from '../data';

const KEY = 'turbobolton-demo-v1';
const RESERVED0 = { 'kw-v3': 2, 'hre-ff04': 4, 'michelin-ps4s': 8, 'ferodo-pads': 1 };

export function defaults() {
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
function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(defaults(), JSON.parse(raw)); } catch (e) { /* ignore */ }
  return defaults();
}
export const uiDefaults = () => ({
  vs: {}, pdpTab: 'Description', pdpImg: 0, qty: 1, filtersOpen: false, errs: {}, couponErr: '', orderTab: 'All', invTab: 'All',
  apq: '', apcat: '', confirmRemove: null, editVehicle: null, lastPid: null, homeTab: 'Featured', ymmEdit: {}, fold: {}, processing: false,
});

const Ctx = createContext(null);

export function StoreProvider({ children }) {
  const [S, setS] = useState(load);
  const [ui, setUiState] = useState(uiDefaults);
  const [route, setRoute] = useState(() => (location.hash || '').slice(1) || 'brief');
  const [navTick, setNavTick] = useState(0);
  const [modal, setModal] = useState(null);
  const [toasts, setToasts] = useState([]);
  const timers = useRef([]);

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } }, [S]);

  const update = useCallback(fn => setS(s => produce(s, fn)), []);
  const setUi = useCallback(fn => setUiState(u => produce(u, fn)), []);
  const closeModal = useCallback(() => setModal(null), []);
  const openModal = useCallback((type, props = {}, cls = '') => setModal({ type, props, cls }), []);

  const go = useCallback(r => {
    setRoute(r);
    setUiState(u => produce(u, d => { d.errs = {}; }));
    setModal(null);
    setNavTick(t => t + 1);
    try { if (location.hash.slice(1) !== r) location.hash = r; } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    const onHash = () => {
      const h = location.hash.slice(1);
      if (!h) return;
      setRoute(cur => { if (h !== cur) { setNavTick(t => t + 1); return h; } return cur; });
    };
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setModal(null); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const toast = useCallback((msg, kind = '') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, kind }]);
    timers.current.push(setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200));
  }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const value = useMemo(() => ({ S, ui, route, navTick, modal, toasts, update, setUi, setS, setUiState, go, openModal, closeModal, toast }),
    [S, ui, route, navTick, modal, toasts, update, setUi, go, openModal, closeModal, toast]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used inside <StoreProvider>');
  return v;
}
