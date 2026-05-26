import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const signatories = await db.signatory.findMany({ orderBy: [{ createdAt: 'asc' }] })
    return NextResponse.json(signatories)
  } catch (error) {
    console.error('Failed to fetch signatories:', error)
    return NextResponse.json({ error: 'Failed to fetch signatories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, title, department, method, signatureData, typedFont, typedText, sealPath, email } = body

    if (!name || !name.trim() || !title || !title.trim()) {
      return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 })
    }

    const signatory = await db.signatory.create({
      data: {
        name: name.trim(),
        title: title.trim(),
        department: department || '',
        method: method || 'draw',
        signatureData: signatureData || '',
        typedFont: typedFont || '',
        typedText: typedText || '',
        sealPath: sealPath || '',
        email: email || '',
      },
    })

    return NextResponse.json(signatory)
  } catch (error) {
    console.error('Failed to create signatory:', error)
    return NextResponse.json({ error: 'Failed to create signatory' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, title, department, method, signatureData, typedFont, typedText, sealPath, email } = body

    if (!id) {
      return NextResponse.json({ error: 'Signatory ID is required' }, { status: 400 })
    }
    if (!name || !name.trim() || !title || !title.trim()) {
      return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 })
    }

    const signatory = await db.signatory.update({
      where: { id },
      data: {
        name: name.trim(),
        title: title.trim(),
        department: department || '',
        method: method || 'draw',
        signatureData: signatureData || '',
        typedFont: typedFont || '',
        typedText: typedText || '',
        sealPath: sealPath || '',
        email: email || '',
      },
    })

    return NextResponse.json(signatory)
  } catch (error) {
    console.error('Failed to update signatory:', error)
    return NextResponse.json({ error: 'Failed to update signatory' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Signatory ID is required' }, { status: 400 })
    }

    await db.signatory.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete signatory:', error)
    return NextResponse.json({ error: 'Failed to delete signatory' }, { status: 500 })
  }
}
