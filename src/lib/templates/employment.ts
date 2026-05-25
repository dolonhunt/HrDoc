import { SHARED_DOC_CSS, HEADER_HTML, FOOTER_HTML } from './shared-css'

export function employmentHTML(data: Record<string, any>): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Employment Certificate – ${data.name || 'Employee'}</title>
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
  ${FOOTER_HTML(1, 1)}
</div>
</body>
</html>`
}
