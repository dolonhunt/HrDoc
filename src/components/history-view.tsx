"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  FileText, Search, Trash2, Download, Clock, Receipt, DollarSign,
  Briefcase, Award, BadgeCheck, Loader2
} from "lucide-react"
import type { DocType } from "./app-sidebar"

interface HistoryRecord {
  id: string
  docType: DocType
  employeeName: string
  employeeId: string
  generatedAt: string
  month?: number
  year?: number
}

const DOC_ICON: Record<DocType, React.ReactNode> = {
  payslip: <Receipt className="w-4 h-4" />,
  salary_cert: <DollarSign className="w-4 h-4" />,
  appointment: <Briefcase className="w-4 h-4" />,
  experience: <Award className="w-4 h-4" />,
  employment_cert: <BadgeCheck className="w-4 h-4" />,
}

const DOC_LABEL: Record<DocType, string> = {
  payslip: 'Pay Slip',
  salary_cert: 'Salary Certificate',
  appointment: 'Appointment Letter',
  experience: 'Experience Letter',
  employment_cert: 'Employment Certificate',
}

interface HistoryViewProps {
  brandColor: string
}

export function HistoryView({ brandColor }: HistoryViewProps) {
  const { toast } = useToast()
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('dochr_document_history')
    if (stored) {
      try {
        setRecords(JSON.parse(stored))
      } catch {
        setRecords([])
      }
    }
    setLoading(false)
  }, [])

  const saveRecords = (newRecords: HistoryRecord[]) => {
    setRecords(newRecords)
    localStorage.setItem('dochr_document_history', JSON.stringify(newRecords))
  }

  const handleDelete = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    saveRecords(updated)
    toast({ title: "Deleted", description: "Record removed from history" })
  }

  const handleClearAll = () => {
    saveRecords([])
    toast({ title: "Cleared", description: "All history records removed" })
  }

  const filtered = records.filter(r =>
    !search ||
    r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    DOC_LABEL[r.docType].toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 bg-muted/30 flex flex-col overflow-hidden">
      <div className="h-14 border-b border-border bg-background flex items-center justify-between px-6 flex-shrink-0">
        <h2 className="text-[15px] font-bold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: brandColor }} />
          Document History
        </h2>
        {records.length > 0 && (
          <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 text-destructive" onClick={handleClearAll}>
            <Trash2 className="w-3 h-3" /> Clear All
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 flex-shrink-0">
          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by employee or document type..."
              className="h-8 pl-7 text-[11px]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">
                {search ? 'No matching records' : 'No document history yet'}
              </p>
              {!search && <p className="text-[11px] text-muted-foreground/60 mt-1">Generated documents will appear here automatically</p>}
            </div>
          ) : (
            <div className="space-y-2 max-w-3xl">
              {filtered.map(record => (
                <Card key={record.id} className="hover:bg-accent/30 transition-colors">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white"
                      style={{ background: brandColor }}
                    >
                      {DOC_ICON[record.docType]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground">{DOC_LABEL[record.docType]}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {record.employeeName} • {record.employeeId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(record.generatedAt).toLocaleDateString()}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Utility to add a record from the main page
export function addDocumentHistory(docType: DocType, employeeName: string, employeeId: string, month?: number, year?: number) {
  const stored = localStorage.getItem('dochr_document_history')
  let records: HistoryRecord[] = []
  if (stored) {
    try { records = JSON.parse(stored) } catch { /* ignore */ }
  }
  records.unshift({
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    docType,
    employeeName,
    employeeId,
    generatedAt: new Date().toISOString(),
    month,
    year,
  })
  // Keep only last 200 records
  if (records.length > 200) records = records.slice(0, 200)
  localStorage.setItem('dochr_document_history', JSON.stringify(records))
}
