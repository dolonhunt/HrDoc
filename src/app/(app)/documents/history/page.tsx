'use client'

import { HistoryView } from '@/components/history-view'
import { useWorkspace } from '@/components/workspace-provider'

export default function HistoryPage() {
  const { company } = useWorkspace()

  return (
    <HistoryView brandColor={company?.brand_color || '#6C63FF'} />
  )
}
