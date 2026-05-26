'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Building2, FileText, Signature, Users, Settings } from 'lucide-react'
import { useWorkspace } from '@/components/workspace-provider'
import { cn } from '@/lib/utils'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { company } = useWorkspace()
  const brandColor = company?.brand_color || '#6C63FF'

  const tabs = [
    { id: 'company', label: 'Company Profile', path: '/settings/company', icon: <Building2 className="w-4 h-4" /> },
    { id: 'letterhead', label: 'Letterhead Manager', path: '/settings/letterhead', icon: <FileText className="w-4 h-4" /> },
    { id: 'signatories', label: 'Signatories', path: '/settings/signatories', icon: <Signature className="w-4 h-4" /> },
    { id: 'users', label: 'User Roles', path: '/settings/users', icon: <Users className="w-4 h-4" /> },
    { id: 'preferences', label: 'Preferences', path: '/settings/preferences', icon: <Settings className="w-4 h-4" /> },
  ]

  return (
    <div className="flex-1 bg-muted/20 flex flex-col overflow-hidden">
      {/* Top Header */}
      <div className="h-14 border-b border-border bg-background flex items-center px-6 flex-shrink-0">
        <h2 className="text-[15px] font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5" style={{ color: brandColor }} />
          System Settings
        </h2>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Sub-Sidebar */}
        <aside className="w-56 border-r border-border bg-background flex-shrink-0 py-4 px-2 space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.path
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-all text-left relative overflow-hidden group",
                  isActive
                    ? "text-foreground font-semibold bg-accent border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40 border border-transparent"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor }} />
                )}
                <span className={isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </aside>

        {/* Settings Active View Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
          {children}
        </main>
      </div>
    </div>
  )
}
