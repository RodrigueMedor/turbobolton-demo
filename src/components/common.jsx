/* ==========================================================
   Shared building blocks used across storefront, admin and docs
   ========================================================== */
import { Fragment, useRef, useState } from 'react';
import { Icon, LogoMark } from '../lib/icons';
import { Art } from '../lib/art';
import { cx, fmtTime, money, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { P, eff, fitOf, isNew, onSale, stockState } from '../store/selectors';

/* ---------- Navigation helpers ---------- */
/** Button that navigates to a route (replaces data-go). */
export function Go({ to, children, onClick, ...rest }) {
  const { go } = useStore();
  return <button type="button" onClick={e => { onClick?.(e); go(to); }} {...rest}>{children}</button>;
}
/** Button that navigates to a route or runs an action given as 'act:name'. */
export function GoAct({ to, children, ...rest }) {
  const A = useActions();
  return <button type="button" onClick={() => A.goOrAct(to)} {...rest}>{children}</button>;
}
/** Button that only shows a toast (placeholder for flows outside the prototype). */
export function Soon({ m, children, ...rest }) {
  const { toast } = useStore();
  return <button type="button" onClick={() => toast(m || 'Done')} {...rest}>{children}</button>;
}

export function Logo({ to = 'home' }) {
  return <Go to={to} className="logo" aria-label="TurboBolton home"><span className="logo-mark"><LogoMark /></span><span className="logo-word">Turbo<span>Bolton</span></span></Go>;
}
export function LogoStatic({ wordStyle }) {
  return <span className="logo"><span className="logo-mark"><LogoMark /></span><span className="logo-word" style={wordStyle}>Turbo<span>Bolton</span></span></span>;
}

export function Crumbs({ items }) {
  const { go } = useStore();
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map(([l, to], i) => (
        <Fragment key={i}>
          {i ? <span className="sep">/</span> : null}
          {to ? <button type="button" onClick={() => go(to)}>{l}</button> : <span>{l}</span>}
        </Fragment>
      ))}
    </nav>
  );
}

export const Stars = ({ r }) => <span className="stars" aria-label={`${r} out of 5 stars`}>★★★★★<i style={{ width: `${(r / 5) * 100}%` }}>★★★★★</i></span>;

export function FitBadge({ p, style }) {
  const { S } = useStore();
  const f = fitOf(S, p), v = S.vehicle;
  if (f === 'fits') return <div className="fit fit-ok" style={style}><Icon n="check" /><span>Fits your {vname(v)}</span></div>;
  if (f === 'universal') return <div className="fit fit-warn" style={style}><Icon n="alert" /><span>Universal part · verify fitment</span></div>;
  if (f === 'no') return <div className="fit fit-no" style={style}><Icon n="x" /><span>Does not fit your {vname(v)}</span></div>;
  return <div className="fit fit-warn" style={style}><Icon n="alert" /><span>Verify vehicle fitment</span></div>;
}

export const SecTitle = ({ t, sub }) => (
  <div className="sec-title"><span className="st-rule"></span><div><h2>{t}</h2>{sub ? <p>{sub}</p> : null}</div><span className="st-rule"></span></div>
);

/* ---------- Dialog chrome ---------- */
export function Modal({ title, children, foot, wide, ariaLabel }) {
  const A = useActions();
  return (
    <div className={cx('modal', wide && 'wide')} role="dialog" aria-modal="true" aria-label={ariaLabel || title}>
      <div className="modal-h"><h3>{title}</h3><button type="button" className="icon-btn" onClick={A.close} aria-label="Close"><Icon n="x" /></button></div>
      <div className="modal-b">{children}</div>
      {foot ? <div className="modal-f">{foot}</div> : null}
    </div>
  );
}
export function Drawer({ title, children, foot, style, headStyle, head, bodyStyle }) {
  const A = useActions();
  return (
    <aside className="drawer" role="dialog" aria-modal="true" aria-label={title} style={style}>
      <div className="modal-h" style={headStyle}>{head || <h3>{title}</h3>}<button type="button" className="icon-btn" onClick={A.close} aria-label="Close"><Icon n="x" /></button></div>
      <div className="modal-b" style={bodyStyle}>{children}</div>
      {foot ? <div className="modal-f">{foot}</div> : null}
    </aside>
  );
}

/* ---------- Product card and carousel ---------- */
export function ProductCard({ p }) {
  const { S, go } = useStore();
  const A = useActions();
  const st = stockState(S, p), wished = S.wishlist.includes(p.id), cmp = S.compare.includes(p.id);
  return (
    <article className="pcard">
      <div className="pimg" onClick={() => go('p-' + p.id)} role="presentation">
        <Art kind={p.art} />
        <span className="flags">{onSale(p) ? <span className="badge badge-sale">Sale</span> : null}{isNew(p) ? <span className="badge badge-dark">New</span> : null}</span>
        <button type="button" className={cx('wish', wished && 'on')} onClick={e => { e.stopPropagation(); A.wish(p.id); }} aria-label={`${wished ? 'Remove from' : 'Add to'} wishlist`}><Icon n="heart" /></button>
        <button type="button" className="qv" onClick={e => { e.stopPropagation(); A.quickView(p.id); }}><Icon n="search" />Quick view</button>
      </div>
      <div className="pbody">
        <span className="pbrand">{p.brand}</span>
        <button type="button" className="pname" onClick={() => go('p-' + p.id)}>{p.name}</button>
        <span className="psku mono">SKU {p.sku}</span>
        <span className="rating"><Stars r={p.rating} /><span className="num">{p.rating} ({p.reviews})</span></span>
        <div className={cx('price', onSale(p) && 'sale')}>{onSale(p) ? <span className="msrp">MSRP <s>{money(p.price)}</s></span> : null}<b>{money(eff(p))}</b></div>
        <span className={`stock ${st.k}`}>{st.t}</span>
        <div className="pfoot">
          <FitBadge p={p} />
          <div className="pf-row">
            <button type="button" className="btn btn-primary btn-sm" onClick={() => A.add(p.id)}><Icon n="cart" />Add to Cart</button>
            <button type="button" className={cx('icon-btn cmp', cmp && 'on')} onClick={() => A.compare(p.id)} aria-label={`${cmp ? 'Remove from' : 'Add to'} compare`}><Icon n="compare" /></button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function Carousel({ list }) {
  const track = useRef(null);
  const scroll = d => { const t = track.current; if (t) t.scrollBy({ left: d * t.clientWidth * 0.9, behavior: 'smooth' }); };
  return (
    <div className="car">
      <button type="button" className="car-btn prev" onClick={() => scroll(-1)} aria-label="Previous"><Icon n="arrowL" /></button>
      <div className="car-track" ref={track}>{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
      <button type="button" className="car-btn next" onClick={() => scroll(1)} aria-label="Next"><Icon n="arrowR" /></button>
    </div>
  );
}

/* ---------- Order fragments ---------- */
export function OrderItems({ o }) {
  const { S } = useStore();
  return o.items.map(l => {
    const p = P(S, l.id);
    return (
      <div className="mini-line" key={l.id}>
        <div className="pimg"><Art kind={p.art} /><span className="q">{l.qty}</span></div>
        <div><b style={{ fontSize: 14 }}>{p.brand} {p.name}</b><div className="small muted">SKU <span className="mono">{p.sku}</span> · {money(l.price)} each</div></div>
        <b className="num">{money(l.price * l.qty)}</b>
      </div>
    );
  });
}
export function OrderTotals({ o }) {
  const t = o.totals;
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div className="sumrow"><span>Subtotal</span><span>{money(t.sub)}</span></div>
      {t.disc ? <div className="sumrow disc"><span>Discount (TURBO10)</span><span>−{money(t.disc)}</span></div> : null}
      <div className="sumrow"><span>Shipping</span><span>{t.ship ? money(t.ship) : 'FREE'}</span></div>
      <div className="sumrow"><span>Tax</span><span>{money(t.tax)}</span></div>
      <div className="sumrow total"><span>Total paid</span><span>{money(t.total)}</span></div>
    </div>
  );
}
export const AddrBlock = ({ a }) => (
  <>{a.first} {a.last}<br />{a.addr1}{a.addr2 ? ', ' + a.addr2 : ''}<br />{a.city}, {a.state} {a.zip}<br />{a.country}</>
);

const TL = ['Order Placed', 'Payment Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
const TL_IC = ['doc', 'card', 'box', 'truck', 'pin', 'home'];
export const doneIdx = s => ({ New: 1, Processing: 2, Shipped: 3, Delivered: 5 }[s]);
export function Timeline({ o }) {
  const di = doneIdx(o.status);
  const at = name => { const h = o.history.find(x => x.s === name); return h ? fmtTime(h.t) : ''; };
  return (
    <div className="timeline">
      {TL.map((s, i) => {
        const st = i <= di ? 'done' : i === di + 1 ? 'cur' : 'todo';
        return (
          <div className={`tl-step ${st}`} key={s}>
            <span className="tl-dot">{st === 'done' ? <Icon n="check" /> : <Icon n={TL_IC[i]} />}</span>
            <span className="tl-txt"><b>{s}</b><small>{st === 'done' ? at(s) || 'Complete' : st === 'cur' ? 'Up next' : 'Pending'}</small></span>
          </div>
        );
      })}
    </div>
  );
}

export function NoOrder() {
  const A = useActions();
  return (
    <div className="card empty" style={{ margin: '40px 0' }}>
      <Icon n="box" /><h2>No demo order yet</h2>
      <p className="muted">Place an order on the storefront first. The fastest path: add the Brembo kit and check out.</p>
      <div className="row" style={{ justifyContent: 'center' }}><Go to="p-brembo-gt6" className="btn btn-primary">Open Brembo kit</Go><button type="button" className="btn" onClick={A.seedOrder}>Create sample order</button></div>
    </div>
  );
}

/** Orders table shared by the admin dashboard, orders list and the design system page. */
export function OrdersTbl({ rows, compact }) {
  const { go } = useStore();
  const A = useActions();
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr><th>Order</th><th>Date</th><th>Customer</th>{compact ? null : <><th>Vehicle</th><th className="r">Items</th></>}<th className="r">Total</th>{compact ? null : <th>Payment</th>}<th>Status</th></tr></thead>
        <tbody>
          {rows.map(x => (
            <tr key={x.num} className={cx('click', x.demo && x.status === 'New' && 'hl-new')} onClick={() => (x.demo ? go('admin-order') : A.sampleOrder())}>
              <td><b className="mono">{x.num}</b>{x.demo ? <> <span className="badge badge-info">Demo</span></> : null}</td>
              <td className="small">{x.date}</td>
              <td>{x.customer}</td>
              {compact ? null : <><td className="small">{x.vehicle}</td><td className="r num">{x.items}</td></>}
              <td className="r num">{money(x.total)}</td>
              {compact ? null : <td><span className="badge badge-ok">Paid</span></td>}
              <td><span className={`st st-${x.status}`}>{x.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Header-style search form. */
export function SearchForm({ id = 'hq', style, inputStyle, placeholder = 'Search by part, brand or SKU' }) {
  const { S } = useStore();
  const A = useActions();
  const [q, setQ] = useState(S.q);
  return (
    <form className="hsearch" role="search" style={style} onSubmit={e => { e.preventDefault(); A.search(q.trim()); }}>
      <input id={id} type="search" placeholder={placeholder} value={q} onChange={e => setQ(e.target.value)} aria-label="Search parts" style={inputStyle} />
      <button type="submit" aria-label="Search"><Icon n="search" /></button>
    </form>
  );
}
