'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    setLoading(true)

    // Simulate link sent
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#00D4AA]/10 text-[#00D4AA] flex items-center justify-center animate-scale-up">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Check your inbox</h2>
          <p className="text-xs text-[#6B6B8A] max-w-sm mx-auto leading-relaxed">
            We have sent a password reset link to <strong className="text-white">{email}</strong>. Please check your email to continue.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 text-xs text-[#6C63FF] hover:text-[#00D4AA] font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Reset password</h2>
        <p className="text-xs text-[#6B6B8A] mt-1.5">Enter your work email and we will send a password reset link.</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D] text-xs flex items-start gap-2">
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

        {/* CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 mt-2 bg-gradient-to-r from-[#6C63FF] to-[#00D4AA] hover:brightness-110 active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all cursor-pointer relative overflow-hidden group"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Reset Link</span>
              <div className="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-12 translate-x-[-150%] group-hover:animate-shimmer"></div>
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 text-xs text-[#6B6B8A] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  )
}
