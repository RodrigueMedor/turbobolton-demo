import { useEffect, useState } from 'react';
import { Icon } from '../lib/icons';
import { Art } from '../lib/art';
import { cx, money, plural, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { P, cartCount, eff, stockState, totals } from '../store/selectors';
import { Crumbs, FitBadge, Go } from '../components/common';

function Line({ l, savedList }) {
  const { S, go } = useStore();
  const A = useActions();
  const p = P(S, l.id), st = stockState(S, p), v = S.vehicle;
  return (
    <div className="cline">
      <div className="pimg" onClick={() => go('p-' + p.id)}><Art kind={p.art} /></div>
      <div className="cline-info">
        <span className="pbrand">{p.brand}</span><button type="button" className="pname" onClick={() => go('p-' + p.id)}>{p.name}</button><span className="small muted">SKU <span className="mono">{p.sku}</span></span>
        <span className={`stock ${st.k}`}>{st.t}</span>{v ? <div style={{ alignSelf: 'flex-start' }}><FitBadge p={p} /></div> : null}
        <div className="cline-acts">
          {savedList ? <button type="button" onClick={() => A.moveToCart(p.id)}><Icon n="cart" />Move to cart</button> : <button type="button" onClick={() => A.saveLater(p.id)}><Icon n="heart" />Save for later</button>}
          <button type="button" onClick={() => (savedList ? A.removeSaved(p.id) : A.remove(p.id))} style={{ color: 'var(--err)' }}><Icon n="trash" />Remove</button>
        </div>
      </div>
      <div className="cline-price">
        {savedList ? <b className="num">{money(eff(p))}</b> : (
          <>
            <span className="unit num">{money(eff(p))} each</span>
            <div className="qty sm"><button type="button" onClick={() => A.cqty(p.id, -1)} aria-label="Decrease"><Icon n="minus" /></button><span>{l.qty}</span><button type="button" onClick={() => A.cqty(p.id, 1)} aria-label="Increase"><Icon n="plus" /></button></div>
            <span className="lt num">{money(eff(p) * l.qty)}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function Cart() {
  const { S, ui } = useStore();
  const A = useActions();
  const t = totals(S), v = S.vehicle;
  const [code, setCode] = useState(S.coupon || '');
  useEffect(() => { setCode(S.coupon || ''); }, [S.coupon]);
  const saved = S.saved.length ? <div className="card" style={!S.cart.length ? { marginBottom: 56 } : undefined}><div className="panel-h"><h3>Saved for later ({S.saved.length})</h3></div>{S.saved.map(l => <Line key={l.id} l={l} savedList />)}</div> : null;

  if (!S.cart.length) return (
    <div className="wrap">
      <Crumbs items={[['Home', 'home'], ['Cart', '']]} />
      <div className="card empty" style={{ marginBottom: 56 }}><Icon n="cart" /><h2>Your cart is empty</h2><p className="muted">{v ? `Find parts that fit your ${vname(v)}.` : 'Select your vehicle to find parts that fit.'}</p><button type="button" className="btn btn-primary" onClick={v ? A.shopVehicle : A.shopAll}>Shop parts</button></div>
      {saved}
    </div>
  );
  return (
    <div className="wrap">
      <Crumbs items={[['Home', 'home'], ['Cart', '']]} />
      <div className="row between" style={{ marginBottom: 18 }}><h1>Your Cart <span className="muted" style={{ fontSize: '.6em', fontWeight: 500 }}>({plural(cartCount(S), 'item')})</span></h1>{v ? <span className="badge badge-ok" style={{ fontSize: 13, padding: '6px 10px' }}><Icon n="car" />Shopping for {vname(v)}</span> : null}</div>
      <div className="cart-l">
        <div className="stack">
          <div className="card">{S.cart.map(l => <Line key={l.id} l={l} />)}</div>
          <div><button type="button" className="btn" onClick={v ? A.shopVehicle : A.shopAll}><Icon n="chevL" />Continue Shopping</button></div>
          {saved}
        </div>
        <aside className="card summary">
          <h3>Order Summary</h3>
          <div className="sumrow"><span>Subtotal</span><span>{money(t.sub)}</span></div>
          {t.disc ? <div className="sumrow disc"><span>Discount (TURBO10)</span><span>−{money(t.disc)}</span></div> : <div className="sumrow"><span>Discount</span><span className="muted">—</span></div>}
          <div className="sumrow"><span>Shipping estimate</span><span>{t.ship ? money(t.ship) : <b style={{ color: 'var(--ok)' }}>FREE</b>}</span></div>
          <div className="sumrow"><span>Estimated tax <span className="small muted">(TX 8.25%)</span></span><span>{money(t.tax)}</span></div>
          <div className="sumrow total"><span>Order total</span><span>{money(t.total)}</span></div>
          <form className="coupon" onSubmit={e => { e.preventDefault(); A.coupon(code); }}><input className={cx('input', ui.couponErr && 'err')} id="coupon" placeholder="Coupon code" value={code} onChange={e => setCode(e.target.value)} aria-label="Coupon code" /><button className="btn btn-sm">{S.coupon ? 'Applied' : 'Apply'}</button></form>
          {ui.couponErr ? <span className="field"><span className="errtxt">{ui.couponErr}</span></span> : S.coupon ? <span className="small" style={{ color: 'var(--ok)', fontWeight: 600 }}>TURBO10 applied · <button type="button" className="btn-link" onClick={A.removeCoupon}>Remove</button></span> : <span className="small muted">Demo code: TURBO10</span>}
          <Go to="checkout" className="btn btn-primary btn-lg btn-block"><Icon n="lock" />Proceed to Checkout</Go>
          <div className="secure"><Icon n="lock" />Secure checkout · payments by Stripe</div>
          <div className="paylogos"><span>VISA</span><span>MC</span><span>AMEX</span><span>DISCOVER</span><span>APPLE PAY</span></div>
        </aside>
      </div>
    </div>
  );
}
