// src/lib/templates/shared-css.ts
// ═══════════════════════════════════════════════════════════════
// Unified letterhead design system — matches official_letterhead.html exactly.
// All 5 document types share this CSS, header, footer, watermark and print rules.
// ═══════════════════════════════════════════════════════════════

/** Google Fonts <link> tag — must be in every document <head> */
export const GOOGLE_FONTS_LINK = `<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Poppins:wght@400;700&family=Oswald:wght@700&display=swap" rel="stylesheet"/>`;

/** Complete shared CSS — A4 page, header, body, footer, watermark, typography, print */
export const SHARED_DOC_CSS = `
/* ═══════════════════════════════════════════
   RESET & BASE
═══════════════════════════════════════════ */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  background: #ffffff;
  font-family: 'Open Sans', sans-serif;
  color: #000000;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

/* ═══════════════════════════════════════════
   A4 LETTERHEAD PAGE
═══════════════════════════════════════════ */
.page {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  display: grid;
  grid-template-rows: auto 1fr auto;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  margin: 0 auto;
}

/* ── WATERMARK ── */
.watermark {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%) rotate(-42deg);
  font-size: 82px; color: rgba(0, 0, 0, 0.03); font-weight: 900;
  letter-spacing: 18px; text-transform: uppercase;
  pointer-events: none; z-index: 0; white-space: nowrap;
  font-family: 'Oswald', sans-serif;
  user-select: none;
}

/* ── HEADER ── */
.pg-header {
  position: relative; z-index: 1; flex-shrink: 0;
  width: 100%; padding-top: 13px;
  display: flex; flex-direction: column; align-items: center;
}
.pg-logo { display: block; height: 78px; width: auto; object-fit: contain; }
.pg-rule-thick { display: block; width: 100%; height: 3px; background: #000000; border: none; margin-top: 11px; }

/* ── BODY (Typing/Content Area) ── */
.pg-body {
  position: relative; z-index: 1;
  padding: 12mm 23mm 6mm 23mm;
  min-height: 0;
  font-family: 'Cambria', 'Times New Roman', serif;
  font-size: 11.5pt; color: #000000;
  line-height: 1.6;
  outline: none;
}

/* ── FOOTER ── */
.pg-foot-wrap { position: relative; z-index: 1; flex-shrink: 0; }
.pg-rule-thin { display: block; width: 100%; height: 1px; background: #000000; border: none; margin-top: 0; margin-bottom: 8px; }
.pg-footer {
  background: transparent; width: 100%;
  padding: 0 0 3.5mm;
  display: flex; flex-direction: column; align-items: center;
  text-align: center; gap: 1px;
}
.pg-pin { display: block; width: 30px; height: 30px; margin-bottom: -5px; object-fit: contain; }
.pg-foot-label {
  font-size: 11.5px; font-weight: 700; color: #000000;
  font-family: 'Poppins', sans-serif; letter-spacing: .5px;
}
.pg-foot-addr {
  font-size: 11.5px; font-weight: 400; color: #000000;
  font-family: 'Poppins', sans-serif; line-height: 1.5;
}

/* ── DEFAULT TYPOGRAPHY CLASSES ── */
.meta-right { text-align: right; font-weight: bold; font-style: italic; margin-bottom: 12px; }
.ref-block { margin-bottom: 20px; }
.ref-line { font-size: 10.5pt; font-style: italic; color: #333333; margin-bottom: 2px; }
.date-line { font-weight: bold; }
.addr-block { margin-bottom: 20px; line-height: 1.5; }
.addr-block strong { font-weight: 700; }
.subject-line { font-weight: bold; margin-bottom: 20px; text-decoration: none; }
.salutation { font-weight: bold; margin-bottom: 15px; }
.body-paragraph { margin-bottom: 15px; text-align: justify; }
.closing { margin: 25px 0; }
.sign-area { margin-top: 30px; }
.sign-line { border-top: 1.5px solid #000000; width: 220px; padding-top: 6px; margin-top: 50px; }
.sign-name { font-weight: bold; }

/* ── DOCUMENT-SPECIFIC SHARED CLASSES ── */
.doc-title {
  font-family: 'Oswald', sans-serif;
  font-size: 18px; font-weight: 600;
  margin-bottom: 20px; text-align: center;
  color: #000000;
}
.section-heading {
  font-family: 'Poppins', sans-serif;
  font-size: 13px; font-weight: 700;
  margin-top: 15px; margin-bottom: 8px;
  color: #000000;
}

/* ── CERTIFICATE / LETTER SHARED STYLES ── */
.cert-title {
  text-align: center;
  font-size: 14px; font-weight: 700;
  margin-bottom: 20px; letter-spacing: 0.05em;
}
.ref-date {
  display: flex; justify-content: space-between;
  margin-bottom: 20px; font-size: 11px;
}
.cert-body {
  font-size: 11px; line-height: 1.85;
  text-align: justify; margin-bottom: 18px;
}
.cert-body .emp-name { font-weight: 700; }
.detail-row {
  display: flex; margin-bottom: 8px;
  font-size: 11px; line-height: 1.7;
}
.detail-row .label { width: 130px; font-weight: 700; flex-shrink: 0; }
.detail-row .value { flex: 1; }
.declaration {
  font-size: 11px; line-height: 1.75;
  text-align: justify; margin-top: 18px; margin-bottom: 20px;
}
.sig-section { margin-top: 30px; }
.sig-block .sig-name {
  font-size: 11px; font-weight: 700;
  border-top: 1.5px solid #333; padding-top: 6px;
  display: inline-block;
}
.sig-block .sig-title { font-size: 10px; color: #000; line-height: 1.6; }
.sig-block .sig-heading {
  font-size: 11px; font-weight: 700;
  color: #000; margin-bottom: 70px;
}
.sig-block .sig-date { font-size: 10px; color: #000; margin-top: 8px; }

/* ── APPOINTMENT LETTER EXTRAS ── */
.body-text { font-size: 11px; line-height: 1.75; text-align: justify; margin-bottom: 14px; }
.expect-list { font-size: 11px; line-height: 1.75; margin-bottom: 14px; padding-left: 20px; }
.expect-list li { margin-bottom: 6px; list-style-type: disc; }
.salary-text { font-size: 11px; line-height: 1.75; text-align: justify; margin-bottom: 14px; }

/* ── SALARY TABLE (appointment + salary cert) ── */
.salary-table { width: 100%; border-collapse: collapse; font-size: 10.5px; margin-bottom: 14px; }
.salary-table thead tr { background: transparent; }
.salary-table thead th { padding: 6px 10px; text-align: left; font-weight: 700; border: 1px solid #999; border-bottom: 2px solid #333; color: #111; }
.salary-table thead th.right { text-align: right; }
.salary-table tbody td { padding: 5px 10px; border: 1px solid #ddd; vertical-align: middle; }
.salary-table tbody tr:nth-child(even) { background: #f5f5f5; }
.salary-table td.right { text-align: right; font-variant-numeric: tabular-nums; }
.salary-table td.bold { font-weight: 700; }
.salary-table .total-row { background: #e8e8e8; }
.salary-table .total-row td { font-weight: 700; border-top: 2px solid #333; }
.salary-table .net-row { background: transparent; }
.salary-table .net-row td { font-weight: 700; border: 2px solid #333; color: #111; }

/* ── SALARY CERT ANNUAL ── */
.annual-heading { font-size: 11px; font-weight: 700; margin-top: 16px; margin-bottom: 10px; }
.annual-row { display: flex; margin-bottom: 5px; font-size: 11px; line-height: 1.7; }
.annual-row .label { width: 260px; flex-shrink: 0; }
.annual-row .colon { width: 20px; flex-shrink: 0; }
.annual-row .value { flex: 1; text-align: right; font-variant-numeric: tabular-nums; }
.annual-row.total-annual .label, .annual-row.total-annual .value { font-weight: 700; }
.annual-divider { border: none; border-top: 1px solid #999; margin: 8px 0; }

/* ═══════════════════════════════════════════
   PRINT-ONLY RULESET
═══════════════════════════════════════════ */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
  body { background: #ffffff !important; }
  .no-print { display: none !important; }
  .page { box-shadow: none !important; margin: 0 !important; }
  .page { page-break-after: always; break-after: page; }
  .page:last-child { page-break-after: avoid; break-after: avoid; }
  @page { size: A4; margin: 0; }
}
`;

// Keep backward compat alias
export const sharedStyles = SHARED_DOC_CSS;

// ── Default asset URLs (hosted, work standalone) ──
const DEFAULT_LOGO = 'https://i.postimg.cc/WzcZTHwj/Logo-nobg.png';
const DEFAULT_PIN  = 'https://i.postimg.cc/3NjvRFtr/Location-Pin.png';
const DEFAULT_ADDR = 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D,<br/>Niketon, Gulshan-1, Dhaka-1212, Bangladesh.';

/** Letterhead header — logo + thick rule */
export function HEADER_HTML(logoPath?: string): string {
  const logo = logoPath || DEFAULT_LOGO;
  return `
<div class="pg-header">
  <img class="pg-logo" src="${logo}" alt="The Beyond Headlines"/>
  <hr class="pg-rule-thick"/>
</div>`;
}

/** Letterhead footer — thin rule + pin icon + OFFICE ADDRESS label + address */
export function FOOTER_HTML(
  page: number = 1,
  totalPages: number = 1,
  companyName?: string,
  companyAddress?: string
): string {
  const addr = companyAddress || DEFAULT_ADDR;
  return `
<div class="pg-foot-wrap">
  <hr class="pg-rule-thin"/>
  <div class="pg-footer">
    <img class="pg-pin" src="${DEFAULT_PIN}" alt="Location-Pin"/>
    <span class="pg-foot-label">OFFICE ADDRESS:</span>
    <span class="pg-foot-addr">${addr}</span>
  </div>
</div>`;
}

/** Watermark overlay — diagonal semi-transparent text */
export function WATERMARK_HTML(text: string = 'CONFIDENTIAL', enabled: boolean = true): string {
  if (!enabled) return '';
  return `<div class="watermark" id="watermark">${text}</div>`;
}

/** Inline script for watermark toggle (used in standalone HTML preview) */
export const WATERMARK_TOGGLE_SCRIPT = `
<script>
function toggleWatermark() {
  var wm = document.getElementById('watermark');
  if (!wm) return;
  if (wm.style.display === 'none') {
    wm.style.display = 'block';
  } else {
    wm.style.display = 'none';
  }
}
</script>`;
