import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ createdAt: 'desc' }],
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, password } = body

    if (!email || !email.trim() || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
    }

    const existing = await db.user.findUnique({ where: { email: email.trim().toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Default password if not provided
    const defaultPassword = password || 'User123!'
    const passwordHash = hashPassword(defaultPassword)

    const user = await db.user.create({
      data: {
        name: name?.trim() || 'Invited User',
        email: email.trim().toLowerCase(),
        role: role,
        passwordHash,
        companyId: 'default',
      },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error('Failed to create user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Protect default admin from deletion
    if (id === 'admin-default') {
      return NextResponse.json({ error: 'Cannot delete default Super Admin account' }, { status: 400 })
    }

    await db.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to delete user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
