// src/lib/templates/payslip.ts
import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML } from './shared-css'

export function paySlipHTML(data: Record<string, any>): string {
  const logoPath = data.logo_path || '/Logo-main.png';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pay Slip – ${data.name || 'Employee'}</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .body {
      flex: 1;
      padding: 12px 20px 12px 20px;
    }
    .payslip-title {
      text-align: center;
      font-size: 15px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #111;
      margin-bottom: 2px;
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    .payslip-subtitle {
      text-align: center;
      font-size: 12px;
      font-weight: 800;
      color: #111;
      margin-bottom: 8px;
    }
    .ref-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 10.5px;
      background: #f9f0f2;
      border: 1px solid #e8c8cf;
      border-radius: 4px;
      padding: 5px 12px;
    }
    .ref-row span {
      font-weight: 700;
      color: #c21807;
    }
    .emp-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      font-size: 10px;
    }
    .emp-table td {
      border: 1px solid #ccc;
      padding: 4px 8px;
      vertical-align: middle;
    }
    .emp-table .label {
      font-weight: 700;
      color: #555;
      white-space: nowrap;
      background: #f9f9f9;
    }
    .emp-table .value {
      font-weight: 600;
      color: #111;
    }
    .tables-row {
      display: flex;
      gap: 14px;
      margin-bottom: 8px;
    }
    .tables-row .table-col {
      flex: 1;
    }
    .inner-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    .inner-table thead tr {
      background: #c21807;
      color: #fff;
    }
    .inner-table thead th {
      padding: 4px 8px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #a01005;
      font-size: 10px;
    }
    .inner-table thead th.right {
      text-align: right;
    }
    .inner-table tbody td {
      padding: 4px 8px;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
    .inner-table tbody tr:nth-child(even) {
      background: #f9f0f2;
    }
    .inner-table td.right {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .inner-table td.label-cell {
      font-weight: 600;
      color: #444;
    }
    .summary-row td {
      border: 1px solid #ddd;
      padding: 5px 8px;
    }
    .summary-row td.label {
      font-weight: 700;
      text-align: right;
      padding-right: 8px;
    }
    .net-payment-box {
      background: #f9f0f2;
      border: 2px solid #c21807;
      border-radius: 6px;
      padding: 6px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .net-payment-box .net-label {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      color: #c21807;
      letter-spacing: 0.04em;
    }
    .net-payment-box .net-amount {
      font-size: 15px;
      font-weight: 800;
      color: #111;
    }
    .breakdown-table {
      margin-top: 15px;
      margin-bottom: 25px;
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    .breakdown-table thead tr {
      background: #c21807;
      color: #fff;
    }
    .breakdown-table thead th {
      padding: 4px 8px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #a01005;
    }
    .breakdown-table thead th.right {
      text-align: right;
    }
    .breakdown-table tbody td {
      padding: 4px 8px;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
    .breakdown-table td.right {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .breakdown-table td.label-cell {
      font-weight: 600;
      color: #444;
    }
    .breakdown-table .summary-row.total-row {
      background: #c21807;
      color: #fff;
    }
    .breakdown-table .summary-row.total-row td {
      font-weight: 800;
      border-color: #a01005;
    }
    .sig-section {
      margin-top: 15px;
      border-top: 2px solid #c21807;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }
    .sig-box {
      flex: 1;
      text-align: center;
    }
    .sig-box .sig-label {
      font-size: 10px;
      font-weight: 700;
      color: #555;
      margin-bottom: 4px;
    }
    .sig-line {
      border-top: 1.5px solid #333;
      margin-top: 50px;
      padding-top: 4px;
      font-size: 9px;
      color: #666;
    }
  </style>
</head>
<body>
<div class="page">
  ${HEADER_HTML(logoPath)}
  <div class="body">
    <div class="payslip-title">Pay Slip</div>
    <div class="payslip-subtitle">For the Period of ${data.period || ''}</div>

    <div class="ref-row">
      <div><span>Ref:</span> ${data.ref_code || ''}</div>
      <div><span>Page:</span> 1 of 1</div>
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
      <!-- Earnings -->
      <div class="table-col">
        <table class="inner-table">
          <thead>
            <tr>
              <th>Earnings</th>
              <th class="right">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="label-cell">Basic</td>
              <td class="right">${data.basic_fmt || '0.00'}</td>
            </tr>
            <tr>
              <td class="label-cell">House Rent Allowance</td>
              <td class="right">${data.house_rent_fmt || '0.00'}</td>
            </tr>
            <tr>
              <td class="label-cell">Conveyance Allowance</td>
              <td class="right">${data.conveyance_fmt || '0.00'}</td>
            </tr>
            <tr>
              <td class="label-cell">Medical Allowance</td>
              <td class="right">${data.medical_fmt || '0.00'}</td>
            </tr>
            <tr>
              <td class="label-cell">Mobile &amp; Other Allowance</td>
              <td class="right">${data.food_mobile_fmt || '0.00'}</td>
            </tr>
            <tr class="summary-row">
              <td class="label">Total Earned</td>
              <td class="right" style="font-weight:700;">${data.total_earnings_fmt || '0.00'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Deductions -->
      <div class="table-col">
        <table class="inner-table">
          <thead>
            <tr>
              <th>Deductions</th>
              <th class="right">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="label-cell">Absent Amount</td>
              <td class="right">-</td>
            </tr>
            <tr>
              <td class="label-cell">Mobile Deduction</td>
              <td class="right">-</td>
            </tr>
            <tr>
              <td class="label-cell">Advance</td>
              <td class="right">-</td>
            </tr>
            <tr>
              <td class="label-cell">PF Fund</td>
              <td class="right">-</td>
            </tr>
            <tr>
              <td class="label-cell">Source Tax</td>
              <td class="right">${data.tax_fmt || '0.00'}</td>
            </tr>
            <tr class="summary-row">
              <td class="label">Total Deduction</td>
              <td class="right" style="font-weight:700;">${data.total_deductions_fmt || '0.00'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="net-payment-box">
      <div class="net-label">Net Payment</div>
      <div class="net-amount">BDT ${data.net_fmt || '0.00'}</div>
    </div>

    <table class="breakdown-table">
      <thead>
        <tr>
          <th style="width:50%">Breakdown</th>
          <th class="right" style="width:50%">Amount (BDT)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="label-cell">Bank</td>
          <td class="right">${data.bank_total_fmt || '0.00'}</td>
        </tr>
        <tr>
          <td class="label-cell">Cash</td>
          <td class="right">${data.cash_fmt || '-'}</td>
        </tr>
        <tr class="summary-row total-row">
          <td class="label">Total</td>
          <td class="right">${data.net_fmt || '0.00'}</td>
        </tr>
      </tbody>
    </table>

    <div class="sig-section">
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
</body>
</html>`
}
