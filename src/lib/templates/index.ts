import {
  GOOGLE_FONTS_LINK,
  SHARED_DOC_CSS,
  WATERMARK_HTML,
  WATERMARK_TOGGLE_SCRIPT
} from './shared-css'
import { formatBDT, formatDate, formatMonthYear, calculateGross, calculateNet, numberToWords } from '@/lib/calculations'
import { DEFAULT_COMPANY, type CompanyConfig } from '@/lib/storage'

// ── CUSTOM RENDERING HELPERS FOR V3.0 ──

/**
 * Renders the Letterhead Header dynamically based on layout settings.
 */
function renderHeader(lh: Record<string, any>): string {
  const logo = lh.logoPath || 'https://i.postimg.cc/WzcZTHwj/Logo-nobg.png'
  const name = lh.companyName || 'Beyond Headlines'
  const tagline = lh.tagline || ''
  const bg = lh.headerBgColor || '#FFFFFF'
  const accent = lh.accentColor || '#6C63FF'

  const logoImg = `<img src="${logo}" style="height: 72px; max-width: 250px; object-fit: contain;" alt="Logo" />`
  const textInfo = `
    <div style="flex: 1; min-width: 0;">
      <h1 style="font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 700; color: ${accent}; text-transform: uppercase; margin: 0; line-height: 1.1;">${name}</h1>
      ${tagline ? `<p style="font-family: 'Poppins', sans-serif; font-size: 10px; font-weight: 500; color: #666; margin: 2px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">${tagline}</p>` : ''}
    </div>
  `

  if (lh.headerLayout === 'FullImage' && lh.fullImageHeader) {
    return `
      <div style="width: 100%; max-height: 150px; overflow: hidden; background: ${bg}; border-bottom: 2px solid ${accent};">
        <img src="${lh.fullImageHeader}" style="width: 100%; height: auto; object-fit: cover;" alt="Header" />
      </div>
    `
  }

  let headerContent = ''
  if (lh.headerLayout === 'LogoCenter') {
    headerContent = `
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; width: 100%;">
        ${logoImg}
        ${textInfo}
      </div>
    `
  } else if (lh.headerLayout === 'LogoRight') {
    headerContent = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; text-align: left;">
        ${textInfo}
        ${logoImg}
      </div>
    `
  } else {
    // Default: LogoLeft
    headerContent = `
      <div style="display: flex; align-items: center; gap: 16px; width: 100%; text-align: left;">
        ${logoImg}
        ${textInfo}
      </div>
    `
  }

  return `
    <div style="width: 100%; padding: 16px 24px 10px 24px; background: ${bg};">
      ${headerContent}
      <hr style="width: 100%; height: 2px; background: ${accent}; border: none; margin-top: 12px; margin-bottom: 0;" />
    </div>
  `
}

/**
 * Renders the Letterhead Footer dynamically based on settings.
 */
function renderFooter(lh: Record<string, any>): string {
  const name = lh.companyName || 'Beyond Headlines'
  const addr1 = lh.address1 || ''
  const addr2 = lh.address2 || ''
  const phone = lh.phone || ''
  const email = lh.email || ''
  const web = lh.website || ''
  const accent = lh.accentColor || '#6C63FF'
  const footerText = lh.footerText || ''

  const fullAddr = [addr1, addr2].filter(Boolean).join(', ')
  const contacts = [
    phone && `Phone: ${phone}`,
    email && `Email: ${email}`,
    web && `Web: ${web}`
  ].filter(Boolean).join(' | ')

  if (lh.footerLayout === 'FullImage' && lh.fullImageFooter) {
    return `
      <div style="width: 100%; max-height: 100px; overflow: hidden; border-top: 1px solid ${accent};">
        <img src="${lh.fullImageFooter}" style="width: 100%; height: auto; object-fit: cover;" alt="Footer" />
      </div>
    `
  }

  return `
    <div style="width: 100%; padding: 12px 24px 18px 24px; text-align: center; font-family: 'Poppins', sans-serif;">
      <hr style="width: 100%; height: 1px; background: #E2E8F0; border: none; margin: 0 0 8px 0;" />
      ${footerText ? `<p style="font-size: 10px; font-weight: 600; color: #4A5568; margin-bottom: 4px;">${footerText}</p>` : ''}
      <p style="font-size: 9.5px; font-weight: 500; color: #718096; margin: 0; line-height: 1.4;">${fullAddr}</p>
      ${contacts ? `<p style="font-size: 9px; font-weight: 400; color: #A0AEC0; margin: 2px 0 0 0;">${contacts}</p>` : ''}
    </div>
  `
}

/**
 * Renders the Signature block containing seals and dynamic draws.
 */
function renderSignatureBlock(data: Record<string, any>): string {
  const sigName = data.signatory_name || data.proprietor_name || 'Saqib Ahmed'
  const sigTitle = data.signatory_title || data.proprietor_designation || 'Proprietor'
  const companyName = data.company_name || 'Beyond Headlines'
  const method = data.signatory_method || 'type'
  const signatureData = data.signature_data || ''
  const seal = data.signatory_seal || ''
  const dualSig = data.dual_signatory || false
  const dualName = data.dual_name || ''
  const dualTitle = data.dual_title || ''

  const signatureImg = signatureData && method !== 'type'
    ? `<img src="${signatureData}" style="max-height: 48px; max-width: 160px; object-fit: contain; display: block; margin-bottom: 4px;" alt="Signature" />`
    : method === 'type' && signatureData
      ? `<div style="font-family: 'Playball', 'Georgia', cursive; font-size: 20px; font-style: italic; font-weight: 600; color: #1A202C; margin-bottom: 6px; padding-bottom: 2px;">${signatureData}</div>`
      : `<div style="height: 38px;"></div>`

  const sealImg = seal
    ? `<img src="${seal}" style="height: 56px; width: 56px; object-fit: contain; opacity: 0.85; position: absolute; left: 110px; bottom: 10px; pointer-events: none;" alt="Seal" />`
    : ''

  const mainSig = `
    <div style="position: relative; display: inline-block; text-align: left; min-width: 220px;">
      ${signatureImg}
      ${sealImg}
      <div style="border-top: 1.5px solid #2D3748; padding-top: 6px; font-family: 'Open Sans', sans-serif; font-size: 11px; font-weight: 700; color: #1A202C;">${sigName}</div>
      <div style="font-family: 'Open Sans', sans-serif; font-size: 9.5px; color: #4A5568; line-height: 1.3;">
        ${sigTitle}<br/>
        ${companyName}
      </div>
    </div>
  `

  const secondarySig = dualSig ? `
    <div style="position: relative; display: inline-block; text-align: left; min-width: 220px;">
      <div style="height: 38px;"></div>
      <div style="border-top: 1.5px solid #2D3748; padding-top: 6px; font-family: 'Open Sans', sans-serif; font-size: 11px; font-weight: 700; color: #1A202C;">${dualName || 'Approved By'}</div>
      <div style="font-family: 'Open Sans', sans-serif; font-size: 9.5px; color: #4A5568; line-height: 1.3;">
        ${dualTitle || 'HR Manager'}<br/>
        ${companyName}
      </div>
    </div>
  ` : ''

  return `
    <div style="display: flex; justify-content: ${dualSig ? 'space-between' : 'flex-end'}; margin-top: 36px; padding: 0 4px; page-break-inside: avoid;">
      ${secondarySig}
      ${mainSig}
    </div>
  `
}

/**
 * Standard templates renderer wrapper.
 */
function enrichData(docType: string, formData: Record<string, any>, companyData?: CompanyConfig | null): Record<string, any> {
  const company = companyData || DEFAULT_COMPANY
  const d = { ...formData }

  d.company_name = company.name || 'Beyond Headlines'
  d.company_address = company.address || ''
  d.proprietor_name = company.proprietor_name || 'Saqib Ahmed'
  d.proprietor_designation = company.proprietor_designation || 'Proprietor'
  d.brand_color = company.brand_color || '#6C63FF'
  d.logo_path = company.logo_path || '/Logo-main.png'

  if (!d.employee_id && d.id) d.employee_id = d.id

  const gross = calculateGross(d)
  const net = calculateNet(d)

  d.gross = d.gross || gross
  d.net = d.net || net
  d.total_earnings = gross - (Number(d.cash) || 0)
  d.total_deductions = Number(d.tax) || 0
  d.net_payment = net
  d.total_gross = gross
  d.net_salary = net
  d.annual_gross = gross * 12
  d.annual_net = net * 12

  d.basic_fmt = formatBDT(Number(d.basic) || 0)
  d.house_rent_fmt = formatBDT(Number(d.house_rent) || 0)
  d.conveyance_fmt = formatBDT(Number(d.conveyance) || 0)
  d.medical_fmt = formatBDT(Number(d.medical) || 0)
  d.food_mobile_fmt = formatBDT(Number(d.food_mobile) || 0)
  d.cash_fmt = formatBDT(Number(d.cash) || 0)
  d.tax_fmt = formatBDT(Number(d.tax) || 0)
  d.gross_fmt = formatBDT(gross)
  d.net_fmt = formatBDT(net)
  d.total_earnings_fmt = formatBDT(d.total_earnings)
  d.total_deductions_fmt = formatBDT(d.total_deductions)
  d.net_payment_fmt = formatBDT(net)
  d.total_gross_fmt = formatBDT(gross)
  d.net_salary_fmt = formatBDT(net)
  d.annual_gross_fmt = formatBDT(gross * 12)
  d.annual_net_fmt = formatBDT(net * 12)
  d.net_in_words = numberToWords(net)

  if (!d.date) d.date = d.cert_date || d.letter_date || new Date().toISOString().split('T')[0]
  d.date_fmt = formatDate(d.date)
  d.joining_date_fmt = formatDate(d.joining_date || '')
  d.leaving_date_fmt = formatDate(d.leaving_date || '')

  const isFemale = (d.name && (d.name.toLowerCase().startsWith('mrs.') || d.name.toLowerCase().startsWith('ms.')))
  d.pronoun = isFemale ? 'she' : 'he'
  d.possessive = isFemale ? 'her' : 'his'
  d.Pronoun = isFemale ? 'She' : 'He'
  d.Possessive = isFemale ? 'Her' : 'His'

  d.days_worked = Number(d.days_present) || Number(d.days_in_month) || 30

  return d
}

/**
 * Standard Letter Layout Generator
 */
function renderLetter(data: Record<string, any>, subject: string, paragraphs: string[]): string {
  const paras = paragraphs.map(p => `<p class="body-paragraph">${p}</p>`).join('')
  
  return `
    <div class="ref-block">
      <div class="ref-line">Ref: ${data.ref_code || ''}</div>
      <div class="ref-line date-line">Date: ${data.date_fmt || ''}</div>
    </div>
    <div class="addr-block">
      <strong>${data.name || ''}</strong><br/>
      ID: ${data.employee_id || ''}<br/>
      ${data.designation || ''} – ${data.department || ''}<br/>
      ${data.email ? `Email: ${data.email}<br/>` : ''}
      ${data.mobile ? `Mobile: ${data.mobile}` : ''}
    </div>
    <div class="subject-line">SUBJECT: ${subject}</div>
    <div class="salutation">Dear ${data.name || 'Sir/Madam'},</div>
    <div class="letter-body">
      ${paras}
    </div>
    <div class="closing">
      Sincerely,<br/><br/>
      <strong>For ${data.company_name}</strong>
    </div>
    ${renderSignatureBlock(data)}
  `
}

/**
 * Standard Certificate Layout Generator
 */
function renderCertificate(data: Record<string, any>, title: string, paragraphs: string[], bodyContent: string = ''): string {
  const paras = paragraphs.map(p => `<p class="body-paragraph">${p}</p>`).join('')

  return `
    <div class="cert-title">${title}</div>
    <div class="ref-date">
      <span>Ref: ${data.ref_code || ''}</span>
      <span>Date: ${data.date_fmt || ''}</span>
    </div>
    <div class="cert-body">
      ${paras}
    </div>
    ${bodyContent}
    ${renderSignatureBlock(data)}
  `
}

export function renderDocument(docType: string, formData: Record<string, any>, companyData?: CompanyConfig | null): string {
  const data = enrichData(docType, formData, companyData)
  
  // Custom layout margins & letterhead overrides
  const lh = data.letterhead_profile || {
    headerLayout: 'LogoLeft',
    footerLayout: 'TextOnly',
    logoPath: data.logo_path,
    companyName: data.company_name,
    address1: data.company_address,
    accentColor: data.brand_color,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
    marginRight: 15
  }

  const wmText = data.watermark_text || 'CONFIDENTIAL'
  const wmEnabled = data.watermark_enabled !== false

  // Renders the internal HTML body depending on the type
  let content = ''
  
  switch (docType) {
    case 'payslip':
      content = `
        <div class="cert-title">PAY SLIP</div>
        <div class="ref-date">
          <span>Ref: ${data.ref_code || ''}</span>
          <span>Period: ${data.period || ''}</span>
        </div>
        <div class="addr-block" style="margin-bottom:14px; font-size:10.5px;">
          <strong>Name: ${data.name || ''}</strong><br/>
          Employee ID: ${data.employee_id || ''} | Designation: ${data.designation || ''}<br/>
          Department: ${data.department || ''} | Bank Account: ${data.bank_account || ''}
        </div>
        <table class="salary-table">
          <thead>
            <tr>
              <th style="width:38%">Earnings</th>
              <th class="right" style="width:12%">Amount (BDT)</th>
              <th style="width:38%">Deductions</th>
              <th class="right" style="width:12%">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Basic Salary</td>
              <td class="right">${data.basic_fmt || ''}</td>
              <td>Income Tax</td>
              <td class="right">${data.tax_fmt || ''}</td>
            </tr>
            <tr>
              <td>House Rent Allowance</td>
              <td class="right">${data.house_rent_fmt || ''}</td>
              <td>Other Deductions</td>
              <td class="right">-</td>
            </tr>
            <tr>
              <td>Conveyance Allowance</td>
              <td class="right">${data.conveyance_fmt || ''}</td>
              <td></td><td></td>
            </tr>
            <tr>
              <td>Medical Allowance</td>
              <td class="right">${data.medical_fmt || ''}</td>
              <td></td><td></td>
            </tr>
            <tr>
              <td>Food & Mobile Allowances</td>
              <td class="right">${data.food_mobile_fmt || ''}</td>
              <td></td><td></td>
            </tr>
            <tr>
              <td>Cash Reimbursement</td>
              <td class="right">${data.cash_fmt || ''}</td>
              <td></td><td></td>
            </tr>
            <tr class="total-row">
              <td class="bold">Total Earnings</td>
              <td class="right bold">${data.total_gross_fmt || ''}</td>
              <td class="bold">Total Deductions</td>
              <td class="right bold">${data.total_deductions_fmt || ''}</td>
            </tr>
            <tr class="net-row">
              <td class="bold">Net Payment (in hand)</td>
              <td class="right bold">${data.net_payment_fmt || ''}</td>
              <td colspan="2" class="bold text-xs" style="font-size:9px;">In Words: ${data.net_in_words || ''} Only</td>
            </tr>
          </tbody>
        </table>
        <div class="declaration" style="font-size:10px; margin-top:8px;">
          Note: This is a computer-generated voucher and does not strictly require physical signatures, however digital endorsement is appended for compliance.
        </div>
        ${renderSignatureBlock(data)}
      `
      break

    case 'salary_cert':
      content = renderCertificate(data, 'SALARY CERTIFICATE', [
        `This is to certify that Mr. <span class="emp-name">${data.name || ''}</span> has been working as a permanent employee in our organization, ${data.company_name}, and his contract excludes any retirement age limit. His employment details and monthly salary structure are detailed below:`
      ], `
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
              <td>Food & Mobile Allowances</td>
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
              <td colspan="2" style="font-size:9.5px; font-weight:700;">In Words: ${data.net_in_words || ''} Only</td>
            </tr>
          </tbody>
        </table>
        <div class="annual-heading">Annual Pay & Benefits (in BDT)</div>
        <div class="annual-row">
          <span class="label">Salary & Other Allowances</span>
          <span class="colon">:</span>
          <span class="value">${data.annual_gross_fmt || ''}</span>
        </div>
        <hr class="annual-divider"/>
        <div class="annual-row total-annual">
          <span class="label">Total (Annually)</span>
          <span class="colon">:</span>
          <span class="value">${data.annual_gross_fmt || ''}</span>
        </div>
        <div class="declaration">
          We hereby certify that the above-mentioned information is correct and accurate to the best of our knowledge. We are issuing this letter on the specific request of our employee for whatever bank credit or official purpose he may require, without accepting any financial liability on behalf of our company.
        </div>
      `)
      break

    case 'appointment':
      content = renderCertificate(data, 'APPOINTMENT LETTER', [
        `We are pleased to appoint you as <span class="emp-name">${data.designation || ''}</span> in our organisation ${data.company_name} with effect from <span class="bold">${data.joining_date_fmt || ''}</span> under the following terms and conditions:`
      ], `
        <div class="section-heading">1. Emoluments & Compensation</div>
        <p class="body-text">Your monthly gross salary will be BDT ${data.gross_fmt || ''} (Net: BDT ${data.net_fmt || ''}) distributed as per the payroll table below:</p>
        <table class="salary-table" style="margin: 8px 0 14px 0;">
          <thead>
            <tr>
              <th>Salary Breakdown Component</th>
              <th class="right">Monthly Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Basic Salary</td><td class="right">${data.basic_fmt || ''}</td></tr>
            <tr><td>House Rent Allowance</td><td class="right">${data.house_rent_fmt || ''}</td></tr>
            <tr><td>Conveyance Allowance</td><td class="right">${data.conveyance_fmt || ''}</td></tr>
            <tr><td>Medical Allowance</td><td class="right">${data.medical_fmt || ''}</td></tr>
            <tr><td>Food & Mobile Reimbursements</td><td class="right">${data.food_mobile_fmt || ''}</td></tr>
            <tr><td>Cash Remittance</td><td class="right">${data.cash_fmt || ''}</td></tr>
            <tr class="total-row"><td>Gross Monthly Total</td><td class="right bold">${data.gross_fmt || ''}</td></tr>
          </tbody>
        </table>
        <div class="section-heading">2. Probationary Period</div>
        <p class="body-text">You will be on probation for a period of ${data.probation_months || 3} months from your joining date. Upon successful evaluation of your performance, your services will be confirmed in writing by the company.</p>
        <div class="section-heading">3. Notice Period & Termination</div>
        <p class="body-text">During the probation period, either party may terminate this contract by giving 15 days notice. After confirmation, the notice period shall be 30 days or payment of equivalent salary in lieu thereof.</p>
        <div class="declaration">
          Please sign and return the duplicate copy of this letter as an acknowledgment of your acceptance of the terms and conditions.
        </div>
      `)
      break

    case 'experience':
      content = renderCertificate(data, 'EXPERIENCE CERTIFICATE', [
        `This is to certify that Mr. <span class="emp-name">${data.name || ''}</span> was employed with ${data.company_name} as a permanent <span class="bold">${data.designation || ''}</span> in the <span class="bold">${data.department || ''}</span> department.`,
        `His tenure of employment was from <span class="bold">${data.joining_date_fmt || ''}</span> to <span class="bold">${data.leaving_date_fmt || ''}</span>.`,
        `During his tenure, we found him to be hard-working, professional, and dedicated to his duties. His conduct was exemplary and he maintained excellent professional relationships with colleagues and management.`,
        `We accept his resignation and relieve him of his duties with effect from the close of business hours on <span class="bold">${data.leaving_date_fmt || ''}</span>. We wish him the absolute best in his future professional endeavors.`
      ])
      break

    case 'employment_cert':
      content = renderCertificate(data, 'EMPLOYMENT CERTIFICATE', [
        `This is to certify that Mr. <span class="emp-name">${data.name || ''}</span> (ID: ${data.employee_id || ''}) is a permanent employee of ${data.company_name}. He joined the organization on <span class="bold">${data.joining_date_fmt || ''}</span> and is currently serving in the capacity of <span class="bold">${data.designation || ''}</span> in our <span class="bold">${data.department || ''}</span> department.`,
        `To the best of our knowledge, his conduct has been highly professional and satisfactory. We are issuing this certificate upon his written request to facilitate ${data.purpose || 'official purposes'}, without any legal or financial liability on behalf of our company.`
      ])
      break

    case 'offer_letter':
      content = renderLetter(data, `Job Offer: ${data.designation || ''}`, [
        `We are pleased to offer you the position of ${data.designation || ''} in the ${data.department || ''} department with our organization ${data.company_name}.`,
        `Your monthly gross salary will be BDT ${data.gross_fmt || ''} (in words: ${data.net_in_words || ''} Only) subject to applicable local taxes. Your joining date is scheduled for ${data.joining_date_fmt || ''}.`,
        `Please review the enclosed offer details. To accept, sign and return this copy by tomorrow.`
      ])
      break

    case 'joining_letter':
      content = renderLetter(data, `Joining Report – ${data.name || ''}`, [
        `I am writing to formally report my joining today, ${data.date_fmt || ''}, at the head office of ${data.company_name} as a permanent ${data.designation || ''} in the ${data.department || ''} department.`,
        `I accept the terms and conditions outlined in the appointment letter ref: ${data.ref_code || ''} and look forward to contributing to the company's growth.`,
        `Please accept this joining letter for official records.`
      ])
      break

    case 'probation_confirm':
      content = renderLetter(data, `Confirmation of Services`, [
        `Following the successful completion of your ${data.probation_months || 3}-month probation period ending on ${data.date_fmt || ''}, we are pleased to confirm your appointment as a permanent ${data.designation || ''} in the ${data.department || ''} department, effective immediately.`,
        `All other terms and conditions of your employment contract remain unchanged. We appreciate your valuable contributions during the probation and look forward to your continued support.`
      ])
      break

    case 'id_card_letter':
      content = renderLetter(data, 'Access ID & Smart Card Issuance', [
        `This letter authorizes the IT Operations and Security departments to issue an official company ID Access Card to Mr. ${data.name || ''}, serving as ${data.designation || ''} in the ${data.department || ''} department.`,
        `The card will grant authorization to all general company premises. Please issue the card under reference ID: ${data.ref_code || ''}.`
      ])
      break

    case 'noc_cert':
      content = renderCertificate(data, 'NO OBJECTION CERTIFICATE', [
        `This is to certify that Mr. <span class="emp-name">${data.name || ''}</span> is an active permanent employee of ${data.company_name}, working as ${data.designation || ''} in the ${data.department || ''} department since ${data.joining_date_fmt || ''}.`,
        `The company has no objection to his application for ${data.purpose || 'visa / credit facilities'} and we confirm that his travel does not conflict with company operations.`
      ])
      break

    case 'bank_intro':
      content = renderLetter(data, 'Request to Open Salary Bank Account', [
        `This is to introduce our employee Mr. ${data.name || ''}, serving as ${data.designation || ''} in our organization since ${data.joining_date_fmt || ''}.`,
        `We request you to kindly facilitate the opening of a salary/savings account for him and configure direct salary transfers. Please find his employee NID: ${data.nid || 'N/A'} for KYC verification.`,
        `We appreciate your prompt assistance.`
      ])
      break

    case 'embassy_support':
      content = renderLetter(data, 'Embassy Visa Support & Travel Authorization', [
        `This is to confirm that Mr. ${data.name || ''}, working as ${data.designation || ''} since ${data.joining_date_fmt || ''}, has been granted leave to travel to the Schengen zone for a holiday between the dates of ${data.travel_dates || 'next month'}.`,
        `We guarantee that he will return to his official duties immediately upon completion of his trip, and his salary will be continuously paid in full during his holiday.`,
        `We request the embassy to grant him the necessary entry visa.`
      ])
      break

    case 'salary_increment':
      content = renderLetter(data, 'Salary Revision & Appraisal Notification', [
        `We are pleased to inform you that following your annual performance appraisal, the management of ${data.company_name} has approved a revision of your gross salary to BDT ${data.gross_fmt || ''} per month, effective from next month.`,
        `We appreciate your dedication and valuable contributions to the team and hope you maintain this excellent momentum. All other clauses in your employment contract remain unchanged.`
      ])
      break

    case 'bonus_letter':
      content = renderLetter(data, 'Festival Bonus Payout Allocation', [
        `We are pleased to award you a special Festival Bonus of BDT ${data.basic_fmt || ''} (equivalent to one basic salary) in recognition of your dedicated services.`,
        `This amount will be disbursed alongside your monthly payroll. We wish you and your family a wonderful holiday.`
      ])
      break

    case 'arrear_letter':
      content = renderLetter(data, 'Outstanding Arrear Adjustment Details', [
        `This letter confirms the disbursement of outstanding salary arrears amounting to BDT ${data.net_fmt || ''} for adjustments relating to previous payroll cycles.`,
        `The calculations have been adjusted in the current pay run. Please check your bank receipt.`
      ])
      break

    case 'show_cause':
      content = renderLetter(data, 'Show Cause Notice: Professional Negligence', [
        `It has been reported to the HR department that on ${data.incident_date || 'recent days'}, you committed a breach of professional conduct, specifically: ${data.incident_desc || 'absenteeism without notification'}.`,
        `Under company policy clause 14, you are hereby required to submit a written explanation within 3 business days, showing cause why disciplinary action should not be initiated against you.`,
        `Please treat this with utmost urgency.`
      ])
      break

    case 'warning_letter':
      content = renderLetter(data, 'First Written Warning: Attendance & Performance', [
        `This letter serves as a formal written warning regarding your persistent performance issues and delays in completing deliverables.`,
        `Despite verbal warnings, we have not observed satisfactory improvement. You are expected to improve your metrics immediately, failing which further disciplinary measures including suspension will be taken.`
      ])
      break

    case 'suspension_letter':
      content = renderLetter(data, 'Suspension Pending Disciplinary Inquiry', [
        `You are hereby notified that you have been suspended from your duties as ${data.designation || ''} with immediate effect, pending a formal inquiry into the allegations of misconduct.`,
        `During the suspension period, you are prohibited from entering company premises unless formally summoned by the inquiry committee. You will receive a basic allowance as per policy.`
      ])
      break

    case 'termination_letter':
      content = renderLetter(data, 'Termination of Employment Services', [
        `We regret to inform you that your employment services with ${data.company_name} are terminated with effect from the close of business hours today.`,
        `This action is taken due to ${data.termination_reason || 're-structuring operations'}. You are requested to return all company assets and clear your dues with the accounting department for final settlement.`
      ])
      break

    case 'resignation_accept':
      content = renderLetter(data, 'Acceptance of Resignation & Clearance Order', [
        `This is in reference to your resignation letter dated ${data.date_fmt || ''}. We hereby accept your resignation and confirm that your last working day will be ${data.leaving_date_fmt || ''}.`,
        `You are requested to complete the clearance checklist and hand over all projects. We thank you for your services.`
      ])
      break

    case 'relieving_letter':
      content = renderLetter(data, 'Relieving Order', [
        `This is to confirm that Mr. ${data.name || ''} has been officially relieved of his duties as ${data.designation || ''} at ${data.company_name} on ${data.leaving_date_fmt || ''}.`,
        `His final dues have been settled in full and he has returned all company assets. We wish him success.`
      ])
      break

    case 'clearance_cert':
      content = renderCertificate(data, 'DEPARTMENTAL CLEARANCE RELEASE', [
        `This document certifies that Mr. <span class="emp-name">${data.name || ''}</span> has successfully returned all office files, equipment, laptops, and credentials, obtaining full clearance from IT, Admin, and Accounts departments.`
      ])
      break

    case 'final_settlement':
      content = renderCertificate(data, 'FULL & FINAL SETTLEMENT SHEET', [
        `Employee Name: ${data.name || ''} | Designation: ${data.designation || ''} | Resigned: ${data.leaving_date_fmt || ''}`,
        `Calculations of Final Settlement disbursements are structuralized as follows:`
      ], `
        <table class="salary-table">
          <thead>
            <tr>
              <th>Dues Component</th>
              <th class="right">Payable (BDT)</th>
              <th>Deductions Component</th>
              <th class="right">Amount (BDT)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Gratuity (Accrued)</td><td class="right">${data.basic_fmt || ''}</td><td>Unpaid Tax</td><td class="right">${data.tax_fmt || ''}</td></tr>
            <tr><td>Notice Period Pay</td><td class="right">-</td><td>LWP Adjustments</td><td class="right">-</td></tr>
            <tr><td>Earned Leave Encashment</td><td class="right">${data.medical_fmt || ''}</td><td>Office Assets Damage</td><td class="right">-</td></tr>
            <tr class="total-row"><td>Total Payable</td><td class="right bold">${data.gross_fmt || ''}</td><td>Total Deductions</td><td class="right bold">${data.tax_fmt || ''}</td></tr>
            <tr class="net-row"><td>Net Final Payout</td><td class="right bold" colspan="3">${data.net_fmt || ''} (in words: ${data.net_in_words || ''} Only)</td></tr>
          </tbody>
        </table>
      `)
      break

    case 'promotion_letter':
      content = renderLetter(data, 'Promotion to Senior Grade & Designation Re-allocation', [
        `We are pleased to promote you to the grade of ${data.designation || 'Senior Executive'} within the ${data.department || ''} department, effective from next month.`,
        `In this capacity, your monthly gross salary will be revised to BDT ${data.gross_fmt || ''}. We look forward to your leadership and outstanding contributions in this new role.`
      ])
      break

    case 'pip_letter':
      content = renderLetter(data, 'Performance Improvement Plan (PIP) Notice', [
        `Following recent reviews, we have decided to place you on a formal Performance Improvement Plan (PIP) for a period of 30 days starting tomorrow.`,
        `You are required to meet the specific target metrics attached with this letter. Failure to meet these criteria will lead to suspension or termination of your services.`
      ])
      break

    case 'appreciation_letter':
      content = renderCertificate(data, 'LETTER OF APPRECIATION', [
        `This letter of appreciation is awarded to Mr. <span class="emp-name">${data.name || ''}</span> in recognition of his outstanding commitment and stellar performance during the recent project releases.`,
        `Your hard work is highly appreciated and sets an excellent benchmark for the entire team.`
      ])
      break

    case 'leave_approval':
      content = renderLetter(data, 'Approval of Earned / Sick Leave Request', [
        `We are writing to approve your request for leave from ${data.start_date || 'first of next month'} to ${data.end_date || 'middle of next month'}.`,
        `You are expected to report back to your duties on the next business day. Please ensure your tasks are delegated.`
      ])
      break

    case 'lwp_notice':
      content = renderLetter(data, 'Notice of Leave Without Pay (LWP) Adjustment', [
        `Please be notified that your recent leaves have exceeded your annual paid balance. Therefore, an adjustment of LWP has been configured for this cycle.`,
        `This adjustment has been reflected in your pay slip. Please contact the finance desk for details.`
      ])
      break

    case 'custom_freeform':
      content = `
        <div class="cert-title" contenteditable="true">OFFICIAL CORRESPONDENCE</div>
        <div class="ref-date">
          <span contenteditable="true">Ref: ${data.ref_code || ''}</span>
          <span contenteditable="true">Date: ${data.date_fmt || ''}</span>
        </div>
        <div class="pg-body-text" contenteditable="true" style="outline:none; text-align:justify; line-height:1.7; font-size:11px;">
          Type custom free-form letter content here. You can click anywhere to edit directly...
        </div>
        ${renderSignatureBlock(data)}
      `
      break

    case 'custom_builder':
      content = `
        <div class="cert-title">CLAUSE BUILDER SHEET</div>
        <div class="ref-date">
          <span>Ref: ${data.ref_code || ''}</span>
          <span>Date: ${data.date_fmt || ''}</span>
        </div>
        <div style="font-size:11px; space-y-4;">
          <div style="padding:8px; border:1px dashed #ddd; margin-bottom:8px;">
            <strong>Clause 1: Confidentiality</strong><br/>
            The employee agrees to protect all trade secrets and proprietary data...
          </div>
          <div style="padding:8px; border:1px dashed #ddd; margin-bottom:8px;">
            <strong>Clause 2: Intellectual Property</strong><br/>
            All assets, codes, designs created remain the exclusive property of the company...
          </div>
        </div>
        ${renderSignatureBlock(data)}
      `
      break

    default:
      content = `<div>Invalid document type</div>`
  }

  // Construct complete HTML file wrapping our dynamic content inside the non-destructive letterhead wrapper
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${docType.toUpperCase()} – ${data.name || 'Employee'}</title>
  ${GOOGLE_FONTS_LINK}
  <style>
    ${SHARED_DOC_CSS}
    
    /* Dynamically overwrite A4 margins based on Letterhead profile config */
    .page {
      padding-top: ${lh.marginTop || 15}mm;
      padding-bottom: ${lh.marginBottom || 15}mm;
      padding-left: ${lh.marginLeft || 15}mm;
      padding-right: ${lh.marginRight || 15}mm;
    }
  </style>
</head>
<body>
<div class="page">
  ${WATERMARK_HTML(wmText, wmEnabled)}
  ${renderHeader(lh)}
  <div class="pg-body" contenteditable="true" spellcheck="true">
    ${content}
  </div>
  ${renderFooter(lh)}
</div>
${WATERMARK_TOGGLE_SCRIPT}
</body>
</html>`
}
