/* ==========================================================
   Admin portal: shell, sign in, dashboard, orders, products,
   inventory and the simple list sections
   ========================================================== */
import { useState } from 'react';
import { ADMIN_SECTIONS, BRANDS, CARRIERS, CATEGORIES, SHIP_METHODS } from '../data';
import { Icon, LogoMark } from '../lib/icons';
import { Art, HeroWheel } from '../lib/art';
import { cx, fmtDate, fmtTime, money, plural, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { P, allOrders, allProducts, avail, eff, fitOf, inv, lowStock, onSale, pendingCount } from '../store/selectors';
import { AddrBlock, Drawer, Go, LogoStatic, Modal, OrderTotals, OrdersTbl, Soon } from '../components/common';
import { VIEWS } from '../pages/Product';

const ADM_NAV = [
  ['Overview', [['admin', 'Dashboard', 'gauge']]],
  ['Catalog', [['admin-products', 'Products', 'box'], ['admin-x-categories', 'Categories', 'grid'], ['admin-x-brands', 'Brands', 'tag'], ['admin-x-fitment', 'Vehicle Fitment', 'car'], ['admin-inventory', 'Inventory', 'layers']]],
  ['Sales', [['admin-orders', 'Orders', 'list'], ['admin-x-customers', 'Customers', 'users'], ['admin-x-promotions', 'Promotions', 'tag'], ['admin-x-returns', 'Returns', 'ret']]],
  ['Business', [['admin-x-reports', 'Reports', 'chart'], ['admin-x-users', 'Users', 'users'], ['admin-x-settings', 'Settings', 'cog']]],
];

export function AdmNav({ active }) {
  const { S, go } = useStore();
  return ADM_NAV.map(([g, items]) => (
    <span key={g} style={{ display: 'contents' }}>
      <div className="grp">{g}</div>
      {items.map(([to, l, i]) => {
        const on = active === to || (to === 'admin-orders' && active === 'admin-order') || (to === 'admin-products' && active.startsWith('admin-product'));
        const cnt = to === 'admin-orders' ? pendingCount(S) : to === 'admin-inventory' ? lowStock(S).length : 0;
        return <button type="button" key={to} className={cx(on && 'on')} onClick={() => go(to)}><Icon n={i} />{l}{cnt ? <span className="navcnt">{cnt}</span> : null}</button>;
      })}
    </span>
  ));
}

function AdmShell({ active, children }) {
  const { go } = useStore();
  const A = useActions();
  return (
    <div className="adm">
      <aside className="adm-side">
        <button type="button" className="logo" onClick={() => go('admin')}><span className="logo-mark"><LogoMark /></span><span><span className="logo-word">Turbo<span>Bolton</span></span><span className="adm-tag">Admin portal</span></span></button>
        <nav className="adm-nav" aria-label="Admin"><AdmNav active={active} /></nav>
      </aside>
      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="icon-btn adm-burger" onClick={A.admMenu} aria-label="Open menu"><Icon n="menu" /></button>
          <div className="asearch"><Icon n="search" /><input className="input" id="admq" placeholder="Search orders, products, customers" aria-label="Search admin" /></div>
          <div className="adm-user"><Go to="home" className="btn btn-sm"><Icon n="store" /><span>View store</span></Go><span className="avatar">JE</span><span className="who"><b>Jordan Ellis</b><br /><span className="small muted">Store Manager</span></span><button type="button" className="icon-btn" onClick={A.admLogout} aria-label="Sign out"><Icon n="logout" /></button></div>
        </header>
        <div className="adm-body">{children}</div>
      </div>
    </div>
  );
}

export function AdmMenuDrawer() {
  const { route } = useStore();
  return (
    <Drawer title="Admin menu" style={{ background: 'var(--ink)' }} headStyle={{ borderColor: 'var(--ink-3)' }} head={<LogoStatic wordStyle={{ color: '#fff' }} />} bodyStyle={{ padding: 0 }}>
      <nav className="adm-nav" style={{ padding: '8px 10px' }}><AdmNav active={route} /></nav>
    </Drawer>
  );
}

export default function AdminRoute({ r }) {
  const { S } = useStore();
  if (r === 'admin-login' || !S.admin) return <AdminLogin />;
  let body;
  if (r === 'admin') body = <Dashboard />;
  else if (r === 'admin-orders') body = <Orders />;
  else if (r === 'admin-order') body = <OrderDetail />;
  else if (r === 'admin-products') body = <Products />;
  else if (r === 'admin-product-new') body = <ProductForm key="new" id={null} />;
  else if (r.startsWith('admin-product-')) body = <ProductForm key={r} id={r.slice(14)} />;
  else if (r === 'admin-inventory') body = <Inventory />;
  else if (r.startsWith('admin-x-')) body = <Section k={r.slice(8)} />;
  else { r = 'admin'; body = <Dashboard />; }
  return <AdmShell active={r}>{body}</AdmShell>;
}

function AdminLogin() {
  const A = useActions();
  return (
    <div className="adm-login">
      <div className="al-art"><HeroWheel /><span className="logo" style={{ position: 'relative' }}><span className="logo-mark"><LogoMark /></span><span className="logo-word">Turbo<span>Bolton</span></span></span>
        <div style={{ position: 'relative' }}><span className="eyebrow">Admin portal</span><h1 style={{ fontSize: 44, textTransform: 'uppercase', marginTop: 10, lineHeight: 1 }}>Run the shop<br />from one place.</h1><p style={{ color: '#C3CCD8', marginTop: 12, maxWidth: '40ch' }}>Orders, products, vehicle fitment and inventory for the TurboBolton team. Works on desktop, tablet and phone browsers.</p></div>
        <span className="small" style={{ color: 'var(--ink-muted)', position: 'relative' }}>Staff access only · Activity is logged</span></div>
      <div className="al-form"><form onSubmit={e => { e.preventDefault(); A.admLogin(); }}>
        <div><h2>Sign in</h2><p className="muted" style={{ marginTop: 6 }}>Use your TurboBolton staff account.</p></div>
        <div className="field"><label htmlFor="al-e">Email</label><input className="input" id="al-e" type="email" defaultValue="jordan@turbobolton.example" autoComplete="username" /></div>
        <div className="field"><label htmlFor="al-p">Password</label><input className="input" id="al-p" type="password" defaultValue="demo-password" autoComplete="current-password" /></div>
        <div className="row between"><label className="chk"><input type="checkbox" defaultChecked />Keep me signed in</label><Soon m="Password reset email sent" className="btn-link small">Forgot password?</Soon></div>
        <button className="btn btn-dark btn-lg btn-block"><Icon n="lock" />Sign In</button>
        <p className="small muted">Prototype: credentials are prefilled. Two-step verification is planned for production.</p>
      </form></div>
    </div>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard() {
  const { S, go } = useStore();
  const A = useActions();
  const o = S.order;
  const today = o && new Date(o.placed).toDateString() === new Date().toDateString() ? o.totals.total : 0;
  const pend = pendingCount(S), low = lowStock(S), orders = allOrders(S);
  const Kpi = ({ l, i, v, d, attn }) => <div className={cx('card kpi', attn && 'attn')}><small><Icon n={i} />{l}</small><b>{v}</b><span className="delta">{d}</span></div>;
  return (
    <>
      <div className="adm-h"><div><h1>Dashboard</h1><p>{fmtDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · Sample data</p></div><div className="row"><Go to="admin-product-new" className="btn btn-sm"><Icon n="plus" />Add product</Go><Go to="admin-orders" className="btn btn-sm btn-dark"><Icon n="list" />View orders</Go></div></div>
      {o && o.status === 'New' ? <div className="callout info" style={{ alignItems: 'center' }}><Icon n="bolt" /><div style={{ flex: 1 }}><b>New order {o.num}</b> from {o.addr.first} {o.addr.last} · {money(o.totals.total)} · paid by card</div><Go to="admin-order" className="btn btn-primary btn-sm">Open order</Go></div> : null}
      <div className="kpis">
        <Kpi l="Today's Sales" i="dollar" v={money(8214.37 + today).replace(/\.\d\d$/, '')} d="+12% vs. last Thu" />
        <Kpi l="Orders" i="list" v={14 + (today ? 1 : 0)} d="today" />
        <Kpi l="Revenue" i="chart" v={'$' + Math.round(186420 + today).toLocaleString()} d="last 30 days" />
        <Kpi l="Customers" i="users" v="2,318" d="+46 this month" />
        <Kpi l="Low Stock" i="alert" v={low.length} d="items need reorder" attn={low.length > 0} />
        <Kpi l="Pending Orders" i="clock" v={pend} d="to process" attn={pend > 0} />
      </div>
      <div className="adm-2col">
        <div className="card"><div className="panel-h"><h3>Recent Orders</h3><Go to="admin-orders" className="btn-link">All orders <Icon n="arrowR" /></Go></div><OrdersTbl rows={orders.slice(0, 6)} compact /></div>
        <div className="stack">
          <div className="card"><div className="panel-h"><h3>Low Stock</h3><Go to="admin-inventory" className="btn-link">Inventory <Icon n="arrowR" /></Go></div>
            <div className="stack" style={{ padding: '14px 18px', gap: 12 }}>{low.length ? low.map(p => <div className="row" key={p.id} style={{ flexWrap: 'nowrap' }}><span className="thumb"><Art kind={p.art} /></span><span style={{ flex: 1, minWidth: 0, fontSize: 14 }}><b>{p.brand}</b> {p.name}<br /><span className="mono muted">{p.sku}</span></span><span className={`st ${avail(S, p.id) ? 'st-Low' : 'st-Out'}`}>{avail(S, p.id)} left</span></div>) : <span className="muted">All products above reorder level.</span>}</div></div>
          <div className="card"><div className="panel-h"><h3>Pending Orders</h3></div><div className="stack" style={{ padding: '14px 18px', gap: 10 }}>{orders.filter(x => x.status === 'New' || x.status === 'Processing').map(x => <button type="button" key={x.num} className="row between" style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', flexWrap: 'nowrap' }} onClick={() => (x.demo ? go('admin-order') : A.sampleOrder())}><span><b className="mono">{x.num}</b><br /><span className="small muted">{x.customer} · {money(x.total)}</span></span><span className={`st st-${x.status}`}>{x.status}</span></button>)}</div></div>
        </div>
      </div>
    </>
  );
}

/* ---------- Orders ---------- */
function Orders() {
  const { S, ui } = useStore();
  const A = useActions();
  const tabs = ['All', 'New', 'Processing', 'Shipped', 'Delivered'];
  const orders = allOrders(S);
  const rows = orders.filter(x => ui.orderTab === 'All' || x.status === ui.orderTab);
  return (
    <>
      <div className="adm-h"><div><h1>Orders</h1><p>{orders.length} orders · {pendingCount(S)} need action</p></div><Soon m="CSV export started" className="btn btn-sm">Export CSV</Soon></div>
      {!S.order ? <div className="callout"><Icon n="info" /><div style={{ flex: 1 }}><b>No demo order yet.</b> Place one on the storefront, or create a sample order to run the admin demo.</div><button type="button" className="btn btn-sm btn-dark" onClick={A.seedOrder}>Create sample order</button></div> : null}
      <div className="card">
        <div className="panel-h"><div className="ordertabs">{tabs.map(t => <button type="button" key={t} className={cx(ui.orderTab === t && 'on')} onClick={() => A.orderTab(t)}>{t} <span className="num">{t === 'All' ? orders.length : orders.filter(x => x.status === t).length}</span></button>)}</div></div>
        {rows.length ? <OrdersTbl rows={rows} compact={false} /> : <div className="empty"><span className="muted">No orders with this status.</span></div>}
      </div>
    </>
  );
}

const FLOW = ['New', 'Processing', 'Shipped', 'Delivered'];
function OrderDetail() {
  const { S, ui } = useStore();
  const A = useActions();
  const [carrier, setCarrier] = useState(CARRIERS[0]);
  const [track, setTrack] = useState('1Z84V9X20344718826');
  const o = S.order;
  if (!o) return <div className="card empty"><Icon n="box" /><h3>No demo order yet</h3><p className="muted">Place an order on the storefront first, or create a sample order.</p><button type="button" className="btn btn-dark" onClick={A.seedOrder}>Create sample order</button></div>;
  const i = FLOW.indexOf(o.status);
  const m = SHIP_METHODS.find(x => x.id === o.ship);
  let action;
  if (o.status === 'New') action = <div className="stack" style={{ gap: 10, padding: 18 }}><h4>Next step: start processing</h4><p className="small muted">Payment is captured. Mark the order as Processing when the warehouse starts picking. The customer's tracking page updates right away.</p><div><button type="button" className="btn btn-primary" onClick={() => A.admStatus('Processing')}><Icon n="box" />Mark as Processing</button></div></div>;
  else if (o.status === 'Processing') action = (
    <div className="stack" style={{ gap: 12, padding: 18 }}><h4>Next step: ship the order</h4><p className="small muted">Enter the carrier and tracking number. The customer gets a shipping email and sees tracking on their order page.</p>
      <div className="grid2">
        <div className="field"><label htmlFor="shipCarrier">Carrier</label><select className="select" id="shipCarrier" value={carrier} onChange={e => setCarrier(e.target.value)}>{CARRIERS.map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="field"><label htmlFor="shipTrack">Tracking number</label><input className={cx('input mono', ui.errs.track && 'err')} id="shipTrack" value={track} onChange={e => setTrack(e.target.value)} />{ui.errs.track ? <span className="errtxt">{ui.errs.track}</span> : <span className="hint">Prefilled with a sample UPS number</span>}</div>
      </div>
      <label className="chk"><input type="checkbox" defaultChecked />Email the customer their tracking details</label>
      <div><button type="button" className="btn btn-primary" onClick={() => A.admStatus('Shipped', { carrier, track })}><Icon n="truck" />Mark as Shipped</button></div>
    </div>
  );
  else if (o.status === 'Shipped') action = <div className="stack" style={{ gap: 10, padding: 18 }}><h4>Shipped with {o.carrier}</h4><dl className="kv"><dt>Carrier</dt><dd>{o.carrier}</dd><dt>Tracking number</dt><dd className="mono">{o.tracking}</dd><dt>Customer ETA</dt><dd>{o.eta}</dd></dl><div className="row"><button type="button" className="btn btn-primary" onClick={() => A.admStatus('Delivered')}><Icon n="check" />Mark as Delivered</button><Go to="track" className="btn"><Icon n="external" />See customer's tracking page</Go></div></div>;
  else action = <div className="stack" style={{ gap: 10, padding: 18 }}><h4>Order complete</h4><p className="small muted">Delivered {fmtTime(o.history.find(h => h.s === 'Delivered').t)}.</p><div><Go to="track" className="btn"><Icon n="external" />See customer's tracking page</Go></div></div>;
  return (
    <>
      <div><Go to="admin-orders" className="btn-link"><Icon n="chevL" />Orders</Go></div>
      <div className="adm-h"><div><div className="row" style={{ gap: 10 }}><h1>Order <span className="mono" style={{ fontSize: '.7em' }}>{o.num}</span></h1><span className={`st st-${o.status}`}>{o.status}</span></div><p>Placed {fmtTime(o.placed)} · Online store</p></div>
        <div className="row"><Soon m="Packing slip ready to print" className="btn btn-sm">Packing slip</Soon><Go to="track" className="btn btn-sm"><Icon n="external" />Customer view</Go></div></div>
      <div className="card"><div className="panel-h"><h3>Fulfillment status</h3><span className="small muted">Changes are visible on the customer's Track Order page</span></div>
        <div className="status-flow">{FLOW.map((s, k) => <span key={s} style={{ display: 'contents' }}>{k ? <span className={cx('sf-line', k <= i && 'done')}></span> : null}<span className={cx('sf-step', k <= i && 'done', k === i + 1 && 'cur')}><span className="d">{k <= i ? <Icon n="check" /> : null}</span>{s}</span></span>)}</div>
        <hr className="hr" />{action}</div>
      <div className="od-grid">
        <div className="stack">
          <div className="card"><div className="panel-h"><h3>Products</h3><span className="small muted">{plural(o.items.reduce((a, l) => a + l.qty, 0), 'item')}</span></div>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Product</th><th>SKU</th><th className="r">Qty</th><th className="r">Price</th><th className="r">Total</th></tr></thead><tbody>
              {o.items.map(l => { const p = P(S, l.id); return <tr key={l.id}><td><div className="row" style={{ flexWrap: 'nowrap' }}><span className="thumb"><Art kind={p.art} /></span><span><b>{p.brand}</b> {p.name}<br />{o.vehicle && fitOf(S, p, o.vehicle) === 'fits' ? <span className="badge badge-ok" style={{ marginTop: 4 }}><Icon n="check" />Fits {vname(o.vehicle)}</span> : <span className="badge badge-warn" style={{ marginTop: 4 }}>Universal</span>}</span></div></td><td className="mono small">{p.sku}</td><td className="r num">{l.qty}</td><td className="r num">{money(l.price)}</td><td className="r num"><b>{money(l.price * l.qty)}</b></td></tr>; })}
            </tbody></table></div>
            <div style={{ padding: '16px 18px', borderTop: '1px solid var(--line)' }}><OrderTotals o={o} /></div></div>
          <div className="card"><div className="panel-h"><h3>Activity</h3></div><div className="activity">{o.history.slice().reverse().map((h, k) => <div key={k}><span><b>{h.s}</b>{h.note ? ` · ${h.note}` : ''}<small>{fmtTime(h.t)}{h.by ? ' · ' + h.by : ''}</small></span></div>)}</div></div>
        </div>
        <div className="stack">
          <div className="card pad stack" style={{ gap: 10 }}><h4>Customer</h4><div className="row" style={{ flexWrap: 'nowrap' }}><span className="avatar">DO</span><span><b>{o.addr.first} {o.addr.last}</b><br /><span className="small muted">Customer since Mar 2025 · 3 orders</span></span></div><dl className="kv"><dt>Email</dt><dd style={{ overflowWrap: 'anywhere' }}>{o.addr.email}</dd><dt>Phone</dt><dd>{o.addr.phone}</dd></dl></div>
          <div className="card pad stack" style={{ gap: 10 }}><h4>Vehicle</h4>{o.vehicle ? <><div className="fit fit-ok"><Icon n="car" />{vname(o.vehicle)}</div><span className="small muted">{o.vehicle.engine}</span><span className="small">All items verified against this vehicle at checkout.</span></> : <span className="muted">No vehicle selected</span>}</div>
          <div className="card pad stack" style={{ gap: 10 }}><h4>Payment</h4><dl className="kv"><dt>Status</dt><dd><span className="badge badge-ok"><Icon n="check" />Paid</span></dd><dt>Amount</dt><dd className="num">{money(o.totals.total)}</dd><dt>Method</dt><dd>Visa ending in {o.last4}</dd><dt>Stripe ID</dt><dd className="mono small" style={{ overflowWrap: 'anywhere' }}>{o.payId}</dd></dl></div>
          <div className="card pad stack" style={{ gap: 10 }}><h4>Shipping</h4><p className="small"><AddrBlock a={o.addr} /></p><dl className="kv"><dt>Method</dt><dd>{m.name}</dd><dt>ETA</dt><dd>{o.eta}</dd>{o.tracking ? <><dt>Carrier</dt><dd>{o.carrier}</dd><dt>Tracking</dt><dd className="mono small">{o.tracking}</dd></> : null}</dl></div>
        </div>
      </div>
    </>
  );
}

/* ---------- Products ---------- */
function Products() {
  const { S, ui, go } = useStore();
  const A = useActions();
  const q = ui.apq.toLowerCase();
  const all = allProducts(S);
  const rows = all.map(p => P(S, p.id)).filter(p => (!q || `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(q)) && (!ui.apcat || p.cat === ui.apcat));
  return (
    <>
      <div className="adm-h"><div><h1>Products</h1><p>{all.length} products · {all.filter(p => P(S, p.id).status === 'Active').length} active</p></div><Go to="admin-product-new" className="btn btn-primary"><Icon n="plus" />Add Product</Go></div>
      <div className="card">
        <div className="panel-h"><div className="row" style={{ flex: 1 }}><input className="input" id="apq" placeholder="Search name, SKU or brand" value={ui.apq} onChange={e => A.apq(e.target.value)} style={{ maxWidth: 300, minHeight: 40 }} /><select className="select" id="apcat" value={ui.apcat} onChange={e => A.apcat(e.target.value)} style={{ width: 'auto', minHeight: 40 }}><option value="">All categories</option>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}</select></div></div>
        <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th className="r">Price</th><th className="r">Available</th><th>Status</th><th></th></tr></thead><tbody>
          {rows.map(p => { const a = avail(S, p.id), lo = !p.digital && a <= inv(S, p.id).threshold; return (
            <tr key={p.id} className="click" onClick={() => go('admin-product-' + p.id)}>
              <td><div className="row" style={{ flexWrap: 'nowrap' }}><span className="thumb"><Art kind={p.art} /></span><span style={{ minWidth: 180 }}><b>{p.brand}</b><br /><span className="small">{p.name}</span></span></div></td>
              <td className="mono small">{p.sku}</td><td>{p.cat}</td>
              <td className="r num">{onSale(p) ? <><s className="muted small">{money(p.price)}</s><br /><b style={{ color: 'var(--brand-d)' }}>{money(eff(p))}</b></> : money(p.price)}</td>
              <td className="r num">{p.digital ? '∞' : <span className={lo ? 'st ' + (a ? 'st-Low' : 'st-Out') : ''}>{a}</span>}</td>
              <td><span className={`st st-${p.status}`}>{p.status}</span></td>
              <td><button type="button" className="btn btn-sm" onClick={e => { e.stopPropagation(); go('admin-product-' + p.id); }}><Icon n="edit" />Edit</button></td>
            </tr>
          ); })}
        </tbody></table></div>
      </div>
    </>
  );
}

function ProductForm({ id }) {
  const { S, ui } = useStore();
  const A = useActions();
  const p = id ? P(S, id) : null;
  if (id && !p) return <div className="card empty"><h3>Product not found</h3><Go to="admin-products" className="btn">Back to products</Go></div>;
  const val = (k, d = '') => (p ? p[k] ?? d : d);
  const iv = p ? inv(S, p.id) : { onHand: '', threshold: 5, reserved: 0 };
  const fits = p ? (p.fit === 'universal' ? [] : p.fit) : [{ make: 'BMW', model: 'M3', from: 2021, to: 2025 }];
  const specs = p ? p.specs : [['Material', ''], ['Weight', '']];
  const margin = p && p.cost ? Math.round((1 - p.cost / eff(p)) * 100) : p ? Math.round((1 - (eff(p) * 0.62) / eff(p)) * 100) : null;
  const e = ui.errs;
  return (
    <>
      <div><Go to="admin-products" className="btn-link"><Icon n="chevL" />Products</Go></div>
      <form className="stack" style={{ gap: 20 }} onSubmit={ev => { ev.preventDefault(); A.product(ev.currentTarget, id); }}>
        <div className="adm-h"><div><h1>{p ? 'Edit Product' : 'Add Product'}</h1><p>{p ? <><span className="mono">{p.sku}</span> · last updated today</> : 'New products save as drafts until you set them to Active.'}</p></div><div className="row"><Go to="admin-products" className="btn">Cancel</Go><button className="btn btn-primary"><Icon n="check" />Save Product</button></div></div>
        <div className="pe-grid">
          <div className="stack">
            <div className="card form-sec"><h3>Basic information</h3>
              <div className="field"><label htmlFor="pf-name">Product name</label><input className={cx('input', e.name && 'err')} id="pf-name" name="name" defaultValue={val('name')} placeholder="e.g. GT Series 6-Piston Front Big Brake Kit" />{e.name ? <span className="errtxt">{e.name}</span> : null}</div>
              <div className="grid3">
                <div className="field"><label htmlFor="pf-sku">SKU</label><input className={cx('input mono', e.sku && 'err')} id="pf-sku" name="sku" defaultValue={val('sku')} placeholder="BRM-0000" />{e.sku ? <span className="errtxt">{e.sku}</span> : null}</div>
                <div className="field"><label htmlFor="pf-brand">Brand</label><select className="select" id="pf-brand" name="brand" defaultValue={p ? p.brand : BRANDS[0]}>{BRANDS.map(b => <option key={b}>{b}</option>)}</select></div>
                <div className="field"><label htmlFor="pf-cat">Category</label><select className="select" id="pf-cat" name="cat" defaultValue={p ? p.cat : CATEGORIES[0].id}>{CATEGORIES.map(c => <option key={c.id}>{c.id}</option>)}</select></div>
              </div>
              <div className="field"><label htmlFor="pf-desc">Description</label><textarea className="textarea" id="pf-desc" name="desc" placeholder="What it does, who it's for and what's included" defaultValue={val('desc')} /></div>
            </div>
            <div className="card form-sec"><h3>Images</h3><div className="img-row">{p ? VIEWS.map((s, k) => <span className="thumb" key={k}><span style={{ display: 'block', width: '100%', height: '100%', transform: s || undefined }}><Art kind={p.art} /></span></span>) : null}</div><div className="dropzone"><Icon n="upload" /><b>Drag images here or browse</b><span className="small">JPG or PNG, at least 1600 × 1200 px. The first image is the main photo.</span></div></div>
            <div className="card form-sec"><h3>Specifications</h3>{specs.map(([k, v2], k2) => <div className="kvrow" key={k2}><input className="input" id={`sk${k2}`} defaultValue={k} aria-label="Spec name" /><input className="input" id={`sv${k2}`} defaultValue={v2} aria-label="Spec value" placeholder="Value" /><button type="button" className="icon-btn" aria-label="Remove spec"><Icon n="x" /></button></div>)}<div><Soon m="Spec row added" className="btn btn-sm"><Icon n="plus" />Add specification</Soon></div></div>
            <div className="card form-sec"><h3>Vehicle fitment</h3><p className="small muted">Every vehicle listed here sees “Fits your vehicle” on this product. Leave empty for universal parts.</p>
              {fits.map((f, k) => <div className="fitrow" key={k}><input className="input" name={`fy1-${k}`} defaultValue={f.from} aria-label="From year" /><input className="input" name={`fy2-${k}`} defaultValue={f.to} aria-label="To year" /><input className="input" name={`fmk-${k}`} defaultValue={f.make} aria-label="Make" /><input className="input" name={`fmd-${k}`} defaultValue={f.model} aria-label="Model" /><button type="button" className="icon-btn" aria-label="Remove vehicle"><Icon n="x" /></button></div>)}
              <div className="small muted">Year from · Year to · Make · Model (all engines)</div><div><Soon m="Fitment row added" className="btn btn-sm"><Icon n="plus" />Add vehicle</Soon></div></div>
            <div className="card form-sec"><h3>Shipping information</h3><div className="grid3"><div className="field"><label htmlFor="pf-w">Weight (lb)</label><input className="input" id="pf-w" defaultValue={p ? (p.cat === 'Brakes' ? '58' : p.cat === 'Exhaust' ? '31' : '12') : ''} /></div><div className="field"><label htmlFor="pf-d">Box size (in)</label><input className="input" id="pf-d" defaultValue={p ? '30 × 20 × 14' : ''} placeholder="L × W × H" /></div><div className="field"><label htmlFor="pf-sm">Ships via</label><select className="select" id="pf-sm" defaultValue="Ground parcel"><option>Ground parcel</option><option>LTL freight</option><option>Digital delivery</option></select></div></div><label className="chk"><input type="checkbox" defaultChecked={!!(p && p.cat === 'Brakes')} />Requires signature on delivery</label></div>
          </div>
          <div className="stack">
            <div className="card form-sec"><h3>Status</h3><select className="select" name="status" id="pf-status" defaultValue={p && p.status === 'Active' ? 'Active' : 'Draft'}><option>Active</option><option>Draft</option></select><span className="small muted">Draft products are hidden from the storefront.</span></div>
            <div className="card form-sec"><h3>Pricing</h3>
              <div className="field"><label htmlFor="pf-price">Price (USD)</label><input className={cx('input num', e.price && 'err')} id="pf-price" name="price" defaultValue={p ? p.price : ''} inputMode="decimal" placeholder="0.00" />{e.price ? <span className="errtxt">{e.price}</span> : null}</div>
              <div className="field"><label htmlFor="pf-sale">Sale price</label><input className="input num" id="pf-sale" name="sale" defaultValue={p && p.sale != null ? p.sale : ''} inputMode="decimal" placeholder="Optional" /></div>
              <div className="field"><label htmlFor="pf-cost">Cost</label><input className="input num" id="pf-cost" name="cost" defaultValue={p ? (p.cost ?? (eff(p) * 0.62).toFixed(2)) : ''} inputMode="decimal" /><span className="hint">Only visible to staff{margin != null ? ` · margin ${margin}%` : ''}</span></div></div>
            <div className="card form-sec"><h3>Inventory</h3>
              <div className="field"><label htmlFor="pf-stock">Stock quantity (on hand)</label><input className="input num" id="pf-stock" name="stock" defaultValue={iv.onHand} inputMode="numeric" /></div>
              <div className="field"><label htmlFor="pf-th">Low-stock alert at</label><input className="input num" id="pf-th" name="threshold" defaultValue={iv.threshold} inputMode="numeric" /></div>
              {p ? <span className="small muted">{iv.reserved} reserved for open orders · {avail(S, p.id)} available to sell</span> : null}</div>
          </div>
        </div>
      </form>
    </>
  );
}

/* ---------- Inventory ---------- */
function Inventory() {
  const { S, ui } = useStore();
  const A = useActions();
  const list = allProducts(S).filter(p => !p.digital).map(p => P(S, p.id));
  const state = p => { const a = avail(S, p.id); return a <= 0 ? 'Out' : a <= inv(S, p.id).threshold ? 'Low' : 'In'; };
  const rows = list.filter(p => ui.invTab === 'All' || (ui.invTab === 'Low stock' && state(p) === 'Low') || (ui.invTab === 'Out of stock' && state(p) === 'Out'));
  const units = list.reduce((a, p) => a + inv(S, p.id).onHand, 0);
  const label = { In: 'In stock', Low: 'Low stock', Out: 'Out of stock' };
  return (
    <>
      <div className="adm-h"><div><h1>Inventory</h1><p>Available = on hand − reserved for open orders</p></div><Soon m="Receiving form opens here" className="btn btn-sm"><Icon n="box" />Receive shipment</Soon></div>
      <div className="kpis k4">
        <div className="card kpi"><small><Icon n="box" />SKUs tracked</small><b>{list.length}</b></div>
        <div className="card kpi"><small><Icon n="layers" />Units on hand</small><b>{units}</b></div>
        <div className="card kpi attn"><small><Icon n="alert" />Low stock</small><b>{list.filter(p => state(p) === 'Low').length}</b></div>
        <div className="card kpi attn"><small><Icon n="x" />Out of stock</small><b>{list.filter(p => state(p) === 'Out').length}</b></div>
      </div>
      <div className="card">
        <div className="panel-h"><div className="ordertabs">{['All', 'Low stock', 'Out of stock'].map(t => <button type="button" key={t} className={cx(ui.invTab === t && 'on')} onClick={() => A.invTab(t)}>{t}</button>)}</div></div>
        <div className="tbl-wrap"><table className="tbl"><thead><tr><th>SKU</th><th>Product</th><th className="r">On hand</th><th className="r">Reserved</th><th className="r">Available</th><th className="r">Alert at</th><th>Status</th><th></th></tr></thead><tbody>
          {rows.map(p => { const s = state(p), iv = inv(S, p.id); return <tr key={p.id} className={cx(s !== 'In' && 'hl')}><td className="mono small">{p.sku}</td><td><div className="row" style={{ flexWrap: 'nowrap' }}><span className="thumb"><Art kind={p.art} /></span><span style={{ minWidth: 160, fontSize: 14 }}><b>{p.brand}</b> {p.name}</span></div></td><td className="r num">{iv.onHand}</td><td className="r num">{iv.reserved}</td><td className="r num"><b>{avail(S, p.id)}</b></td><td className="r num">{iv.threshold}</td><td><span className={`st st-${s}`}>{label[s]}</span></td><td><button type="button" className="btn btn-sm" onClick={() => A.adjust(p.id)}>Adjust</button></td></tr>; })}
        </tbody></table></div>
      </div>
    </>
  );
}

export function AdjustModal({ id }) {
  const { S } = useStore();
  const A = useActions();
  const [type, setType] = useState('add');
  const [q, setQ] = useState('10');
  const p = P(S, id), iv = inv(S, id);
  return (
    <Modal title="Adjust inventory" foot={<><button type="button" className="btn" onClick={A.close}>Cancel</button><button type="button" className="btn btn-primary" onClick={() => A.saveAdjust(id, { type, q })}>Save adjustment</button></>}>
      <div className="row" style={{ flexWrap: 'nowrap' }}><span className="thumb"><Art kind={p.art} /></span><span><b>{p.brand}</b> {p.name}<br /><span className="mono small muted">{p.sku}</span></span></div>
      <dl className="kv"><dt>On hand</dt><dd className="num">{iv.onHand}</dd><dt>Reserved</dt><dd className="num">{iv.reserved}</dd><dt>Available</dt><dd className="num">{avail(S, id)}</dd></dl>
      <div className="grid2"><div className="field"><label htmlFor="adj-type">Adjustment</label><select className="select" id="adj-type" value={type} onChange={e => setType(e.target.value)}><option value="add">Add units</option><option value="remove">Remove units</option><option value="set">Set on-hand count</option></select></div><div className="field"><label htmlFor="adj-q">Quantity</label><input className="input num" id="adj-q" value={q} onChange={e => setQ(e.target.value)} inputMode="numeric" /></div></div>
      <div className="field"><label htmlFor="adj-r">Reason</label><select className="select" id="adj-r" defaultValue="Received shipment"><option>Received shipment</option><option>Cycle count correction</option><option>Damaged or defective</option><option>Customer return to stock</option></select></div>
      <div className="field"><label htmlFor="adj-n">Note (optional)</label><input className="input" id="adj-n" placeholder="PO number, location, etc." /></div>
    </Modal>
  );
}

/* ---------- Other sections ---------- */
function Section({ k }) {
  if (k === 'settings') return (
    <>
      <div className="adm-h"><div><h1>Settings</h1><p>Store-wide configuration</p></div></div>
      <div className="ds-grid">
        <div className="card form-sec"><h3>Store</h3><dl className="kv"><dt>Store name</dt><dd>TurboBolton</dd><dt>Support email</dt><dd>support@turbobolton.example</dd><dt>Support phone</dt><dd>(800) 555-0142</dd><dt>Currency</dt><dd>USD</dd></dl></div>
        <div className="card form-sec"><h3>Payments</h3><dl className="kv"><dt>Processor</dt><dd>Stripe</dd><dt>Status</dt><dd><span className="badge badge-ok"><Icon n="check" />Connected</span> <span className="badge badge-warn">Test mode</span></dd><dt>Accepted</dt><dd>Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay</dd></dl></div>
        <div className="card form-sec"><h3>Shipping</h3><dl className="kv">{SHIP_METHODS.map(m => <span key={m.id} style={{ display: 'contents' }}><dt>{m.name}</dt><dd>{m.cost ? money(m.cost) : 'Free over $149, else $12.95'} · {m.eta}</dd></span>)}</dl></div>
        <div className="card form-sec"><h3>Taxes & notifications</h3><dl className="kv"><dt>Sales tax</dt><dd>Texas 8.25% (demo rate)</dd><dt>Order emails</dt><dd>Confirmation, shipped, delivered</dd><dt>Low-stock alerts</dt><dd>Daily email to Store Manager</dd></dl></div>
      </div>
    </>
  );
  const s = ADMIN_SECTIONS[k];
  if (!s) return null;
  const pill = v => (/^(Active|Expired|Draft)$/.test(v) ? <span className={`st st-${v}`}>{v}</span> : v);
  return (
    <>
      <div className="adm-h"><div><h1>{s.title}</h1><p>{s.rows.length} records · sample data</p></div><Soon m={`${s.action} opens here`} className="btn btn-sm btn-dark"><Icon n="plus" />{s.action}</Soon></div>
      <div className="card tbl-wrap"><table className="tbl"><thead><tr>{s.cols.map(c => <th key={c}>{c}</th>)}</tr></thead><tbody>{s.rows.map((r, ri) => <tr key={ri}>{r.map((c, i) => <td key={i} className={cx(typeof c === 'number' && 'num')}>{i === 0 ? <b>{c}</b> : pill(String(c))}</td>)}</tr>)}</tbody></table></div>
    </>
  );
}
