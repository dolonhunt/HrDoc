import { GOOGLE_FONTS_LINK, SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, WATERMARK_HTML, WATERMARK_TOGGLE_SCRIPT } from './shared-css'

export function salaryCertHTML(data: Record<string, any>): string {
  const logo = data.logo_path || undefined;
  const wmText = data.watermark_text || 'CONFIDENTIAL';
  const wmEnabled = data.watermark_enabled !== false;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Salary Certificate – ${data.name || 'Employee'}</title>
  ${GOOGLE_FONTS_LINK}
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page">
  ${WATERMARK_HTML(wmText, wmEnabled)}
  ${HEADER_HTML(logo)}
  <div class="pg-body" contenteditable="true" spellcheck="true">
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
    <hr class="annual-divider"/>
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
  ${FOOTER_HTML(1, 1, data.company_name, data.company_address)}
</div>
${WATERMARK_TOGGLE_SCRIPT}
</body>
</html>`
}
