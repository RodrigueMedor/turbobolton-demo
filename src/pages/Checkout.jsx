import { SHIP_METHODS } from '../data';
import { Icon } from '../lib/icons';
import { Art } from '../lib/art';
import { cx, money, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { P, eff, etaRange, totals } from '../store/selectors';
import { FitBadge, Go, Logo } from '../components/common';

const CO_STEPS = ['Customer information', 'Shipping address', 'Shipping method', 'Payment', 'Review order'];
const STATES = ['AZ', 'CA', 'CO', 'FL', 'GA', 'IL', 'NC', 'NY', 'OH', 'OR', 'TX', 'WA'];

function Inp({ f, label, type, ph, ac, hint, style }) {
  const { S, ui } = useStore();
  const A = useActions();
  const e = ui.errs[f];
  return (
    <div className="field" style={style}>
      <label htmlFor={`co-${f}`}>{label}</label>
      <input className={cx('input', e && 'err')} id={`co-${f}`} value={S.co[f]} onChange={ev => A.coInput(f, ev.target.value)} type={type} placeholder={ph} autoComplete={ac || 'on'} />
      {e ? <span className="errtxt">{e}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}
const CoHdr = ({ secure }) => <div className="co-hdr"><div className="wrap"><Logo />{secure ? <span className="secure"><Icon n="lock" />Secure checkout</span> : null}</div></div>;

export default function Checkout() {
  const { S, ui } = useStore();
  const A = useActions();
  if (!S.cart.length && !S.order) return <><CoHdr /><div className="wrap"><div className="card empty" style={{ margin: '40px 0' }}><Icon n="cart" /><h2>Your cart is empty</h2><Go to="home" className="btn btn-primary">Shop parts</Go></div></div></>;
  if (!S.cart.length) return <><CoHdr /><div className="wrap"><div className="card empty" style={{ margin: '40px 0' }}><Icon n="check" /><h2>Order already placed</h2><p className="muted">Your cart is empty because order {S.order.num} was placed.</p><div className="row" style={{ justifyContent: 'center' }}><Go to="confirm" className="btn btn-primary">View confirmation</Go><Go to="home" className="btn">Continue shopping</Go></div></div></div></>;

  const c = S.co, step = c.step, t = totals(S, S.cart, c.ship), v = S.vehicle;
  const m = SHIP_METHODS.find(x => x.id === c.ship);
  const summaries = [
    <>{c.email} · {c.phone}</>,
    <>{c.first} {c.last}, {c.addr1}{c.addr2 ? ', ' + c.addr2 : ''}, {c.city}, {c.state} {c.zip}</>,
    <>{m.name} · {m.eta} · {t.ship ? money(t.ship) : 'Free'}</>,
    <>Visa ending in {c.cardNum.replace(/\D/g, '').slice(-4)} · exp {c.exp}</>,
  ];
  const bodies = [
    () => (
      <>
        <div className="callout info"><Icon n="user" /><div>Signed in as <b>Daniel Okafor</b>. Order updates go to this email.</div></div>
        <div className="grid2"><Inp f="email" label="Email" type="email" ac="email" /><Inp f="phone" label="Phone" type="tel" ac="tel" hint="For delivery questions only" /></div>
        <label className="chk"><input type="checkbox" defaultChecked />Email me shipping and tracking updates</label>
        <div><button type="button" className="btn btn-dark" onClick={A.coNext}>Continue to Shipping Address</button></div>
      </>
    ),
    () => (
      <>
        <div className="grid2 keep"><Inp f="first" label="First name" ac="given-name" /><Inp f="last" label="Last name" ac="family-name" /></div>
        <Inp f="addr1" label="Street address" ac="address-line1" /><Inp f="addr2" label="Apartment, suite, unit (optional)" ac="address-line2" />
        <div className="grid3">
          <Inp f="city" label="City" ac="address-level2" />
          <div className="field"><label htmlFor="co-state">State</label><select className="select" id="co-state" value={c.state} onChange={e => A.coInput('state', e.target.value)}>{STATES.map(s => <option key={s}>{s}</option>)}</select></div>
          <Inp f="zip" label="ZIP code" ac="postal-code" />
        </div>
        <div className="field"><label htmlFor="co-country">Country</label><select className="select" id="co-country" value={c.country} onChange={e => A.coInput('country', e.target.value)}><option>United States</option></select></div>
        <div><button type="button" className="btn btn-dark" onClick={A.coNext}>Continue to Shipping Method</button></div>
      </>
    ),
    () => (
      <>
        {SHIP_METHODS.map(x => { const cost = x.id === 'standard' ? (t.sub - t.disc >= 149 ? 0 : 12.95) : x.cost; return (
          <label className={cx('radio-card', c.ship === x.id && 'on')} key={x.id}><input type="radio" name="ship" value={x.id} checked={c.ship === x.id} onChange={() => A.ship(x.id)} /><span className="rc-t"><b>{x.name}</b><small>{x.eta} · arrives {etaRange(x.id)}</small></span><span className="rc-p">{cost ? money(cost) : 'FREE'}</span></label>
        ); })}
        <div><button type="button" className="btn btn-dark" onClick={A.coNext}>Continue to Payment</button></div>
      </>
    ),
    () => (
      <>
        <div className="testnote"><Icon n="info" /><div><b>Prototype: Stripe test mode.</b> 4242 4242 4242 4242 is Stripe's public test card. No real payment is processed in this demo.</div></div>
        <div className="stripe"><div className="stripe-h"><span><Icon n="lock" /> Card details are sent directly to</span><b>stripe</b></div><div className="stripe-b">
          <Inp f="cardName" label="Name on card" ac="cc-name" />
          <div className="field cardnum"><label htmlFor="co-cardNum">Card number</label><div style={{ position: 'relative' }}><input className={cx('input', ui.errs.cardNum && 'err')} id="co-cardNum" value={c.cardNum} onChange={e => A.coInput('cardNum', e.target.value)} inputMode="numeric" autoComplete="cc-number" /><span className="brandmark">VISA</span></div>{ui.errs.cardNum ? <span className="errtxt">{ui.errs.cardNum}</span> : null}</div>
          <div className="grid2 keep"><Inp f="exp" label="Expiry (MM / YY)" ac="cc-exp" /><Inp f="cvc" label="Security code" ac="cc-csc" /></div>
        </div></div>
        <label className="chk"><input type="checkbox" checked={c.billSame} onChange={e => A.billSame(e.target.checked)} />Billing address is the same as shipping</label>
        <div><button type="button" className="btn btn-dark" onClick={A.coNext}>Continue to Review</button></div>
      </>
    ),
    () => (
      <>
        <div className="stack" style={{ gap: 12 }}>{S.cart.map(l => { const p = P(S, l.id); return <div className="mini-line" key={l.id}><div className="pimg"><Art kind={p.art} /><span className="q">{l.qty}</span></div><div><b style={{ fontSize: 14 }}>{p.brand} {p.name}</b><div style={{ marginTop: 6, display: 'inline-flex' }}><FitBadge p={p} /></div></div><b className="num">{money(eff(p) * l.qty)}</b></div>; })}</div>
        <hr className="hr" />
        <dl className="kv"><dt>Ship to</dt><dd>{summaries[1]}</dd><dt>Shipping</dt><dd>{summaries[2]}</dd><dt>Estimated delivery</dt><dd>{etaRange(c.ship)}</dd><dt>Payment</dt><dd>{summaries[3]}</dd>{v ? <><dt>Vehicle</dt><dd>{vname(v)} · {v.engine}</dd></> : null}</dl>
        <hr className="hr" />
        <div className="stack" style={{ gap: 8 }}>
          <div className="sumrow"><span>Subtotal</span><span>{money(t.sub)}</span></div>{t.disc ? <div className="sumrow disc"><span>Discount (TURBO10)</span><span>−{money(t.disc)}</span></div> : null}
          <div className="sumrow"><span>Shipping</span><span>{t.ship ? money(t.ship) : 'FREE'}</span></div><div className="sumrow"><span>Tax</span><span>{money(t.tax)}</span></div>
          <div className="sumrow total"><span>Total</span><span>{money(t.total)}</span></div>
        </div>
        <p className="small muted">By placing your order you agree to TurboBolton's Terms of Sale and Return Policy.</p>
        <button type="button" className="btn btn-primary btn-lg btn-block" onClick={A.placeOrder}><Icon n="lock" />Place Order · {money(t.total)}</button>
      </>
    ),
  ];
  return (
    <>
      <CoHdr secure />
      <div className="wrap">
        <div className="co-steps" aria-label="Checkout progress">{CO_STEPS.map((s, i) => <div key={s} className={cx(i + 1 < step && 'done', i + 1 === step && 'on')}>Step {i + 1} · {s}</div>)}</div>
        <div className="co-l">
          <div>
            {CO_STEPS.map((s, i) => { const n = i + 1, state = n < step ? 'done' : n === step ? 'on' : 'todo'; return (
              <section className={`co-step ${state}`} key={s}>
                <div className="co-step-h"><span className="n">{state === 'done' ? <Icon n="check" /> : n}</span><h3>{s}</h3>{state === 'done' ? <button type="button" className="btn-link edit" onClick={() => A.coEdit(n)}>Edit</button> : null}</div>
                {state === 'done' && summaries[i] ? <div className="co-step-sum">{summaries[i]}</div> : null}{state === 'on' ? <div className="co-step-b">{bodies[i]()}</div> : null}
              </section>
            ); })}
            <Go to="cart" className="btn btn-ghost btn-sm"><Icon n="chevL" />Return to cart</Go>
          </div>
          <aside className="card summary">
            <h3>Order Summary</h3>
            {S.cart.map(l => { const p = P(S, l.id); return <div className="mini-line" key={l.id}><div className="pimg"><Art kind={p.art} /><span className="q">{l.qty}</span></div><span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{p.brand} {p.name}</span><b className="num" style={{ fontSize: 14 }}>{money(eff(p) * l.qty)}</b></div>; })}
            <hr className="hr" />
            <div className="sumrow"><span>Subtotal</span><span>{money(t.sub)}</span></div>
            {t.disc ? <div className="sumrow disc"><span>Discount</span><span>−{money(t.disc)}</span></div> : null}
            <div className="sumrow"><span>Shipping</span><span>{step >= 3 ? (t.ship ? money(t.ship) : 'FREE') : <span className="muted small">Next steps</span>}</span></div>
            <div className="sumrow"><span>Tax</span><span>{money(t.tax)}</span></div>
            <div className="sumrow total"><span>Total</span><span>{money(t.total)}</span></div>
            {v ? <div className="fit fit-ok"><Icon n="check" />All parts checked against your {vname(v)}</div> : null}
            <div className="secure"><Icon n="lock" />256-bit encryption · Stripe</div>
          </aside>
        </div>
      </div>
    </>
  );
}
