/* ==========================================================
   Vehicle selector (Year → Make → Model → Engine), the
   "search by vehicle" box and the vehicle picker dialog
   ========================================================== */
import { YEARS, enginesFor, makesFor, modelsFor } from '../data';
import { Icon } from '../lib/icons';
import { EMPTY_VS, cx, sameV, vname } from '../lib/util';
import { useStore } from '../store/StoreContext';
import { useActions } from '../store/actions';
import { Modal } from './common';

export function VselBlock({ k, cta = 'Find Parts That Fit' }) {
  const { S, ui } = useStore();
  const A = useActions();
  const s = ui.vs[k] || EMPTY_VS();
  const y = +s.year;
  const makes = y ? makesFor(y) : [], models = y && s.make ? modelsFor(y, s.make) : [], engines = y && s.make && s.model ? enginesFor(y, s.make, s.model) : [];
  const sel = ({ n, label, f, opts, val, dis }) => (
    <div className="field" key={f}>
      <label htmlFor={`vs-${k}-${f}`}><span className={cx('stepn', val && 'done')}>{val ? '✓' : n}</span>{label}</label>
      <select className="select" id={`vs-${k}-${f}`} disabled={dis} value={String(val)} onChange={e => A.vsChange(k, f, e.target.value)}>
        <option value="">Select {label.toLowerCase()}</option>
        {opts.map(o => <option key={o} value={String(o)}>{o}</option>)}
      </select>
    </div>
  );
  const ready = s.year && s.make && s.model && s.engine;
  return (
    <div id={`vsw-${k}`}>
      <div className="vsel-grid">
        {sel({ n: 1, label: 'Year', f: 'year', opts: YEARS, val: s.year, dis: false })}
        {sel({ n: 2, label: 'Make', f: 'make', opts: makes, val: s.make, dis: !y })}
        {sel({ n: 3, label: 'Model', f: 'model', opts: models, val: s.model, dis: !s.make })}
        {sel({ n: 4, label: 'Engine', f: 'engine', opts: engines, val: s.engine, dis: !s.model })}
      </div>
      <div className="vs-btns">
        <button type="button" className="btn btn-primary btn-lg" data-apply onClick={() => A.applyVehicle(k)} disabled={!ready}><Icon n="search" />{cta}</button>
        {k !== 'modal' ? <button type="button" className="btn btn-lg" onClick={() => A.resetVs(k)}>Reset</button> : null}
      </div>
      <div className="vsel-foot">
        <button type="button" className="btn-link" onClick={() => A.fillDemo(k)}>Demo shortcut: 2022 BMW M3</button>
        {S.garage.length ? <button type="button" className="btn-link" onClick={A.openVehicle}><Icon n="car" />Choose from My Garage</button> : null}
      </div>
    </div>
  );
}

/** "Search by vehicle" box: shows the active vehicle, or the selector. */
export function YmmBox({ k }) {
  const { S, ui } = useStore();
  const A = useActions();
  const v = S.vehicle;
  if (v && !ui.ymmEdit[k]) {
    const saved = S.garage.some(g => sameV(g, v));
    return (
      <div className="ymm-active">
        <div className="ymm-car"><Icon n="car" /></div>
        <div className="ymm-txt"><span className="yv-l">Your Vehicle</span><span className="yv-n">{vname(v)}</span><span className="yv-e">{v.engine}</span></div>
        <div className="fit fit-ok ymm-fit"><Icon n="check" />Parts are checked against this vehicle</div>
        <div className="ymm-acts">
          {k === 'home' ? <button type="button" className="btn btn-primary" onClick={A.shopVehicle}><Icon n="search" />Shop parts for my {v.model}</button> : null}
          <button type="button" className="btn" onClick={() => A.ymmEdit(k)}><Icon n="refresh" />Change</button>
          {saved ? <span className="badge badge-ok"><Icon n="check" />In My Garage</span> : <button type="button" className="btn btn-dark" onClick={A.saveGarage}><Icon n="plus" />Save to My Garage</button>}
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="ymm-title"><h2><Icon n="car" />Search by Vehicle</h2><p>Year · Make · Model · Engine. We only show parts that fit.</p></div>
      <VselBlock k={k} />
    </>
  );
}

export function VehicleModal() {
  const { S, ui } = useStore();
  const A = useActions();
  const v = S.vehicle, editing = ui.editVehicle;
  return (
    <Modal title={editing ? 'Edit vehicle' : 'Select your vehicle'}>
      {!editing && S.garage.length ? (
        <>
          <div className="stack" style={{ gap: 8 }}>
            <span className="lbl">My Garage</span>
            {S.garage.map(g => (
              <button type="button" key={g.id} className={cx('radio-card', sameV(g, v) && 'on')} onClick={() => A.useGarage(g.id)} style={{ textAlign: 'left', background: 'var(--paper)' }}>
                <Icon n="car" /><span className="rc-t"><b>{vname(g)}</b><small>{g.engine}</small></span>
                {sameV(g, v) ? <span className="badge badge-ok">Active</span> : <span className="btn-link">Shop</span>}
              </button>
            ))}
          </div>
          <div className="row" style={{ gap: 10 }}><hr className="hr" style={{ flex: 1 }} /><span className="small muted">or add a vehicle</span><hr className="hr" style={{ flex: 1 }} /></div>
        </>
      ) : null}
      <VselBlock k="modal" cta={editing ? 'Save Vehicle' : 'Shop This Vehicle'} />
    </Modal>
  );
}
