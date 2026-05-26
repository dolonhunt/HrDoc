'use client'

import { useRouter } from 'next/navigation'
import { DashboardView } from '@/components/dashboard-view'
import { useWorkspace } from '@/components/workspace-provider'
import type { View } from '@/components/app-sidebar'

export default function DashboardPage() {
  const router = useRouter()
  const { employees, company, setSelectedEmpId } = useWorkspace()

  const handleNavigate = (view: View) => {
    if (view === 'dashboard') {
      router.push('/dashboard')
    } else if (view === 'employee_list') {
      router.push('/employees')
    } else if (view === 'history') {
      router.push('/documents/history')
    } else if (view === 'settings') {
      router.push('/settings/company')
    } else {
      router.push(`/documents/${view}`)
    }
  }

  const handleSelectEmployee = (id: string) => {
    setSelectedEmpId(id)
  }

  return (
    <DashboardView
      employees={employees}
      onNavigate={handleNavigate}
      onSelectEmployee={handleSelectEmployee}
      brandColor={company?.brand_color || '#6C63FF'}
    />
  )
}
