"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users, Receipt, DollarSign, Briefcase, Award, BadgeCheck,
  TrendingUp, FileText, Plus, ArrowRight
} from "lucide-react"
import type { Employee } from "@/lib/storage"
import type { View, DocType } from "./app-sidebar"

interface DashboardViewProps {
  employees: Employee[]
  onNavigate: (view: View) => void
  onSelectEmployee: (id: string) => void
  brandColor: string
}

export function DashboardView({ employees, onNavigate, onSelectEmployee, brandColor }: DashboardViewProps) {
  const activeEmployees = employees.filter(e => e.status === 'active')
  const totalPayroll = activeEmployees.reduce((sum, e) => sum + (e.gross || 0), 0)

  const docCards: { key: DocType; label: string; icon: React.ReactNode; desc: string; count?: number }[] = [
    { key: 'payslip', label: 'Pay Slips', icon: <Receipt className="w-5 h-5" />, desc: 'Monthly salary slips' },
    { key: 'salary_cert', label: 'Salary Certs', icon: <DollarSign className="w-5 h-5" />, desc: 'Verification letters' },
    { key: 'appointment', label: 'Appointments', icon: <Briefcase className="w-5 h-5" />, desc: 'Offer letters' },
    { key: 'experience', label: 'Experience', icon: <Award className="w-5 h-5" />, desc: 'Work proof letters' },
    { key: 'employment_cert', label: 'Employment', icon: <BadgeCheck className="w-5 h-5" />, desc: 'Current employment proof' },
  ]

  const recentEmployees = [...employees].sort((a, b) => {
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  }).slice(0, 5)

  return (
    <div className="flex-1 bg-muted/30 flex flex-col overflow-hidden">
      <div className="h-14 border-b border-border bg-background flex items-center px-6 flex-shrink-0">
        <h2 className="text-[15px] font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5" style={{ color: brandColor }} />
          Dashboard
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4" /> Total Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
                <p className="text-[11px] text-muted-foreground mt-1">{activeEmployees.length} active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Monthly Payroll
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳{(totalPayroll / 100000).toFixed(1)}L</div>
                <p className="text-[11px] text-muted-foreground mt-1">Gross total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Document Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-[11px] text-muted-foreground mt-1">PDF + DOCX export</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Avg. Net Salary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ৳{activeEmployees.length > 0
                    ? Math.round(activeEmployees.reduce((s, e) => s + (e.net || 0), 0) / activeEmployees.length).toLocaleString('en-IN')
                    : '0'}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Per employee</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Quick Links */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Generate Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docCards.map(doc => (
                  <button
                    key={doc.key}
                    onClick={() => onNavigate(doc.key)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:bg-accent hover:border-accent transition-all duration-200 text-left group"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white transition-transform duration-200 group-hover:scale-110"
                      style={{ background: brandColor }}
                    >
                      {doc.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground">{doc.label}</p>
                      <p className="text-[11px] text-muted-foreground">{doc.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Employees */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Recent Employees
                </h3>
                <Button variant="ghost" size="sm" className="h-6 text-[11px] gap-1" onClick={() => onNavigate('employee_list')}>
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  {recentEmployees.length === 0 ? (
                    <div className="p-6 text-center">
                      <Users className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-[12px] text-muted-foreground">No employees yet</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 gap-1 text-[11px]"
                        onClick={() => onNavigate('employee_list')}
                      >
                        <Plus className="w-3 h-3" /> Add Employee
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {recentEmployees.map(emp => (
                        <button
                          key={emp.id}
                          onClick={() => { onSelectEmployee(emp.id); onNavigate('payslip'); }}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent/50 transition-colors"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold"
                            style={{ background: brandColor }}
                          >
                            {emp.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-foreground truncate">{emp.name}</p>
                            <p className="text-[11px] text-muted-foreground">{emp.designation}</p>
                          </div>
                          <span className="text-[11px] font-medium text-foreground">৳{(emp.net || 0).toLocaleString('en-IN')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
