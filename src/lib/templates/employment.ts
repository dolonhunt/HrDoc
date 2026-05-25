import { GOOGLE_FONTS_LINK, SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, WATERMARK_HTML, WATERMARK_TOGGLE_SCRIPT } from './shared-css'

export function employmentHTML(data: Record<string, any>): string {
  const logo = data.logo_path || undefined;
  const wmText = data.watermark_text || 'CONFIDENTIAL';
  const wmEnabled = data.watermark_enabled !== false;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Employment Certificate – ${data.name || 'Employee'}</title>
  ${GOOGLE_FONTS_LINK}
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page">
  ${WATERMARK_HTML(wmText, wmEnabled)}
  ${HEADER_HTML(logo)}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">EMPLOYMENT CERTIFICATE</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>
    <div class="cert-body">
      This is to certify that Mr. <span class="emp-name">${data.name || ''}</span> is currently employed at <strong>${data.company_name || 'Beyond Headlines'}</strong> as a <strong>${data.designation || ''}</strong> in the <strong>${data.department || ''}</strong> department since <strong>${data.joining_date_fmt || ''}</strong>. ${data.Pronoun || 'He'} is a permanent employee of the organisation and ${data.possessive || 'his'} contract excludes any retirement age limit.
    </div>
    <div class="detail-row">
      <span class="label">Name:</span>
      <span class="value">${data.name || ''}</span>
    </div>
    <div class="detail-row">
      <span class="label">Designation:</span>
      <span class="value">${data.designation || ''}</span>
    </div>
    <div class="detail-row">
      <span class="label">Department:</span>
      <span class="value">${data.department || ''}</span>
    </div>
    <div class="detail-row">
      <span class="label">Joining Date:</span>
      <span class="value">${data.joining_date_fmt || ''}</span>
    </div>
    <div class="detail-row">
      <span class="label">Employment Type:</span>
      <span class="value">Full-time / Permanent</span>
    </div>
    <div class="detail-row">
      <span class="label">Job Location:</span>
      <span class="value">Head Office, Dhaka</span>
    </div>
    <div class="declaration">
      This certificate is issued on the specific request of ${data.name || 'the employee'} for <strong>${data.purpose || 'official purposes'}</strong> without accepting any liability on behalf of this letter or part of this letter on our company.
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
