'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, Lock, Mail, User, Building, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shake, setShake] = useState(false)

  // Password strength calculation
  const [strength, setStrength] = useState(0)
  const [strengthText, setStrengthText] = useState('Weak')
  const [strengthColor, setStrengthColor] = useState('bg-[#FF4D6D]')

  useEffect(() => {
    if (!password) {
      setStrength(0)
      return
    }

    let score = 0
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    setStrength(score)

    if (score <= 2) {
      setStrengthText('Weak')
      setStrengthColor('bg-[#FF4D6D]')
    } else if (score <= 4) {
      setStrengthText('Medium')
      setStrengthColor('bg-[#F5A623]')
    } else {
      setStrengthText('Strong')
      setStrengthColor('bg-[#00D4AA]')
    }
  }, [password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShake(false)

    // Form validations
    if (!name.trim() || !email.trim() || !companyName.trim() || !password || !confirmPassword) {
      setError('All fields are required')
      setShake(true)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setShake(true)
      return
    }

    if (strength < 3) {
      setError('Please choose a stronger password (must contain numbers and capital letters)')
      setShake(true)
      return
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms & Privacy Policy')
      setShake(true)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, companyName, password, confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setShake(true)
        toast({
          title: 'Sign Up Failed',
          description: data.error || 'Failed to set up workspace.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Account Created!',
          description: 'Your workspace has been successfully initialized.',
        })
        // Redirect to company settings first, then dashboard
        router.push('/settings')
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
    <div className={`space-y-5 transition-transform duration-300 ${shake ? 'animate-shake' : ''}`}>
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Set up your HR workspace</h2>
        <p className="text-xs text-[#6B6B8A] mt-1">Get started with DocHR v3.0.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D] text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="relative group">
          <label className="absolute left-3 top-2.5 text-[10px] font-bold text-[#6B6B8A] uppercase tracking-wider transition-all duration-200 group-focus-within:text-[#6C63FF]">
            Full Name
          </label>
          <User className="absolute left-3.5 bottom-3 w-4 h-4 text-[#6B6B8A] group-focus-within:text-[#6C63FF] transition-colors" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            placeholder="Syed Ashfaqul Haque"
            className="w-full bg-[#1A1A26]/40 border-b border-white/[0.08] focus:border-[#6C63FF] outline-none pl-10 pr-4 pt-6 pb-2 text-[13px] text-white transition-all placeholder:text-[#6B6B8A]/40"
            required
          />
        </div>

        {/* Work Email */}
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
            placeholder="ashfaq@company.com"
            className="w-full bg-[#1A1A26]/40 border-b border-white/[0.08] focus:border-[#6C63FF] outline-none pl-10 pr-4 pt-6 pb-2 text-[13px] text-white transition-all placeholder:text-[#6B6B8A]/40"
            required
          />
        </div>

        {/* Company Name */}
        <div className="relative group">
          <label className="absolute left-3 top-2.5 text-[10px] font-bold text-[#6B6B8A] uppercase tracking-wider transition-all duration-200 group-focus-within:text-[#6C63FF]">
            Company Name
          </label>
          <Building className="absolute left-3.5 bottom-3 w-4 h-4 text-[#6B6B8A] group-focus-within:text-[#6C63FF] transition-colors" />
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={loading}
            placeholder="The Beyond Headlines"
            className="w-full bg-[#1A1A26]/40 border-b border-white/[0.08] focus:border-[#6C63FF] outline-none pl-10 pr-4 pt-6 pb-2 text-[13px] text-white transition-all placeholder:text-[#6B6B8A]/40"
            required
          />
        </div>

        {/* Password */}
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

        {/* Password Strength Meter */}
        {password && (
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6B6B8A]">
              <span>Password Strength</span>
              <span className="uppercase">{strengthText}</span>
            </div>
            <div className="h-1 w-full bg-[#1A1A26] rounded-full overflow-hidden flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-full flex-1 transition-all duration-300 ${
                    s <= strength ? strengthColor : 'bg-white/[0.05]'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative group">
          <label className="absolute left-3 top-2.5 text-[10px] font-bold text-[#6B6B8A] uppercase tracking-wider transition-all duration-200 group-focus-within:text-[#6C63FF]">
            Confirm Password
          </label>
          <Lock className="absolute left-3.5 bottom-3 w-4 h-4 text-[#6B6B8A] group-focus-within:text-[#6C63FF] transition-colors" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            placeholder="••••••••"
            className="w-full bg-[#1A1A26]/40 border-b border-white/[0.08] focus:border-[#6C63FF] outline-none pl-10 pr-4 pt-6 pb-2 text-[13px] text-white transition-all placeholder:text-[#6B6B8A]/40"
            required
          />
        </div>

        {/* Terms and conditions */}
        <div className="flex items-start gap-2.5 pt-1 text-xs text-[#E8E8F4]/80">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded bg-[#1A1A26] border-white/10 text-[#6C63FF] focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 mt-0.5"
            required
          />
          <span className="leading-tight select-none">
            I agree to the{' '}
            <a href="#" className="text-[#6C63FF] hover:underline font-semibold">
              Terms of Service
            </a>{' '}
            &{' '}
            <a href="#" className="text-[#6C63FF] hover:underline font-semibold">
              Privacy Policy
            </a>
          </span>
        </div>

        {/* Create Account CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 mt-2 bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] hover:brightness-110 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden group"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-[-150%] group-hover:animate-shimmer"></div>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-1.5">
        <p className="text-xs text-[#6B6B8A]">
          Already have an account?{' '}
          <Link href="/login" className="text-[#6C63FF] hover:text-[#00D4AA] font-bold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
