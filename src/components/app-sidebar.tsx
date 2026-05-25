"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Users, Receipt, DollarSign, Briefcase, Award, BadgeCheck,
  Settings, ChevronDown, LayoutDashboard, FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

export type View =
  | 'dashboard'
  | 'payslip'
  | 'salary_cert'
  | 'appointment'
  | 'experience'
  | 'employment_cert'
  | 'employee_list'
  | 'settings'
  | 'history'

export type DocType = 'payslip' | 'salary_cert' | 'appointment' | 'experience' | 'employment_cert'

export const DOC_TYPES: { key: DocType; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'payslip', label: 'Pay Slip', icon: <Receipt className="w-4 h-4" />, desc: 'Generate monthly pay slips' },
  { key: 'salary_cert', label: 'Salary Certificate', icon: <DollarSign className="w-4 h-4" />, desc: 'Salary verification letter' },
  { key: 'appointment', label: 'Appointment Letter', icon: <Briefcase className="w-4 h-4" />, desc: 'Employment offer letter' },
  { key: 'experience', label: 'Experience Letter', icon: <Award className="w-4 h-4" />, desc: 'Work experience proof' },
  { key: 'employment_cert', label: 'Employment Cert.', icon: <BadgeCheck className="w-4 h-4" />, desc: 'Current employment proof' },
]

interface AppSidebarProps {
  view: View
  onViewChange: (view: View) => void
  employeeCount: number
  companyName: string
  brandColor: string
  logoPath: string
}

export function AppSidebar({ view, onViewChange, employeeCount, companyName, brandColor, logoPath }: AppSidebarProps) {
  const [sidebarEmployeesOpen, setSidebarEmployeesOpen] = useState(true)
  const [sidebarDocsOpen, setSidebarDocsOpen] = useState(true)

  const isDocView = ['payslip', 'salary_cert', 'appointment', 'experience', 'employment_cert'].includes(view)

  return (
    <aside className="w-60 flex-shrink-0 bg-gradient-to-b from-sidebar/80 to-background border-r border-border flex flex-col overflow-hidden">
      {/* Brand */}
      <div className="px-4 py-3 border-b border-border/60 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: brandColor || '#FF2109' }}
          >
            <span className="text-white font-extrabold text-sm">
              {companyName ? companyName.charAt(0).toUpperCase() : 'D'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[13px] font-bold text-sidebar-foreground leading-tight truncate">{companyName || 'DocHR'}</h1>
            <p className="text-[10px] text-muted-foreground leading-tight">HR Document Generator</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="py-3 px-2 space-y-1">

          {/* Dashboard */}
          <button
            onClick={() => onViewChange('dashboard')}
            className={cn(
              "group w-full px-3 py-2 text-left text-[12px] flex items-center gap-2.5 rounded-lg transition-all duration-200 relative overflow-hidden",
              view === 'dashboard'
                ? "text-sidebar-foreground font-semibold bg-sidebar-accent shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 border border-transparent"
            )}
          >
            {view === 'dashboard' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor || '#FF2109' }} />
            )}
            <LayoutDashboard className={cn("w-4 h-4 transition-colors duration-200", view === 'dashboard' ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
            <span>Dashboard</span>
          </button>

          {/* Divider */}
          <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* EMPLOYEES Section */}
          <div className="mb-1">
            <button
              onClick={() => setSidebarEmployeesOpen(!sidebarEmployeesOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sidebar-accent/60 transition-all duration-200"
            >
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">Employees</span>
              <div className={`transition-transform duration-300 ease-out ${sidebarEmployeesOpen ? 'rotate-0' : '-rotate-90'}`}>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-out ${sidebarEmployeesOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => onViewChange('employee_list')}
                  className={cn(
                    "group w-full px-3 py-2 text-left text-[12px] flex items-center gap-2.5 rounded-lg transition-all duration-200 relative overflow-hidden",
                    view === 'employee_list'
                      ? "text-sidebar-foreground font-semibold bg-sidebar-accent shadow-sm border border-border/80"
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 border border-transparent"
                  )}
                >
                  {view === 'employee_list' && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor || '#FF2109' }} />
                  )}
                  <Users className={cn("w-4 h-4 transition-colors duration-200", view === 'employee_list' ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
                  <span>Employee Directory</span>
                  {employeeCount > 0 && (
                    <span className="ml-auto text-[10px] bg-muted px-1.5 py-0.5 rounded-full font-medium">{employeeCount}</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* DOCUMENTS Section */}
          <div className="mb-1">
            <button
              onClick={() => setSidebarDocsOpen(!sidebarDocsOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sidebar-accent/60 transition-all duration-200"
            >
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">Documents</span>
              <div className={`transition-transform duration-300 ease-out ${sidebarDocsOpen ? 'rotate-0' : '-rotate-90'}`}>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-out ${sidebarDocsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-0.5 pt-0.5">
                {DOC_TYPES.map(doc => (
                  <button
                    key={doc.key}
                    onClick={() => onViewChange(doc.key)}
                    className={cn(
                      "group w-full px-3 py-2 text-left text-[12px] flex items-center gap-2.5 rounded-lg transition-all duration-200 relative overflow-hidden",
                      view === doc.key
                        ? "text-sidebar-foreground font-semibold bg-sidebar-accent shadow-sm border border-border/80"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 border border-transparent"
                    )}
                  >
                    {view === doc.key && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor || '#FF2109' }} />
                    )}
                    <span className={cn("transition-colors duration-200", view === doc.key ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')}>
                      {doc.icon}
                    </span>
                    <span className="truncate">{doc.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* History */}
          <button
            onClick={() => onViewChange('history')}
            className={cn(
              "group w-full px-3 py-2 text-left text-[12px] flex items-center gap-2.5 rounded-lg transition-all duration-200 relative overflow-hidden",
              view === 'history'
                ? "text-sidebar-foreground font-semibold bg-sidebar-accent shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 border border-transparent"
            )}
          >
            {view === 'history' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor || '#FF2109' }} />
            )}
            <FileText className={cn("w-4 h-4 transition-colors duration-200", view === 'history' ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
            <span>Document History</span>
          </button>

          {/* SETTINGS */}
          <button
            onClick={() => onViewChange('settings')}
            className={cn(
              "group w-full px-3 py-2 text-left text-[12px] flex items-center gap-2.5 rounded-lg transition-all duration-200 relative overflow-hidden",
              view === 'settings'
                ? "text-sidebar-foreground font-semibold bg-sidebar-accent shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/60 border border-transparent"
            )}
          >
            {view === 'settings' && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor || '#FF2109' }} />
            )}
            <Settings className={cn("w-4 h-4 transition-colors duration-200", view === 'settings' ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
            <span>Settings</span>
          </button>
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="px-4 py-3 border-t border-border/60 flex-shrink-0 flex items-center justify-between">
        <p className="text-[9px] text-muted-foreground/60 font-medium tracking-wider">v2.0 • DocHR</p>
        <ThemeToggle />
      </div>
    </aside>
  )
}
