'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Employee, CompanyConfig } from '@/lib/storage'
import { bootstrapStorage } from '@/lib/storage-api'
import { useToast } from '@/hooks/use-toast'

interface WorkspaceContextType {
  employees: Employee[]
  company: CompanyConfig | null
  selectedEmpId: string
  setSelectedEmpId: (id: string) => void
  refreshEmployees: () => Promise<void>
  updateCompany: (company: CompanyConfig) => void
  loading: boolean
}

const WorkspaceContext = createContext<WorkspaceContextType>({
  employees: [],
  company: null,
  selectedEmpId: '',
  setSelectedEmpId: () => {},
  refreshEmployees: async () => {},
  updateCompany: () => {},
  loading: true,
})

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [company, setCompany] = useState<CompanyConfig | null>(null)
  const [selectedEmpId, setSelectedEmpId] = useState<string>('')
  const [loading, setLoading] = useState(true)

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
      
      if (emps.length > 0) {
        setSelectedEmpId(emps[0].id)
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load workspace data.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refreshEmployees = async () => {
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
      toast({ title: 'Error', description: 'Failed to refresh employee list.', variant: 'destructive' })
    }
  }

  const updateCompany = (updated: CompanyConfig) => {
    setCompany(updated)
  }

  return (
    <WorkspaceContext.Provider
      value={{
        employees,
        company,
        selectedEmpId,
        setSelectedEmpId,
        refreshEmployees,
        updateCompany,
        loading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => useContext(WorkspaceContext)
