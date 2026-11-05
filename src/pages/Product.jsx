import { useEffect } from 'react';
import { QUESTIONS, REVIEWS, SHIP_METHODS } from '../data';
import { Icon } from '../lib/icons';
import { Art } from '../lib/art';
import { cx, money, plural, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { P, cartCount, eff, etaRange, fitOf, fitText, fitmentRows, isNew, onSale, shopProducts, stockState, totals } from '../store/selectors';
import { Carousel, Crumbs, Drawer, FitBadge, Go, Modal, SecTitle, Soon, Stars } from '../components/common';

const PDP_TABS = ['Description', 'Specifications', 'Vehicle Fitment', 'Installation', 'Shipping', 'Warranty', 'Reviews', 'Questions & Answers'];
/** Alternate "camera angles" for the illustration, as CSS transforms */
export const VIEWS = ['', 'scale(1.35) translate(4%,3%)', 'rotate(-10deg) scale(.9)', 'scaleX(-1)'];

function PdpPanel({ p }) {
  const { S, ui } = useStore();
  const v = S.vehicle;
  switch (ui.pdpTab) {
    case 'Description': return <><p>{p.desc}</p><h4>Highlights</h4><ul>{p.features.map(x => <li key={x}>{x}</li>)}</ul></>;
    case 'Specifications': return (
      <table className="spec-tbl"><tbody>
        <tr><th>Brand</th><td>{p.brand}</td></tr><tr><th>SKU</th><td className="mono">{p.sku}</td></tr><tr><th>Product type</th><td>{p.type}</td></tr>
        {p.specs.map(([k, val]) => <tr key={k}><th>{k}</th><td>{val}</td></tr>)}
      </tbody></table>
    );
    case 'Vehicle Fitment':
      if (p.fit === 'universal') return <div className="callout"><Icon n="alert" /><div><b>Universal part.</b> This product isn't tied to a specific vehicle. Check the installation notes or contact support to confirm it suits your build.</div></div>;
      return (
        <>
          <p className="muted">Confirmed vehicle applications. Your vehicle is highlighted.</p>
          <div className="tbl-wrap card"><table className="tbl">
            <thead><tr><th>Year</th><th>Make</th><th>Model</th><th>Engine</th><th>Notes</th></tr></thead>
            <tbody>{fitmentRows(p, v).map(r => <tr key={r.key} className={cx(r.mine && 'hl')}><td className="num">{r.yrs}</td><td>{r.make}</td><td>{r.model}</td><td>{r.engine}</td><td>{r.mine ? <span className="badge badge-ok"><Icon n="check" />Your vehicle</span> : 'Direct fit'}</td></tr>)}</tbody>
          </table></div>
        </>
      );
    case 'Installation': return (
      <>
        <div className="video-ph" role="img" aria-label="Installation video placeholder"><span className="play"><Icon n="play" /></span><span><b>Installation walkthrough</b><br /><span className="small">Video · 12:40 · sample placeholder</span></span></div>
        <ul>{p.install.map(x => <li key={x}>{x}</li>)}</ul>
        <div className="callout info"><Icon n="info" /><div>Need an installer? Our support team can recommend a shop near {S.co.zip}.</div></div>
      </>
    );
    case 'Shipping': return p.digital ? <p>This is a digital product. Your license is emailed within minutes of payment.</p> : (
      <>
        <table className="spec-tbl"><tbody>{SHIP_METHODS.map(m => <tr key={m.id}><th>{m.name}</th><td>{m.eta} · {m.cost ? money(m.cost) : 'Free over $149, otherwise $12.95'}</td></tr>)}</tbody></table>
        <p className="muted small">Orders placed before 2pm CT on business days ship the same day when in stock. Lower 48 states.</p>
      </>
    );
    case 'Warranty': return <><p>{p.warranty}</p><p><b>TurboBolton Fitment Guarantee.</b> If a part we marked as fitting your vehicle doesn't fit, we cover return shipping and refund you in full.</p></>;
    case 'Reviews': return (
      <>
        <div className="row" style={{ gap: 24, alignItems: 'flex-start' }}>
          <div><div style={{ fontFamily: 'var(--f-display)', fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{p.rating}</div><Stars r={p.rating} /><div className="small muted">{p.reviews} reviews</div></div>
          <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[5, 4, 3, 2, 1].map((s, i) => { const pct = [82, 13, 3, 1, 1][i]; return (
              <div className="row small" key={s} style={{ gap: 8, flexWrap: 'nowrap' }}><span style={{ width: 44 }}>{s} star</span><span style={{ flex: 1, height: 8, background: 'var(--bg-2)', borderRadius: 4, overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: `${pct}%`, background: 'var(--star)' }}></span></span><span className="num muted" style={{ width: 34, textAlign: 'right' }}>{pct}%</span></div>
            ); })}
          </div>
          <Soon m="Reviews are moderated before publishing" className="btn btn-sm">Write a review</Soon>
        </div>
        {REVIEWS.map(r => <div className="review" key={r.name}><div className="row" style={{ gap: 10 }}><Stars r={r.stars} /><b>{r.title}</b></div><p>{r.text}</p><span className="small muted">{r.name} · {r.car} · {r.date} · <span className="badge badge-ok">Verified purchase</span></span></div>)}
      </>
    );
    case 'Questions & Answers': return (
      <>
        {QUESTIONS.map(q => <div className="review" key={q.q}><b>Q: {q.q}</b><p><b style={{ color: 'var(--ok)' }}>A:</b> {q.a}</p><span className="small muted">Answered by {q.by}</span></div>)}
        <div><Soon m="Question sent to our support team" className="btn btn-sm">Ask a question</Soon></div>
      </>
    );
    default: return null;
  }
}

const Angle = ({ i, children }) => <span style={{ display: 'block', width: '100%', height: '100%', transform: VIEWS[i] || undefined }}>{children}</span>;

export default function Product({ id }) {
  const { S, ui, setUi, update, go } = useStore();
  const A = useActions();
  const p = P(S, id);

  useEffect(() => {
    if (!p || ui.lastPid === id) return;
    setUi(u => { u.lastPid = id; u.pdpTab = 'Description'; u.pdpImg = 0; u.qty = 1; });
    update(s => { s.recent = [id, ...s.recent.filter(x => x !== id)].slice(0, 8); });
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) return <div className="wrap"><div className="card empty" style={{ margin: '40px 0' }}><Icon n="alert" /><h3>Product not found</h3><Go to="results" className="btn">Back to results</Go></div></div>;

  const st = stockState(S, p), fit = fitOf(S, p), v = S.vehicle, wished = S.wishlist.includes(p.id), cmp = S.compare.includes(p.id);
  let fitBox;
  if (fit === 'fits') fitBox = <div className="fit fit-lg fit-ok"><Icon n="check" /><div><span className="fit-cap">This product fits your {vname(v)}</span><small>{v.engine} · Confirmed against {p.brand} application data</small></div></div>;
  else if (fit === 'universal') fitBox = <div className="fit fit-lg fit-warn"><Icon n="alert" /><div><span className="fit-cap">Verify vehicle fitment</span><small>Universal part. Installation on your {vname(v)} may need vehicle-specific hardware. Ask our team to confirm.</small></div></div>;
  else if (fit === 'no') fitBox = <div className="fit fit-lg fit-no"><Icon n="x" /><div><span className="fit-cap">Does not fit your {vname(v)}</span><small>Fits {fitText(p)}. <button type="button" className="btn-link" onClick={A.shopVehicle}>Shop parts for your {v.model}</button></small></div></div>;
  else fitBox = <div className="fit fit-lg fit-warn"><Icon n="alert" /><div><span className="fit-cap">Verify vehicle fitment</span><small>Select your vehicle to confirm this part fits. <button type="button" className="btn-link" onClick={A.openVehicle}>Select vehicle</button></small></div></div>;

  const shop = shopProducts(S);
  const fbtIds = p.id === 'brembo-gt6' ? ['ferodo-pads', 'motul-rbf660'] : shop.filter(x => x.id !== p.id && x.cat === p.cat && fitOf(S, x) !== 'no').map(x => x.id).concat(['motul-rbf660', 'ngk-plugs']).filter((x, i, a) => x !== p.id && a.indexOf(x) === i).slice(0, 2);
  const fbt = [p, ...fbtIds.map(x => P(S, x))];
  const fbtTotal = fbt.reduce((a, x) => a + eff(x), 0);
  const pool = shop.filter(x => x.id !== p.id && !fbtIds.includes(x.id));
  const similar = pool.filter(x => x.cat === p.cat || x.type === p.type).concat(pool.filter(x => x.brand === p.brand)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 6);
  const related = pool.filter(x => !similar.includes(x) && (fitOf(S, x) === 'fits' || !v)).slice(0, 8);
  const shipTxt = p.digital ? 'Digital delivery by email' : eff(p) >= 149 ? 'Free ground shipping' : '$12.95 ground, free over $149';

  return (
    <>
      <div className="wrap">
        <Crumbs items={[['Home', 'home'], ['Shop', ''], [p.cat, ''], [p.brand, '']]} />
        <div className="pdp">
          <div className="gallery">
            <div className="gal-thumbs">{VIEWS.map((s, i) => <button type="button" key={i} className={cx(ui.pdpImg === i && 'on')} onClick={() => A.pdpImg(i)} aria-label={`Image ${i + 1}`}><span style={{ display: 'block', width: '100%', height: '100%', overflow: 'hidden' }}><Angle i={i}><Art kind={p.art} /></Angle></span></button>)}</div>
            <div className="gal-main"><span style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'inherit' }}><span style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%', transform: VIEWS[ui.pdpImg] || undefined }}><Art kind={p.art} /></span></span><span className="gal-note">Illustration · product photography in production</span></div>
          </div>
          <div className="pdp-info">
            <div className="row">{onSale(p) ? <span className="badge badge-sale">On Sale</span> : null}{isNew(p) ? <span className="badge badge-dark">New</span> : null}</div>
            <h1>{p.name}</h1>
            <button type="button" className="brandlink" onClick={() => A.shopBrand(p.brand)}>{p.brand}</button>
            <button type="button" className="rating btn-link" style={{ color: 'var(--muted)', fontWeight: 500, alignSelf: 'flex-start' }} onClick={() => A.pdpTab('Reviews', true)}><Stars r={p.rating} /><span className="num">{p.rating} · {p.reviews} reviews</span></button>
            <div className={cx('pdp-price', onSale(p) && 'sale')}>{onSale(p) ? <span className="was">Was <s>{money(p.price)}</s></span> : null}<b>{onSale(p) ? <small>On Sale</small> : null}{money(eff(p))}</b>{onSale(p) ? <span className="badge badge-sale">You save {money(p.price - eff(p))}</span> : null}</div>
            <dl className="pdp-dl"><dt>SKU</dt><dd className="mono">{p.sku}</dd><dt>Condition</dt><dd>New</dd><dt>Availability</dt><dd><span className={`stock ${st.k}`}>{st.t}</span></dd><dt>Shipping</dt><dd>{shipTxt}{p.digital ? '' : ` · arrives ${etaRange('standard')}`}</dd></dl>
            {fitBox}
            <div className="row" style={{ gap: 14 }}><span className="lbl">Quantity</span><div className="qty"><button type="button" onClick={() => A.qty(-1)} aria-label="Decrease"><Icon n="minus" /></button><span>{ui.qty}</span><button type="button" onClick={() => A.qty(1)} aria-label="Increase"><Icon n="plus" /></button></div></div>
            <div className="buy-row"><button type="button" className="btn btn-primary btn-lg" onClick={() => A.addPdp(p.id)}><Icon n="cart" />Add to Cart</button><button type="button" className="btn btn-dark btn-lg" onClick={() => A.buyNow(p.id)}>Buy Now</button></div>
            <div className="sub-acts">
              <button type="button" className={cx(wished && 'on')} onClick={() => A.wish(p.id)}><Icon n="heart" />{wished ? 'In your wishlist' : 'Add to Wishlist'}</button>
              <button type="button" className={cx(cmp && 'on')} onClick={() => A.compare(p.id)}><Icon n="compare" />{cmp ? 'In compare' : 'Compare'}</button>
              <button type="button" onClick={A.share}><Icon n="external" />Share</button>
            </div>
            <div className="ship-note">
              <div><Icon n="shield" /><span>Fitment guarantee: if it doesn't fit, we pay return shipping</span></div>
              <div><Icon n="ret" /><span>30-day returns on uninstalled parts</span></div>
              <div><Icon n="headset" /><span>Questions? Call (800) 555-0142 or <button type="button" className="btn-link" onClick={A.chat}>chat with a specialist</button></span></div>
            </div>
          </div>
        </div>

        <div className="pdp-tabs" id="pdp-tabs">
          <div className="tabs" role="tablist">{PDP_TABS.map(t => <button type="button" role="tab" key={t} className={cx(ui.pdpTab === t && 'on')} onClick={() => A.pdpTab(t)}>{t}{t === 'Reviews' ? ` (${p.reviews})` : t === 'Questions & Answers' ? ` (${QUESTIONS.length})` : ''}</button>)}</div>
          <div className="tabpanel" role="tabpanel"><PdpPanel p={p} /></div>
        </div>

        <section className="band" style={{ paddingTop: 8 }}>
          <SecTitle t="Frequently Bought Together" />
          <div className="card pad"><div className="fbt">
            {fbt.map((x, i) => (
              <span key={x.id} style={{ display: 'contents' }}>
                {i ? <span className="fbt-plus"><Icon n="plus" /></span> : null}
                <div className="fbt-item"><div className="pimg" onClick={() => go('p-' + x.id)}><Art kind={x.art} /></div><span className="small" style={{ fontWeight: 600, lineHeight: 1.3 }}>{i === 0 ? 'This item: ' : ''}{x.brand} {x.name}</span><b className="num">{money(eff(x))}</b></div>
              </span>
            ))}
            <div className="fbt-sum"><span className="small muted">Total for all {fbt.length}</span><b className="num" style={{ fontFamily: 'var(--f-display)', fontSize: 28 }}>{money(fbtTotal)}</b><button type="button" className="btn btn-primary" onClick={() => A.addFbt(fbt.map(x => x.id))}>Add All {fbt.length} to Cart</button></div>
          </div></div>
        </section>
        {similar.length ? <section className="band" style={{ paddingTop: 0 }}><SecTitle t="Similar Products" sub={`Other ${p.cat.toLowerCase()} options`} /><Carousel list={similar} /></section> : null}
        {related.length ? <section className="band" style={{ paddingTop: 0 }}><SecTitle t="Related Products" sub={v ? `More parts that fit your ${vname(v)}` : ''} /><Carousel list={related} /></section> : null}
      </div>
      <div className="pdp-sticky"><div><div className="small muted">{p.brand}</div><b className="num" style={{ fontFamily: 'var(--f-display)', fontSize: 22 }}>{money(eff(p))}</b></div><button type="button" className="btn btn-primary" onClick={() => A.addPdp(p.id)}><Icon n="cart" />Add to Cart</button></div>
    </>
  );
}

/* ---------- Quick view, compare and added-to-cart overlays ---------- */
export function QuickViewModal({ id }) {
  const { S } = useStore();
  const A = useActions();
  const p = P(S, id), st = stockState(S, p);
  return (
    <div className="modal wide" role="dialog" aria-modal="true" aria-label="Quick view">
      <div className="modal-h"><h3>Quick view</h3><button type="button" className="icon-btn" onClick={A.close} aria-label="Close"><Icon n="x" /></button></div>
      <div className="modal-b qv-grid">
        <div className="pimg qv-img"><Art kind={p.art} /></div>
        <div className="stack" style={{ gap: 10 }}>
          <span className="pbrand" style={{ color: 'var(--muted)' }}>{p.brand}</span><h3 style={{ fontSize: 24 }}>{p.name}</h3><span className="mono small muted">SKU {p.sku}</span>
          <span className="rating"><Stars r={p.rating} /><span className="num">{p.rating} ({p.reviews})</span></span>
          <div className={cx('pdp-price', onSale(p) && 'sale')} style={{ gap: 8 }}>{onSale(p) ? <span className="was">Was <s>{money(p.price)}</s></span> : null}<b style={{ fontSize: 30 }}>{money(eff(p))}</b></div>
          <span className={`stock ${st.k}`}>{st.t}</span><FitBadge p={p} /><p className="small muted">{p.blurb}</p>
          <div className="row"><button type="button" className="btn btn-primary" onClick={() => A.add(p.id)}><Icon n="cart" />Add to Cart</button><Go to={'p-' + p.id} className="btn">View full details</Go></div>
        </div>
      </div>
    </div>
  );
}

export function CompareModal() {
  const { S } = useStore();
  const A = useActions();
  const ps = S.compare.map(id => P(S, id)).filter(Boolean);
  if (!ps.length) return <Modal title="Compare products"><div className="empty" style={{ padding: 20 }}><Icon n="compare" /><p className="muted">Select Compare on up to 4 products to see them side by side.</p></div></Modal>;
  const Row = ({ l, fn }) => <tr><th>{l}</th>{ps.map(p => <td key={p.id}>{fn(p)}</td>)}</tr>;
  return (
    <div className="modal wide" role="dialog" aria-modal="true" aria-label="Compare products">
      <div className="modal-h"><h3>Compare products ({ps.length} of 4)</h3><button type="button" className="icon-btn" onClick={A.close} aria-label="Close"><Icon n="x" /></button></div>
      <div className="modal-b"><div className="tbl-wrap"><table className="tbl cmp-tbl"><tbody>
        <Row l="" fn={p => <><div className="pimg" style={{ borderRadius: 6, maxWidth: 160 }}><Art kind={p.art} /></div><b style={{ display: 'block', marginTop: 8, fontSize: 14 }}>{p.brand} {p.name}</b></>} />
        <Row l="Price" fn={p => <><b>{money(eff(p))}</b>{onSale(p) ? <> <s className="muted small">{money(p.price)}</s></> : null}</>} />
        <Row l="Fitment" fn={p => <FitBadge p={p} />} />
        <Row l="Category" fn={p => p.cat + ' · ' + p.type} />
        <Row l="Rating" fn={p => <><Stars r={p.rating} /> {p.rating}</>} />
        <Row l="Availability" fn={p => <span className={`stock ${stockState(S, p).k}`}>{stockState(S, p).t}</span>} />
        <Row l="" fn={p => <div className="stack" style={{ gap: 6 }}><button type="button" className="btn btn-primary btn-sm" onClick={() => A.add(p.id)}>Add to Cart</button><button type="button" className="btn-link small" onClick={() => A.compare(p.id, true)}>Remove</button></div>} />
      </tbody></table></div></div>
    </div>
  );
}

export function AddedDrawer({ ids }) {
  const { S } = useStore();
  const A = useActions();
  const items = ids.map(id => P(S, id));
  const t = totals(S);
  return (
    <Drawer title="Added to your cart" foot={<><button type="button" className="btn" onClick={A.close}>Continue Shopping</button><Go to="cart" className="btn btn-dark">View Cart</Go><Go to="checkout" className="btn btn-primary">Checkout</Go></>}>
      {items.map(p => (
        <div className="mini-line" key={p.id}>
          <div className="pimg"><Art kind={p.art} /></div>
          <div><b style={{ fontSize: 14 }}>{p.brand} {p.name}</b>{fitOf(S, p) === 'fits' ? <div className="fit fit-ok" style={{ marginTop: 6, padding: '3px 8px', fontSize: 12 }}><Icon n="check" />Fits your {vname(S.vehicle)}</div> : null}</div>
          <b className="num">{money(eff(p))}</b>
        </div>
      ))}
      <hr className="hr" /><div className="sumrow"><span>Cart subtotal ({plural(cartCount(S), 'item')})</span><b>{money(t.sub)}</b></div>
      {t.sub >= 149 ? <div className="badge badge-ok" style={{ alignSelf: 'flex-start' }}><Icon n="truck" />Your order qualifies for free shipping</div> : <div className="small muted">Add {money(149 - t.sub)} more for free shipping</div>}
    </Drawer>
  );
}
