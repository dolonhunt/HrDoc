'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Lock, Mail, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShake(false)

    if (!email.trim() || !password) {
      setError('Email and password are required')
      setShake(true)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid credentials')
        setShake(true)
        toast({
          title: 'Login Failed',
          description: data.error || 'Invalid email or password.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Welcome Back!',
          description: 'Successfully signed in to your HR workspace.',
        })
        // Redirect to dashboard
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setError('A connection error occurred. Please try again.')
      setShake(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`space-y-6 transition-transform duration-300 ${shake ? 'animate-shake' : ''}`}>
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
        <p className="text-xs text-[#6B6B8A] mt-1.5">Sign in to your DocHR workspace.</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D] text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="relative group">
          <label className="absolute left-3 top-2.5 text-[10px] font-bold text-[#6B6B8A] uppercase tracking-wider transition-all duration-200 group-focus-within:text-[#6C63FF]">
            Work Email
          </label>
          <Mail className="absolute left-3.5 bottom-3 w-4 h-4 text-[#6B6B8A] group-focus-within:text-[#6C63FF] transition-colors" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="name@company.com"
            className="w-full bg-[#1A1A26]/40 border-b border-white/[0.08] focus:border-[#6C63FF] outline-none pl-10 pr-4 pt-6 pb-2 text-[13px] text-white transition-all placeholder:text-[#6B6B8A]/40"
            required
          />
        </div>

        {/* Password Field */}
        <div className="relative group">
          <label className="absolute left-3 top-2.5 text-[10px] font-bold text-[#6B6B8A] uppercase tracking-wider transition-all duration-200 group-focus-within:text-[#6C63FF]">
            Password
          </label>
          <Lock className="absolute left-3.5 bottom-3 w-4 h-4 text-[#6B6B8A] group-focus-within:text-[#6C63FF] transition-colors" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="••••••••"
            className="w-full bg-[#1A1A26]/40 border-b border-white/[0.08] focus:border-[#6C63FF] outline-none pl-10 pr-10 pt-6 pb-2 text-[13px] text-white transition-all placeholder:text-[#6B6B8A]/40"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 bottom-2.5 text-[#6B6B8A] hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer group text-[#E8E8F4]/80">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-[#1A1A26] border-white/10 text-[#6C63FF] focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
            />
            <span className="group-hover:text-white transition-colors">Remember me</span>
          </label>
          
          <Link href="/forgot-password" className="text-[#6C63FF] hover:text-[#00D4AA] font-semibold transition-colors">
            Forgot Password?
          </Link>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 mt-2 bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] hover:brightness-110 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden group"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              {/* Shimmer effect overlay */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-[-150%] group-hover:animate-shimmer"></div>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-[#6B6B8A]">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#6C63FF] hover:text-[#00D4AA] font-bold transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
