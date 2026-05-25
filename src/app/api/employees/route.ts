import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { Employee } from '@/lib/storage'

function toEmployee(row: Awaited<ReturnType<typeof db.employee.findFirst>>): Employee {
  if (!row) {
    throw new Error('Employee row missing')
  }
  return {
    id: row.id,
    name: row.name,
    designation: row.designation,
    department: row.department,
    joining_date: row.joiningDate,
    basic: row.basic,
    house_rent: row.houseRent,
    conveyance: row.conveyance,
    medical: row.medical,
    food_mobile: row.foodMobile,
    cash: row.cash,
    gross: row.gross,
    tax: row.tax,
    net: row.net,
    bank_account: row.bankAccount,
    bank_name: row.bankName,
    nid: row.nid,
    mobile: row.mobile,
    email: row.email,
    status: row.status as Employee['status'],
    ref_code: row.refCode,
  }
}

export async function GET() {
  try {
    const rows = await db.employee.findMany({ orderBy: [{ id: 'asc' }] })
    return NextResponse.json(rows.map((row) => toEmployee(row)))
  } catch (error) {
    console.error('Failed to fetch employees:', error)
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = (await request.json()) as Employee
    if (!payload.id || !payload.name || !payload.designation) {
      return NextResponse.json({ error: 'Missing required employee fields' }, { status: 400 })
    }

    await db.employee.upsert({
      where: { id: payload.id },
      update: {
        name: payload.name,
        designation: payload.designation,
        department: payload.department,
        joiningDate: payload.joining_date,
        basic: payload.basic,
        houseRent: payload.house_rent,
        conveyance: payload.conveyance,
        medical: payload.medical,
        foodMobile: payload.food_mobile,
        cash: payload.cash,
        gross: payload.gross,
        tax: payload.tax,
        net: payload.net,
        bankAccount: payload.bank_account,
        bankName: payload.bank_name,
        nid: payload.nid,
        mobile: payload.mobile,
        email: payload.email,
        status: payload.status,
        refCode: payload.ref_code,
      },
      create: {
        id: payload.id,
        name: payload.name,
        designation: payload.designation,
        department: payload.department,
        joiningDate: payload.joining_date,
        basic: payload.basic,
        houseRent: payload.house_rent,
        conveyance: payload.conveyance,
        medical: payload.medical,
        foodMobile: payload.food_mobile,
        cash: payload.cash,
        gross: payload.gross,
        tax: payload.tax,
        net: payload.net,
        bankAccount: payload.bank_account,
        bankName: payload.bank_name,
        nid: payload.nid,
        mobile: payload.mobile,
        email: payload.email,
        status: payload.status,
        refCode: payload.ref_code,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to save employee:', error)
    return NextResponse.json({ error: 'Failed to save employee' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as { id?: string }
    if (!body.id) {
      return NextResponse.json({ error: 'Employee id is required' }, { status: 400 })
    }

    await db.employee.delete({ where: { id: body.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete employee:', error)
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 })
  }
}
