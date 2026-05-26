import crypto from 'crypto'
import { NextRequest } from 'next/server'

// Get secure session secret
function getSecret(): string {
  if (process.env.SESSION_SECRET) {
    return process.env.SESSION_SECRET
  }
  // Generate random ephemeral key in case of missing environment config, warning in log
  console.warn("Generating ephemeral session secret. User sessions will invalidate on server restart.")
  return crypto.randomBytes(64).toString('hex')
}

const SECRET = getSecret()

/**
 * Hash a password using scrypt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verify a password against a stored scrypt hash
 */
export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, originalHash] = stored.split(':')
    if (!salt || !originalHash) return false
    const hash = crypto.scryptSync(password, salt, 64).toString('hex')
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'))
  } catch {
    return false
  }
}

/**
 * Sign a token payload with HMAC-SHA256
 */
export function signToken(payload: any, expiresInDays: number = 7): string {
  const expiresAt = Date.now() + expiresInDays * 24 * 60 * 60 * 1000
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const claims = Buffer.from(JSON.stringify({ ...payload, exp: expiresAt })).toString('base64url')
  
  const hmac = crypto.createHmac('sha256', SECRET)
  hmac.update(`${header}.${claims}`)
  const signature = hmac.digest('base64url')
  
  return `${header}.${claims}.${signature}`
}

/**
 * Verify and decode a token
 */
export function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const [header, claims, signature] = parts
    const hmac = crypto.createHmac('sha256', SECRET)
    hmac.update(`${header}.${claims}`)
    const expectedSignature = hmac.digest('base64url')
    
    if (signature !== expectedSignature) return null
    
    const decodedClaims = JSON.parse(Buffer.from(claims, 'base64url').toString('utf8'))
    
    if (decodedClaims.exp && decodedClaims.exp < Date.now()) {
      return null // Expired
    }
    
    return decodedClaims
  } catch {
    return null
  }
}

/**
 * Extract and verify token from request cookies
 */
export function getUserFromRequest(req: NextRequest): { id: string; email: string; name: string; role: string } | null {
  try {
    const cookie = req.cookies.get('__Host-session') || req.cookies.get('session')
    if (!cookie?.value) return null
    return verifyToken(cookie.value)
  } catch {
    return null
  }
}
