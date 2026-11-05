/* Order confirmation and Track Order pages */
import { SHIP_METHODS } from '../data';
import { Icon } from '../lib/icons';
import { fmtDate, fmtTime, money, plural, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { AddrBlock, Crumbs, Go, NoOrder, OrderItems, OrderTotals, Timeline } from '../components/common';

export function Confirm() {
  const { S } = useStore();
  const A = useActions();
  const o = S.order;
  if (!o) return <div className="wrap"><NoOrder /></div>;
  const m = SHIP_METHODS.find(x => x.id === o.ship);
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <div className="conf-hero"><span className="big-check"><Icon n="check" /></span><h1>Thank You for Your Order</h1>
        <p className="muted" style={{ fontSize: 17 }}>Order <b className="mono" style={{ color: 'var(--text)' }}>{o.num}</b> is confirmed. A receipt is on its way to <b style={{ color: 'var(--text)' }}>{o.addr.email}</b>.</p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 10 }}><Go to="track" className="btn btn-primary"><Icon n="truck" />Track Order</Go><Go to="account-order" className="btn btn-dark">View Order</Go><button type="button" className="btn" onClick={A.shopVehicle}>Continue Shopping</button></div></div>
      <div className="conf-grid">
        <div className="card pad stack"><h3>Products purchased</h3><OrderItems o={o} /><hr className="hr" /><OrderTotals o={o} /></div>
        <div className="stack">
          <div className="card pad stack" style={{ gap: 10 }}><h3>Delivery</h3><dl className="kv"><dt>Ship to</dt><dd><AddrBlock a={o.addr} /></dd><dt>Method</dt><dd>{m.name} ({m.eta})</dd><dt>Estimated delivery</dt><dd><b>{o.eta}</b></dd>{o.vehicle ? <><dt>Vehicle</dt><dd>{vname(o.vehicle)}</dd></> : null}</dl></div>
          <div className="card pad stack" style={{ gap: 10 }}><h3>Payment</h3><dl className="kv"><dt>Method</dt><dd>Visa ending in {o.last4}</dd><dt>Status</dt><dd><span className="badge badge-ok"><Icon n="check" />Paid {money(o.totals.total)}</span></dd><dt>Processor</dt><dd>Stripe (test mode)</dd></dl></div>
          <div className="callout info"><Icon n="info" /><div><b>What happens next:</b> our team picks and packs your order, then emails tracking as soon as it ships.</div></div>
        </div>
      </div>
    </div>
  );
}

export function Track() {
  const { S } = useStore();
  const A = useActions();
  const o = S.order;
  if (!o) return <div className="wrap"><Crumbs items={[['Home', 'home'], ['Track order', '']]} /><NoOrder /></div>;
  const shipped = o.status === 'Shipped' || o.status === 'Delivered';
  return (
    <div className="wrap" style={{ paddingBottom: 56 }}>
      <Crumbs items={[['Account', 'account'], ['Orders', 'account-orders'], [o.num, '']]} />
      <div className="row between" style={{ marginBottom: 22 }}>
        <div><h1>Track Order <span className="mono" style={{ fontSize: '.6em' }}>{o.num}</span></h1><p className="muted" style={{ marginTop: 6 }}>Placed {fmtTime(o.placed)} · {plural(o.items.reduce((a, l) => a + l.qty, 0), 'item')} · {money(o.totals.total)}</p></div>
        <div className="row"><span className={`st st-${o.status}`} style={{ fontSize: 13, padding: '6px 12px' }}>{o.status === 'New' ? 'Order received' : o.status}</span><button type="button" className="btn btn-sm" onClick={A.refresh}><Icon n="refresh" />Refresh</button></div>
      </div>
      <div className="card pad" style={{ padding: '28px 20px' }}><Timeline o={o} /></div>
      <div className="tracking-box" style={{ marginTop: 16 }}>
        <div><small>Carrier</small><b>{shipped ? o.carrier : '—'}</b><span className="small muted">{shipped ? SHIP_METHODS.find(x => x.id === o.ship).name : 'Assigned when shipped'}</span></div>
        <div><small>Tracking number</small><b className="mono">{shipped ? o.tracking : '—'}</b>{shipped ? <button type="button" className="btn-link small" onClick={() => A.copy(o.tracking)}><Icon n="copy" />Copy</button> : <span className="small muted">Emailed when your order ships</span>}</div>
        <div><small>Estimated delivery</small><b>{o.status === 'Delivered' ? 'Delivered ' + fmtDate(o.history.find(h => h.s === 'Delivered').t) : o.eta}</b><span className="small muted">to {o.addr.city}, {o.addr.state} {o.addr.zip}</span></div>
      </div>
      {!shipped ? <div className="callout" style={{ marginTop: 16 }}><Icon n="info" /><div><b>Presenter tip:</b> switch to the Admin portal, open order {o.num} and mark it Processing, then Shipped with a tracking number. Come back here and this page shows the carrier and tracking. <Go to="admin-order" className="btn-link">Open order in Admin portal</Go></div></div> : null}
      <div className="conf-grid" style={{ marginTop: 20 }}>
        <div className="card pad stack"><h3>Items in this order</h3><OrderItems o={o} /></div>
        <div className="card pad stack" style={{ gap: 10 }}><h3>Shipping to</h3><p style={{ fontSize: 14 }}><AddrBlock a={o.addr} /></p><hr className="hr" /><p className="small muted">Questions about this order? Call (800) 555-0142 and mention <span className="mono">{o.num}</span>.</p></div>
      </div>
    </div>
  );
}
