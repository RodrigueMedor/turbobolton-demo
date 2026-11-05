/* ---------- Icons (24px stroke set) ---------- */
const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  cart: '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.1L21 8H6"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  heart: '<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 5.6 5 5 0 0 1 21.2 11C19 15.6 12 20 12 20z"/>',
  car: '<path d="M5 17H3v-4l2.2-5.2A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.3L21 13v4h-2"/><path d="M3 13h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  alert: '<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4M12 17v.2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.2"/>',
  chevR: '<path d="m9 5 7 7-7 7"/>', chevL: '<path d="m15 5-7 7 7 7"/>', chevD: '<path d="m5 9 7 7 7-7"/>',
  arrowR: '<path d="M4 12h16M14 6l6 6-6 6"/>', arrowL: '<path d="M20 12H4M10 6l-6 6 6 6"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>', play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  truck: '<path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  ret: '<path d="M4 9h11a5 5 0 0 1 0 10H8"/><path d="m8 5-4 4 4 4"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-5M12 16V8M16 16v-8"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  logout: '<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  compare: '<path d="M7 4 3 8l4 4M3 8h13M17 12l4 4-4 4M21 16H8"/>',
  store: '<path d="M3 9 4.5 4h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  gauge: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="m12 13 4-5"/><circle cx="12" cy="13" r="1.2"/>',
  engine: '<path d="M4 9h3l2-2h6v3h2l2-2h1v9h-1l-2-2h-2v3H9l-2-2H4z"/><path d="M2 11v4"/>',
  exhaust: '<path d="M2 14h10l3-4h4"/><path d="M2 18h12l3-4h2"/><ellipse cx="20" cy="12" rx="1.6" ry="3"/>',
  spring: '<path d="M8 3h8M8 21h8M8 5.5l8 2.5-8 2.5 8 2.5-8 2.5 8 2.5"/>',
  disc: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M16 4.8a8.5 8.5 0 0 1 0 14.4"/>',
  wheel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v6.5M12 14.5V21M3.5 9.2l6.2 2M14.3 12.8l6.2 2M6.7 19.3l3.8-5.3M13.5 10l3.8-5.3"/>',
  seat: '<path d="M7 3h5l-1 9h6a2 2 0 0 1 2 2v2H8z"/><path d="M8 16l-1 5M17 16l1 5"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
  monitor: '<rect x="2.5" y="4" width="19" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
  tablet: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',
  phone: '<rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M11 18.5h2"/>',
  doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-1.4-1.3-1.6-1.3-2.8 0-1 .8-1.5 1.8-1.5H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.1"/><circle cx="10.5" cy="7.2" r="1.1"/><circle cx="15" cy="7.5" r="1.1"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  home: '<path d="M3 11 12 4l9 7M5 9.5V20h14V9.5"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  dollar: '<path d="M12 2v20M17 6.5C16 5 14.3 4.5 12 4.5c-3 0-4.5 1.5-4.5 3.3 0 4.4 9.5 2.4 9.5 7.4 0 2-1.8 3.4-5 3.4-2.4 0-4.2-.8-5-2.3"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
};
function ic(n, cls = '') {
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;
}

/* ---------- Product illustrations (stand-ins for real photography) ---------- */
const ART_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <radialGradient id="aRotor" cx=".42" cy=".38"><stop offset="0" stop-color="#EEF1F4"/><stop offset=".65" stop-color="#AEB7C2"/><stop offset="1" stop-color="#7B8592"/></radialGradient>
  <linearGradient id="aTi" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9CFD8"/><stop offset=".55" stop-color="#7D88A8"/><stop offset="1" stop-color="#B88A55"/></linearGradient>
  <linearGradient id="aSteel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3E7EC"/><stop offset="1" stop-color="#8F99A6"/></linearGradient>
  <linearGradient id="aBronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8925E"/><stop offset="1" stop-color="#6E5230"/></linearGradient>
  <pattern id="aCarbon" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#1A1D22"/><rect width="4" height="4" fill="#2C3139"/><rect x="4" y="4" width="4" height="4" fill="#2C3139"/></pattern>
</defs></svg>`;

function art(kind) {
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
  return `<svg viewBox="0 0 240 180" class="art" role="img" aria-label="Product image">${sh}${g}</svg>`;
}

/* Wheel line-art for the hero */
function heroWheel() {
  let spokes = '';
  for (let i = 0; i < 10; i++) spokes += `<g transform="rotate(${i * 36} 300 300)"><path d="M290 228 L284 74 Q300 66 316 74 L310 228" /></g>`;
  let holes = '';
  for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2; holes += `<circle cx="${(300 + Math.cos(a) * 248).toFixed(1)}" cy="${(300 + Math.sin(a) * 248).toFixed(1)}" r="5"/>`; }
  return `<svg viewBox="0 0 600 600" class="hero-wheel" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><circle cx="300" cy="300" r="290"/><circle cx="300" cy="300" r="262"/><circle cx="300" cy="300" r="232"/>${spokes}<circle cx="300" cy="300" r="60"/><circle cx="300" cy="300" r="26"/></g><g fill="currentColor" opacity=".7">${holes}</g></svg>`;
}
