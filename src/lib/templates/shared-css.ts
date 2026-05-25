// src/lib/templates/shared-css.ts

export const sharedStyles = `
  *, *::before, *::after { 
    margin: 0; 
    padding: 0; 
    box-sizing: border-box; 
  }

  body {
    background: #ffffff;
    font-family: 'Open Sans', sans-serif;
    color: #000000;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* ── A4 CANVAS STRUCTURE ── */
  .page {
    width: 210mm;
    min-height: 297mm;
    background: #ffffff;
    display: grid;
    grid-template-rows: auto 1fr auto;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
  }

  /* ── HEADER LAYOUT ── */
  .pg-header {
    position: relative; 
    z-index: 1; 
    width: 100%; 
    padding-top: 13px;
    display: flex; 
    flex-direction: column; 
    align-items: center;
  }
  .pg-logo { 
    display: block; 
    height: 78px; 
    width: auto; 
    object-fit: contain; 
  }
  .pg-rule-thick { 
    display: block; 
    width: 100%; 
    height: 3px; 
    background: #000000; 
    border: none; 
    margin-top: 11px; 
  }

  /* ── MAIN BODY SLOT ── */
  .pg-body {
    position: relative; 
    z-index: 1;
    padding: 12mm 23mm 6mm 23mm;
    font-family: 'Cambria', 'Times New Roman', serif;
    font-size: 11.5px; 
    color: #000000;
    line-height: 1.5;
  }

  /* Clean Document Headers */
  .doc-title {
    font-family: 'Oswald', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    color: #000000;
  }

  .section-heading {
    font-family: 'Poppins', sans-serif;
    font-size: 13px;
    font-weight: 700;
    margin-top: 15px;
    margin-bottom: 8px;
    color: #000000;
    text-transform: none; 
    text-decoration: none; 
  }

  /* ── FOOTER WRAPPER ── */
  .pg-foot-wrap { 
    position: relative; 
    z-index: 1; 
  }
  .pg-rule-thin { 
    display: block;
    width: 100%;
    height: 1px; 
    background: #000000;
    border: none;
    margin-top: 0; 
    margin-bottom: 8px; 
  }
  .pg-footer {
    background: transparent; 
    width: 100%;
    padding: 0 0 3.5mm;
    display: flex; 
    flex-direction: column; 
    align-items: center;
    text-align: center; 
    gap: 1px;
  }
  .pg-pin { 
    display: block; 
    width: 30px; 
    height: 30px; 
    margin-bottom: -5px; 
    object-fit: contain; 
  }
  .pg-foot-label {
    font-size: 11px; 
    font-weight: 700; 
    color: #000000;
    font-family: 'Poppins', sans-serif; 
    letter-spacing: .5px;
  }
  .pg-foot-addr {
    font-size: 10.5px; 
    font-weight: 400; 
    color: #000000;
    font-family: 'Poppins', sans-serif; 
    line-height: 1.4;
  }

  @media print {
    @page { 
      size: A4; 
      margin: 0; 
    }
    .page { 
      page-break-after: always; 
      break-after: page; 
    }
    .page:last-child { 
      page-break-after: avoid; 
      break-after: avoid; 
    }
  }
`;
