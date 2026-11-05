/* ==========================================================
   Admin portal
   ========================================================== */
const ADM_NAV = [
  ['Overview', [['admin', 'Dashboard', 'gauge']]],
  ['Catalog', [['admin-products', 'Products', 'box'], ['admin-x-categories', 'Categories', 'grid'], ['admin-x-brands', 'Brands', 'tag'], ['admin-x-fitment', 'Vehicle Fitment', 'car'], ['admin-inventory', 'Inventory', 'layers']]],
  ['Sales', [['admin-orders', 'Orders', 'list'], ['admin-x-customers', 'Customers', 'users'], ['admin-x-promotions', 'Promotions', 'tag'], ['admin-x-returns', 'Returns', 'ret']]],
  ['Business', [['admin-x-reports', 'Reports', 'chart'], ['admin-x-users', 'Users', 'users'], ['admin-x-settings', 'Settings', 'cog']]],
];
function demoOrderRow() {
  const o = S.order; if (!o) return null;
  return { num: o.num, date: fmtTime(o.placed), customer: `${o.addr.first} ${o.addr.last}`, email: o.addr.email, items: o.items.reduce((a, l) => a + l.qty, 0), total: o.totals.total, status: o.status, vehicle: o.vehicle ? vname(o.vehicle) : '—', demo: true };
}
const allOrders = () => [demoOrderRow(), ...ADMIN_ORDERS].filter(Boolean);
const pendingCount = () => allOrders().filter(o => o.status === 'New' || o.status === 'Processing').length;
const lowStock = () => allProducts().filter(p => !p.digital && avail(p.id) <= inv(p.id).threshold);

function admNav(active) {
  return ADM_NAV.map(([g, items]) => `<div class="grp">${g}</div>${items.map(([to, l, i]) => {
    const on = active === to || (to === 'admin-orders' && active === 'admin-order') || (to === 'admin-products' && active.startsWith('admin-product'));
    const cnt = to === 'admin-orders' ? pendingCount() : to === 'admin-inventory' ? lowStock().length : 0;
    return `<button class="${on ? 'on' : ''}" data-go="${to}">${ic(i)}${l}${cnt ? `<span class="navcnt">${cnt}</span>` : ''}</button>`;
  }).join('')}`).join('');
}
function admShell(active, body) {
  return `<div class="adm">
    <aside class="adm-side"><button class="logo" data-go="admin"><span class="logo-mark">${LOGO_MARK}</span><span><span class="logo-word">Turbo<span>Bolton</span></span><span class="adm-tag">Admin portal</span></span></button><nav class="adm-nav" aria-label="Admin">${admNav(active)}</nav></aside>
    <div class="adm-main">
      <header class="adm-top"><button class="icon-btn adm-burger" data-act="admMenu" aria-label="Open menu">${ic('menu')}</button>
        <div class="asearch">${ic('search')}<input class="input" id="admq" placeholder="Search orders, products, customers" aria-label="Search admin"></div>
        <div class="adm-user"><button class="btn btn-sm" data-go="home">${ic('store')}<span>View store</span></button><span class="avatar">JE</span><span class="who"><b>Jordan Ellis</b><br><span class="small muted">Store Manager</span></span><button class="icon-btn" data-act="admLogout" aria-label="Sign out">${ic('logout')}</button></div></header>
      <div class="adm-body">${body}</div>
    </div></div>`;
}
function vAdminRoute(r) {
  if (r === 'admin-login' || !S.admin) return vAdminLogin();
  if (r === 'admin') return admShell(r, vAdmDash());
  if (r === 'admin-orders') return admShell(r, vAdmOrders());
  if (r === 'admin-order') return admShell(r, vAdmOrder());
  if (r === 'admin-products') return admShell(r, vAdmProducts());
  if (r === 'admin-product-new') return admShell(r, vAdmProductForm(null));
  if (r.startsWith('admin-product-')) return admShell(r, vAdmProductForm(r.slice(14)));
  if (r === 'admin-inventory') return admShell(r, vAdmInventory());
  if (r.startsWith('admin-x-')) return admShell(r, vAdmSection(r.slice(8)));
  return admShell('admin', vAdmDash());
}

function vAdminLogin() {
  return `<div class="adm-login">
    <div class="al-art">${heroWheel()}<span class="logo" style="position:relative"><span class="logo-mark">${LOGO_MARK}</span><span class="logo-word">Turbo<span>Bolton</span></span></span>
      <div style="position:relative"><span class="eyebrow">Admin portal</span><h1 style="font-size:44px;text-transform:uppercase;margin-top:10px;line-height:1">Run the shop<br>from one place.</h1><p style="color:#C3CCD8;margin-top:12px;max-width:40ch">Orders, products, vehicle fitment and inventory for the TurboBolton team. Works on desktop, tablet and phone browsers.</p></div>
      <span class="small" style="color:var(--ink-muted);position:relative">Staff access only · Activity is logged</span></div>
    <div class="al-form"><form data-form="admLogin">
      <div><h2>Sign in</h2><p class="muted" style="margin-top:6px">Use your TurboBolton staff account.</p></div>
      <div class="field"><label for="al-e">Email</label><input class="input" id="al-e" type="email" value="jordan@turbobolton.example" autocomplete="username"></div>
      <div class="field"><label for="al-p">Password</label><input class="input" id="al-p" type="password" value="demo-password" autocomplete="current-password"></div>
      <div class="row between"><label class="chk"><input type="checkbox" checked>Keep me signed in</label><button type="button" class="btn-link small" data-act="soon" data-m="Password reset email sent">Forgot password?</button></div>
      <button class="btn btn-dark btn-lg btn-block">${ic('lock')}Sign In</button>
      <p class="small muted">Prototype: credentials are prefilled. Two-step verification is planned for production.</p>
    </form></div></div>`;
}

/* ---------- Dashboard ---------- */
function vAdmDash() {
  const o = S.order;
  const today = o && new Date(o.placed).toDateString() === new Date().toDateString() ? o.totals.total : 0;
  const pend = pendingCount(), low = lowStock();
  const kpi = (l, i, v, d, attn) => `<div class="card kpi ${attn ? 'attn' : ''}"><small>${ic(i)}${l}</small><b>${v}</b><span class="delta">${d}</span></div>`;
  return `<div class="adm-h"><div><h1>Dashboard</h1><p>${fmtDate(new Date(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · Sample data</p></div><div class="row"><button class="btn btn-sm" data-go="admin-product-new">${ic('plus')}Add product</button><button class="btn btn-sm btn-dark" data-go="admin-orders">${ic('list')}View orders</button></div></div>
  ${o && o.status === 'New' ? `<div class="callout info" style="align-items:center">${ic('bolt')}<div style="flex:1"><b>New order ${o.num}</b> from ${esc(o.addr.first)} ${esc(o.addr.last)} · ${money(o.totals.total)} · paid by card</div><button class="btn btn-primary btn-sm" data-go="admin-order">Open order</button></div>` : ''}
  <div class="kpis">
    ${kpi("Today's Sales", 'dollar', money(8214.37 + today).replace(/\.\d\d$/, ''), '+12% vs. last Thu')}
    ${kpi('Orders', 'list', 14 + (today ? 1 : 0), 'today')}
    ${kpi('Revenue', 'chart', '$' + Math.round(186420 + today).toLocaleString(), 'last 30 days')}
    ${kpi('Customers', 'users', '2,318', '+46 this month')}
    ${kpi('Low Stock', 'alert', low.length, 'items need reorder', low.length > 0)}
    ${kpi('Pending Orders', 'clock', pend, 'to process', pend > 0)}
  </div>
  <div class="adm-2col">
    <div class="card"><div class="panel-h"><h3>Recent Orders</h3><button class="btn-link" data-go="admin-orders">All orders ${ic('arrowR')}</button></div>${ordersTbl(allOrders().slice(0, 6), true)}</div>
    <div class="stack">
      <div class="card"><div class="panel-h"><h3>Low Stock</h3><button class="btn-link" data-go="admin-inventory">Inventory ${ic('arrowR')}</button></div>
        <div class="stack" style="padding:14px 18px;gap:12px">${low.length ? low.map(p => `<div class="row" style="flex-wrap:nowrap"><span class="thumb">${art(p.art)}</span><span style="flex:1;min-width:0;font-size:14px"><b>${esc(p.brand)}</b> ${esc(p.name)}<br><span class="mono muted">${esc(p.sku)}</span></span><span class="st ${avail(p.id) ? 'st-Low' : 'st-Out'}">${avail(p.id)} left</span></div>`).join('') : '<span class="muted">All products above reorder level.</span>'}</div></div>
      <div class="card"><div class="panel-h"><h3>Pending Orders</h3></div><div class="stack" style="padding:14px 18px;gap:10px">${allOrders().filter(x => x.status === 'New' || x.status === 'Processing').map(x => `<button class="row between" style="background:none;border:0;padding:0;text-align:left;flex-wrap:nowrap" ${x.demo ? 'data-go="admin-order"' : 'data-act="sampleOrder"'}><span><b class="mono">${x.num}</b><br><span class="small muted">${esc(x.customer)} · ${money(x.total)}</span></span><span class="st st-${x.status}">${x.status}</span></button>`).join('')}</div></div>
    </div>
  </div>`;
}
function ordersTbl(rows, compact) {
  return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Order</th><th>Date</th><th>Customer</th>${compact ? '' : '<th>Vehicle</th><th class="r">Items</th>'}<th class="r">Total</th>${compact ? '' : '<th>Payment</th>'}<th>Status</th></tr></thead><tbody>
    ${rows.map(x => `<tr class="click ${x.demo && x.status === 'New' ? 'hl-new' : ''}" ${x.demo ? 'data-go="admin-order"' : 'data-act="sampleOrder"'}><td><b class="mono">${x.num}</b>${x.demo ? ' <span class="badge badge-info">Demo</span>' : ''}</td><td class="small">${x.date}</td><td>${esc(x.customer)}</td>${compact ? '' : `<td class="small">${esc(x.vehicle)}</td><td class="r num">${x.items}</td>`}<td class="r num">${money(x.total)}</td>${compact ? '' : `<td><span class="badge badge-ok">Paid</span></td>`}<td><span class="st st-${x.status}">${x.status}</span></td></tr>`).join('')}
  </tbody></table></div>`;
}

/* ---------- Orders ---------- */
function vAdmOrders() {
  const tabs = ['All', 'New', 'Processing', 'Shipped', 'Delivered'];
  const rows = allOrders().filter(x => ui.orderTab === 'All' || x.status === ui.orderTab);
  return `<div class="adm-h"><div><h1>Orders</h1><p>${allOrders().length} orders · ${pendingCount()} need action</p></div><button class="btn btn-sm" data-act="soon" data-m="CSV export started">Export CSV</button></div>
    ${!S.order ? `<div class="callout">${ic('info')}<div style="flex:1"><b>No demo order yet.</b> Place one on the storefront, or create a sample order to run the admin demo.</div><button class="btn btn-sm btn-dark" data-act="seedOrder">Create sample order</button></div>` : ''}
    <div class="card"><div class="panel-h"><div class="ordertabs">${tabs.map(t => `<button class="${ui.orderTab === t ? 'on' : ''}" data-act="orderTab" data-t="${t}">${t} <span class="num">${t === 'All' ? allOrders().length : allOrders().filter(x => x.status === t).length}</span></button>`).join('')}</div></div>
    ${rows.length ? ordersTbl(rows, false) : '<div class="empty"><span class="muted">No orders with this status.</span></div>'}</div>`;
}
const FLOW = ['New', 'Processing', 'Shipped', 'Delivered'];
function vAdmOrder() {
  const o = S.order;
  if (!o) return `<div class="card empty">${ic('box')}<h3>No demo order yet</h3><p class="muted">Place an order on the storefront first, or create a sample order.</p><button class="btn btn-dark" data-act="seedOrder">Create sample order</button></div>`;
  const i = FLOW.indexOf(o.status);
  const m = SHIP_METHODS.find(x => x.id === o.ship);
  const flow = FLOW.map((s, k) => `${k ? `<span class="sf-line ${k <= i ? 'done' : ''}"></span>` : ''}<span class="sf-step ${k <= i ? 'done' : k === i + 1 ? 'cur' : ''}"><span class="d">${k <= i ? ic('check') : ''}</span>${s}</span>`).join('');
  let action = '';
  if (o.status === 'New') action = `<div class="stack" style="gap:10px;padding:18px"><h4>Next step: start processing</h4><p class="small muted">Payment is captured. Mark the order as Processing when the warehouse starts picking. The customer's tracking page updates right away.</p><div><button class="btn btn-primary" data-act="admStatus" data-s="Processing">${ic('box')}Mark as Processing</button></div></div>`;
  else if (o.status === 'Processing') action = `<div class="stack" style="gap:12px;padding:18px"><h4>Next step: ship the order</h4><p class="small muted">Enter the carrier and tracking number. The customer gets a shipping email and sees tracking on their order page.</p>
    <div class="grid2"><div class="field"><label for="shipCarrier">Carrier</label><select class="select" id="shipCarrier">${CARRIERS.map(c => `<option>${c}</option>`).join('')}</select></div><div class="field"><label for="shipTrack">Tracking number</label><input class="input mono ${ui.errs.track ? 'err' : ''}" id="shipTrack" value="1Z84V9X20344718826">${ui.errs.track ? `<span class="errtxt">${ui.errs.track}</span>` : '<span class="hint">Prefilled with a sample UPS number</span>'}</div></div>
    <label class="chk"><input type="checkbox" checked>Email the customer their tracking details</label>
    <div><button class="btn btn-primary" data-act="admStatus" data-s="Shipped">${ic('truck')}Mark as Shipped</button></div></div>`;
  else if (o.status === 'Shipped') action = `<div class="stack" style="gap:10px;padding:18px"><h4>Shipped with ${esc(o.carrier)}</h4><dl class="kv"><dt>Carrier</dt><dd>${esc(o.carrier)}</dd><dt>Tracking number</dt><dd class="mono">${esc(o.tracking)}</dd><dt>Customer ETA</dt><dd>${o.eta}</dd></dl><div class="row"><button class="btn btn-primary" data-act="admStatus" data-s="Delivered">${ic('check')}Mark as Delivered</button><button class="btn" data-go="track">${ic('external')}See customer's tracking page</button></div></div>`;
  else action = `<div class="stack" style="gap:10px;padding:18px"><h4>Order complete</h4><p class="small muted">Delivered ${fmtTime(o.history.find(h => h.s === 'Delivered').t)}.</p><div><button class="btn" data-go="track">${ic('external')}See customer's tracking page</button></div></div>`;
  return `<div><button class="btn-link" data-go="admin-orders">${ic('chevL')}Orders</button></div>
    <div class="adm-h"><div><div class="row" style="gap:10px"><h1>Order <span class="mono" style="font-size:.7em">${o.num}</span></h1><span class="st st-${o.status}">${o.status}</span></div><p>Placed ${fmtTime(o.placed)} · Online store</p></div>
      <div class="row"><button class="btn btn-sm" data-act="soon" data-m="Packing slip ready to print">Packing slip</button><button class="btn btn-sm" data-go="track">${ic('external')}Customer view</button></div></div>
    <div class="card"><div class="panel-h"><h3>Fulfillment status</h3><span class="small muted">Changes are visible on the customer's Track Order page</span></div><div class="status-flow">${flow}</div><hr class="hr">${action}</div>
    <div class="od-grid">
      <div class="stack">
        <div class="card"><div class="panel-h"><h3>Products</h3><span class="small muted">${plural(o.items.reduce((a, l) => a + l.qty, 0), 'item')}</span></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Product</th><th>SKU</th><th class="r">Qty</th><th class="r">Price</th><th class="r">Total</th></tr></thead><tbody>
          ${o.items.map(l => { const p = P(l.id); return `<tr><td><div class="row" style="flex-wrap:nowrap"><span class="thumb">${art(p.art)}</span><span><b>${esc(p.brand)}</b> ${esc(p.name)}<br>${o.vehicle && fitOf(p, o.vehicle) === 'fits' ? `<span class="badge badge-ok" style="margin-top:4px">${ic('check')}Fits ${esc(vname(o.vehicle))}</span>` : `<span class="badge badge-warn" style="margin-top:4px">Universal</span>`}</span></div></td><td class="mono small">${esc(p.sku)}</td><td class="r num">${l.qty}</td><td class="r num">${money(l.price)}</td><td class="r num"><b>${money(l.price * l.qty)}</b></td></tr>`; }).join('')}
          </tbody></table></div>
          <div style="padding:16px 18px;border-top:1px solid var(--line)">${orderTotals(o)}</div></div>
        <div class="card"><div class="panel-h"><h3>Activity</h3></div><div class="activity">${o.history.slice().reverse().map(h => `<div><span><b>${h.s}</b>${h.note ? ` · ${esc(h.note)}` : ''}<small>${fmtTime(h.t)}${h.by ? ' · ' + h.by : ''}</small></span></div>`).join('')}</div></div>
      </div>
      <div class="stack">
        <div class="card pad stack" style="gap:10px"><h4>Customer</h4><div class="row" style="flex-wrap:nowrap"><span class="avatar">DO</span><span><b>${esc(o.addr.first)} ${esc(o.addr.last)}</b><br><span class="small muted">Customer since Mar 2025 · 3 orders</span></span></div><dl class="kv"><dt>Email</dt><dd style="overflow-wrap:anywhere">${esc(o.addr.email)}</dd><dt>Phone</dt><dd>${esc(o.addr.phone)}</dd></dl></div>
        <div class="card pad stack" style="gap:10px"><h4>Vehicle</h4>${o.vehicle ? `<div class="fit fit-ok">${ic('car')}${esc(vname(o.vehicle))}</div><span class="small muted">${esc(o.vehicle.engine)}</span><span class="small">All items verified against this vehicle at checkout.</span>` : '<span class="muted">No vehicle selected</span>'}</div>
        <div class="card pad stack" style="gap:10px"><h4>Payment</h4><dl class="kv"><dt>Status</dt><dd><span class="badge badge-ok">${ic('check')}Paid</span></dd><dt>Amount</dt><dd class="num">${money(o.totals.total)}</dd><dt>Method</dt><dd>Visa ending in ${o.last4}</dd><dt>Stripe ID</dt><dd class="mono small" style="overflow-wrap:anywhere">${o.payId}</dd></dl></div>
        <div class="card pad stack" style="gap:10px"><h4>Shipping</h4><p class="small">${addrBlock(o.addr)}</p><dl class="kv"><dt>Method</dt><dd>${m.name}</dd><dt>ETA</dt><dd>${o.eta}</dd>${o.tracking ? `<dt>Carrier</dt><dd>${esc(o.carrier)}</dd><dt>Tracking</dt><dd class="mono small">${esc(o.tracking)}</dd>` : ''}</dl></div>
      </div>
    </div>`;
}

/* ---------- Products ---------- */
function vAdmProducts() {
  const q = ui.apq.toLowerCase();
  const rows = allProducts().map(p => P(p.id)).filter(p => (!q || `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(q)) && (!ui.apcat || p.cat === ui.apcat));
  return `<div class="adm-h"><div><h1>Products</h1><p>${allProducts().length} products · ${allProducts().filter(p => P(p.id).status === 'Active').length} active</p></div><button class="btn btn-primary" data-go="admin-product-new">${ic('plus')}Add Product</button></div>
    <div class="card"><div class="panel-h"><div class="row" style="flex:1"><input class="input" id="apq" data-chg="apq" placeholder="Search name, SKU or brand" value="${esc(ui.apq)}" style="max-width:300px;min-height:40px"><select class="select" id="apcat" data-chg="apcat" style="width:auto;min-height:40px"><option value="">All categories</option>${CATEGORIES.map(c => `<option ${ui.apcat === c.id ? 'selected' : ''}>${c.id}</option>`).join('')}</select></div></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th class="r">Price</th><th class="r">Available</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map(p => { const a = avail(p.id), lo = !p.digital && a <= inv(p.id).threshold; return `<tr class="click" data-go="admin-product-${p.id}"><td><div class="row" style="flex-wrap:nowrap"><span class="thumb">${art(p.art)}</span><span style="min-width:180px"><b>${esc(p.brand)}</b><br><span class="small">${esc(p.name)}</span></span></div></td><td class="mono small">${esc(p.sku)}</td><td>${esc(p.cat)}</td><td class="r num">${onSale(p) ? `<s class="muted small">${money(p.price)}</s><br><b style="color:var(--brand-d)">${money(eff(p))}</b>` : money(p.price)}</td><td class="r num">${p.digital ? '∞' : `<span class="${lo ? 'st ' + (a ? 'st-Low' : 'st-Out') : ''}">${a}</span>`}</td><td><span class="st st-${p.status}">${p.status}</span></td><td><button class="btn btn-sm" data-go="admin-product-${p.id}">${ic('edit')}Edit</button></td></tr>`; }).join('')}
    </tbody></table></div></div>`;
}
function vAdmProductForm(id) {
  const p = id ? P(id) : null;
  if (id && !p) return `<div class="card empty"><h3>Product not found</h3><button class="btn" data-go="admin-products">Back to products</button></div>`;
  const val = (k, d = '') => p ? esc(p[k] ?? d) : d;
  const iv = p ? inv(p.id) : { onHand: '', threshold: 5, reserved: 0 };
  const fits = p ? (p.fit === 'universal' ? [] : p.fit) : [{ make: 'BMW', model: 'M3', from: 2021, to: 2025 }];
  const specs = p ? p.specs : [['Material', ''], ['Weight', '']];
  const margin = p && p.cost ? Math.round((1 - p.cost / eff(p)) * 100) : p ? Math.round((1 - (eff(p) * .62) / eff(p)) * 100) : null;
  const e = ui.errs;
  return `<div><button class="btn-link" data-go="admin-products">${ic('chevL')}Products</button></div>
  <form data-form="product" data-id="${id || ''}" class="stack" style="gap:20px">
    <div class="adm-h"><div><h1>${p ? 'Edit Product' : 'Add Product'}</h1><p>${p ? `<span class="mono">${esc(p.sku)}</span> · last updated today` : 'New products save as drafts until you set them to Active.'}</p></div><div class="row"><button type="button" class="btn" data-go="admin-products">Cancel</button><button class="btn btn-primary">${ic('check')}Save Product</button></div></div>
    <div class="pe-grid">
      <div class="stack">
        <div class="card form-sec"><h3>Basic information</h3>
          <div class="field"><label for="pf-name">Product name</label><input class="input ${e.name ? 'err' : ''}" id="pf-name" name="name" value="${val('name')}" placeholder="e.g. GT Series 6-Piston Front Big Brake Kit">${e.name ? `<span class="errtxt">${e.name}</span>` : ''}</div>
          <div class="grid3"><div class="field"><label for="pf-sku">SKU</label><input class="input mono ${e.sku ? 'err' : ''}" id="pf-sku" name="sku" value="${val('sku')}" placeholder="BRM-0000">${e.sku ? `<span class="errtxt">${e.sku}</span>` : ''}</div>
            <div class="field"><label for="pf-brand">Brand</label><select class="select" id="pf-brand" name="brand">${BRANDS.map(b => `<option ${p && p.brand === b ? 'selected' : ''}>${esc(b)}</option>`).join('')}</select></div>
            <div class="field"><label for="pf-cat">Category</label><select class="select" id="pf-cat" name="cat">${CATEGORIES.map(c => `<option ${p && p.cat === c.id ? 'selected' : ''}>${c.id}</option>`).join('')}</select></div></div>
          <div class="field"><label for="pf-desc">Description</label><textarea class="textarea" id="pf-desc" name="desc" placeholder="What it does, who it's for and what's included">${val('desc')}</textarea></div>
        </div>
        <div class="card form-sec"><h3>Images</h3><div class="img-row">${p ? VIEWS.map(s => `<span class="thumb"><span style="display:block;width:100%;height:100%;${s}">${art(p.art)}</span></span>`).join('') : ''}</div><div class="dropzone">${ic('upload')}<b>Drag images here or browse</b><span class="small">JPG or PNG, at least 1600 × 1200 px. The first image is the main photo.</span></div></div>
        <div class="card form-sec"><h3>Specifications</h3>${specs.map(([k, v2], i) => `<div class="kvrow"><input class="input" id="sk${i}" value="${esc(k)}" aria-label="Spec name"><input class="input" id="sv${i}" value="${esc(v2)}" aria-label="Spec value" placeholder="Value"><button type="button" class="icon-btn" aria-label="Remove spec">${ic('x')}</button></div>`).join('')}<div><button type="button" class="btn btn-sm" data-act="soon" data-m="Spec row added">${ic('plus')}Add specification</button></div></div>
        <div class="card form-sec"><h3>Vehicle fitment</h3><p class="small muted">Every vehicle listed here sees “Fits your vehicle” on this product. Leave empty for universal parts.</p>
          ${fits.map((f, i) => `<div class="fitrow"><input class="input" name="fy1-${i}" value="${f.from}" aria-label="From year"><input class="input" name="fy2-${i}" value="${f.to}" aria-label="To year"><input class="input" name="fmk-${i}" value="${esc(f.make)}" aria-label="Make"><input class="input" name="fmd-${i}" value="${esc(f.model)}" aria-label="Model"><button type="button" class="icon-btn" aria-label="Remove vehicle">${ic('x')}</button></div>`).join('')}
          <div class="small muted">Year from · Year to · Make · Model (all engines)</div><div><button type="button" class="btn btn-sm" data-act="soon" data-m="Fitment row added">${ic('plus')}Add vehicle</button></div></div>
        <div class="card form-sec"><h3>Shipping information</h3><div class="grid3"><div class="field"><label for="pf-w">Weight (lb)</label><input class="input" id="pf-w" value="${p ? (p.cat === 'Brakes' ? '58' : p.cat === 'Exhaust' ? '31' : '12') : ''}"></div><div class="field"><label for="pf-d">Box size (in)</label><input class="input" id="pf-d" value="${p ? '30 × 20 × 14' : ''}" placeholder="L × W × H"></div><div class="field"><label for="pf-sm">Ships via</label><select class="select" id="pf-sm"><option>Ground parcel</option><option>LTL freight</option><option>Digital delivery</option></select></div></div><label class="chk"><input type="checkbox" ${p && p.cat === 'Brakes' ? 'checked' : ''}>Requires signature on delivery</label></div>
      </div>
      <div class="stack">
        <div class="card form-sec"><h3>Status</h3><select class="select" name="status" id="pf-status"><option ${p && p.status === 'Active' ? 'selected' : ''}>Active</option><option ${!p || p.status === 'Draft' ? 'selected' : ''}>Draft</option></select><span class="small muted">Draft products are hidden from the storefront.</span></div>
        <div class="card form-sec"><h3>Pricing</h3>
          <div class="field"><label for="pf-price">Price (USD)</label><input class="input num ${e.price ? 'err' : ''}" id="pf-price" name="price" value="${p ? p.price : ''}" inputmode="decimal" placeholder="0.00">${e.price ? `<span class="errtxt">${e.price}</span>` : ''}</div>
          <div class="field"><label for="pf-sale">Sale price</label><input class="input num" id="pf-sale" name="sale" value="${p && p.sale != null ? p.sale : ''}" inputmode="decimal" placeholder="Optional"></div>
          <div class="field"><label for="pf-cost">Cost</label><input class="input num" id="pf-cost" name="cost" value="${p ? (p.cost ?? (eff(p) * .62).toFixed(2)) : ''}" inputmode="decimal"><span class="hint">Only visible to staff${margin != null ? ` · margin ${margin}%` : ''}</span></div></div>
        <div class="card form-sec"><h3>Inventory</h3>
          <div class="field"><label for="pf-stock">Stock quantity (on hand)</label><input class="input num" id="pf-stock" name="stock" value="${iv.onHand}" inputmode="numeric"></div>
          <div class="field"><label for="pf-th">Low-stock alert at</label><input class="input num" id="pf-th" name="threshold" value="${iv.threshold}" inputmode="numeric"></div>
          ${p ? `<span class="small muted">${iv.reserved} reserved for open orders · ${avail(p.id)} available to sell</span>` : ''}</div>
      </div>
    </div></form>`;
}

/* ---------- Inventory ---------- */
function vAdmInventory() {
  const list = allProducts().filter(p => !p.digital).map(p => P(p.id));
  const state = p => { const a = avail(p.id); return a <= 0 ? 'Out' : a <= inv(p.id).threshold ? 'Low' : 'In'; };
  const rows = list.filter(p => ui.invTab === 'All' || (ui.invTab === 'Low stock' && state(p) === 'Low') || (ui.invTab === 'Out of stock' && state(p) === 'Out'));
  const units = list.reduce((a, p) => a + inv(p.id).onHand, 0);
  const label = { In: 'In stock', Low: 'Low stock', Out: 'Out of stock' };
  return `<div class="adm-h"><div><h1>Inventory</h1><p>Available = on hand − reserved for open orders</p></div><button class="btn btn-sm" data-act="soon" data-m="Receiving form opens here">${ic('box')}Receive shipment</button></div>
    <div class="kpis k4">
      <div class="card kpi"><small>${ic('box')}SKUs tracked</small><b>${list.length}</b></div>
      <div class="card kpi"><small>${ic('layers')}Units on hand</small><b>${units}</b></div>
      <div class="card kpi attn"><small>${ic('alert')}Low stock</small><b>${list.filter(p => state(p) === 'Low').length}</b></div>
      <div class="card kpi attn"><small>${ic('x')}Out of stock</small><b>${list.filter(p => state(p) === 'Out').length}</b></div></div>
    <div class="card"><div class="panel-h"><div class="ordertabs">${['All', 'Low stock', 'Out of stock'].map(t => `<button class="${ui.invTab === t ? 'on' : ''}" data-act="invTab" data-t="${t}">${t}</button>`).join('')}</div></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>SKU</th><th>Product</th><th class="r">On hand</th><th class="r">Reserved</th><th class="r">Available</th><th class="r">Alert at</th><th>Status</th><th></th></tr></thead><tbody>
      ${rows.map(p => { const s = state(p), iv = inv(p.id); return `<tr class="${s !== 'In' ? 'hl' : ''}"><td class="mono small">${esc(p.sku)}</td><td><div class="row" style="flex-wrap:nowrap"><span class="thumb">${art(p.art)}</span><span style="min-width:160px;font-size:14px"><b>${esc(p.brand)}</b> ${esc(p.name)}</span></div></td><td class="r num">${iv.onHand}</td><td class="r num">${iv.reserved}</td><td class="r num"><b>${avail(p.id)}</b></td><td class="r num">${iv.threshold}</td><td><span class="st st-${s}">${label[s]}</span></td><td><button class="btn btn-sm" data-act="adjust" data-id="${p.id}">Adjust</button></td></tr>`; }).join('')}
    </tbody></table></div></div>`;
}
function adjustModal(id) {
  const p = P(id), iv = inv(id);
  return modal('Adjust inventory', `<div class="row" style="flex-wrap:nowrap"><span class="thumb">${art(p.art)}</span><span><b>${esc(p.brand)}</b> ${esc(p.name)}<br><span class="mono small muted">${esc(p.sku)}</span></span></div>
    <dl class="kv"><dt>On hand</dt><dd class="num">${iv.onHand}</dd><dt>Reserved</dt><dd class="num">${iv.reserved}</dd><dt>Available</dt><dd class="num">${avail(id)}</dd></dl>
    <div class="grid2"><div class="field"><label for="adj-type">Adjustment</label><select class="select" id="adj-type"><option value="add">Add units</option><option value="remove">Remove units</option><option value="set">Set on-hand count</option></select></div><div class="field"><label for="adj-q">Quantity</label><input class="input num" id="adj-q" value="10" inputmode="numeric"></div></div>
    <div class="field"><label for="adj-r">Reason</label><select class="select" id="adj-r"><option>Received shipment</option><option>Cycle count correction</option><option>Damaged or defective</option><option>Customer return to stock</option></select></div>
    <div class="field"><label for="adj-n">Note (optional)</label><input class="input" id="adj-n" placeholder="PO number, location, etc."></div>`,
    `<button class="btn" data-act="close">Cancel</button><button class="btn btn-primary" data-act="saveAdjust" data-id="${id}">Save adjustment</button>`);
}

/* ---------- Other sections ---------- */
function vAdmSection(key) {
  if (key === 'settings') return `<div class="adm-h"><div><h1>Settings</h1><p>Store-wide configuration</p></div></div>
    <div class="ds-grid">
      <div class="card form-sec"><h3>Store</h3><dl class="kv"><dt>Store name</dt><dd>TurboBolton</dd><dt>Support email</dt><dd>support@turbobolton.example</dd><dt>Support phone</dt><dd>(800) 555-0142</dd><dt>Currency</dt><dd>USD</dd></dl></div>
      <div class="card form-sec"><h3>Payments</h3><dl class="kv"><dt>Processor</dt><dd>Stripe</dd><dt>Status</dt><dd><span class="badge badge-ok">${ic('check')}Connected</span> <span class="badge badge-warn">Test mode</span></dd><dt>Accepted</dt><dd>Visa, Mastercard, Amex, Discover, Apple Pay, Google Pay</dd></dl></div>
      <div class="card form-sec"><h3>Shipping</h3><dl class="kv">${SHIP_METHODS.map(m => `<dt>${m.name}</dt><dd>${m.cost ? money(m.cost) : 'Free over $149, else $12.95'} · ${m.eta}</dd>`).join('')}</dl></div>
      <div class="card form-sec"><h3>Taxes & notifications</h3><dl class="kv"><dt>Sales tax</dt><dd>Texas 8.25% (demo rate)</dd><dt>Order emails</dt><dd>Confirmation, shipped, delivered</dd><dt>Low-stock alerts</dt><dd>Daily email to Store Manager</dd></dl></div>
    </div>`;
  const s = ADMIN_SECTIONS[key];
  if (!s) return '';
  const pill = v => /^(Active|Expired|Draft)$/.test(v) ? `<span class="st st-${v}">${v}</span>` : esc(v);
  return `<div class="adm-h"><div><h1>${s.title}</h1><p>${s.rows.length} records · sample data</p></div><button class="btn btn-sm btn-dark" data-act="soon" data-m="${s.action} opens here">${ic('plus')}${s.action}</button></div>
    <div class="card tbl-wrap"><table class="tbl"><thead><tr>${s.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${s.rows.map(r => `<tr>${r.map((c, i) => `<td class="${typeof c === 'number' ? 'num' : ''}">${i === 0 ? `<b>${esc(c)}</b>` : pill(String(c))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
