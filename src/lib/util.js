/* ---------- Formatting and small helpers ---------- */
export const money = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const vname = v => `${v.year} ${v.make} ${v.model}`;
export const sameV = (a, b) => !!(a && b && a.year === b.year && a.make === b.make && a.model === b.model && a.engine === b.engine);
export const fmtDate = (d, opt = { month: 'short', day: 'numeric', year: 'numeric' }) => new Date(d).toLocaleDateString('en-US', opt);
export const fmtTime = d => { const x = new Date(d); return `${fmtDate(x)} · ${x.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`; };
export const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
export const cx = (...a) => a.filter(Boolean).join(' ');
export const CAT_ART = { Engine: 'intake', Exhaust: 'exhaust', Suspension: 'coilover', Brakes: 'rotor', 'Wheels & Tires': 'wheel', Exterior: 'lip', Interior: 'seat', Electronics: 'ecu', Performance: 'intercooler' };
export const EMPTY_VS = () => ({ year: '', make: '', model: '', engine: '' });
