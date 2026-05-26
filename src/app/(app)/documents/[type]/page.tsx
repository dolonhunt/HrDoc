'use client'

import { useParams, useRouter } from 'next/navigation'
import { DocumentView } from '@/components/document-view'
import { useWorkspace } from '@/components/workspace-provider'
import { type DocType } from '@/components/app-sidebar'

const VALID_DOC_TYPES = ['payslip', 'salary_cert', 'appointment', 'experience', 'employment_cert']

export default function DocumentTypePage() {
  const params = useParams()
  const router = useRouter()
  const { employees, company, selectedEmpId, setSelectedEmpId } = useWorkspace()

  const type = params?.type as string

  // If the document type is invalid, redirect to dashboard
  if (!VALID_DOC_TYPES.includes(type)) {
    router.push('/dashboard')
    return null
  }

  return (
    <DocumentView
      view={type as DocType}
      employees={employees}
      company={company}
      selectedEmpId={selectedEmpId}
      onSelectEmployee={setSelectedEmpId}
      brandColor={company?.brand_color || '#6C63FF'}
    />
  )
}
