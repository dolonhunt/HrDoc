import { NextRequest, NextResponse } from 'next/server'
import { renderDocument } from '@/lib/templates/index'

const FALLBACK_DATA: Record<string, Record<string, any>> = {
  payslip: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000,
    medical: 22500, food_mobile: 22500, cash: 143000, tax: 43000,
    bank_account: 'Bank T/F', bank_name: '', month: 5, year: 2026,
    days_present: 30, days_in_month: 30,
  },
  salary_cert: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000,
    medical: 22500, food_mobile: 22500, cash: 143000, tax: 43000,
    cert_date: new Date().toISOString().split('T')[0], purpose: 'bank loan',
  },
  appointment: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000,
    medical: 22500, food_mobile: 22500, cash: 143000, tax: 43000,
    letter_date: '2025-09-22', probation_months: 3,
  },
  experience: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', leaving_date: '2026-01-31', letter_date: '2026-01-31',
  },
  employment_cert: {
    id: 'EMP001', employee_id: 'EMP001', ref_code: 'TBH-46077',
    name: 'Syed Ashfaqul Haque', designation: 'Editor', department: 'Editorial',
    joining_date: '2025-10-01', basic: 150000, house_rent: 75000, conveyance: 30000,
    medical: 22500, food_mobile: 22500, cash: 143000, tax: 43000,
    cert_date: new Date().toISOString().split('T')[0], purpose: 'visa application',
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const docType = searchParams.get('type') || 'payslip'
  const validTypes = ['payslip', 'salary_cert', 'appointment', 'experience', 'employment_cert']
  if (!validTypes.includes(docType)) {
    return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
  }
  const data = FALLBACK_DATA[docType] || FALLBACK_DATA.payslip
  const html = renderDocument(docType, data)
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const docType = body.type || 'payslip'
    const formData = body.data || {}
    const companyData = body.company || null
    const validTypes = ['payslip', 'salary_cert', 'appointment', 'experience', 'employment_cert']
    if (!validTypes.includes(docType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }
    const html = renderDocument(docType, formData, companyData)
    return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch (err) {
    console.error('Document render error:', err)
    return NextResponse.json({ error: 'Failed to render document' }, { status: 500 })
  }
}
