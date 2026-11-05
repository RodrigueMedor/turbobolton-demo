/* ==========================================================
   Storefront layout: promo strip → dark header → nav band with
   mega menus → vehicle bar → page → footer → chat button
   ========================================================== */
import { useState } from 'react';
import { BRANDS, CATEGORIES } from '../data';
import { Icon } from '../lib/icons';
import { cx, money, sameV, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { cartCount, totals } from '../store/selectors';
import { Drawer, Go, GoAct, Logo, LogoStatic, SearchForm, Soon } from './common';

export const SUBCATS = {
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

function MegaCats() {
  const A = useActions();
  return (
    <div className="mega" role="menu"><div className="wrap mega-grid">
      {CATEGORIES.map(c => (
        <div key={c.id}>
          <button type="button" className="mega-h" onClick={() => A.shopCat(c.id)}><Icon n={c.icon} />{c.id}</button>
          <ul>{SUBCATS[c.id].map(s => <li key={s}><button type="button" onClick={() => A.shopCat(c.id)}>{s}</button></li>)}</ul>
        </div>
      ))}
    </div></div>
  );
}
function MegaBrands() {
  const A = useActions();
  return (
    <div className="mega" role="menu"><div className="wrap">
      <div className="mega-brands">{BRANDS.map(b => <button type="button" key={b} className="brandtile sm" onClick={() => A.shopBrand(b)}>{b}</button>)}</div>
      <div className="mega-foot"><Go to="brands" className="btn-link">View all brands <Icon n="arrowR" /></Go></div>
    </div></div>
  );
}

function Footer() {
  const A = useActions();
  const [email, setEmail] = useState('');
  const Col = ({ h, items }) => <div><h4>{h}</h4><ul>{items.map(([l, to]) => <li key={l}><GoAct to={to}>{l}</GoAct></li>)}</ul></div>;
  return (
    <footer className="ftr">
      <div className="ftr-news"><div className="wrap">
        <div><h3>Get deals for your build</h3><p>New parts for the vehicles in your garage, plus members-only codes.</p></div>
        <form className="news" onSubmit={e => { e.preventDefault(); A.news(); }}><input id="news" type="email" placeholder="Your email address" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} /><button className="btn btn-primary">Subscribe</button></form>
      </div></div>
      <div className="wrap">
        <div className="ftr-cols">
          <div>
            <LogoStatic />
            <p style={{ marginTop: 14, maxWidth: '34ch' }}>Performance parts matched to your vehicle, shipped fast and backed by people who build cars.</p>
            <p style={{ marginTop: 12, color: '#fff' }}><b>(800) 555-0142</b><br /><span className="small">support@turbobolton.example · Mon–Sat 8–6 CT</span></p>
            <div className="social"><span>Facebook</span><span>Instagram</span><span>YouTube</span></div>
          </div>
          <Col h="Shop" items={[['All parts', 'act:shopAll'], ['Brands', 'brands'], ['Deals', 'deals'], ['New products', 'act:shopNew'], ['My Garage', 'account-garage']]} />
          <Col h="Support" items={[['Contact us', 'support'], ['Track an order', 'track'], ['Shipping policy', 'support'], ['Returns & refunds', 'support'], ['Fitment guarantee', 'support']]} />
          <Col h="Account" items={[['Sign in', 'signin'], ['Orders', 'account-orders'], ['Wishlist', 'account-wishlist'], ['Settings', 'account-settings']]} />
          <Col h="Company" items={[['About TurboBolton', 'support'], ['Terms & conditions', 'support'], ['Privacy policy', 'support'], ['Sitemap', 'brief']]} />
        </div>
        <div className="ftr-bottom">
          <span>© 2026 TurboBolton. Prototype with sample data. Third-party brand names are used for demonstration only.</span>
          <span className="paylogos"><span>VISA</span><span>MC</span><span>AMEX</span><span>DISCOVER</span><span>APPLE PAY</span><span>GOOGLE PAY</span></span>
        </div>
      </div>
    </footer>
  );
}

export default function StoreShell({ children }) {
  const { S, route } = useStore();
  const A = useActions();
  const n = cartCount(S), t = totals(S), v = S.vehicle;
  const saved = v && S.garage.some(g => sameV(g, v));
  return (
    <>
      <div className="promo"><div className="wrap"><span><Icon n="bolt" /><b>Fall Boost Event:</b> use code <b className="mono">TURBO10</b> for 10% off · Free shipping over $149</span></div></div>
      <header className="hdr">
        <div className="hdr-top"><div className="wrap hdr-main">
          <button type="button" className="hact burger" onClick={A.menu} aria-label="Open menu"><Icon n="menu" /></button>
          <Logo />
          <SearchForm />
          <div className="hacts">
            <button type="button" className="hact garage" onClick={A.openVehicle}><Icon n="car" /><span className="t"><small>{v ? 'My Garage' : 'Select Vehicle'}</small><b>{v ? vname(v) : 'Add your vehicle'}</b></span></button>
            <Go to={S.signedIn ? 'account' : 'signin'} className="hact" aria-label="Account"><Icon n="user" /><span className="t"><small>{S.signedIn ? 'Hello, Daniel' : 'Welcome'}</small><b>{S.signedIn ? 'Account' : 'Sign in'}</b></span></Go>
            <button type="button" className="hact compare" onClick={A.openCompare} aria-label="Compare"><Icon n="compare" />{S.compare.length ? <span className="cnt">{S.compare.length}</span> : null}</button>
            <Go to="account-wishlist" className="hact wishlist" aria-label="Wishlist"><Icon n="heart" />{S.wishlist.length ? <span className="cnt">{S.wishlist.length}</span> : null}</Go>
            <Go to="cart" className="hact" aria-label={`Cart, ${n} items`}><Icon n="cart" />{n ? <span className="cnt">{n}</span> : null}<span className="t"><small>Cart</small><b className="num">{money(t.sub)}</b></span></Go>
          </div>
        </div></div>
        <nav className="hnav" aria-label="Main"><div className="wrap hnav-in">
          <button type="button" onClick={A.shopAll}>Shop</button>
          <div className="hn-dd"><button type="button" onClick={A.shopAll} aria-haspopup="true">Categories <Icon n="chevD" /></button><MegaCats /></div>
          <div className="hn-dd"><Go to="brands" aria-haspopup="true">Brands <Icon n="chevD" /></Go><MegaBrands /></div>
          <Go to="deals">Deals</Go>
          <button type="button" onClick={A.shopNew}>New Products</button>
          <Go to="support">Support</Go>
        </div></nav>
      </header>
      {v && route !== 'results' && route !== 'home' ? (
        <div className="vbar"><div className="wrap">
          <span className="vb-car"><Icon n="check" />Your vehicle: {vname(v)}</span><span className="vb-eng">{v.engine}</span>
          <span className="vb-acts"><button type="button" className="btn-link" onClick={A.openVehicle}>Change vehicle</button>{saved ? null : <button type="button" className="btn-link" onClick={A.saveGarage}>Save to My Garage</button>}</span>
        </div></div>
      ) : null}
      <main>{children}</main>
      <Footer />
      <button type="button" className={cx('chat-fab', route.startsWith('p-') && 'on-pdp')} onClick={A.chat} aria-label="Chat with a parts specialist"><Icon n="chat" /><span>Chat with us</span></button>
    </>
  );
}

/* ---------- Mobile menu drawer ---------- */
export function MenuDrawer() {
  const { S } = useStore();
  const A = useActions();
  return (
    <Drawer head={<Logo />} title="Menu" bodyStyle={{ gap: 4 }}>
      <>
        <button type="button" className="btn btn-block" onClick={A.openVehicle} style={{ justifyContent: 'flex-start' }}><Icon n="car" />{S.vehicle ? vname(S.vehicle) : 'Select Vehicle'}</button>
        <div className="acct-nav" style={{ padding: '8px 0' }}>
          <button type="button" onClick={A.shopAll}>Shop all parts</button>
          {CATEGORIES.map(c => <button type="button" key={c.id} onClick={() => A.shopCat(c.id)}><Icon n={c.icon} />{c.id}</button>)}
          <hr />
          <Go to="brands"><Icon n="tag" />Brands</Go><Go to="deals"><Icon n="dollar" />Deals</Go><button type="button" onClick={A.shopNew}><Icon n="bolt" />New Products</button><Go to="support"><Icon n="headset" />Support</Go>
          <hr />
          <Go to={S.signedIn ? 'account' : 'signin'}><Icon n="user" />{S.signedIn ? 'Account' : 'Sign in'}</Go><Go to="account-garage"><Icon n="car" />My Garage</Go><Go to="account-orders"><Icon n="box" />Orders</Go><Go to="account-wishlist"><Icon n="heart" />Wishlist</Go><Go to="track"><Icon n="truck" />Track order</Go>
        </div>
        <div className="small muted" style={{ marginTop: 'auto' }}>Support (800) 555-0142</div>
      </>
    </Drawer>
  );
}

/* ---------- Chat side panel ---------- */
export function ChatPanel() {
  const { S } = useStore();
  const [msg, setMsg] = useState('');
  return (
    <Drawer title="Chat with TurboBolton" foot={<><input className="input" id="chat-in" placeholder="Type a message" aria-label="Message" style={{ flex: 1 }} value={msg} onChange={e => setMsg(e.target.value)} /><Soon m="Message sent" className="btn btn-primary">Send</Soon></>}>
      <div className="chat-log">
        <div className="msg them"><b>Marco · Parts specialist</b><p>Hi Daniel! I see a {S.vehicle ? vname(S.vehicle) : 'vehicle'} in your garage. What are you working on?</p></div>
        <div className="msg me"><p>Will the Brembo GT kit clear my factory 19" wheels?</p></div>
        <div className="msg them"><b>Marco · Parts specialist</b><p>Yes. The 380mm GT kit clears the OEM 19" wheels on the G80 M3. No spacers needed.</p></div>
      </div>
      <p className="small muted">Prototype: sample conversation. Production uses a live chat service.</p>
    </Drawer>
  );
}
