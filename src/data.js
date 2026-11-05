/* ==========================================================
   TurboBolton prototype — sample data (DEMO DATA ONLY)
   ========================================================== */

/* Hero photo: Sunder Muthukumaran on Unsplash (Unsplash License). Plate blurred. Inlined at build time. */
import heroImg from './assets/hero-m4.jpg';
export const HERO_IMG = heroImg;

/* ---------- Vehicles (Year → Make → Model → Engine) ---------- */
export const YEARS = Array.from({ length: 17 }, (_, i) => 2026 - i);
export const VEHICLES = [
  { make: 'BMW', model: 'M3', from: 2021, to: 2025, engines: ['3.0L S58 Twin-Turbo I6 (473 hp)', '3.0L S58 Twin-Turbo I6 Competition (503 hp)'] },
  { make: 'BMW', model: 'M3', from: 2015, to: 2018, engines: ['3.0L S55 Twin-Turbo I6 (425 hp)'] },
  { make: 'BMW', model: 'M4', from: 2021, to: 2025, engines: ['3.0L S58 Twin-Turbo I6 (473 hp)', '3.0L S58 Twin-Turbo I6 Competition (503 hp)'] },
  { make: 'BMW', model: 'M340i', from: 2020, to: 2025, engines: ['3.0L B58 Turbo I6 (382 hp)'] },
  { make: 'Ford', model: 'Mustang GT', from: 2018, to: 2025, engines: ['5.0L Coyote V8 (450 hp)'] },
  { make: 'Ford', model: 'F-150', from: 2021, to: 2025, engines: ['3.5L EcoBoost V6 (400 hp)', '5.0L Coyote V8 (400 hp)'] },
  { make: 'Toyota', model: 'GR Supra', from: 2020, to: 2025, engines: ['3.0L B58 Turbo I6 (382 hp)', '2.0L B48 Turbo I4 (255 hp)'] },
  { make: 'Toyota', model: 'GR86', from: 2022, to: 2025, engines: ['2.4L FA24 H4 (228 hp)'] },
  { make: 'Subaru', model: 'WRX', from: 2022, to: 2025, engines: ['2.4L FA24 Turbo H4 (271 hp)'] },
  { make: 'Chevrolet', model: 'Camaro SS', from: 2016, to: 2024, engines: ['6.2L LT1 V8 (455 hp)'] },
  { make: 'Honda', model: 'Civic Type R', from: 2017, to: 2025, engines: ['2.0L K20C1 Turbo I4 (315 hp)'] },
  { make: 'Volkswagen', model: 'Golf R', from: 2022, to: 2025, engines: ['2.0L EA888 Turbo I4 (315 hp)'] },
  { make: 'Audi', model: 'RS 3', from: 2022, to: 2025, engines: ['2.5L TFSI Turbo I5 (401 hp)'] },
];
export const DEMO_VEHICLE = { year: 2022, make: 'BMW', model: 'M3', engine: '3.0L S58 Twin-Turbo I6 (473 hp)' };

export function makesFor(y) { return [...new Set(VEHICLES.filter(v => y >= v.from && y <= v.to).map(v => v.make))].sort(); }
export function modelsFor(y, mk) { return [...new Set(VEHICLES.filter(v => v.make === mk && y >= v.from && y <= v.to).map(v => v.model))]; }
export function enginesFor(y, mk, md) { const r = VEHICLES.find(v => v.make === mk && v.model === md && y >= v.from && y <= v.to); return r ? r.engines : []; }

/* ---------- Catalog ---------- */
export const CATEGORIES = [
  { id: 'Engine', icon: 'engine', blurb: 'Intakes, plugs, cooling' },
  { id: 'Exhaust', icon: 'exhaust', blurb: 'Cat-backs, slip-ons, downpipes' },
  { id: 'Suspension', icon: 'spring', blurb: 'Coilovers, springs, sway bars' },
  { id: 'Brakes', icon: 'disc', blurb: 'Big brake kits, pads, fluid' },
  { id: 'Wheels & Tires', icon: 'wheel', blurb: 'Forged wheels, UHP tires' },
  { id: 'Exterior', icon: 'car', blurb: 'Carbon aero, lighting' },
  { id: 'Interior', icon: 'seat', blurb: 'Seats, wheels, shift knobs' },
  { id: 'Electronics', icon: 'chip', blurb: 'Tunes, gauges, data' },
  { id: 'Performance', icon: 'bolt', blurb: 'Intercoolers, turbo upgrades' },
];

export const G8X = [{ make: 'BMW', model: 'M3', from: 2021, to: 2025 }, { make: 'BMW', model: 'M4', from: 2021, to: 2025 }];

export const PRODUCTS = [
  {
    id: 'brembo-gt6', sku: 'BRM-1N1.9005A', brand: 'Brembo', cat: 'Brakes', type: 'Big Brake Kit',
    name: 'GT Series 6-Piston Front Big Brake Kit, 380mm Two-Piece Rotors',
    price: 4295, sale: 3895, rating: 4.9, reviews: 128, onHand: 7, threshold: 3, art: 'rotor', sold: 412, added: '2026-06-02', fit: G8X,
    blurb: 'Track-proven stopping power with forged monobloc calipers and floating two-piece rotors.',
    desc: 'The Brembo GT Series kit replaces the factory front brakes on the G80 M3 with forged 6-piston monobloc calipers and 380 × 34 mm two-piece floating rotors. Expect a firmer, more consistent pedal, far less fade on track days and a noticeable drop in unsprung weight.',
    features: ['Forged 6-piston monobloc calipers, red finish', '380 × 34 mm slotted two-piece floating rotors', 'Brembo high-performance street pads included', 'Stainless braided lines and all mounting hardware', 'Clears OEM 19" front wheels'],
    specs: [['Position', 'Front'], ['Caliper', '6-piston forged monobloc'], ['Rotor size', '380 × 34 mm, two-piece'], ['Rotor type', 'Slotted, floating'], ['Minimum wheel', '19 in'], ['Weight savings', '7.4 lb per corner vs. OEM']],
    install: ['Professional installation recommended', 'Approx. 3–4 hours', 'Brake fluid flush required (DOT 4 racing fluid recommended)'],
    warranty: 'Brembo limited warranty: 2 years against defects in materials and workmanship.',
  },
  {
    id: 'akrapovic-slipon', sku: 'AKR-S-BM/T/9H', brand: 'Akrapovič', cat: 'Exhaust', type: 'Exhaust System',
    name: 'Slip-On Line Titanium Exhaust with Carbon Tips',
    price: 4950, sale: null, rating: 4.8, reviews: 64, onHand: 3, threshold: 3, art: 'exhaust', sold: 188, added: '2026-03-11', fit: G8X,
    blurb: 'Hand-welded titanium with the deep S58 soundtrack, 16 lb lighter than stock.',
    desc: 'A complete titanium slip-on built specifically for the S58 engine. Electronically controlled valves keep the car civil in Comfort and open up in Sport+. Finished with hand-laid carbon fiber tips.',
    features: ['Titanium construction, 16.3 lb lighter than OEM', 'Retains factory valve control', 'Carbon fiber tail pipe set', 'TÜV-tested sound levels'],
    specs: [['Material', 'Titanium'], ['Tips', 'Carbon fiber, 4 ×'], ['Weight savings', '16.3 lb'], ['Power gain', '+5.6 hp at 6,250 rpm'], ['Valves', 'OEM-controlled']],
    install: ['Bolt-on, no cutting', 'Approx. 1.5 hours', 'Lift or ramps recommended'],
    warranty: 'Akrapovič 2-year limited warranty.',
  },
  {
    id: 'kw-v3', sku: 'KW-3522000Y', brand: 'KW', cat: 'Suspension', type: 'Coilovers',
    name: 'V3 Coilover Kit with EDC Cancellation',
    price: 3199, sale: null, rating: 4.7, reviews: 89, onHand: 12, threshold: 4, art: 'coilover', sold: 261, added: '2025-11-20', fit: G8X,
    blurb: 'Independent rebound and compression adjustment with a 0.8–1.6" lowering range.',
    desc: 'KW V3 coilovers give the G80 a sharper turn-in and flatter cornering while staying livable on the street. Rebound (16 clicks) and compression (12 clicks) adjust independently.',
    features: ['Stainless steel inox-line housings', 'Independent rebound and compression damping', 'Lowering: 0.8–1.6 in front, 0.6–1.4 in rear', 'Includes EDC cancellation module'],
    specs: [['Adjustment', 'Rebound 16 clicks, compression 12 clicks'], ['Lowering (front)', '0.8–1.6 in'], ['Lowering (rear)', '0.6–1.4 in'], ['Housing', 'Stainless steel']],
    install: ['Professional installation recommended', 'Approx. 4–5 hours', 'Alignment required after installation'],
    warranty: 'KW limited lifetime warranty on housings, 2 years on dampers.',
  },
  {
    id: 'eventuri-intake', sku: 'EVE-BMW-G8X-INT', brand: 'Eventuri', cat: 'Engine', type: 'Air Intake',
    name: 'Carbon Fiber Intake System, Twin Venturi Housings',
    price: 2450, sale: 2350, rating: 4.9, reviews: 41, onHand: 4, threshold: 3, art: 'intake', sold: 97, added: '2026-08-14', fit: G8X,
    blurb: 'Patented venturi housings for smoother airflow and a sharper induction note.',
    desc: 'Pre-preg carbon housings replace the factory airbox and route cold air through Eventuri\'s patented venturi design for better throttle response and more audible turbo spool.',
    features: ['Pre-preg carbon fiber construction', 'Patented venturi filter housings', 'High-flow cotton filters', 'Direct OEM replacement'],
    specs: [['Material', 'Pre-preg carbon fiber'], ['Filter', 'High-flow cotton, washable'], ['Power gain', '+12 hp (dyno, tuned)'], ['Finish', 'Gloss']],
    install: ['DIY friendly', 'Approx. 1 hour', 'Basic hand tools'],
    warranty: 'Eventuri 2-year limited warranty.',
  },
  {
    id: 'wagner-ic', sku: 'WGT-200001148', brand: 'Wagner Tuning', cat: 'Performance', type: 'Intercooler',
    name: 'Competition Intercooler Kit, Air-to-Water Core',
    price: 1299, sale: null, rating: 4.6, reviews: 37, onHand: 9, threshold: 3, art: 'intercooler', sold: 74, added: '2026-01-09', fit: G8X,
    blurb: 'Larger core keeps intake temps down across repeated pulls and track sessions.',
    desc: 'A higher-capacity intercooler core that holds intake air temperatures lower during repeated hard acceleration and track use.',
    features: ['42% larger core volume', 'Cast end tanks', 'Direct fit'],
    specs: [['Core type', 'Bar and plate'], ['Core volume', '+42% vs. OEM'], ['Finish', 'Black powder coat']],
    install: ['Professional installation recommended', 'Approx. 3 hours'],
    warranty: 'Wagner Tuning 2-year limited warranty.',
  },
  {
    id: 'hre-ff04', sku: 'HRE-FF04-1995-SBZ', brand: 'HRE', cat: 'Wheels & Tires', type: 'Wheels',
    name: 'FF04 Flow-Formed Wheel 19×9.5 ET25, Satin Bronze (each)',
    price: 595, sale: null, rating: 4.8, reviews: 52, onHand: 24, threshold: 8, art: 'wheel', sold: 340, added: '2026-05-01', fit: G8X,
    blurb: 'Flow-formed strength in a classic 5-spoke, sized for the G80 front axle.',
    desc: 'HRE\'s FF04 is a 5-spoke flow-formed wheel that saves weight over the factory forged wheel while keeping OEM-level strength. Sold individually.',
    features: ['Flow-formed construction', 'Hub-centric 72.6 mm bore', 'TPMS compatible', 'Sold individually'],
    specs: [['Size', '19 × 9.5 in'], ['Offset', 'ET25'], ['Bolt pattern', '5×112'], ['Weight', '21.4 lb'], ['Finish', 'Satin bronze']],
    install: ['Mount and balance required', 'Torque lugs to 103 lb-ft'],
    warranty: 'HRE limited lifetime structural warranty.',
  },
  {
    id: 'michelin-ps4s', sku: 'MIC-PS4S-2753519', brand: 'Michelin', cat: 'Wheels & Tires', type: 'Tires',
    name: 'Pilot Sport 4S 275/35ZR19 100Y XL',
    price: 389, sale: 359, rating: 4.9, reviews: 412, onHand: 48, threshold: 12, art: 'tire', sold: 1288, added: '2025-09-30', fit: G8X,
    blurb: 'The benchmark max-performance summer tire, in the M3 front fitment size.',
    desc: 'Michelin\'s Pilot Sport 4S combines dry grip, wet confidence and long tread life. This size matches the factory front tire on the G80 M3.',
    features: ['Max-performance summer tire', 'Dual-compound tread', 'Ships free'],
    specs: [['Size', '275/35ZR19'], ['Load / speed', '100Y XL'], ['Season', 'Summer'], ['Treadwear', '300 AA A']],
    install: ['Mount and balance required'],
    warranty: 'Michelin 30,000-mile limited treadwear warranty.',
  },
  {
    id: 'bm3-stage1', sku: 'BM3-S58-LIC', brand: 'bootmod3', cat: 'Electronics', type: 'ECU Tune',
    name: 'Stage 1 Flash Tune License for S58 Engine',
    price: 595, sale: null, rating: 4.8, reviews: 203, onHand: 999, threshold: 0, art: 'ecu', sold: 905, added: '2026-07-21', fit: G8X, digital: true,
    blurb: 'OBD flash tune: around +60 hp on 93 octane, reversible at any time.',
    desc: 'A digital license tied to your vehicle VIN. Flash through the OBD port using the bootmod3 app or cable. Return to stock whenever you need to.',
    features: ['Delivered by email, no shipping', 'Flash in about 10 minutes', 'Return to stock at any time'],
    specs: [['Delivery', 'Digital license by email'], ['Fuel', '93 octane'], ['Est. gain', '+60 hp, +70 lb-ft']],
    install: ['DIY via OBD port', 'Approx. 15 minutes'],
    warranty: 'License support for the life of the vehicle.',
  },
  {
    id: 'ngk-plugs', sku: 'NGK-97506-6', brand: 'NGK', cat: 'Engine', type: 'Ignition',
    name: 'Ruthenium HX Spark Plugs, Set of 6',
    price: 89.94, sale: null, rating: 4.7, reviews: 156, onHand: 3, threshold: 10, art: 'plugs', sold: 1004, added: '2025-12-02', fit: G8X,
    blurb: 'Pre-gapped for tuned S58 engines. Cleaner ignition and longer service life.',
    desc: 'Ruthenium-tipped plugs pre-gapped for tuned S58 engines. A common maintenance item when running Stage 1 or higher.',
    features: ['Ruthenium center electrode', 'Pre-gapped for tuned applications'],
    specs: [['Quantity', '6'], ['Heat range', 'One step colder']],
    install: ['DIY friendly', 'Approx. 45 minutes'],
    warranty: 'NGK limited warranty.',
  },
  {
    id: 'vorsteiner-lip', sku: 'VOR-BMG8-FL', brand: 'Vorsteiner', cat: 'Exterior', type: 'Aero',
    name: 'Carbon Fiber Front Lip Spoiler, Gloss',
    price: 1095, sale: null, rating: 4.5, reviews: 22, onHand: 0, threshold: 2, art: 'lip', sold: 58, added: '2026-09-18', fit: G8X,
    blurb: 'Pre-preg carbon front lip that follows the factory bumper lines.',
    desc: 'A 2×2 twill pre-preg carbon lip shaped to follow the G80 front bumper.',
    features: ['Pre-preg carbon fiber, gloss clear coat', 'Bolt-on with included hardware'],
    specs: [['Material', 'Pre-preg carbon'], ['Weave', '2×2 twill'], ['Finish', 'Gloss']],
    install: ['DIY friendly', 'Approx. 1 hour'],
    warranty: 'Vorsteiner 1-year limited warranty.',
  },
  {
    id: 'ferodo-pads', sku: 'FER-FCP5098R', brand: 'Ferodo', cat: 'Brakes', type: 'Brake Pads',
    name: 'DS2500 Front Brake Pads for Brembo GT 6-Piston',
    price: 289, sale: null, rating: 4.7, reviews: 71, onHand: 15, threshold: 5, art: 'pads', sold: 233, added: '2026-02-10', fit: G8X,
    blurb: 'Street and track-day compound for the Brembo GT 6-piston caliper.',
    desc: 'A street-legal compound that tolerates track-day heat without the noise of a full race pad.',
    features: ['Street/track compound', 'Low dust for a performance pad'],
    specs: [['Position', 'Front'], ['Compound', 'DS2500']],
    install: ['DIY friendly with experience', 'Approx. 1 hour'],
    warranty: 'Ferodo limited warranty.',
  },
  {
    id: 'motul-rbf660', sku: 'MOT-101666', brand: 'Motul', cat: 'Brakes', type: 'Brake Fluid',
    name: 'RBF 660 Racing Brake Fluid, 500 mL',
    price: 29.95, sale: null, rating: 4.8, reviews: 318, onHand: 64, threshold: 20, art: 'fluid', sold: 2210, added: '2025-08-12', fit: 'universal',
    blurb: 'High boiling point DOT 4 fluid. Two bottles cover a full flush.',
    desc: 'A DOT 4 racing fluid with a 617 °F dry boiling point. Two bottles cover a full flush on most cars.',
    features: ['617 °F dry boiling point', 'Compatible with DOT 3, 4 and 5.1 systems'],
    specs: [['Volume', '500 mL'], ['Standard', 'DOT 4'], ['Dry boiling point', '617 °F']],
    install: ['Full flush recommended'],
    warranty: 'Manufacturer warranty.',
  },
  {
    id: 'sparco-seat', sku: 'SPA-008007ZNR', brand: 'Sparco', cat: 'Interior', type: 'Seats',
    name: 'Evo QRT Fixed-Back Racing Seat, Black',
    price: 749, sale: null, rating: 4.6, reviews: 29, onHand: 6, threshold: 2, art: 'seat', sold: 44, added: '2026-04-04', fit: 'universal',
    blurb: 'FIA-homologated fiberglass shell. Needs a vehicle-specific mounting bracket.',
    desc: 'An FIA-homologated fiberglass seat. Mounting requires a vehicle-specific bracket and side mounts, sold separately.',
    features: ['FIA 8855-1999 homologated', 'Fiberglass shell', 'Requires vehicle-specific bracket'],
    specs: [['Shell', 'Fiberglass'], ['Homologation', 'FIA 8855-1999']],
    install: ['Professional installation recommended'],
    warranty: 'Sparco 1-year limited warranty.',
  },
  {
    id: 'borla-atak', sku: 'BOR-140743', brand: 'Borla', cat: 'Exhaust', type: 'Exhaust System',
    name: 'ATAK Cat-Back Exhaust, Stainless Steel',
    price: 1899, sale: null, rating: 4.7, reviews: 143, onHand: 5, threshold: 2, art: 'exhaust2', sold: 302, added: '2026-01-26', fit: [{ make: 'Ford', model: 'Mustang GT', from: 2018, to: 2023 }],
    blurb: 'Aggressive cat-back sound for the 2018–2023 Mustang GT.',
    desc: 'Borla\'s most aggressive sound level, built from T-304 stainless steel.',
    features: ['T-304 stainless steel', 'Million-mile warranty'],
    specs: [['Material', 'T-304 stainless'], ['Sound level', 'ATAK (loudest)']],
    install: ['Bolt-on', 'Approx. 2 hours'],
    warranty: 'Borla million-mile warranty.',
  },
];

export const BRANDS = ['Akrapovič', 'Brembo', 'KW', 'Eventuri', 'HRE', 'Michelin', 'bootmod3', 'NGK', 'Vorsteiner', 'Wagner Tuning', 'Ferodo', 'Motul', 'Sparco', 'Borla'];

export const REVIEWS = [
  { name: 'Chris T.', car: '2022 BMW M3 Competition', stars: 5, date: 'Sep 12, 2026', title: 'Exact fit, no surprises', text: 'Everything lined up with the factory mounting points. TurboBolton confirmed fitment before it shipped, which mattered at this price.' },
  { name: 'Alana R.', car: '2021 BMW M4', stars: 5, date: 'Aug 30, 2026', title: 'Worth it for track days', text: 'Ran three sessions at COTA with no fade. The pedal feels firm and consistent from the first stop to the last lap.' },
  { name: 'Dev P.', car: '2023 BMW M3 Touring', stars: 4, date: 'Jul 18, 2026', title: 'Great product, plan for install time', text: 'Quality is excellent. Installation took my shop longer than quoted, so budget an extra hour.' },
];
export const QUESTIONS = [
  { q: 'Will this fit the Competition xDrive model?', a: 'Yes. Fitment covers all 2021–2025 M3 and M4 variants with the S58 engine, including Competition and xDrive.', by: 'TurboBolton Support' },
  { q: 'Do I need to change anything else when installing?', a: 'Plan for any items listed under Installation. Our support team can review your build before you order.', by: 'TurboBolton Support' },
];

/* ---------- Demo customer ---------- */
export const CUSTOMER = {
  first: 'Daniel', last: 'Okafor', email: 'daniel.okafor@example.com', phone: '(512) 555-0187',
  addr1: '2185 Ridgeview Ave', addr2: 'Unit 4', city: 'Austin', state: 'TX', zip: '78704', country: 'United States',
};

export const SHIP_METHODS = [
  { id: 'standard', name: 'Standard Ground', eta: '5–7 business days', days: [5, 7], cost: 0, note: 'Free on orders over $149' },
  { id: 'expedited', name: 'Expedited', eta: '2–3 business days', days: [2, 3], cost: 24.95 },
  { id: 'overnight', name: 'Overnight', eta: 'Next business day', days: [1, 1], cost: 59.95 },
];
export const CARRIERS = ['UPS', 'FedEx', 'USPS', 'DHL'];

/* ---------- Admin sample orders ---------- */
export const ADMIN_ORDERS = [
  { num: 'TB-100481', date: 'Oct 1, 2026 · 9:42 AM', customer: 'Marisol Vega', email: 'm.vega@example.com', items: 2, total: 718.00, status: 'Processing', vehicle: '2020 Toyota GR Supra' },
  { num: 'TB-100480', date: 'Oct 1, 2026 · 8:15 AM', customer: 'Kevin Brandt', email: 'kbrandt@example.com', items: 1, total: 1899.00, status: 'New', vehicle: '2021 Ford Mustang GT' },
  { num: 'TB-100479', date: 'Sep 30, 2026 · 6:03 PM', customer: 'Aisha Rahman', email: 'aisha.r@example.com', items: 4, total: 1436.00, status: 'Shipped', vehicle: '2023 BMW M4' },
  { num: 'TB-100478', date: 'Sep 30, 2026 · 2:47 PM', customer: 'Tom Lindqvist', email: 'tom.l@example.com', items: 1, total: 595.00, status: 'Delivered', vehicle: '2022 BMW M3' },
  { num: 'TB-100477', date: 'Sep 30, 2026 · 11:20 AM', customer: 'Grace Kim', email: 'gkim@example.com', items: 3, total: 3482.45, status: 'Shipped', vehicle: '2022 Honda Civic Type R' },
  { num: 'TB-100476', date: 'Sep 29, 2026 · 4:55 PM', customer: 'Luis Ortega', email: 'lortega@example.com', items: 1, total: 289.00, status: 'Delivered', vehicle: '2021 BMW M3' },
  { num: 'TB-100475', date: 'Sep 29, 2026 · 10:08 AM', customer: 'Hannah Moore', email: 'hmoore@example.com', items: 2, total: 2610.00, status: 'Delivered', vehicle: '2022 Volkswagen Golf R' },
];

export const ADMIN_SECTIONS = {
  categories: { title: 'Categories', icon: 'grid', action: 'Add category', cols: ['Category', 'Products', 'Visible in menu', 'Status'],
    rows: CATEGORIES.map((c, i) => [c.id, [3, 2, 1, 4, 2, 1, 1, 1, 1][i], 'Yes', 'Active']) },
  brands: { title: 'Brands', icon: 'tag', action: 'Add brand', cols: ['Brand', 'Products', 'Featured on home', 'Status'],
    rows: BRANDS.map((b, i) => [b, 1 + (i % 3), i < 8 ? 'Yes' : 'No', 'Active']) },
  fitment: { title: 'Vehicle Fitment', icon: 'car', action: 'Add vehicle', cols: ['Years', 'Make', 'Model', 'Engines', 'Linked products'],
    rows: VEHICLES.map(v => [`${v.from}–${v.to}`, v.make, v.model, v.engines.length, v.make === 'BMW' && (v.model === 'M3' || v.model === 'M4') && v.from === 2021 ? 11 : v.model === 'Mustang GT' ? 1 : 0]) },
  customers: { title: 'Customers', icon: 'users', action: 'Export list', cols: ['Customer', 'Email', 'Orders', 'Total spent', 'Garage', 'Joined'],
    rows: [['Daniel Okafor', 'daniel.okafor@example.com', 3, '$4,912.34', '2 vehicles', 'Mar 2025'], ['Marisol Vega', 'm.vega@example.com', 5, '$3,204.10', '1 vehicle', 'Jan 2024'], ['Kevin Brandt', 'kbrandt@example.com', 1, '$1,899.00', '1 vehicle', 'Sep 2026'], ['Aisha Rahman', 'aisha.r@example.com', 7, '$9,880.75', '2 vehicles', 'Jun 2023'], ['Grace Kim', 'gkim@example.com', 2, '$3,771.45', '1 vehicle', 'Feb 2026']] },
  promotions: { title: 'Promotions', icon: 'tag', action: 'Create promotion', cols: ['Code', 'Discount', 'Applies to', 'Uses', 'Ends', 'Status'],
    rows: [['TURBO10', '10% off (max $250)', 'Entire order', 214, 'Dec 31, 2026', 'Active'], ['BRAKEWEEK', 'Sale prices', 'Brakes category', 96, 'Oct 7, 2026', 'Active'], ['FREESHIP', 'Free expedited shipping', 'Orders over $500', 41, 'Sep 15, 2026', 'Expired']] },
  returns: { title: 'Returns', icon: 'ret', action: 'Create return', cols: ['RMA', 'Order', 'Customer', 'Item', 'Reason', 'Status'],
    rows: [['RMA-2041', 'TB-100452', 'Owen Park', 'KW V3 Coilover Kit', 'Ordered wrong vehicle', 'Awaiting item'], ['RMA-2040', 'TB-100433', 'Grace Kim', 'NGK Spark Plugs ×6', 'Damaged in transit', 'Refunded'], ['RMA-2039', 'TB-100401', 'Luis Ortega', 'HRE FF04 Wheel', 'Changed mind', 'Approved']] },
  reports: { title: 'Reports', icon: 'chart', action: 'Download CSV', cols: ['Category', 'Orders (30 days)', 'Units', 'Revenue', 'Avg. order'],
    rows: [['Brakes', 88, 141, '$61,240.00', '$695.91'], ['Exhaust', 41, 43, '$52,980.00', '$1,292.20'], ['Wheels & Tires', 63, 214, '$38,115.00', '$605.00'], ['Suspension', 17, 17, '$22,410.00', '$1,318.24'], ['Engine', 52, 77, '$11,675.00', '$224.52']] },
  users: { title: 'Users', icon: 'users', action: 'Invite user', cols: ['Name', 'Role', 'Email', 'Last active'],
    rows: [['Jordan Ellis', 'Store Manager', 'jordan@turbobolton.example', 'Now'], ['Sam Whitaker', 'Fulfillment', 'sam@turbobolton.example', '12 min ago'], ['Priya Nair', 'Catalog Editor', 'priya@turbobolton.example', 'Yesterday'], ['Marco Diaz', 'Customer Support', 'marco@turbobolton.example', '2 days ago']] },
};
