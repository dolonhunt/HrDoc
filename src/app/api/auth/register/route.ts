import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { name, email, companyName, password, confirmPassword } = await req.json()

    // 1. Validations
    if (!name?.trim() || !email?.trim() || !companyName?.trim() || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Password strength check: min 8 characters, 1 uppercase letter, 1 number
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 })
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one uppercase letter' }, { status: 400 })
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json({ error: 'Password must contain at least one number' }, { status: 400 })
    }

    // Password matching
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 })
    }

    // 2. Hash password & create user
    const passwordHash = hashPassword(password)
    
    // Create database records within a transaction
    const result = await db.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          passwordHash,
          role: 'Super_Admin',
          companyId: 'default'
        }
      })

      // Setup company config if not present
      const companyCount = await tx.companySetting.count()
      if (companyCount === 0) {
        await tx.companySetting.create({
          data: {
            id: 'default',
            name: companyName.trim(),
            address: 'Head Office address details',
            phone: '',
            email: email.trim().toLowerCase(),
            proprietorName: name.trim(),
            proprietorDesignation: 'Founder & CEO',
            brandColor: '#6C63FF',
            logoPath: '/Logo-main.png'
          }
        })
      }

      return user
    })

    // 3. Generate token & response
    const tokenPayload = {
      id: result.id,
      email: result.email,
      name: result.name,
      role: result.role,
      companyId: result.companyId
    }
    const token = signToken(tokenPayload)

    // Set secure cookie
    const response = NextResponse.json({ success: true, user: { id: result.id, name: result.name, email: result.email, role: result.role } })
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
