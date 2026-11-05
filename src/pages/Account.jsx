import { SHIP_METHODS } from '../data';
import { Icon } from '../lib/icons';
import { cx, fmtDate, fmtTime, money, sameV, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { P } from '../store/selectors';
import { AddrBlock, Crumbs, Go, NoOrder, OrderItems, OrderTotals, ProductCard, Soon } from '../components/common';

const ACCT_NAV = [['account', 'Dashboard', 'gauge'], ['account-profile', 'Profile', 'user'], ['account-garage', 'My Garage', 'car'], ['account-orders', 'Orders', 'box'], ['account-addresses', 'Addresses', 'pin'], ['account-wishlist', 'Wishlist', 'heart'], ['account-recent', 'Recently Viewed', 'clock'], ['account-settings', 'Account Settings', 'cog']];
const PAST = [{ num: 'TB-100317', date: 'Aug 14, 2026', what: 'Michelin Pilot Sport 4S 275/35ZR19 × 4', total: 1554.47, status: 'Delivered' }, { num: 'TB-100122', date: 'Mar 3, 2026', what: 'NGK Ruthenium HX Spark Plugs, Set of 6', total: 97.36, status: 'Delivered' }];

function OrdersTable() {
  const { S, go } = useStore();
  const o = S.order;
  return (
    <div className="card tbl-wrap"><table className="tbl">
      <thead><tr><th>Order</th><th>Date</th><th>Items</th><th className="r">Total</th><th>Status</th><th></th></tr></thead>
      <tbody>
        {o ? <tr className="click hl-new" onClick={() => go('track')}><td className="mono">{o.num}</td><td>{fmtDate(o.placed)}</td><td>{o.items.map(l => P(S, l.id).brand + ' ' + P(S, l.id).name).join(', ')}</td><td className="r num">{money(o.totals.total)}</td><td><span className={`st st-${o.status}`}>{o.status}</span></td><td><Go to="track" className="btn btn-sm">Track</Go></td></tr> : null}
        {PAST.map(x => <tr key={x.num}><td className="mono">{x.num}</td><td>{x.date}</td><td>{x.what}</td><td className="r num">{money(x.total)}</td><td><span className={`st st-${x.status}`}>{x.status}</span></td><td><Soon m="Sample order history" className="btn btn-sm">Details</Soon></td></tr>)}
      </tbody>
    </table></div>
  );
}

function AcctPage({ r }) {
  const { S, ui } = useStore();
  const A = useActions();
  const v = S.vehicle, o = S.order;
  switch (r) {
    case 'account': return (
      <>
        <div><h1>Welcome back, Daniel</h1><p className="muted" style={{ marginTop: 6 }}>Member since March 2025 · daniel.okafor@example.com</p></div>
        <div className="acct-tiles">
          <div className="card pad stack" style={{ gap: 8 }}><span className="lbl muted">Active vehicle</span>{v ? <><b style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>{vname(v)}</b><span className="small muted">{v.engine}</span><button type="button" className="btn btn-sm" onClick={A.shopVehicle}>Shop parts</button></> : <><span>No vehicle selected</span><button type="button" className="btn btn-sm" onClick={A.openVehicle}>Select vehicle</button></>}</div>
          <div className="card pad stack" style={{ gap: 8 }}><span className="lbl muted">Latest order</span>{o ? <><b className="mono">{o.num}</b><span className={`st st-${o.status}`} style={{ alignSelf: 'flex-start' }}>{o.status}</span><Go to="track" className="btn btn-sm">Track order</Go></> : <><b className="mono">TB-100317</b><span className="st st-Delivered" style={{ alignSelf: 'flex-start' }}>Delivered</span><Go to="account-orders" className="btn btn-sm">View orders</Go></>}</div>
          <div className="card pad stack" style={{ gap: 8 }}><span className="lbl muted">Wishlist</span><b style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>{S.wishlist.length} saved parts</b><span className="small muted">{S.garage.length + (v && !S.garage.some(g => sameV(g, v)) ? 1 : 0)} vehicles in My Garage</span><Go to="account-wishlist" className="btn btn-sm">View wishlist</Go></div>
        </div>
        <div className="stack" style={{ gap: 10 }}><div className="row between"><h3>Recent orders</h3><Go to="account-orders" className="btn-link">All orders <Icon n="arrowR" /></Go></div><OrdersTable /></div>
        <div className="stack" style={{ gap: 10 }}><h3>Recently viewed</h3><div className="pgrid">{S.recent.slice(0, 4).map(id => P(S, id)).filter(Boolean).map(p => <ProductCard key={p.id} p={p} />)}</div></div>
      </>
    );
    case 'account-profile': return (
      <>
        <h1>Profile</h1>
        <div className="card form-sec"><div className="grid2"><div className="field"><label htmlFor="pf1">First name</label><input className="input" id="pf1" defaultValue="Daniel" /></div><div className="field"><label htmlFor="pf2">Last name</label><input className="input" id="pf2" defaultValue="Okafor" /></div><div className="field"><label htmlFor="pf3">Email</label><input className="input" id="pf3" defaultValue="daniel.okafor@example.com" /></div><div className="field"><label htmlFor="pf4">Phone</label><input className="input" id="pf4" defaultValue="(512) 555-0187" /></div></div><div><Soon m="Profile saved" className="btn btn-dark">Save changes</Soon></div></div>
      </>
    );
    case 'account-garage': {
      const list = S.garage.slice();
      if (v && !list.some(g => sameV(g, v))) list.unshift({ id: 'active', ...v, unsaved: true });
      return (
        <>
          <div className="row between"><div><h1>My Garage</h1><p className="muted" style={{ marginTop: 6 }}>Save your vehicles. The active vehicle shows fitment on every product.</p></div><button type="button" className="btn btn-primary" onClick={A.addVehicle}><Icon n="plus" />Add Another Vehicle</button></div>
          <div className="garage-grid">
            {list.map(g => { const active = sameV(g, v); return (
              <div className={cx('card vcard', active && 'active')} key={g.id}>
                <div className="vc-top"><span className="vc-ic"><Icon n="car" /></span><div style={{ flex: 1, minWidth: 0 }}><div className="row" style={{ gap: 8 }}>{active ? <span className="badge badge-ok"><Icon n="check" />Active vehicle</span> : null}{g.unsaved ? <span className="badge badge-warn">Not saved</span> : null}</div><div className="vc-n" style={{ marginTop: 6 }}>{vname(g)}</div><div className="small muted">{g.engine}</div></div></div>
                {ui.confirmRemove === g.id ? (
                  <div className="callout" style={{ padding: '10px 12px' }}><Icon n="alert" /><div>Remove {vname(g)} from My Garage? <div className="row" style={{ marginTop: 8 }}><button type="button" className="btn btn-sm btn-dark" onClick={() => A.removeVehicle(g.id)}>Remove</button><button type="button" className="btn btn-sm" onClick={A.cancelRemove}>Cancel</button></div></div></div>
                ) : (
                  <div className="vc-acts">
                    <button type="button" className="btn btn-sm btn-primary" onClick={() => A.shopGarage(g.id)}><Icon n="search" />Shop Parts</button>
                    {!active && !g.unsaved ? <button type="button" className="btn btn-sm btn-dark" onClick={() => A.setActive(g.id)}><Icon n="check" />Set as active</button> : null}
                    {g.unsaved ? <button type="button" className="btn btn-sm btn-dark" onClick={A.saveGarage}><Icon n="plus" />Save</button> : <><button type="button" className="btn btn-sm" onClick={() => A.editVehicle(g.id)}><Icon n="edit" />Edit Vehicle</button><button type="button" className="btn btn-sm btn-ghost" onClick={() => A.askRemove(g.id)} style={{ color: 'var(--err)' }}><Icon n="trash" />Remove Vehicle</button></>}
                  </div>
                )}
              </div>
            ); })}
            <button type="button" className="addveh" onClick={A.addVehicle}><Icon n="plus" />Add Another Vehicle</button>
          </div>
        </>
      );
    }
    case 'account-orders': return <><h1>Orders</h1><OrdersTable /></>;
    case 'account-order': {
      if (!o) return <NoOrder />;
      const m = SHIP_METHODS.find(x => x.id === o.ship);
      return (
        <>
          <div className="row between"><div><h1>Order <span className="mono" style={{ fontSize: '.7em' }}>{o.num}</span></h1><p className="muted" style={{ marginTop: 6 }}>Placed {fmtTime(o.placed)}</p></div><div className="row"><span className={`st st-${o.status}`}>{o.status}</span><Go to="track" className="btn btn-primary btn-sm"><Icon n="truck" />Track Order</Go></div></div>
          <div className="card pad stack"><OrderItems o={o} /><hr className="hr" /><OrderTotals o={o} /></div>
          <div className="grid2"><div className="card pad stack" style={{ gap: 8 }}><h4>Shipping address</h4><p className="small"><AddrBlock a={o.addr} /></p></div><div className="card pad stack" style={{ gap: 8 }}><h4>Delivery & payment</h4><p className="small">{m.name} · {m.eta}<br />Estimated {o.eta}<br />Visa ending in {o.last4} · Paid</p></div></div>
        </>
      );
    }
    case 'account-addresses': return (
      <>
        <div className="row between"><h1>Addresses</h1><Soon m="Address form opens here" className="btn btn-dark btn-sm"><Icon n="plus" />Add address</Soon></div>
        <div className="garage-grid">
          <div className="card pad stack" style={{ gap: 8 }}><span className="badge badge-dark" style={{ alignSelf: 'flex-start' }}>Default shipping</span><p><AddrBlock a={S.co} /></p><div className="row"><button type="button" className="btn btn-sm">Edit</button></div></div>
          <div className="card pad stack" style={{ gap: 8 }}><span className="badge" style={{ alignSelf: 'flex-start' }}>Work</span><p>Daniel Okafor<br />410 Congress Ave, Floor 9<br />Austin, TX 78701<br />United States</p><div className="row"><button type="button" className="btn btn-sm">Edit</button><button type="button" className="btn btn-sm btn-ghost">Set as default</button></div></div>
        </div>
      </>
    );
    case 'account-wishlist': return <><h1>Wishlist</h1>{S.wishlist.length ? <div className="pgrid c3">{S.wishlist.map(id => P(S, id)).filter(Boolean).map(p => <ProductCard key={p.id} p={p} />)}</div> : <div className="card empty"><Icon n="heart" /><h3>No saved parts yet</h3><p className="muted">Tap the heart on any product to save it here.</p></div>}</>;
    case 'account-recent': return <><h1>Recently Viewed</h1><div className="pgrid c3">{S.recent.map(id => P(S, id)).filter(Boolean).map(p => <ProductCard key={p.id} p={p} />)}</div></>;
    case 'account-settings': return (
      <>
        <h1>Account Settings</h1>
        <div className="card form-sec"><h3>Password</h3><div className="grid2"><div className="field"><label htmlFor="pw1">Current password</label><input className="input" id="pw1" type="password" defaultValue="password123" /></div><div className="field"><label htmlFor="pw2">New password</label><input className="input" id="pw2" type="password" placeholder="At least 10 characters" /></div></div><div><Soon m="Password updated" className="btn btn-dark btn-sm">Update password</Soon></div></div>
        <div className="card form-sec"><h3>Email preferences</h3><label className="chk"><input type="checkbox" defaultChecked />Order and shipping updates</label><label className="chk"><input type="checkbox" defaultChecked />New parts for vehicles in My Garage</label><label className="chk"><input type="checkbox" />Deals and promotions</label></div>
        <div className="card form-sec"><h3>Close account</h3><p className="small muted">Closing your account removes your garage, wishlist and saved addresses. Order history is kept for tax records.</p><div><Soon m="Account closure requires email confirmation" className="btn btn-sm" style={{ color: 'var(--err)' }}>Close account</Soon></div></div>
      </>
    );
    default: return null;
  }
}

export default function Account({ r }) {
  const { go } = useStore();
  const A = useActions();
  const title = (ACCT_NAV.find(x => x[0] === r) || [, 'Order details'])[1];
  return (
    <div className="wrap">
      <Crumbs items={[['Home', 'home'], ['Account', r === 'account' ? '' : 'account'], ...(r === 'account' ? [] : [[title, '']])]} />
      <div className="acct">
        <nav className="card acct-nav" aria-label="Account">
          {ACCT_NAV.map(([to, l, i]) => <button type="button" key={to} className={cx((r === to || (r === 'account-order' && to === 'account-orders')) && 'on')} onClick={() => go(to)}><Icon n={i} />{l}</button>)}
          <hr /><button type="button" onClick={A.logout}><Icon n="logout" />Logout</button>
        </nav>
        <section className="stack" style={{ gap: 20, minWidth: 0 }}><AcctPage r={r} /></section>
      </div>
    </div>
  );
}
