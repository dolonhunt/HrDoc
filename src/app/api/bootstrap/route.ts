import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

const DEFAULT_EMPLOYEES = [
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
    nid: '9876543210123',
    mobile: '01712345678',
    email: 'ashfaq@company.com',
    status: 'active',
    ref_code: 'TBH-46077',
  },
]

export async function POST() {
  try {
    // 1. Seed Super Admin User
    const userCount = await db.user.count()
    if (userCount === 0) {
      const passwordHash = hashPassword('Admin123!')
      await db.user.create({
        data: {
          id: 'admin-default',
          email: 'admin@company.com',
          name: 'Super Admin',
          passwordHash,
          role: 'Super_Admin',
          companyId: 'default',
        },
      })
      console.log('Seeded default admin user')
    }

    // 2. Seed Company Settings
    const companyCount = await db.companySetting.count()
    if (companyCount === 0) {
      await db.companySetting.create({
        data: {
          id: 'default',
          name: 'Beyond Headlines',
          address: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D, Niketon, Gulshan-1, Dhaka-1212, Bangladesh.',
          phone: '+880-2-9876543',
          email: 'info@beyondheadlines.com',
          proprietorName: 'Saqib Ahmed',
          proprietorDesignation: 'Proprietor',
          brandColor: '#6C63FF',
          logoPath: 'https://i.postimg.cc/WzcZTHwj/Logo-nobg.png',
        },
      })
      console.log('Seeded default company settings')
    }

    // 3. Seed Default Employees
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
      console.log('Seeded default employees')
    }

    // 4. Seed Default Letterhead Profile
    const letterheadCount = await db.letterheadProfile.count()
    if (letterheadCount === 0) {
      await db.letterheadProfile.create({
        data: {
          name: 'Official 2025',
          isDefault: true,
          companyName: 'Beyond Headlines',
          logoPath: 'https://i.postimg.cc/WzcZTHwj/Logo-nobg.png',
          tagline: 'Delivering the Truth, Beyond Headlines',
          address1: 'Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D',
          address2: 'Niketon, Gulshan-1, Dhaka-1212, Bangladesh',
          phone: '+880-2-9876543',
          email: 'info@beyondheadlines.com',
          website: 'www.beyondheadlines.com',
          headerLayout: 'LogoLeft',
          headerBgColor: '#FFFFFF',
          accentColor: '#6C63FF',
          footerText: 'Confidential — For Internal and Official Use Only',
          footerLayout: 'TextOnly',
          paperSize: 'A4',
          marginTop: 15,
          marginBottom: 15,
          marginLeft: 15,
          marginRight: 15,
        },
      })
      console.log('Seeded default letterhead')
    }

    // 5. Seed Default Signatory
    const signatoryCount = await db.signatory.count()
    if (signatoryCount === 0) {
      await db.signatory.create({
        data: {
          name: 'Saqib Ahmed',
          title: 'Proprietor',
          department: 'Executive Office',
          method: 'type',
          signatureData: 'Saqib Ahmed',
          typedFont: 'Cursive',
          typedText: 'Saqib Ahmed',
          sealPath: '',
          email: 'saqib@beyondheadlines.com',
        },
      })
      console.log('Seeded default signatory')
    }

    // 6. Seed Preference Settings
    const preferenceCount = await db.preference.count()
    if (preferenceCount === 0) {
      await db.preference.create({
        data: {
          id: 'default',
          language: 'en',
          dateFormat: 'DD/MM/YYYY',
          theme: 'dark',
          exportFormat: 'pdf',
          autoSaveDrafts: true,
        },
      })
      console.log('Seeded default preferences')
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Bootstrap failed:', error)
    return NextResponse.json({ error: 'Bootstrap failed' }, { status: 500 })
  }
}
