'use client'

import { useRouter, usePathname } from 'next/navigation'
import { AppSidebar, type View } from '@/components/app-sidebar'
import { WorkspaceProvider, useWorkspace } from '@/components/workspace-provider'
import { Skeleton } from '@/components/ui/skeleton'

function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { employees, company, loading } = useWorkspace()

  // Map route pathname to sidebar View key
  const getViewFromPathname = (path: string): View => {
    if (path.startsWith('/dashboard')) return 'dashboard'
    if (path.startsWith('/employees')) return 'employee_list'
    if (path.startsWith('/documents/history')) return 'history'
    if (path.startsWith('/documents/')) return path.replace('/documents/', '') as View
    if (path.startsWith('/settings')) return 'settings'
    return 'dashboard'
  }

  const handleViewChange = (newView: View) => {
    if (newView === 'dashboard') {
      router.push('/dashboard')
    } else if (newView === 'employee_list') {
      router.push('/employees')
    } else if (newView === 'history') {
      router.push('/documents/history')
    } else if (newView === 'settings') {
      router.push('/settings/company')
    } else {
      router.push(`/documents/${newView}`)
    }
  }

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
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-center">
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

  const currentView = getViewFromPathname(pathname)

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          view={currentView}
          onViewChange={handleViewChange}
          employeeCount={employees.length}
          companyName={company?.name || 'DocHR'}
          brandColor={company?.brand_color || '#6C63FF'}
          logoPath={company?.logo_path || '/Logo-main.png'}
        />
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkspaceProvider>
      <AppLayoutShell>{children}</AppLayoutShell>
    </WorkspaceProvider>
  )
}
