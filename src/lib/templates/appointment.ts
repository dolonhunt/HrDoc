import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML } from './shared-css'

export function appointmentHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Letter of Appointment – The Beyond Headlines</title>
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .body {
      flex: 1;
      padding: 24px 20px 24px 20px;
    }
    .date {
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 18px;
      text-align: right;
    }
    .to-block {
      margin-bottom: 16px;
      line-height: 1.7;
      font-size: 11px;
    }
    .to-block strong {
      font-weight: 700;
    }
    .subject {
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .salutation {
      font-size: 11px;
      margin-bottom: 12px;
    }
    .body-text {
      font-size: 11px;
      line-height: 1.75;
      text-align: justify;
      margin-bottom: 14px;
    }
    .expect-list {
      font-size: 11px;
      line-height: 1.75;
      margin-bottom: 14px;
      padding-left: 20px;
    }
    .expect-list li {
      margin-bottom: 6px;
      list-style-type: disc;
    }
    .salary-text {
      font-size: 11px;
      line-height: 1.75;
      text-align: justify;
      margin-bottom: 14px;
    }
    .salary-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
      margin-bottom: 14px;
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
    .salary-table .net-row {
      background: transparent;
    }
    .salary-table .net-row td {
      border: 2px solid #333;
      color: #111;
    }
    .net-salary-note {
      font-size: 11px;
      font-weight: 700;
      margin-bottom: 16px;
    }
    .closing-text {
      font-size: 11px;
      line-height: 1.75;
      text-align: justify;
      margin-bottom: 20px;
    }
    .sig-section {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      gap: 60px;
    }
    .sig-block {
      flex: 1;
    }
    .sig-block .sig-heading {
      font-size: 11px;
      font-weight: 700;
      color: #000;
      margin-bottom: 70px;
    }
    .sig-block .sig-name {
      font-size: 11px;
      font-weight: 700;
      border-top: 1.5px solid #333;
      padding-top: 6px;
    }
    .sig-block .sig-title {
      font-size: 10px;
      color: #000;
      line-height: 1.6;
    }
    .sig-block .sig-date {
      font-size: 10px;
      color: #000;
      margin-top: 8px;
    }
  </style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page">
  ${HEADER_HTML()}
  <div class="body">
    <div class="date">Date: ${data.date_fmt || ''}</div>
    <div class="to-block">
      <strong>To,</strong><br>
      Mr. ${data.name || ''}<br>
      ${data.designation || ''}<br>
      ${data.company_name || 'Beyond Headlines'}
    </div>
    <div class="subject">Subject: A letter of appointment</div>
    <div class="salutation">Dear Mr. ${data.name ? data.name.split(' ').pop() : ''},</div>
    <div class="body-text">
      On behalf of the '${data.company_name || 'Beyond Headlines'}', I, ${data.proprietor_name || 'Saqib Ahmed'}, am pleased to appoint you as the ${data.designation || ''} of ${data.company_name || 'Beyond Headlines'}; a digital news portal with a vision for an English-language newspaper in the future ahead. The management is hereby giving you the responsibility to turn BH into an independent, credible and free media. The performance of the portal and your stewardship will be reviewed in order to decide on the future the contract.
    </div>
    <div class="body-text">As the ${data.designation || 'Editor'}, you will be broadly expected to:</div>
    <ul class="expect-list">
      <li>Execute editorial and all other policies as approved by the owner.</li>
      <li>Ensure neutrality, accountability and transparency in all aspects of media operations.</li>
      <li>Exercise your complete authority in hiring and firing of the manpower under you with utmost fairness. In case of the recruitment and retrenchment of top-level manpower like Managing Editor, Executive Editor or other HODs, you will consult with the management/owner beforehand.</li>
      <li>Run the media in light of the approved AOP and SOP.</li>
    </ul>
    <div class="salary-text">
      As the ${data.designation || 'Editor'}, your take-home salary will be Tk. ${data.net_salary_fmt || ''} a month, and the income tax will be borne by the company. In addition to your monthly salary, you will be entitled to additional allowances as per the company policy.
    </div>
    <div class="salary-text">
      It may be added that the tenure of this letter will be effective from the ${data.joining_date_fmt || ''} and all other terms and policies of your Employment will be mentioned in detail, in the formal agreement.
    </div>
  </div>
  ${FOOTER_HTML(1, 2)}
</div>

<!-- PAGE 2 -->
<div class="page">
  ${HEADER_HTML()}
  <div class="body">
    <div class="body-text"><strong>Your salary structure will be as follows:</strong></div>
    <table class="salary-table">
      <thead>
        <tr>
          <th style="width:60%">Description</th>
          <th class="right" style="width:40%">Amount (BDT)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Bank Deposit</td><td class="right">${data.bank_total_fmt || ''}</td></tr>
        <tr><td>(Cash)</td><td class="right">${data.cash_fmt || ''}</td></tr>
        <tr><td>Basic 50%</td><td class="right">${data.basic_fmt || ''}</td></tr>
        <tr><td>House Rent @25%</td><td class="right">${data.house_rent_fmt || ''}</td></tr>
        <tr><td>Conveyance @10%</td><td class="right">${data.conveyance_fmt || ''}</td></tr>
        <tr><td>Medical Allowance @7.5%</td><td class="right">${data.medical_fmt || ''}</td></tr>
        <tr><td>Other Allowances @7.5%</td><td class="right">${data.food_mobile_fmt || ''}</td></tr>
        <tr><td>Before AIT</td><td class="right">${data.total_earnings_fmt || ''}</td></tr>
        <tr><td class="bold" style="text-align:right">AIT</td><td class="right">${data.tax_fmt || ''}</td></tr>
        <tr class="net-row"><td class="bold" style="text-align:right">NET Deposit after AIT Deduction</td><td class="right">${data.bank_total_fmt || ''}</td></tr>
      </tbody>
    </table>
    <div class="net-salary-note">NET Salary [Bank + Cash] = ${data.net_salary_fmt || ''}</div>
    <div class="closing-text">
      Please sign a copy of this letter in acknowledgement of this understanding. Kindly note that this Employment Letter is subject to the signing of the Agreement to be signed between you and the proprietor of BH.
    </div>
    <div class="sig-section">
      <div class="sig-block">
        <div class="sig-heading">Sincerely yours</div>
        <div class="sig-name">&nbsp;</div>
        <div class="sig-title">
          ${data.proprietor_name || 'Saqib Ahmed'}<br>
          ${data.proprietor_designation || 'Proprietor'}<br>
          ${data.company_name || 'Beyond Headlines'}
        </div>
      </div>
      <div class="sig-block" style="text-align: right;">
        <div class="sig-heading">Accepted</div>
        <div class="sig-name">&nbsp;</div>
        <div class="sig-title">
          ${data.name || ''}<br>
          On Date: _______________
        </div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML(2, 2)}
</div>

</body>
</html>`
}
