/* ==========================================================
   App shell: demo bar, device stage, hash router, modal host, toasts
   ========================================================== */
import { useEffect, useRef } from 'react';
import { Icon } from './lib/icons';
import { ArtDefs } from './lib/art';
import { cx } from './lib/util';
import { useStore } from './store/StoreContext';
import { useActions } from './store/actions';
import StoreShell, { ChatPanel, MenuDrawer } from './components/StoreShell';
import { VehicleModal } from './components/VehicleSelector';
import Home from './pages/Home';
import Results from './pages/Results';
import Product, { AddedDrawer, CompareModal, QuickViewModal } from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { Confirm, Track } from './pages/Orders';
import Account from './pages/Account';
import { Brands, Deals, Signin, Support } from './pages/Misc';
import AdminRoute, { AdjustModal, AdmMenuDrawer } from './admin/Admin';
import { Brief, DsModal, System } from './docs/Docs';

const AREAS = [['brief', 'Brief'], ['store', 'Storefront'], ['admin', 'Admin portal'], ['system', 'Design system']];
const DEVICES = [['desktop', 'monitor', 'Desktop'], ['tablet', 'tablet', 'Tablet'], ['mobile', 'phone', 'Mobile']];

function DemoBar() {
  const { S, route } = useStore();
  const A = useActions();
  const area = route === 'brief' ? 'brief' : route === 'system' ? 'system' : route.startsWith('admin') ? 'admin' : 'store';
  return (
    <div id="demobar">
      <span className="db-title">TurboBolton <span className="t2">MVP prototype</span> <span className="db-tag">Sample data</span></span>
      <div className="seg" id="areaseg" role="group" aria-label="Prototype area">
        {AREAS.map(([k, l]) => <button type="button" key={k} className={cx(area === k && 'on')} onClick={() => A.area(k)}>{l}</button>)}
      </div>
      <span className="db-sp"></span>
      <div className="seg" id="devseg" role="group" aria-label="Device width">
        {DEVICES.map(([k, i, l]) => <button type="button" key={k} className={cx(S.device === k && 'on')} onClick={() => A.device(k)}><Icon n={i} />{l}</button>)}
      </div>
      <button type="button" className="db-reset" id="resetDemo" onClick={A.resetDemo}><Icon n="refresh" />Reset demo</button>
    </div>
  );
}

function StoreView({ r }) {
  const { S } = useStore();
  if (r === 'home') return <Home />;
  if (r === 'results') return <Results />;
  if (r.startsWith('p-')) return <Product id={r.slice(2)} />;
  if (r === 'cart') return <Cart />;
  if (r === 'confirm') return <Confirm />;
  if (r === 'track') return <Track />;
  if (r === 'brands') return <Brands />;
  if (r === 'deals') return <Deals />;
  if (r === 'support') return <Support />;
  if (r === 'signin') return <Signin />;
  if (r.startsWith('account')) return S.signedIn ? <Account r={r} /> : <Signin />;
  return <Home />;
}

function Page() {
  const { route: r } = useStore();
  if (r === 'brief') return <Brief />;
  if (r === 'system') return <System />;
  if (r === 'checkout') return <Checkout />;
  if (r.startsWith('admin')) return <AdminRoute r={r} />;
  return <StoreShell><StoreView r={r} /></StoreShell>;
}

const MODALS = {
  menu: MenuDrawer, admMenu: AdmMenuDrawer, chat: ChatPanel, vehicle: VehicleModal,
  added: AddedDrawer, compare: CompareModal, quickView: QuickViewModal, adjust: AdjustModal, dsModal: DsModal,
};

function Overlay() {
  const { modal, ui, closeModal } = useStore();
  const Body = modal && MODALS[modal.type];
  return (
    <div id="overlay">
      {Body ? <div className={`scrim ${modal.cls}`} onMouseDown={e => { if (e.target === e.currentTarget) closeModal(); }}><Body {...modal.props} /></div> : null}
      {ui.processing ? <div className="processing"><div className="spinner"></div><h3>Confirming payment</h3><p className="muted">Securely processing with Stripe (test mode). Please don't close this page.</p></div> : null}
    </div>
  );
}

function Toasts() {
  const { toasts } = useStore();
  return <div id="toasts" aria-live="polite">{toasts.map(t => <div key={t.id} className={`toast ${t.kind}`}><Icon n={t.kind === 'warn' ? 'info' : 'check'} /><span>{t.msg}</span></div>)}</div>;
}

export default function App() {
  const { S, navTick } = useStore();
  const frame = useRef(null);
  useEffect(() => { if (frame.current) frame.current.scrollTop = 0; }, [navTick]);
  return (
    <>
      <ArtDefs />
      <DemoBar />
      <div id="stage" data-device={S.device}>
        <div id="frame" ref={frame}>
          <div id="app"><Page /></div>
          <Overlay />
          <Toasts />
        </div>
      </div>
    </>
  );
}
