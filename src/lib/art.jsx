/* ==========================================================
   Product illustrations (stand-ins for real photography).
   The SVG markup is generated as strings, exactly as in the
   original prototype, and injected into React-managed <svg> roots.
   ========================================================== */
import { useMemo } from 'react';

const DEFS_INNER = `<defs>
  <radialGradient id="aRotor" cx=".42" cy=".38"><stop offset="0" stop-color="#EEF1F4"/><stop offset=".65" stop-color="#AEB7C2"/><stop offset="1" stop-color="#7B8592"/></radialGradient>
  <linearGradient id="aTi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9CFD8"/><stop offset=".55" stop-color="#7D88A8"/><stop offset="1" stop-color="#B88A55"/></linearGradient>
  <linearGradient id="aSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3E7EC"/><stop offset="1" stop-color="#8F99A6"/></linearGradient>
  <linearGradient id="aBronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8925E"/><stop offset="1" stop-color="#6E5230"/></linearGradient>
  <pattern id="aCarbon" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#1A1D22"/><rect width="4" height="4" fill="#2C3139"/><rect x="4" y="4" width="4" height="4" fill="#2C3139"/></pattern>
</defs>`;

/** Shared gradients and patterns used by the product illustrations. Render once near the top of the tree. */
export function ArtDefs() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: DEFS_INNER }} />;
}

function artInner(kind) {
  const sh = '<ellipse cx="120" cy="166" rx="78" ry="7" fill="#0D1520" opacity=".13"/>';
  let g = '';
  const ring = (cx, cy, r, n, fn) => { let s = ''; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; s += fn(cx + Math.cos(a) * r, cy + Math.sin(a) * r, a, i); } return s; };
  switch (kind) {
    case 'rotor':
      g = `<circle cx="112" cy="88" r="68" fill="url(#aRotor)"/><circle cx="112" cy="88" r="68" fill="none" stroke="#6B7480" stroke-width="1.5"/>
      ${ring(112, 88, 52, 18, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#4C5560"/>`)}
      ${ring(112, 88, 44, 6, (x, y, a) => `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(112 + Math.cos(a + .35) * 62).toFixed(1)}" y2="${(88 + Math.sin(a + .35) * 62).toFixed(1)}" stroke="#5E6772" stroke-width="2"/>`)}
      <circle cx="112" cy="88" r="31" fill="#4A535F"/><circle cx="112" cy="88" r="28" fill="#8C96A3"/>
      ${ring(112, 88, 17, 5, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.8" fill="#2E353E"/>`)}
      <circle cx="112" cy="88" r="9" fill="#2E353E"/>
      <path d="M150 33a68 68 0 0 1 0 110l-12-12a50 50 0 0 0 0-86z" fill="#C61F2E"/><path d="M155 45a58 58 0 0 1 0 86" fill="none" stroke="#E5505C" stroke-width="2"/>
      <rect x="160" y="80" width="18" height="16" rx="3" fill="#A51826"/>`; break;
    case 'wheel':
      g = `<circle cx="120" cy="86" r="72" fill="#1A1F26"/><circle cx="120" cy="86" r="64" fill="url(#aBronze)"/><circle cx="120" cy="86" r="57" fill="#20262E"/>
      ${ring(120, 86, 0, 5, (x, y, a) => `<g transform="rotate(${(a * 180 / Math.PI).toFixed(1)} 120 86)"><path d="M114 80 L112 30 Q120 26 128 30 L126 80z" fill="url(#aBronze)"/></g>`)}
      <circle cx="120" cy="86" r="16" fill="url(#aBronze)"/><circle cx="120" cy="86" r="8" fill="#2B2F35"/>
      ${ring(120, 86, 12, 5, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.8" fill="#1A1F26"/>`)}`; break;
    case 'tire':
      g = `<circle cx="120" cy="86" r="74" fill="#1C2026"/>
      ${ring(120, 86, 70, 40, (x, y, a) => `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(120 + Math.cos(a) * 62).toFixed(1)}" y2="${(86 + Math.sin(a) * 62).toFixed(1)}" stroke="#30363F" stroke-width="2.4"/>`)}
      <circle cx="120" cy="86" r="58" fill="#252A31"/><circle cx="120" cy="86" r="44" fill="url(#aSteel)"/><circle cx="120" cy="86" r="38" fill="#3A414B"/>
      ${ring(120, 86, 0, 10, (x, y, a) => `<g transform="rotate(${(a * 180 / Math.PI).toFixed(1)} 120 86)"><rect x="118" y="49" width="4" height="30" fill="#C7CDD5"/></g>`)}
      <circle cx="120" cy="86" r="9" fill="#C7CDD5"/>
      <text x="120" y="38" text-anchor="middle" font-family="Barlow Condensed,Arial" font-weight="700" font-size="9" fill="#6E7682" letter-spacing="2">PILOT SPORT 4S</text>`; break;
    case 'exhaust':
    case 'exhaust2': {
      const tip = kind === 'exhaust' ? 'url(#aCarbon)' : 'url(#aSteel)';
      const pipe = kind === 'exhaust' ? 'url(#aTi)' : 'url(#aSteel)';
      g = `<path d="M18 132 C70 128 90 92 150 84" stroke="${pipe}" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M18 104 C66 100 96 62 150 54" stroke="${pipe}" stroke-width="18" fill="none" stroke-linecap="round"/>
      <rect x="36" y="88" width="56" height="34" rx="10" fill="${pipe}" transform="rotate(-14 64 105)"/>
      <ellipse cx="176" cy="52" rx="20" ry="26" fill="${tip}"/><ellipse cx="179" cy="52" rx="13" ry="19" fill="#0F1318"/><ellipse cx="160" cy="54" rx="16" ry="21" fill="${pipe}"/>
      <ellipse cx="176" cy="84" rx="20" ry="26" fill="${tip}"/><ellipse cx="179" cy="84" rx="13" ry="19" fill="#0F1318"/><ellipse cx="160" cy="86" rx="16" ry="21" fill="${pipe}"/>`; break; }
    case 'coilover':
      g = `<rect x="103" y="12" width="34" height="10" rx="3" fill="#2B313A"/><rect x="116" y="20" width="8" height="28" fill="#C2C8D0"/>
      <rect x="108" y="44" width="24" height="100" rx="4" fill="url(#aSteel)"/>
      <polyline points="94,40 146,52 94,64 146,76 94,88 146,100 94,112 146,124" fill="none" stroke="#E2B526" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="98" y="126" width="44" height="9" rx="2" fill="#7B4DB0"/><rect x="98" y="34" width="44" height="7" rx="2" fill="#7B4DB0"/>
      <rect x="112" y="144" width="16" height="10" fill="#8F99A6"/><circle cx="120" cy="158" r="7" fill="none" stroke="#5F6874" stroke-width="5"/>`; break;
    case 'intake':
      g = `<path d="M20 98h40" stroke="#1A1D22" stroke-width="20" stroke-linecap="round"/>
      <rect x="52" y="54" width="112" height="84" rx="16" fill="url(#aCarbon)"/><rect x="52" y="54" width="112" height="84" rx="16" fill="none" stroke="#3E454F" stroke-width="2"/>
      <path d="M70 66 Q108 58 146 66" stroke="#4A515C" stroke-width="2" fill="none"/>
      <path d="M164 72 L212 58 L212 138 L164 124z" fill="#B3252B"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="${170 + i * 6}" y1="${71 - i * 1.7}" x2="${170 + i * 6}" y2="${125 + i * 1.7}" stroke="#7E1A1F" stroke-width="2"/>`).join('')}
      <rect x="208" y="56" width="8" height="84" rx="3" fill="#1A1D22"/>`; break;
    case 'intercooler':
      g = `<rect x="44" y="50" width="152" height="84" fill="#A6B0BB"/>
      ${Array.from({ length: 16 }, (_, i) => `<line x1="44" y1="${54 + i * 5}" x2="196" y2="${54 + i * 5}" stroke="#7F8996" stroke-width="1.5"/>`).join('')}
      <rect x="26" y="44" width="22" height="96" rx="6" fill="#2A3038"/><rect x="192" y="44" width="22" height="96" rx="6" fill="#2A3038"/>
      <rect x="10" y="62" width="20" height="18" rx="4" fill="#3A414B"/><rect x="210" y="104" width="20" height="18" rx="4" fill="#3A414B"/>
      <text x="120" y="152" text-anchor="middle" font-family="Barlow Condensed,Arial" font-weight="700" font-size="10" fill="#6E7682" letter-spacing="2">COMPETITION</text>`; break;
    case 'ecu':
      g = `<rect x="56" y="38" width="128" height="88" rx="12" fill="#1E242C"/><rect x="66" y="48" width="108" height="56" rx="4" fill="#123A73"/>
      <text x="120" y="70" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="10" fill="#9CC3FF">S58 · STAGE 1</text>
      <text x="120" y="90" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="14" font-weight="600" fill="#FFFFFF">+60 HP</text>
      <circle cx="120" cy="115" r="4" fill="#E4570F"/>
      <path d="M184 92 C214 96 214 140 186 146 L160 148" stroke="#1E242C" stroke-width="7" fill="none" stroke-linecap="round"/>
      <rect x="136" y="138" width="28" height="20" rx="3" fill="#2E353E"/>`; break;
    case 'plugs':
      g = [70, 120, 170].map(x => `<rect x="${x - 4}" y="16" width="8" height="12" rx="2" fill="#B9C0C9"/>
        <rect x="${x - 9}" y="26" width="18" height="52" rx="5" fill="#F5F5F2" stroke="#CDD2D8"/>
        <rect x="${x - 7}" y="34" width="14" height="4" fill="#C0392B"/>
        <path d="M${x - 15} 78h30l-3 16h-24z" fill="url(#aSteel)"/>
        <rect x="${x - 8}" y="94" width="16" height="40" fill="#C7CDD5"/>
        ${[0, 1, 2, 3, 4, 5, 6].map(i => `<line x1="${x - 8}" y1="${98 + i * 5}" x2="${x + 8}" y2="${100 + i * 5}" stroke="#8F99A6" stroke-width="1.4"/>`).join('')}
        <path d="M${x} 134v10h7" stroke="#8F99A6" stroke-width="3" fill="none"/>`).join(''); break;
    case 'lip':
      g = `<path d="M14 96 Q120 58 226 96 L220 118 Q120 86 20 118z" fill="url(#aCarbon)"/>
      <path d="M18 99 Q120 63 222 99" fill="none" stroke="#56606C" stroke-width="2"/>
      <path d="M40 112 Q120 88 200 112" fill="none" stroke="#3A414B" stroke-width="1"/>`; break;
    case 'fluid':
      g = `<rect x="106" y="22" width="28" height="22" rx="3" fill="#C91F2B"/><rect x="112" y="40" width="16" height="10" fill="#E7EBEF"/>
      <rect x="88" y="48" width="64" height="110" rx="12" fill="#EEF1F4" stroke="#C7CDD5"/>
      <rect x="88" y="78" width="64" height="50" fill="#C91F2B"/>
      <text x="120" y="100" text-anchor="middle" font-family="Barlow Condensed,Arial" font-weight="700" font-size="15" fill="#FFFFFF">RBF 660</text>
      <text x="120" y="116" text-anchor="middle" font-family="Barlow,Arial" font-size="8" fill="#FFE1E3">FACTORY LINE</text>`; break;
    case 'pads':
      g = [[70, 50], [110, 82]].map(([x, y]) => `<path d="M${x} ${y + 10} Q${x + 50} ${y - 14} ${x + 100} ${y + 10} L${x + 96} ${y + 44} Q${x + 50} ${y + 26} ${x + 4} ${y + 44}z" fill="#6B7480"/>
        <path d="M${x + 8} ${y + 16} Q${x + 50} ${y - 4} ${x + 92} ${y + 16} L${x + 89} ${y + 38} Q${x + 50} ${y + 22} ${x + 11} ${y + 38}z" fill="#353A41"/>
        <line x1="${x + 50}" y1="${y + 6}" x2="${x + 50}" y2="${y + 28}" stroke="#1E2228" stroke-width="2"/>`).join(''); break;
    case 'seat':
      g = `<path d="M82 16 Q120 4 158 16 L164 86 Q178 96 178 128 L172 160 L68 160 L62 128 Q62 96 76 86z" fill="#1E2329"/>
      <path d="M96 30 Q120 22 144 30 L146 86 Q120 80 94 86z" fill="#2E343D"/><path d="M86 100 Q120 92 154 100 L152 150 L88 150z" fill="#2E343D"/>
      <rect x="104" y="20" width="10" height="16" rx="3" fill="#0D1014"/><rect x="126" y="20" width="10" height="16" rx="3" fill="#0D1014"/>
      <path d="M96 34 L94 86 M144 34 L146 86" stroke="#E4570F" stroke-width="1.6" stroke-dasharray="3 3"/>`; break;
  }
  return sh + g;
}

/** Product illustration for a catalog item. `kind` is the product's `art` key. */
export function Art({ kind }) {
  const html = useMemo(() => artInner(kind), [kind]);
  return <svg viewBox="0 0 240 180" className="art" role="img" aria-label="Product image" dangerouslySetInnerHTML={{ __html: html }} />;
}

function heroWheelInner() {
  let spokes = '';
  for (let i = 0; i < 10; i++) spokes += `<g transform="rotate(${i * 36} 300 300)"><path d="M290 228 L284 74 Q300 66 316 74 L310 228" /></g>`;
  let holes = '';
  for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; holes += `<circle cx="${(300 + Math.cos(a) * 248).toFixed(1)}" cy="${(300 + Math.sin(a) * 248).toFixed(1)}" r="5"/>`; }
  return `<g fill="none" stroke="currentColor" stroke-width="2"><circle cx="300" cy="300" r="290"/><circle cx="300" cy="300" r="262"/><circle cx="300" cy="300" r="232"/>${spokes}<circle cx="300" cy="300" r="60"/><circle cx="300" cy="300" r="26"/></g><g fill="currentColor" opacity=".7">${holes}</g>`;
}

/** Wheel line-art for the admin sign-in hero. */
export function HeroWheel() {
  const html = useMemo(heroWheelInner, []);
  return <svg viewBox="0 0 600 600" className="hero-wheel" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />;
}
