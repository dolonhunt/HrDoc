import { GOOGLE_FONTS_LINK, SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML, WATERMARK_HTML, WATERMARK_TOGGLE_SCRIPT } from './shared-css'

export function experienceHTML(data: Record<string, any>): string {
  const logo = data.logo_path || undefined;
  const wmText = data.watermark_text || 'CONFIDENTIAL';
  const wmEnabled = data.watermark_enabled !== false;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Experience Certificate – ${data.name || 'Employee'}</title>
  ${GOOGLE_FONTS_LINK}
  <style>${SHARED_DOC_CSS}</style>
</head>
<body>
<div class="page">
  ${WATERMARK_HTML(wmText, wmEnabled)}
  ${HEADER_HTML(logo)}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    <div class="cert-title">EXPERIENCE CERTIFICATE</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>
    <div class="cert-body">
      This is to certify that Mr. <span class="emp-name">${data.name || ''}</span> was employed at <strong>${data.company_name || 'Beyond Headlines'}</strong> from <strong>${data.joining_date_fmt || ''}</strong> to <strong>${data.leaving_date_fmt || ''}</strong>.
    </div>
    <div class="cert-body">
      During ${data.possessive || 'his'} tenure, ${data.pronoun || 'he'} worked as a <strong>${data.designation || ''}</strong> in the <strong>${data.department || ''}</strong> department. ${data.Pronoun || 'He'} performed ${data.possessive || 'his'} duties with dedication and sincerity, and ${data.pronoun || 'he'} was a valuable member of our team.
    </div>
    <div class="cert-body">
      ${data.Pronoun || 'He'} has been relieved from ${data.possessive || 'his'} duties on <strong>${data.leaving_date_fmt || ''}</strong> with no outstanding dues or liabilities. We wish ${data.pronoun || 'him'} all the best in ${data.possessive || 'his'} future endeavors.
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
      <span class="label">Period:</span>
      <span class="value">${data.joining_date_fmt || ''} to ${data.leaving_date_fmt || ''} (${data.duration || ''})</span>
    </div>
    <div class="declaration">
      This experience certificate is issued upon the request of ${data.name || 'the employee'} and is valid for official purposes only.
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
