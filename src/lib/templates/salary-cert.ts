import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML } from './shared-css'

export function salaryCertHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Salary Certificate – ${data.name || 'Employee'} – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .body {
      flex: 1;
      padding: 24px 20px 24px 20px;
    }
    .cert-title {
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 20px;
      letter-spacing: 0.05em;
    }
    .ref-date {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      font-size: 11px;
    }
    .cert-body {
      font-size: 11px;
      line-height: 1.85;
      text-align: justify;
      margin-bottom: 18px;
    }
    .cert-body .emp-name {
      font-weight: 700;
    }
    .detail-row {
      display: flex;
      margin-bottom: 8px;
      font-size: 11px;
      line-height: 1.7;
    }
    .detail-row .label {
      width: 130px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .detail-row .value {
      flex: 1;
    }
    .salary-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
      margin: 16px 0;
    }
    .salary-table thead tr {
      background: transparent;
    }
    .salary-table thead th {
      padding: 6px 10px;
      text-align: left;
      font-weight: 700;
      border: 1px solid #999;
      border-bottom: 2px solid #333;
      color: #111;
    }
    .salary-table thead th.right {
      text-align: right;
    }
    .salary-table tbody td {
      padding: 5px 10px;
      border: 1px solid #ddd;
      vertical-align: middle;
    }
    .salary-table tbody tr:nth-child(even) {
      background: #f5f5f5;
    }
    .salary-table td.right {
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .salary-table td.bold {
      font-weight: 700;
    }
    .salary-table .total-row {
      background: #e8e8e8;
    }
    .salary-table .total-row td {
      font-weight: 700;
      border-top: 2px solid #333;
    }
    .salary-table .net-row {
      background: transparent;
    }
    .salary-table .net-row td {
      font-weight: 700;
      border: 2px solid #333;
      color: #111;
    }
    .annual-heading {
      font-size: 11px;
      font-weight: 700;
      margin-top: 16px;
      margin-bottom: 10px;
    }
    .annual-row {
      display: flex;
      margin-bottom: 5px;
      font-size: 11px;
      line-height: 1.7;
    }
    .annual-row .label {
      width: 260px;
      flex-shrink: 0;
    }
    .annual-row .colon {
      width: 20px;
      flex-shrink: 0;
    }
    .annual-row .value {
      flex: 1;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .annual-row.total-annual .label,
    .annual-row.total-annual .value {
      font-weight: 700;
    }
    .annual-divider {
      border: none;
      border-top: 1px solid #999;
      margin: 8px 0;
    }
    .declaration {
      font-size: 11px;
      line-height: 1.75;
      text-align: justify;
      margin-top: 18px;
      margin-bottom: 20px;
    }
    .sig-section {
      margin-top: 30px;
    }
    .sig-block .sig-name {
      font-size: 11px;
      font-weight: 700;
      border-top: 1.5px solid #333;
      padding-top: 6px;
      display: inline-block;
    }
    .sig-block .sig-title {
      font-size: 10px;
      color: #000;
      line-height: 1.6;
    }
  </style>
</head>
<body>
<div class="page">
  ${HEADER_HTML()}
  <div class="body">
    <div class="cert-title">SALARY CERTIFICATE</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>
    <div class="cert-body">
      This is to certify that Mr. <span class="emp-name">${data.name || ''}</span> has been working as a permanent employee in our organisation, The Beyond Headlines and, his contract excludes any retirement age limit. His employment details are as follows:
    </div>
    <div class="detail-row">
      <span class="label">Designation:</span>
      <span class="value">${data.designation || ''}</span>
    </div>
    <div class="detail-row">
      <span class="label">Joining date:</span>
      <span class="value">${data.joining_date_fmt || ''}</span>
    </div>
    <div class="detail-row">
      <span class="label">Job Location:</span>
      <span class="value">Head Office, Dhaka</span>
    </div>
    <table class="salary-table">
      <thead>
        <tr>
          <th style="width:38%">Monthly Gross Salary</th>
          <th class="right" style="width:12%">(in BDT)</th>
          <th style="width:38%">Monthly Deductions</th>
          <th class="right" style="width:12%">(in BDT)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Basic</td>
          <td class="right">${data.basic_fmt || ''}</td>
          <td>Tax</td>
          <td class="right">${data.tax_fmt || ''}</td>
        </tr>
        <tr>
          <td>House Rent</td>
          <td class="right">${data.house_rent_fmt || ''}</td>
          <td>Others</td>
          <td class="right">-</td>
        </tr>
        <tr>
          <td>Conveyance</td>
          <td class="right">${data.conveyance_fmt || ''}</td>
          <td></td><td></td>
        </tr>
        <tr>
          <td>Medical Allowance</td>
          <td class="right">${data.medical_fmt || ''}</td>
          <td></td><td></td>
        </tr>
        <tr>
          <td>Food &amp; Mobile Allowances</td>
          <td class="right">${data.food_mobile_fmt || ''}</td>
          <td></td><td></td>
        </tr>
        <tr>
          <td>Cash</td>
          <td class="right">${data.cash_fmt || ''}</td>
          <td></td><td></td>
        </tr>
        <tr class="total-row">
          <td class="bold">Total</td>
          <td class="right bold">${data.total_gross_fmt || ''}</td>
          <td class="bold">Total</td>
          <td class="right bold">${data.total_deductions_fmt || ''}</td>
        </tr>
        <tr class="net-row">
          <td class="bold">Net Total</td>
          <td class="right bold">${data.net_salary_fmt || ''}</td>
          <td></td><td></td>
        </tr>
      </tbody>
    </table>
    <div class="annual-heading">Annual Pay &amp; Benefits (in BDT)</div>
    <div class="annual-row">
      <span class="label">Salary &amp; Others Allowances</span>
      <span class="colon">:</span>
      <span class="value">${data.annual_gross_fmt || ''}</span>
    </div>
    <div class="annual-row">
      <span class="label">Festival Bonus(es)</span>
      <span class="colon">:</span>
      <span class="value">-</span>
    </div>
    <hr class="annual-divider" />
    <div class="annual-row total-annual">
      <span class="label">Total (Annually)</span>
      <span class="colon">:</span>
      <span class="value">${data.annual_gross_fmt || ''}</span>
    </div>
    <div class="declaration">
      We hereby certify that the above-mentioned information is correct and accurate to the best of our knowledge. We are issuing this letter on the specific request of our employee for whatever the purpose he may require without accepting any liability on behalf of this letter or part of this letter on our company.
    </div>
    <div class="sig-section">
      <div class="sig-block">
        <div class="sig-name">${data.proprietor_name || 'Saqib Ahmed'}</div>
        <div class="sig-title">
          ${data.proprietor_designation || 'Proprietor'}<br>
          ${data.company_name || 'Beyond Headlines'}
        </div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML(1, 1)}
</div>
</body>
</html>`
}
