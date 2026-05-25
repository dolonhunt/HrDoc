import { GOOGLE_FONTS_LINK, SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, WATERMARK_HTML, WATERMARK_TOGGLE_SCRIPT } from './shared-css'

export function paySlipHTML(data: Record<string, any>): string {
  const logo = data.logo_path || undefined;
  const wmText = data.watermark_text || 'CONFIDENTIAL';
  const wmEnabled = data.watermark_enabled !== false;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Pay Slip – ${data.name || 'Employee'}</title>
  ${GOOGLE_FONTS_LINK}
  <style>${SHARED_DOC_CSS}</style>
  <style>
    /* ── PAYSLIP-SPECIFIC STYLES ── */
    .ps-body {
      position: relative; z-index: 1;
      padding: 8px 32px 8px 32px;
      min-height: 0;
      font-family: 'Open Sans', sans-serif;
      font-size: 11px; color: #111;
      outline: none;
    }
    .payslip-title {
      text-align: center; font-size: 15px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.08em;
      color: #111; margin-bottom: 1px;
      text-decoration: underline; text-underline-offset: 4px;
    }
    .payslip-subtitle {
      text-align: center; font-size: 13px; font-weight: 800;
      color: #111; margin-bottom: 8px;
    }
    .ps-ref-row {
      display: flex; justify-content: space-between;
      margin-bottom: 5px; font-size: 10.5px;
      background: #f9f0f2; border: 1px solid #e8c8cf;
      border-radius: 4px; padding: 5px 12px;
    }
    .ps-ref-row span { font-weight: 700; color: #9B2242; }
    .emp-table {
      width: 100%; border-collapse: collapse;
      margin-bottom: 6px; font-size: 10px;
    }
    .emp-table td {
      border: 1px solid #ccc; padding: 3px 8px; vertical-align: middle;
    }
    .emp-table .label {
      font-weight: 700; color: #555; white-space: nowrap; background: #f9f9f9;
    }
    .emp-table .value { font-weight: 600; color: #111; }
    .tables-row { display: flex; gap: 14px; margin-bottom: 6px; }
    .tables-row .table-col { flex: 1; }
    .ps-table {
      width: 100%; border-collapse: collapse; font-size: 10px;
    }
    .ps-table thead tr { background: #9B2242; color: #fff; }
    .ps-table thead th {
      padding: 4px 8px; text-align: left; font-weight: 700;
      border: 1px solid #7a1a34; font-size: 10px;
    }
    .ps-table thead th.right { text-align: right; }
    .ps-table tbody td {
      padding: 3px 8px; border: 1px solid #ddd; vertical-align: middle;
    }
    .ps-table tbody tr:nth-child(even) { background: #f9f0f2; }
    .ps-table td.right { text-align: right; font-variant-numeric: tabular-nums; }
    .ps-table td.label-cell { font-weight: 600; color: #444; }
    .ps-table .summary-row td { border: 1px solid #ddd; padding: 5px 8px; }
    .ps-table .summary-row td.label { font-weight: 700; text-align: right; padding-right: 8px; }
    .ps-table .summary-row.total-row { background: #9B2242; color: #fff; }
    .ps-table .summary-row.total-row td { font-weight: 800; border-color: #7a1a34; }
    .net-payment-box {
      background: #f9f0f2; border: 2px solid #9B2242;
      border-radius: 6px; padding: 6px 18px;
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 6px;
    }
    .net-payment-box .net-label {
      font-size: 13px; font-weight: 800; text-transform: uppercase;
      color: #9B2242; letter-spacing: 0.04em;
    }
    .net-payment-box .net-amount { font-size: 16px; font-weight: 800; color: #111; }
    .breakdown-table { margin-top: 30px; margin-bottom: 30px; }
    .ps-sig-section {
      margin-top: 4px; border-top: 2px solid #9B2242;
      padding-top: 8px; display: flex;
      justify-content: space-between; gap: 40px;
    }
    .sig-box { flex: 1; text-align: center; }
    .sig-box .sig-label { font-size: 10px; font-weight: 700; color: #555; margin-bottom: 4px; }
    .sig-box .sig-line {
      border-top: 1.5px solid #333; margin-top: 70px;
      padding-top: 4px; font-size: 9px; color: #666;
    }
  </style>
</head>
<body>
<div class="page">
  ${WATERMARK_HTML(wmText, wmEnabled)}
  ${HEADER_HTML(logo)}
  <div class="ps-body" contenteditable="true" spellcheck="true">
    <div class="payslip-title">Pay Slip</div>
    <div class="payslip-subtitle">For the Period of ${data.period || ''}</div>

    <div class="ps-ref-row">
      <div><span>Ref:</span> ${data.ref_code || ''}</div>
      <div><span>Page:</span> 1</div>
    </div>

    <table class="emp-table">
      <tr>
        <td class="label" style="width:22%">Employee ID:</td>
        <td class="value" style="width:28%">${data.employee_id || ''}</td>
        <td class="label" style="width:22%">Name:</td>
        <td class="value" style="width:28%">${data.name || ''}</td>
      </tr>
      <tr>
        <td class="label">Department:</td>
        <td class="value">${data.department || ''}</td>
        <td class="label">Designation:</td>
        <td class="value">${data.designation || ''}</td>
      </tr>
      <tr>
        <td class="label">Date of Joining:</td>
        <td class="value">${data.joining_date_fmt || ''}</td>
        <td class="label">PF Account No:</td>
        <td class="value">${data.pf_account_no || 'N/A'}</td>
      </tr>
      <tr>
        <td class="label">Days Worked:</td>
        <td class="value">${data.days_worked || ''}</td>
        <td class="label">Casual leave:</td>
        <td class="value">${data.casual_leave || 'N/A'}</td>
      </tr>
      <tr>
        <td class="label">Bank Account:</td>
        <td class="value">${data.bank_account || ''}</td>
        <td class="label">Earned Leave:</td>
        <td class="value">${data.earned_leave || 'N/A'}</td>
      </tr>
    </table>

    <div class="tables-row">
      <div class="table-col">
        <table class="ps-table">
          <thead><tr><th>Earnings</th><th class="right">Amount (BDT)</th></tr></thead>
          <tbody>
            <tr><td class="label-cell">Basic</td><td class="right">${data.basic_fmt || '0.00'}</td></tr>
            <tr><td class="label-cell">House Rent Allowance</td><td class="right">${data.house_rent_fmt || '0.00'}</td></tr>
            <tr><td class="label-cell">Conveyance Allowance</td><td class="right">${data.conveyance_fmt || '0.00'}</td></tr>
            <tr><td class="label-cell">Medical Allowance</td><td class="right">${data.medical_fmt || '0.00'}</td></tr>
            <tr><td class="label-cell">Mobile &amp; Other Allowance</td><td class="right">${data.food_mobile_fmt || '0.00'}</td></tr>
            <tr class="summary-row"><td class="label">Total Earned</td><td class="right" style="font-weight:700;">${data.total_earnings_fmt || '0.00'}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="table-col">
        <table class="ps-table">
          <thead><tr><th>Deductions</th><th class="right">Amount (BDT)</th></tr></thead>
          <tbody>
            <tr><td class="label-cell">Absent Amount</td><td class="right">-</td></tr>
            <tr><td class="label-cell">Mobile Deduction</td><td class="right">-</td></tr>
            <tr><td class="label-cell">Advance</td><td class="right">-</td></tr>
            <tr><td class="label-cell">PF Fund</td><td class="right">-</td></tr>
            <tr><td class="label-cell">Source Tax</td><td class="right">${data.tax_fmt || '0.00'}</td></tr>
            <tr class="summary-row"><td class="label">Total Deduction</td><td class="right" style="font-weight:700;">${data.total_deductions_fmt || '0.00'}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="net-payment-box">
      <div class="net-label">Net Payment</div>
      <div class="net-amount">BDT ${data.net_fmt || '0.00'}</div>
    </div>

    <table class="ps-table breakdown-table">
      <thead><tr><th style="width:50%">Breakdown</th><th class="right" style="width:50%">Amount (BDT)</th></tr></thead>
      <tbody>
        <tr><td class="label-cell">Bank</td><td class="right">${data.bank_total_fmt || '0.00'}</td></tr>
        <tr><td class="label-cell">Cash</td><td class="right">${data.cash_fmt || '-'}</td></tr>
        <tr class="summary-row total-row"><td class="label">Total</td><td class="right">${data.net_fmt || '0.00'}</td></tr>
      </tbody>
    </table>

    <div class="ps-sig-section">
      <div class="sig-box">
        <div class="sig-label">Authorized By</div>
        <div class="sig-line">Signature &amp; Seal</div>
      </div>
      <div class="sig-box">
        <div class="sig-label">Signature of Employee</div>
        <div class="sig-line">Signature</div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML(1, 1, data.company_name, data.company_address)}
</div>
${WATERMARK_TOGGLE_SCRIPT}
</body>
</html>`
}
