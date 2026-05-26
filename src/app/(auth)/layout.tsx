import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#09090F] text-[#E8E8F4] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Mesh Gradient */}
      <div className="absolute inset-0 bg-radial-mesh opacity-20 pointer-events-none z-0"></div>
      
      {/* Split layout wrapper */}
      <div className="w-full max-w-5xl bg-[#111118]/40 border border-white/[0.07] backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] z-10">
        {/* Left Panel: Branding and Animated Floating Docs */}
        <div className="w-full md:w-1/2 bg-gradient-to-tr from-[#6C63FF] via-[#3a35ab] to-[#00D4AA] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-auto">
          {/* Decorative mesh/circle */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none"></div>

          {/* App Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
              <span className="text-white font-extrabold text-lg tracking-wider">D</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">DocHR</h1>
              <p className="text-[10px] text-white/70 tracking-wider uppercase font-semibold">v3.0 Enterprise</p>
            </div>
          </div>

          {/* Center Graphic: Floating Docs */}
          <div className="my-auto py-12 flex flex-col items-center justify-center relative min-h-[220px]">
            {/* Animated card 1 */}
            <div className="absolute w-[220px] bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg transform -rotate-12 -translate-x-12 translate-y-4 animate-float-slow">
              <div className="w-8 h-8 rounded-lg bg-white/10 mb-3 flex items-center justify-center text-white">✍️</div>
              <div className="h-2 w-2/3 bg-white/20 rounded mb-2"></div>
              <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
              <div className="h-2 w-1/2 bg-white/10 rounded"></div>
            </div>

            {/* Animated card 2 (center, glowing) */}
            <div className="absolute w-[220px] bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-2xl z-10 transform rotate-6 translate-x-10 -translate-y-4 animate-float-fast">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 mb-3 flex items-center justify-center text-emerald-300">📄</div>
              <div className="h-2 w-1/2 bg-emerald-300/30 rounded mb-2"></div>
              <div className="h-2 w-full bg-white/20 rounded mb-2"></div>
              <div className="h-2 w-4/5 bg-white/10 rounded"></div>
            </div>
          </div>

          {/* Slogan */}
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-white leading-snug">Generate documents instantly.</h2>
            <p className="text-xs text-white/80 mt-2 font-medium">Compliance-first templates built for Bangladesh payroll and recruitment workflows.</p>
          </div>
        </div>

        {/* Right Panel: Content Form */}
        <div className="w-full md:w-1/2 bg-[#0D0D14] p-8 md:p-12 flex flex-col justify-center relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}
