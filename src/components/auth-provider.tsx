'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  refresh: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        if (data.authenticated) {
          setUser(data.user)
        } else {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  // Handle route protection redirects
  useEffect(() => {
    if (loading) return

    const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(pathname)

    if (!user && !isAuthRoute) {
      router.push('/login')
    } else if (user && isAuthRoute) {
      router.push('/dashboard')
    }
  }, [user, loading, pathname, router])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const refresh = async () => {
    await checkUser()
  }

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#09090F] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#6C63FF] animate-spin" />
        <span className="text-xs text-[#6B6B8A] tracking-wider uppercase font-semibold">Checking session...</span>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
