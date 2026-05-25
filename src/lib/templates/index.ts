import { paySlipHTML } from './payslip'
import { salaryCertHTML } from './salary-cert'
import { appointmentHTML } from './appointment'
import { experienceHTML } from './experience'
import { employmentHTML } from './employment'
import { formatBDT, formatDate, formatMonthYear, calculateGross, calculateNet, calculateBankTotal, numberToWords, calculateDuration } from '@/lib/calculations'
import { DEFAULT_COMPANY, type CompanyConfig } from '@/lib/storage'

function enrichData(docType: string, formData: Record<string, any>, companyData?: CompanyConfig | null): Record<string, any> {
  const company = companyData || DEFAULT_COMPANY
  const d = { ...formData }

  d.company_name = company.name || 'Beyond Headlines'
  d.company_address = company.address || ''
  d.proprietor_name = company.proprietor_name || 'Saqib Ahmed'
  d.proprietor_designation = company.proprietor_designation || 'Proprietor'
  d.brand_color = company.brand_color || '#FF2109'
  d.logo_path = company.logo_path || '/Logo-main.png'

  if (!d.employee_id && d.id) d.employee_id = d.id

  const gross = calculateGross(d)
  const net = calculateNet(d)
  const bankTotal = calculateBankTotal(d)

  d.gross = d.gross || gross
  d.net = d.net || net
  d.bank_total = d.bank_total || bankTotal
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
  d.bank_total_fmt = formatBDT(bankTotal)
  d.total_earnings_fmt = formatBDT(gross - (Number(d.cash) || 0))
  d.total_deductions_fmt = formatBDT(Number(d.tax) || 0)
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

  if (d.month && d.year) d.period = formatMonthYear(Number(d.month), Number(d.year))
  if (d.joining_date && d.leaving_date) d.duration = calculateDuration(d.joining_date, d.leaving_date)

  const isFemale = (d.name && (d.name.toLowerCase().startsWith('mrs.') || d.name.toLowerCase().startsWith('ms.')))
  d.pronoun = isFemale ? 'she' : 'he'
  d.possessive = isFemale ? 'her' : 'his'
  d.Pronoun = isFemale ? 'She' : 'He'
  d.Possessive = isFemale ? 'Her' : 'His'

  d.days_worked = Number(d.days_present) || Number(d.days_in_month) || 30

  // Watermark settings (passed from UI)
  if (d.watermark_enabled === undefined) d.watermark_enabled = true
  if (!d.watermark_text) d.watermark_text = 'CONFIDENTIAL'

  return d
}

function renderDocument(docType: string, formData: Record<string, any>, companyData?: CompanyConfig | null): string {
  const data = enrichData(docType, formData, companyData)
  switch (docType) {
    case 'payslip': return paySlipHTML(data)
    case 'salary_cert': return salaryCertHTML(data)
    case 'appointment': return appointmentHTML(data)
    case 'experience': return experienceHTML(data)
    case 'employment_cert': return employmentHTML(data)
    default: return ''
  }
}

export { renderDocument }
