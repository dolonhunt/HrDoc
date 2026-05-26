import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const profiles = await db.letterheadProfile.findMany({ orderBy: [{ createdAt: 'asc' }] })
    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Failed to fetch letterheads:', error)
    return NextResponse.json({ error: 'Failed to fetch letterheads' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      isDefault,
      companyName,
      logoPath,
      tagline,
      address1,
      address2,
      phone,
      email,
      website,
      headerLayout,
      fullImageHeader,
      headerBgColor,
      accentColor,
      footerText,
      footerLayout,
      fullImageFooter,
      paperSize,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Profile name is required' }, { status: 400 })
    }

    // If setting as default, unset others first
    if (isDefault) {
      await db.letterheadProfile.updateMany({
        where: {},
        data: { isDefault: false },
      })
    }

    const profile = await db.letterheadProfile.create({
      data: {
        name: name.trim(),
        isDefault: !!isDefault,
        companyName: companyName || '',
        logoPath: logoPath || '',
        tagline: tagline || '',
        address1: address1 || '',
        address2: address2 || '',
        phone: phone || '',
        email: email || '',
        website: website || '',
        headerLayout: headerLayout || 'LogoLeft',
        fullImageHeader: fullImageHeader || '',
        headerBgColor: headerBgColor || '#FFFFFF',
        accentColor: accentColor || '#6C63FF',
        footerText: footerText || '',
        footerLayout: footerLayout || 'TextOnly',
        fullImageFooter: fullImageFooter || '',
        paperSize: paperSize || 'A4',
        marginTop: Number(marginTop) || 15,
        marginBottom: Number(marginBottom) || 15,
        marginLeft: Number(marginLeft) || 15,
        marginRight: Number(marginRight) || 15,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Failed to create letterhead profile:', error)
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      isDefault,
      companyName,
      logoPath,
      tagline,
      address1,
      address2,
      phone,
      email,
      website,
      headerLayout,
      fullImageHeader,
      headerBgColor,
      accentColor,
      footerText,
      footerLayout,
      fullImageFooter,
      paperSize,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Profile name is required' }, { status: 400 })
    }

    // If setting as default, unset others first
    if (isDefault) {
      await db.letterheadProfile.updateMany({
        where: { NOT: { id } },
        data: { isDefault: false },
      })
    }

    const profile = await db.letterheadProfile.update({
      where: { id },
      data: {
        name: name.trim(),
        isDefault: !!isDefault,
        companyName: companyName || '',
        logoPath: logoPath || '',
        tagline: tagline || '',
        address1: address1 || '',
        address2: address2 || '',
        phone: phone || '',
        email: email || '',
        website: website || '',
        headerLayout: headerLayout || 'LogoLeft',
        fullImageHeader: fullImageHeader || '',
        headerBgColor: headerBgColor || '#FFFFFF',
        accentColor: accentColor || '#6C63FF',
        footerText: footerText || '',
        footerLayout: footerLayout || 'TextOnly',
        fullImageFooter: fullImageFooter || '',
        paperSize: paperSize || 'A4',
        marginTop: Number(marginTop) || 15,
        marginBottom: Number(marginBottom) || 15,
        marginLeft: Number(marginLeft) || 15,
        marginRight: Number(marginRight) || 15,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Failed to update letterhead profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    await db.letterheadProfile.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete letterhead profile:', error)
    return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 })
  }
}
