import { BRANDS, CATEGORIES } from '../data';
import { Icon } from '../lib/icons';
import { cx, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { PRICE_BANDS, SORTS, applyFilters, fitOf, queryList, sorted } from '../store/selectors';
import { Crumbs, ProductCard, Stars } from '../components/common';
import { YmmBox } from '../components/VehicleSelector';

export default function Results() {
  const { S, ui } = useStore();
  const A = useActions();
  const base = queryList(S);
  const list = sorted(S, applyFilters(S, base));
  const f = S.f, v = S.vehicle;

  const facet = (key, field, values) => {
    const pool = applyFilters(S, base, key);
    return values.map(val => ({ val, c: pool.filter(p => p[field] === val).length })).filter(x => x.c || f[key].includes(x.val))
      .map(({ val, c }) => (
        <label className="chk" key={val}><input type="checkbox" value={val} checked={f[key].includes(val)} onChange={e => A.facet(key, val, e.target.checked)} />{val}<span className="cnt">{c}</span></label>
      ));
  };
  const Group = ({ k, title, children }) => (
    <div className="fgroup">
      <button type="button" className="fgroup-h" onClick={() => A.fold(k)} aria-expanded={!ui.fold[k]}>{title}<Icon n={ui.fold[k] ? 'plus' : 'minus'} /></button>
      {ui.fold[k] ? null : <div className="fgroup-b">{children}</div>}
    </div>
  );
  const types = [...new Set(base.map(p => p.type))].sort();
  const title = S.q ? `Results for “${S.q}”` : f.cats.length === 1 ? f.cats[0] : f.sale ? 'Deals' : f.brands.length === 1 ? f.brands[0] : S.sort === 'new' ? 'New Products' : 'All Parts';
  const chips = [
    ...[...f.cats.map(c => ['cats', c]), ...f.brands.map(c => ['brands', c]), ...f.types.map(c => ['types', c])].map(([k, val]) => ({ key: `${k}-${val}`, label: val, k, val, aria: `Remove ${val}` })),
    ...(f.price ? [{ key: 'price', label: PRICE_BANDS.find(b => b[0] === f.price)[1], k: 'price', aria: 'Remove price filter' }] : []),
    ...(f.sale ? [{ key: 'sale', label: 'On sale', k: 'sale', aria: 'Remove sale filter' }] : []),
    ...(f.inStock ? [{ key: 'inStock', label: 'In stock', k: 'inStock', aria: 'Remove in-stock filter' }] : []),
  ];
  const hiddenNoFit = v && f.fitOnly ? base.filter(p => fitOf(S, p) === 'no').length : 0;

  return (
    <>
      <section className="ymm-band"><div className="wrap"><div className="ymm ymm-bar"><YmmBox k="bar" /></div></div></section>
      <div className="wrap">
        <div className="list-head"><Crumbs items={[['Home', 'home'], ['Shop', ''], [S.q ? 'Search' : title, '']]} /><h1>{title}</h1>{v ? <p className="muted">Compatible parts for your {vname(v)} · {v.engine}</p> : null}</div>
        <div className="res">
          <aside className={cx('filters', ui.filtersOpen && 'open')} aria-label="Filters">
            <div className="fhead"><b>Refine by</b><span>{chips.length ? <>{chips.length} applied · <button type="button" className="btn-link" onClick={A.clearFilters}>Clear</button></> : 'No filters applied'}</span></div>
            {chips.length ? <div className="chips fchips">{chips.map(c => <span className="chip" key={c.key}>{c.label}<button type="button" className="btn-link" onClick={() => A.unchip(c.k, c.val)} aria-label={c.aria}><Icon n="x" /></button></span>)}</div> : null}
            <Group k="fit" title="Vehicle Fitment">
              {v ? <label className="chk"><input type="checkbox" checked={f.fitOnly} onChange={e => A.fitOnly(e.target.checked)} />Only parts that fit my {v.model}</label>
                : <button type="button" className="btn btn-sm btn-block" onClick={A.openVehicle}><Icon n="car" />Select vehicle</button>}
            </Group>
            <Group k="cats" title="Category">{facet('cats', 'cat', CATEGORIES.map(c => c.id))}</Group>
            <Group k="brands" title="Brand">{facet('brands', 'brand', BRANDS.slice().sort((a, b) => a.localeCompare(b)))}</Group>
            <Group k="types" title="Product Type">{facet('types', 'type', types)}</Group>
            <Group k="price" title="Price">
              {PRICE_BANDS.map(([k, l]) => <label className="chk" key={k}><input type="radio" name="price" value={k} checked={f.price === k} onChange={() => A.price(k)} />{l}</label>)}
              <label className="chk"><input type="radio" name="price" value="" checked={!f.price} onChange={() => A.price('')} />Any price</label>
            </Group>
            <Group k="avail" title="Availability">
              <label className="chk"><input type="checkbox" checked={f.inStock} onChange={e => A.inStock(e.target.checked)} />In stock only</label>
              <label className="chk"><input type="checkbox" checked={f.sale} onChange={e => A.sale(e.target.checked)} />On sale</label>
            </Group>
            <Group k="rating" title="Rating">
              {[4.8, 4.5, 0].map(r => <label className="chk" key={r}><input type="radio" name="rating" value={r} checked={+f.rating === r} onChange={() => A.rating(r)} />{r ? <><Stars r={r} /> {r} &amp; up</> : 'Any rating'}</label>)}
            </Group>
          </aside>
          <section>
            <div className="res-bar">
              <button type="button" className="btn btn-sm ftoggle-btn" onClick={A.toggleFilters}><Icon n="filter" />{ui.filtersOpen ? 'Hide' : 'Show'} filters{chips.length ? ` (${chips.length})` : ''}</button>
              <span className="count"><b className="num" style={{ color: 'var(--text)' }}>{list.length}</b> {list.length === 1 ? 'product' : 'products'}{hiddenNoFit ? ` · ${hiddenNoFit} that don't fit hidden` : ''}</span>
              <label className="sort" htmlFor="sort">Sort by <select className="select" id="sort" value={S.sort} onChange={e => A.sort(e.target.value)}>{SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
            </div>
            {list.length ? (
              <>
                <div className="pgrid c3">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
                <div className="row between" style={{ marginTop: 24 }}><span className="small muted">Showing 1–{list.length} of {list.length}</span><div className="pager"><button type="button" aria-label="Previous page" disabled><Icon n="chevL" /></button><button type="button" className="on">1</button><button type="button" aria-label="Next page" disabled><Icon n="chevR" /></button></div></div>
              </>
            ) : (
              <div className="card empty"><Icon n="search" /><h3>No parts match these filters</h3><p className="muted">Try removing a filter or searching a different term.</p><button type="button" className="btn" onClick={A.clearFilters}>Clear filters</button></div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
