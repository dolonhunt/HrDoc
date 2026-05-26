"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Users, Receipt, DollarSign, Briefcase, Award, BadgeCheck,
  Settings, ChevronDown, LayoutDashboard, FileText, UserPlus,
  MailCheck, ShieldAlert, Ban, DoorOpen, ArrowUpCircle, Calendar,
  PenTool, ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export type View =
  | 'dashboard'
  | 'employee_list'
  | 'settings'
  | 'history'
  // Document types
  | 'offer_letter'
  | 'appointment'
  | 'joining_letter'
  | 'probation_confirm'
  | 'id_card_letter'
  | 'employment_cert'
  | 'salary_cert'
  | 'noc_cert'
  | 'bank_intro'
  | 'embassy_support'
  | 'payslip'
  | 'salary_increment'
  | 'bonus_letter'
  | 'arrear_letter'
  | 'show_cause'
  | 'warning_letter'
  | 'suspension_letter'
  | 'termination_letter'
  | 'resignation_accept'
  | 'experience'
  | 'relieving_letter'
  | 'clearance_cert'
  | 'final_settlement'
  | 'promotion_letter'
  | 'pip_letter'
  | 'appreciation_letter'
  | 'leave_approval'
  | 'lwp_notice'
  | 'custom_freeform'
  | 'custom_builder'

export type DocType = Exclude<View, 'dashboard' | 'employee_list' | 'settings' | 'history'>

export interface DocTypeMeta {
  key: DocType
  label: string
  icon: React.ReactNode
  desc: string
}

export interface DocCategory {
  title: string
  items: DocTypeMeta[]
}

export const DOC_CATEGORIES: DocCategory[] = [
  {
    title: "Hiring & Onboarding",
    items: [
      { key: 'offer_letter', label: 'Offer Letter', icon: <Briefcase className="w-3.5 h-3.5" />, desc: 'Job offer details' },
      { key: 'appointment', label: 'Appointment Letter', icon: <Briefcase className="w-3.5 h-3.5" />, desc: 'Employment contract letter' },
      { key: 'joining_letter', label: 'Joining Letter', icon: <UserPlus className="w-3.5 h-3.5" />, desc: 'Employee joining acknowledgment' },
      { key: 'probation_confirm', label: 'Probation Confirmation', icon: <BadgeCheck className="w-3.5 h-3.5" />, desc: 'Probation pass confirmation' },
      { key: 'id_card_letter', label: 'ID Card Letter', icon: <BadgeCheck className="w-3.5 h-3.5" />, desc: 'ID Card request form' },
    ]
  },
  {
    title: "Employment Proof",
    items: [
      { key: 'employment_cert', label: 'Employment Cert.', icon: <BadgeCheck className="w-3.5 h-3.5" />, desc: 'Proof of current employment' },
      { key: 'salary_cert', label: 'Salary Certificate', icon: <DollarSign className="w-3.5 h-3.5" />, desc: 'Salary structure confirmation' },
      { key: 'noc_cert', label: 'NOC Letter', icon: <MailCheck className="w-3.5 h-3.5" />, desc: 'No Objection Certificate' },
      { key: 'bank_intro', label: 'Bank Introduction', icon: <DollarSign className="w-3.5 h-3.5" />, desc: 'Bank account opening intro' },
      { key: 'embassy_support', label: 'Embassy Support', icon: <MailCheck className="w-3.5 h-3.5" />, desc: 'Visa application support' },
    ]
  },
  {
    title: "Payroll & Compensation",
    items: [
      { key: 'payslip', label: 'Pay Slip', icon: <Receipt className="w-3.5 h-3.5" />, desc: 'Monthly payment voucher' },
      { key: 'salary_increment', label: 'Salary Increment', icon: <ArrowUpCircle className="w-3.5 h-3.5" />, desc: 'Salary appraisal letter' },
      { key: 'bonus_letter', label: 'Bonus / Ex-Gratia', icon: <Receipt className="w-3.5 h-3.5" />, desc: 'Festival bonus award letter' },
      { key: 'arrear_letter', label: 'Arrear Payment', icon: <Receipt className="w-3.5 h-3.5" />, desc: 'Outstanding arrear adjustments' },
    ]
  },
  {
    title: "Disciplinary Actions",
    items: [
      { key: 'show_cause', label: 'Show Cause Notice', icon: <ShieldAlert className="w-3.5 h-3.5" />, desc: 'Explanation request notice' },
      { key: 'warning_letter', label: 'Warning Letter', icon: <ShieldAlert className="w-3.5 h-3.5" />, desc: 'Formal conduct warning' },
      { key: 'suspension_letter', label: 'Suspension Letter', icon: <Ban className="w-3.5 h-3.5" />, desc: 'Inquiry suspension notice' },
      { key: 'termination_letter', label: 'Termination Letter', icon: <Ban className="w-3.5 h-3.5" />, desc: 'Service release letter' },
    ]
  },
  {
    title: "Separation",
    items: [
      { key: 'resignation_accept', label: 'Resignation Acceptance', icon: <DoorOpen className="w-3.5 h-3.5" />, desc: 'Resignation approval' },
      { key: 'experience', label: 'Experience Letter', icon: <Award className="w-3.5 h-3.5" />, desc: 'Past work proof certificate' },
      { key: 'relieving_letter', label: 'Relieving Letter', icon: <DoorOpen className="w-3.5 h-3.5" />, desc: 'Official release notification' },
      { key: 'clearance_cert', label: 'Clearance Certificate', icon: <BadgeCheck className="w-3.5 h-3.5" />, desc: 'Departmental clearance release' },
      { key: 'final_settlement', label: 'F&F Settlement', icon: <Receipt className="w-3.5 h-3.5" />, desc: 'Full & Final payment statement' },
    ]
  },
  {
    title: "Performance",
    items: [
      { key: 'promotion_letter', label: 'Promotion Letter', icon: <ArrowUpCircle className="w-3.5 h-3.5" />, desc: 'Grade promotion notification' },
      { key: 'pip_letter', label: 'PIP Letter', icon: <ShieldAlert className="w-3.5 h-3.5" />, desc: 'Performance improvement plan' },
      { key: 'appreciation_letter', label: 'Appreciation Letter', icon: <Award className="w-3.5 h-3.5" />, desc: 'Merit recognition certificate' },
    ]
  },
  {
    title: "Leave & Attendance",
    items: [
      { key: 'leave_approval', label: 'Leave Approval', icon: <Calendar className="w-3.5 h-3.5" />, desc: 'Approved leave request' },
      { key: 'lwp_notice', label: 'LWP Notice', icon: <Calendar className="w-3.5 h-3.5" />, desc: 'Leave Without Pay notice' },
    ]
  },
  {
    title: "Custom Templates",
    items: [
      { key: 'custom_freeform', label: 'Free-form Letter', icon: <PenTool className="w-3.5 h-3.5" />, desc: 'Blank slate with template tokens' },
      { key: 'custom_builder', label: 'Template Builder', icon: <PenTool className="w-3.5 h-3.5" />, desc: 'Clause block layout builder' },
    ]
  }
]

// Flattened document type meta helper
export const DOC_TYPES: DocTypeMeta[] = DOC_CATEGORIES.flatMap(cat => cat.items)

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
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    "Hiring & Onboarding": true,
    "Employment Proof": false,
    "Payroll & Compensation": false,
  })

  const toggleCategory = (title: string) => {
    setOpenCategories(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const isDocActive = (key: DocType) => view === key

  return (
    <aside className="w-60 flex-shrink-0 bg-gradient-to-b from-sidebar/90 to-background border-r border-border flex flex-col overflow-hidden">
      {/* Brand Header */}
      <div className="px-4 py-3 border-b border-border/60 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: brandColor || '#6C63FF' }}
          >
            <span className="text-white font-extrabold text-sm">
              {companyName ? companyName.charAt(0).toUpperCase() : 'D'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[13px] font-bold text-sidebar-foreground leading-tight truncate">{companyName || 'DocHR'}</h1>
            <p className="text-[9px] text-muted-foreground leading-tight tracking-wider uppercase font-semibold">HR Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation Scroll Panel */}
      <ScrollArea className="flex-1">
        <div className="py-3 px-2 space-y-1.5">

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
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor }} />
            )}
            <LayoutDashboard className={cn("w-4 h-4 transition-colors duration-200", view === 'dashboard' ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
            <span>Dashboard</span>
          </button>

          {/* Employees */}
          <div className="mb-1">
            <button
              onClick={() => setSidebarEmployeesOpen(!sidebarEmployeesOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-sidebar-accent/60 transition-all duration-200 text-left"
            >
              <span className="text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-[0.1em]">Employees</span>
              <div className={`transition-transform duration-300 ease-out ${sidebarEmployeesOpen ? 'rotate-0' : '-rotate-90'}`}>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </div>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-out ${sidebarEmployeesOpen ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pt-0.5">
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
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor }} />
                  )}
                  <Users className={cn("w-4 h-4 transition-colors duration-200", view === 'employee_list' ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
                  <span>Employee Directory</span>
                  {employeeCount > 0 && (
                    <span className="ml-auto text-[9px] bg-muted/80 px-1.5 py-0.5 rounded-full font-bold">{employeeCount}</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 my-1.5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Collapsible Document Categories */}
          <div className="space-y-1">
            <span className="px-3 py-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em] block">Compliance Letters</span>
            
            {DOC_CATEGORIES.map((cat) => {
              const isOpen = !!openCategories[cat.title]
              return (
                <div key={cat.title} className="space-y-0.5">
                  <button
                    onClick={() => toggleCategory(cat.title)}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-md hover:bg-sidebar-accent/40 text-left transition-colors"
                  >
                    <span className="text-[11px] font-semibold text-foreground/80">{cat.title}</span>
                    {isOpen ? (
                      <ChevronDown className="w-3 h-3 text-muted-foreground/70" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-muted-foreground/70" />
                    )}
                  </button>

                  <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out pl-2 border-l border-border/40 ml-4 space-y-0.5",
                    isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
                  )}>
                    {cat.items.map((item) => {
                      const active = isDocActive(item.key)
                      return (
                        <button
                          key={item.key}
                          onClick={() => onViewChange(item.key)}
                          className={cn(
                            "group w-full px-2.5 py-1.5 text-left text-[11.5px] flex items-center gap-2 rounded-md transition-all relative",
                            active
                              ? "text-sidebar-foreground font-semibold bg-sidebar-accent shadow-sm"
                              : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                          )}
                        >
                          <span className={active ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground"}>
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div className="mx-3 my-1.5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

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
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor }} />
            )}
            <FileText className={cn("w-4 h-4 transition-colors duration-200", view === 'history' ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
            <span>Document History</span>
          </button>

          {/* Settings */}
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
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: brandColor }} />
            )}
            <Settings className={cn("w-4 h-4 transition-colors duration-200", view === 'settings' ? 'text-sidebar-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground')} />
            <span>Workspace Settings</span>
          </button>
        </div>
      </ScrollArea>

      {/* Footer controls */}
      <div className="px-4 py-2.5 border-t border-border/60 flex-shrink-0 flex items-center justify-between">
        <p className="text-[9px] text-muted-foreground/60 font-medium tracking-wider">v3.0 • DocHR</p>
        <ThemeToggle />
      </div>
    </aside>
  )
}
