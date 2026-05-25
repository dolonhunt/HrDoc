import { GOOGLE_FONTS_LINK, SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, WATERMARK_HTML, WATERMARK_TOGGLE_SCRIPT } from './shared-css'

export function appointmentHTML(data: Record<string, any>): string {
  const logo = data.logo_path || undefined;
  const wmText = data.watermark_text || 'CONFIDENTIAL';
  const wmEnabled = data.watermark_enabled !== false;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Letter of Appointment – ${data.name || 'Employee'}</title>
  ${GOOGLE_FONTS_LINK}
  <style>${SHARED_DOC_CSS}</style>
  <style>
    .appt-sig-section {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      gap: 60px;
    }
    .appt-sig-block { flex: 1; }
    .appt-sig-block .sig-heading {
      font-size: 11px; font-weight: 700;
      color: #000; margin-bottom: 70px;
    }
    .appt-sig-block .sig-name {
      font-size: 11px; font-weight: 700;
      border-top: 1.5px solid #333; padding-top: 6px;
    }
    .appt-sig-block .sig-title {
      font-size: 10px; color: #000; line-height: 1.6;
    }
    .net-salary-note {
      font-size: 11px; font-weight: 700; margin-bottom: 16px;
    }
  </style>
</head>
<body>

<!-- PAGE 1 -->
<div class="page">
  ${WATERMARK_HTML(wmText, wmEnabled)}
  ${HEADER_HTML(logo)}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div style="text-align:right; font-size:11px; font-weight:600; margin-bottom:18px;">Date: ${data.date_fmt || ''}</div>
    <div style="margin-bottom:16px; line-height:1.7; font-size:11px;">
      <strong>To,</strong><br>
      Mr. ${data.name || ''}<br>
      ${data.designation || ''}<br>
      ${data.company_name || 'Beyond Headlines'}
    </div>
    <div style="font-size:11px; font-weight:700; margin-bottom:16px;">Subject: A letter of appointment</div>
    <div style="font-size:11px; margin-bottom:12px;">Dear Mr. ${data.name ? data.name.split(' ').pop() : ''},</div>
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
  ${FOOTER_HTML(1, 2, data.company_name, data.company_address)}
</div>

<!-- PAGE 2 -->
<div class="page">
  ${WATERMARK_HTML(wmText, wmEnabled)}
  ${HEADER_HTML(logo)}
  <div class="pg-body" contenteditable="true" spellcheck="true">
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
    <div style="font-size:11px; line-height:1.75; text-align:justify; margin-bottom:20px;">
      Please sign a copy of this letter in acknowledgement of this understanding. Kindly note that this Employment Letter is subject to the signing of the Agreement to be signed between you and the proprietor of BH.
    </div>
    <div class="appt-sig-section">
      <div class="appt-sig-block">
        <div class="sig-heading">Sincerely yours</div>
        <div class="sig-name">&nbsp;</div>
        <div class="sig-title">
          ${data.proprietor_name || 'Saqib Ahmed'}<br>
          ${data.proprietor_designation || 'Proprietor'}<br>
          ${data.company_name || 'Beyond Headlines'}
        </div>
      </div>
      <div class="appt-sig-block" style="text-align: right;">
        <div class="sig-heading">Accepted</div>
        <div class="sig-name">&nbsp;</div>
        <div class="sig-title">
          ${data.name || ''}<br>
          On Date: _______________
        </div>
      </div>
    </div>
  </div>
  ${FOOTER_HTML(2, 2, data.company_name, data.company_address)}
</div>

${WATERMARK_TOGGLE_SCRIPT}
</body>
</html>`
}
