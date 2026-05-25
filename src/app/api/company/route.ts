import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { DEFAULT_COMPANY } from '@/lib/storage'

export async function GET() {
  try {
    const company = await db.companySetting.findUnique({ where: { id: 'default' } })
    if (!company) {
      return NextResponse.json(DEFAULT_COMPANY)
    }

    return NextResponse.json({
      name: company.name,
      address: company.address,
      phone: company.phone,
      email: company.email,
      proprietor_name: company.proprietorName,
      proprietor_designation: company.proprietorDesignation,
      brand_color: company.brandColor,
      logo_path: company.logoPath,
    })
  } catch (error) {
    console.error('Failed to fetch company:', error)
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      address,
      phone,
      email,
      proprietor_name,
      proprietor_designation,
      brand_color,
      logo_path,
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
    }

    await db.companySetting.upsert({
      where: { id: 'default' },
      update: {
        name: name.trim(),
        address: address || '',
        phone: phone || '',
        email: email || '',
        proprietorName: proprietor_name || '',
        proprietorDesignation: proprietor_designation || '',
        brandColor: brand_color || '#FF2109',
        logoPath: logo_path || '/Logo-main.png',
      },
      create: {
        id: 'default',
        name: name.trim(),
        address: address || '',
        phone: phone || '',
        email: email || '',
        proprietorName: proprietor_name || '',
        proprietorDesignation: proprietor_designation || '',
        brandColor: brand_color || '#FF2109',
        logoPath: logo_path || '/Logo-main.png',
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to save company:', error)
    return NextResponse.json({ error: 'Failed to save company settings' }, { status: 500 })
  }
}
