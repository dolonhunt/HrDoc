import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DEFAULT_COMPANY, type Employee } from '@/lib/storage'

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    name: 'Syed Ashfaqul Haque',
    designation: 'Editor',
    department: 'Editorial',
    joining_date: '2025-10-01',
    basic: 150000,
    house_rent: 75000,
    conveyance: 30000,
    medical: 22500,
    food_mobile: 22500,
    cash: 143000,
    gross: 443000,
    tax: 43000,
    net: 400000,
    bank_account: 'Bank T/F',
    bank_name: '',
    nid: '',
    mobile: '',
    email: '',
    status: 'active',
    ref_code: 'TBH-46077',
  },
]

export async function POST() {
  try {
    const companyCount = await db.companySetting.count()
    if (companyCount === 0) {
      await db.companySetting.create({
        data: {
          id: 'default',
          name: DEFAULT_COMPANY.name,
          address: DEFAULT_COMPANY.address,
          phone: DEFAULT_COMPANY.phone,
          email: DEFAULT_COMPANY.email,
          proprietorName: DEFAULT_COMPANY.proprietor_name,
          proprietorDesignation: DEFAULT_COMPANY.proprietor_designation,
          brandColor: DEFAULT_COMPANY.brand_color,
          logoPath: DEFAULT_COMPANY.logo_path,
        },
      })
    }

    const employeeCount = await db.employee.count()
    if (employeeCount === 0) {
      await db.$transaction(
        DEFAULT_EMPLOYEES.map((e) =>
          db.employee.create({
            data: {
              id: e.id,
              name: e.name,
              designation: e.designation,
              department: e.department,
              joiningDate: e.joining_date,
              basic: e.basic,
              houseRent: e.house_rent,
              conveyance: e.conveyance,
              medical: e.medical,
              foodMobile: e.food_mobile,
              cash: e.cash,
              gross: e.gross,
              tax: e.tax,
              net: e.net,
              bankAccount: e.bank_account,
              bankName: e.bank_name,
              nid: e.nid,
              mobile: e.mobile,
              email: e.email,
              status: e.status,
              refCode: e.ref_code,
            },
          })
        )
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Bootstrap failed:', error)
    return NextResponse.json({ error: 'Bootstrap failed' }, { status: 500 })
  }
}
