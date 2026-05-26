import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const history = await db.documentHistory.findMany({
      orderBy: [{ createdAt: 'desc' }],
    })
    return NextResponse.json(history)
  } catch (error) {
    console.error('Failed to fetch history:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refNo, employeeId, employeeName, docType, generatedBy, status, content, watermarkText, signatoryId } = body

    if (!refNo || !employeeName || !docType) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const record = await db.documentHistory.upsert({
      where: { refNo },
      update: {
        status: status || 'Draft',
        content: content || '',
        watermarkText: watermarkText || '',
        signatoryId: signatoryId || '',
      },
      create: {
        refNo,
        employeeId: employeeId || '',
        employeeName,
        docType,
        generatedBy: generatedBy || 'Super Admin',
        status: status || 'Draft',
        content: content || '',
        watermarkText: watermarkText || '',
        signatoryId: signatoryId || '',
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('Failed to save history:', error)
    return NextResponse.json({ error: 'Failed to save history' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      // Clear all
      await db.documentHistory.deleteMany({})
      return NextResponse.json({ ok: true })
    }

    await db.documentHistory.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete history:', error)
    return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 })
  }
}
