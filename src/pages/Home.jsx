import { BRANDS, CATEGORIES, HERO_IMG } from '../data';
import { Icon, LogoMark } from '../lib/icons';
import { Art } from '../lib/art';
import { cx, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { HOME_TABS, homeTabList, shopProducts } from '../store/selectors';
import { Carousel, Go, SecTitle } from '../components/common';
import { YmmBox } from '../components/VehicleSelector';

export default function Home() {
  const { S, ui } = useStore();
  const A = useActions();
  const all = shopProducts(S);
  const popular = all.slice().sort((a, b) => b.sold - a.sold).slice(0, 8);
  const newest = all.slice().sort((a, b) => (b.added || '').localeCompare(a.added || '')).slice(0, 8);
  return (
    <>
      <section className="lux-hero" aria-label="TurboBolton performance parts">
        <div className="lux-media"><img className="lux-img" src={HERO_IMG} alt="Black BMW M4 Competition coupe lit in a dark studio" width="1900" height="903" /><span className="lux-glow"></span></div>
        <div className="wrap lux-in">
          <div className="lux-copy">
            <span className="lux-brand"><span className="logo-mark"><LogoMark /></span>TurboBolton <i>·</i> Performance Parts</span>
            <h1>Performance<br />starts <em>here</em></h1>
            <p>Find performance parts engineered for your vehicle.</p>
            <div className="lux-ctas"><button type="button" className="btn btn-primary btn-lg" onClick={A.shopAll}>Shop Performance Parts <Icon n="chevR" /></button><button type="button" className="btn btn-lg lux-ghost" onClick={A.heroVehicle}><Icon n="car" />Select Your Vehicle</button></div>
            <div className="lux-trust"><span><Icon n="shield" />Fitment guaranteed</span><span><Icon n="truck" />Free shipping over $149</span><span><Icon n="headset" />Enthusiast support</span></div>
          </div>
          <div className="lux-build"><span>Featured build</span><b>S58 M4 · Stage 1 + Titanium Exhaust</b><button type="button" className="btn-link" onClick={() => A.shopBrand('Akrapovič')}>Shop the exhaust <Icon n="arrowR" /></button></div>
        </div>
        <span className="lux-credit">Photo: Sunder Muthukumaran / Unsplash</span>
      </section>

      <section className="ymm-wrap"><div className="wrap"><div className="ymm" id="selector"><YmmBox k="home" /></div></div></section>

      <section className="band"><div className="wrap">
        <SecTitle t="Our Products" sub={S.vehicle ? `Showing fitment for your ${vname(S.vehicle)}` : 'Select your vehicle to see what fits'} />
        <div className="ptabs" role="tablist">{HOME_TABS.map(t => <button type="button" role="tab" key={t} className={cx(ui.homeTab === t && 'on')} onClick={() => A.homeTab(t)}>{t}</button>)}</div>
        <Carousel list={homeTabList(S, ui.homeTab)} />
      </div></section>

      <section className="band band-white" id="cats"><div className="wrap">
        <SecTitle t="Shop by Category" />
        <div className="cats">{CATEGORIES.map(c => <button type="button" key={c.id} className="cat" onClick={() => A.shopCat(c.id)}><span className="cat-ic"><Icon n={c.icon} /></span><b>{c.id}</b><small>{c.blurb}</small></button>)}</div>
      </div></section>

      <section className="band"><div className="wrap"><div className="deals">
        <div className="deal deal-a"><span className="eyebrow" style={{ color: '#FFD2D5' }}>Brake Week · ends Oct 7</span><h3>Save up to $400 on Brembo</h3><p>Big brake kits, pads and racing fluid at sale prices while stock lasts.</p><button type="button" className="btn" onClick={() => A.shopCat('Brakes')}>Shop brakes <Icon n="arrowR" /></button><Art kind="rotor" /></div>
        <div className="deal deal-b"><span className="eyebrow">Sitewide</span><h3>10% off your build</h3><p>Use code <span className="code">TURBO10</span> at checkout, up to $250 off.</p><Go to="deals" className="btn btn-primary">See all deals</Go><Art kind="intake" /></div>
      </div></div></section>

      <section className="band band-white"><div className="wrap"><SecTitle t="Most Popular Products" sub="Best sellers this month" /><Carousel list={popular} /></div></section>
      <section className="band"><div className="wrap"><SecTitle t="New Products" sub="Just landed in the warehouse" /><Carousel list={newest} /></div></section>

      <section className="why-band"><div className="wrap why">
        <div><span className="w-ic"><Icon n="shield" /></span><h4>Fitment guarantee</h4><p>Matched to year, make, model and engine. If it doesn't fit, we cover return shipping.</p></div>
        <div><span className="w-ic"><Icon n="dollar" /></span><h4>Honest pricing</h4><p>Competitive prices with no hidden fees. Shipping cost is shown before checkout.</p></div>
        <div><span className="w-ic"><Icon n="truck" /></span><h4>Fast shipping</h4><p>Most orders ship in 1–2 business days with tracking to your door.</p></div>
        <div><span className="w-ic"><Icon n="headset" /></span><h4>Real enthusiast support</h4><p>Call, email or chat with people who build cars.</p></div>
      </div></section>

      <section className="band band-white" id="brands"><div className="wrap">
        <SecTitle t="Trusted Brands" />
        <div className="brands">{BRANDS.slice(0, 8).map(b => <button type="button" key={b} className="brandtile" onClick={() => A.shopBrand(b)}>{b}</button>)}</div>
        <div style={{ textAlign: 'center', marginTop: 18 }}><Go to="brands" className="btn">View all brands</Go></div>
      </div></section>

      <section className="band" id="support"><div className="wrap"><div className="svcstrip">
        <div><Icon n="truck" /><span><b>Free shipping over $149</b><small>Ground, lower 48 states</small></span></div>
        <div><Icon n="ret" /><span><b>30-day returns</b><small>Uninstalled parts</small></span></div>
        <div><Icon n="headset" /><span><b>(800) 555-0142</b><small>Mon–Sat, 8am–6pm CT</small></span></div>
        <div><Icon n="box" /><span><b>Track your order</b><small><Go to="track" className="btn-link">Order status</Go></small></span></div>
      </div></div></section>
    </>
  );
}
