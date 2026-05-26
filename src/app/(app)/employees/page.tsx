'use client'

import { useRouter } from 'next/navigation'
import { EmployeeListView } from '@/components/employee-list-view'
import { useWorkspace } from '@/components/workspace-provider'
import type { View } from '@/components/app-sidebar'

export default function EmployeesPage() {
  const router = useRouter()
  const { employees, company, setSelectedEmpId, refreshEmployees } = useWorkspace()

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
    <EmployeeListView
      employees={employees}
      brandColor={company?.brand_color || '#6C63FF'}
      onUpdate={refreshEmployees}
      onSelectEmployee={handleSelectEmployee}
      onNavigate={handleNavigate}
    />
  )
}
