'use client'

import { useState, useEffect, useCallback } from 'react'
import { AppSidebar, type View, type DocType } from '@/components/app-sidebar'
import { DashboardView } from '@/components/dashboard-view'
import { DocumentView } from '@/components/document-view'
import { EmployeeListView } from '@/components/employee-list-view'
import { SettingsView } from '@/components/settings-view'
import { HistoryView } from '@/components/history-view'
import { bootstrapStorage } from '@/lib/storage-api'
import { type Employee, type CompanyConfig } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
  const [view, setView] = useState<View>('dashboard')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [company, setCompany] = useState<CompanyConfig | null>(null)
  const [selectedEmpId, setSelectedEmpId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const loadData = useCallback(async () => {
    try {
      await bootstrapStorage()
      const [empsRes, coRes] = await Promise.all([
        fetch('/api/employees', { cache: 'no-store' }),
        fetch('/api/company', { cache: 'no-store' }),
      ])
      const emps = empsRes.ok ? await empsRes.json() : []
      const co = coRes.ok ? await coRes.json() : null
      setEmployees(emps)
      setCompany(co)
      if (emps.length > 0 && !selectedEmpId) setSelectedEmpId(emps[0].id)
    } catch {
      toast({ title: 'Error', description: 'Failed to load data.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [selectedEmpId, toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refreshEmployees = useCallback(async () => {
    try {
      const res = await fetch('/api/employees', { cache: 'no-store' })
      if (res.ok) {
        const emps = await res.json()
        setEmployees(emps)
        if (emps.length > 0 && !emps.find((e: Employee) => e.id === selectedEmpId)) {
          setSelectedEmpId(emps[0]?.id || '')
        } else if (emps.length === 0) {
          setSelectedEmpId('')
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to refresh employees.', variant: 'destructive' })
    }
  }, [selectedEmpId, toast])

  const handleCompanyUpdate = (updated: CompanyConfig) => {
    setCompany(updated)
  }

  const isDocView = ['payslip', 'salary_cert', 'appointment', 'experience', 'employment_cert'].includes(view)

  if (loading) {
    return (
      <div className="h-screen flex bg-background">
        <div className="w-60 flex-shrink-0 border-r border-border p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <div className="pt-4 space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          view={view}
          onViewChange={setView}
          employeeCount={employees.length}
          companyName={company?.name || 'DocHR'}
          brandColor={company?.brand_color || '#FF2109'}
          logoPath={company?.logo_path || '/Logo-main.png'}
        />

        <div className="flex-1 flex overflow-hidden">
          {view === 'dashboard' && (
            <DashboardView
              employees={employees}
              onNavigate={setView}
              onSelectEmployee={setSelectedEmpId}
              brandColor={company?.brand_color || '#FF2109'}
            />
          )}

          {isDocView && (
            <DocumentView
              view={view as DocType}
              employees={employees}
              company={company}
              selectedEmpId={selectedEmpId}
              onSelectEmployee={setSelectedEmpId}
              brandColor={company?.brand_color || '#FF2109'}
            />
          )}

          {view === 'employee_list' && (
            <EmployeeListView
              employees={employees}
              brandColor={company?.brand_color || '#FF2109'}
              onUpdate={refreshEmployees}
              onSelectEmployee={setSelectedEmpId}
              onNavigate={setView}
            />
          )}

          {view === 'settings' && company && (
            <SettingsView
              company={company}
              onUpdate={handleCompanyUpdate}
              brandColor={company?.brand_color || '#FF2109'}
            />
          )}

          {view === 'history' && (
            <HistoryView brandColor={company?.brand_color || '#FF2109'} />
          )}
        </div>
      </div>
    </div>
  )
}
