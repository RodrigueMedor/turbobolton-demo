/* Brands, Deals, Support and Sign-in pages */
import { useState } from 'react';
import { BRANDS } from '../data';
import { Icon } from '../lib/icons';
import { vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { onSale, shopProducts } from '../store/selectors';
import { Crumbs, ProductCard, SecTitle, Soon } from '../components/common';

export function Brands() {
  const { S } = useStore();
  const A = useActions();
  const counts = b => shopProducts(S).filter(p => p.brand === b).length;
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <div className="list-head"><Crumbs items={[['Home', 'home'], ['Brands', '']]} /><h1>Shop by Brand</h1><p className="muted">Authorized dealer for every brand we carry</p></div>
      <div className="brand-grid">{BRANDS.slice().sort((a, b) => a.localeCompare(b)).map(b => <button type="button" key={b} className="brandcard" onClick={() => A.shopBrand(b)}><span className="bc-name">{b}</span><span className="small muted">{counts(b)} {counts(b) === 1 ? 'product' : 'products'}</span></button>)}</div>
    </div>
  );
}

export function Deals() {
  const { S } = useStore();
  const A = useActions();
  const promos = [
    ['TURBO10', '10% off sitewide', 'Up to $250 off any order. Enter at checkout.', 'act:shopAll', 'Shop all parts'],
    ['Brembo', 'Brake Week pricing', 'Up to $400 off GT big brake kits through Oct 7.', 'brand:Brembo', 'Shop Brembo'],
    ['Michelin', '$30 off per tire', 'Pilot Sport 4S in OEM M3/M4 sizes.', 'brand:Michelin', 'Shop Michelin'],
    ['Eventuri', '$100 off intakes', 'Carbon intake systems for S58 and B58.', 'brand:Eventuri', 'Shop Eventuri'],
  ];
  return (
    <>
      <section className="deals-hero"><div className="wrap"><span className="ev-tag">Fall Boost Event · Oct 1–14</span><h1>Current Deals</h1><p>Sale prices are applied automatically. Codes stack with sale prices unless noted.</p></div></section>
      <div className="wrap" style={{ paddingBottom: 56 }}>
        <Crumbs items={[['Home', 'home'], ['Current Deals', '']]} />
        <div className="promo-grid">{promos.map(([k, t, d, to, cta]) => <div className="card promo-card" key={k}><span className="promo-k">{k}</span><h3>{t}</h3><p className="small muted">{d}</p><button type="button" className="btn btn-sm" onClick={() => (to.startsWith('act:') ? A[to.slice(4)]() : A.shopBrand(to.slice(6)))}>{cta} <Icon n="arrowR" /></button></div>)}</div>
        <div style={{ marginTop: 32 }}><SecTitle t="On Sale Now" sub={S.vehicle ? `Fitment shown for your ${vname(S.vehicle)}` : ''} /></div>
        <div className="pgrid">{shopProducts(S).filter(onSale).map(p => <ProductCard key={p.id} p={p} />)}</div>
      </div>
    </>
  );
}

export function Support() {
  const { S } = useStore();
  const A = useActions();
  const [num, setNum] = useState(S.order ? S.order.num : '');
  const faq = [
    ['How does the fitment guarantee work?', "If a part we marked as fitting your selected vehicle doesn't fit, contact us within 30 days. We send a prepaid return label and refund you in full."],
    ['When will my order ship?', 'In-stock orders placed before 2pm CT on business days ship the same day. Most orders ship within 1–2 business days.'],
    ['What is your return policy?', 'Uninstalled parts in original packaging can be returned within 30 days. Electrical parts and tunes are final sale once activated.'],
    ['Do you help with installation?', 'Our team can recommend an installer near you and answer technical questions before and after you buy.'],
    ['Is checkout secure?', 'Card payments are processed by Stripe. TurboBolton never stores your full card number.'],
  ];
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <div className="list-head"><Crumbs items={[['Home', 'home'], ['Support', '']]} /><h1>How can we help?</h1><p className="muted">Real enthusiasts, Monday to Saturday, 8am–6pm Central</p></div>
      <div className="support-grid">
        <div className="card pad stack" style={{ gap: 8 }}><Icon n="headset" /><h3>Call us</h3><b className="num" style={{ fontSize: 20 }}>(800) 555-0142</b><span className="small muted">Average wait under 2 minutes</span></div>
        <div className="card pad stack" style={{ gap: 8 }}><Icon n="chat" /><h3>Live chat</h3><span className="small muted">Talk to a parts specialist now</span><div><button type="button" className="btn btn-primary btn-sm" onClick={A.chat}>Start chat</button></div></div>
        <div className="card pad stack" style={{ gap: 8 }}><Icon n="doc" /><h3>Email</h3><b style={{ overflowWrap: 'anywhere' }}>support@turbobolton.example</b><span className="small muted">Replies within one business day</span></div>
        <div className="card pad stack" style={{ gap: 10 }}><Icon n="truck" /><h3>Track an order</h3><form className="stack" style={{ gap: 8 }} onSubmit={e => { e.preventDefault(); A.trackLookup(num); }}><input className="input" id="tl-num" placeholder="Order number, e.g. TB-100482" value={num} onChange={e => setNum(e.target.value)} aria-label="Order number" /><button className="btn btn-dark btn-sm">Track</button></form></div>
      </div>
      <div style={{ marginTop: 32 }}><SecTitle t="Frequently Asked Questions" /></div>
      <div className="faq">{faq.map(([q, a], i) => <details key={q} open={i === 0}><summary>{q}<Icon n="chevD" /></summary><p>{a}</p></details>)}</div>
    </div>
  );
}

export function Signin() {
  const A = useActions();
  const submit = e => { e.preventDefault(); A.signin(); };
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <div className="list-head"><Crumbs items={[['Home', 'home'], ['Sign in', '']]} /><h1>Sign in or create an account</h1></div>
      <div className="signin-grid">
        <form className="card form-sec" onSubmit={submit}><h3>Sign in</h3><div className="field"><label htmlFor="si-e">Email</label><input className="input" id="si-e" type="email" defaultValue="daniel.okafor@example.com" autoComplete="username" /></div><div className="field"><label htmlFor="si-p">Password</label><input className="input" id="si-p" type="password" defaultValue="demo-password" autoComplete="current-password" /></div><div className="row between"><label className="chk"><input type="checkbox" defaultChecked />Keep me signed in</label><Soon m="Password reset email sent" className="btn-link small">Forgot password?</Soon></div><button className="btn btn-dark btn-lg btn-block">Sign In</button></form>
        <form className="card form-sec" onSubmit={submit}><h3>New to TurboBolton?</h3><p className="small muted">Save vehicles to My Garage, track orders and check out faster.</p><div className="grid2 keep"><div className="field"><label htmlFor="ca-f">First name</label><input className="input" id="ca-f" placeholder="First name" /></div><div className="field"><label htmlFor="ca-l">Last name</label><input className="input" id="ca-l" placeholder="Last name" /></div></div><div className="field"><label htmlFor="ca-e">Email</label><input className="input" id="ca-e" type="email" placeholder="name@example.com" /></div><div className="field"><label htmlFor="ca-p">Password</label><input className="input" id="ca-p" type="password" placeholder="At least 10 characters" /></div><button className="btn btn-primary btn-lg btn-block">Create Account</button></form>
      </div>
    </div>
  );
}
