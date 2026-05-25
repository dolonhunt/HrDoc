"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Download, Eye, Loader2, FileText, Printer, ExternalLink,
  Users, ChevronDown, ChevronUp, TrendingUp
} from "lucide-react"
import type { Employee, CompanyConfig } from "@/lib/storage"
import type { View, DocType } from "./app-sidebar"
import { DOC_TYPES } from "./app-sidebar"
import { addDocumentHistory } from "./history-view"

interface DocumentViewProps {
  view: DocType
  employees: Employee[]
  company: CompanyConfig | null
  selectedEmpId: string
  onSelectEmployee: (id: string) => void
  brandColor: string
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function buildDocData(docType: DocType, emp: Employee, overrides: Record<string, any> = {}): Record<string, any> {
  const base: Record<string, any> = { ...emp, ...overrides }
  base.employee_id = emp.id
  if (docType === 'payslip') {
    base.month = base.month || new Date().getMonth() + 1
    base.year = base.year || new Date().getFullYear()
    base.days_present = base.days_present || 30
    base.days_in_month = base.days_in_month || 30
  }
  if (docType === 'salary_cert' || docType === 'employment_cert') {
    base.cert_date = base.cert_date || new Date().toISOString().split('T')[0]
    base.purpose = base.purpose || 'official purposes'
  }
  if (docType === 'appointment') {
    base.letter_date = base.letter_date || emp.joining_date || new Date().toISOString().split('T')[0]
    base.probation_months = base.probation_months || 3
  }
  if (docType === 'experience') {
    base.leaving_date = base.leaving_date || new Date().toISOString().split('T')[0]
    base.letter_date = base.letter_date || base.leaving_date
  }
  return base
}

function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/50 hover:bg-muted transition-colors"
      >
        <span className="text-[11px] font-bold text-foreground/80 uppercase tracking-wider">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  )
}

export function DocumentView({ view, employees, company, selectedEmpId, onSelectEmployee, brandColor }: DocumentViewProps) {
  const { toast } = useToast()
  const [docOverrides, setDocOverrides] = useState<Record<string, any>>({})
  const [previewSrc, setPreviewSrc] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [docxLoading, setDocxLoading] = useState(false)
  const prevBlobRef = useRef<string>('')

  const currentEmp = employees.find(e => e.id === selectedEmpId)
  const activeDocMeta = DOC_TYPES.find(d => d.key === view)

  const fetchPreview = useCallback(async () => {
    if (!currentEmp) {
      setPreviewSrc(`/api/document?type=${view}`)
      return
    }
    try {
      const data = buildDocData(view, currentEmp, docOverrides)
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: view, data, company }),
      })
      if (res.ok) {
        const html = await res.text()
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current)
        prevBlobRef.current = url
        setPreviewSrc(url)
      }
    } catch {
      setPreviewSrc(`/api/document?type=${view}`)
    }
  }, [view, currentEmp, docOverrides, company])

  useEffect(() => { fetchPreview() }, [fetchPreview])
  useEffect(() => {
    return () => { if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current) }
  }, [])

  const setOverride = (key: string, val: any) => setDocOverrides(p => ({ ...p, [key]: val }))

  const handleDownloadPDF = async () => {
    if (!currentEmp) return toast({ title: 'Error', description: 'Select an employee first.', variant: 'destructive' })
    setPdfLoading(true)
    try {
      const data = buildDocData(view, currentEmp, docOverrides)
      const htmlRes = await fetch('/api/document', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: view, data, company }) })
      const htmlContent = await htmlRes.text()
      const pdfRes = await fetch('/api/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'text/html' }, body: htmlContent })
      if (!pdfRes.ok) throw new Error('PDF failed')
      const blob = await pdfRes.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${DOC_TYPES.find(d => d.key === view)?.label || 'Document'}-${currentEmp.name}.pdf`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
      addDocumentHistory(view, currentEmp.name, currentEmp.ref_code || currentEmp.id, data.month, data.year)
    } catch {
      toast({ title: 'Error', description: 'PDF generation failed.', variant: 'destructive' })
    } finally { setPdfLoading(false) }
  }

  const handleDownloadDOC = async () => {
    if (!currentEmp) return toast({ title: 'Error', description: 'Select an employee first.', variant: 'destructive' })
    setDocxLoading(true)
    try {
      const data = buildDocData(view, currentEmp, docOverrides)
      const htmlRes = await fetch('/api/document', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: view, data, company }) })
      const htmlContent = await htmlRes.text()
      const docRes = await fetch('/api/generate-docx', { method: 'POST', headers: { 'Content-Type': 'text/html' }, body: htmlContent })
      if (!docRes.ok) throw new Error('DOC failed')
      const blob = await docRes.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${DOC_TYPES.find(d => d.key === view)?.label || 'Document'}-${currentEmp.name}.doc`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
      addDocumentHistory(view, currentEmp.name, currentEmp.ref_code || currentEmp.id, data.month, data.year)
    } catch {
      toast({ title: 'Error', description: 'DOC generation failed.', variant: 'destructive' })
    } finally { setDocxLoading(false) }
  }

  return (
    <>
      {/* Left Config Panel */}
      <div className="w-[360px] flex-shrink-0 bg-background border-r border-border flex flex-col overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-3">
            <Section title="Employee">
              <select
                value={selectedEmpId}
                onChange={e => { onSelectEmployee(e.target.value); setDocOverrides({}) }}
                className="w-full h-9 rounded-md border border-input px-3 text-[12px] bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">-- Select Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.id} — {emp.name}</option>
                ))}
              </select>
            </Section>

            {currentEmp ? (
              <>
                <Section title="Employee Info">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Employee ID</Label>
                      <div className="text-[12px] font-semibold text-foreground mt-0.5 bg-muted rounded px-2 py-1.5 border border-border">{currentEmp.ref_code || currentEmp.id}</div>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Name</Label>
                      <div className="text-[12px] font-semibold text-foreground mt-0.5 bg-muted rounded px-2 py-1.5 border border-border">{currentEmp.name}</div>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Designation</Label>
                      <div className="text-[12px] font-semibold text-foreground mt-0.5 bg-muted rounded px-2 py-1.5 border border-border">{currentEmp.designation}</div>
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Department</Label>
                      <div className="text-[12px] font-semibold text-foreground mt-0.5 bg-muted rounded px-2 py-1.5 border border-border">{currentEmp.department}</div>
                    </div>
                  </div>
                </Section>

                {view === 'payslip' && (
                  <Section title="Pay Period">
                    <div className="space-y-2.5">
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Date</Label>
                        <Input type="date" value={docOverrides.date || new Date().toISOString().split('T')[0]} onChange={e => setOverride('date', e.target.value)} className="h-8 text-[12px] mt-0.5" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Month</Label>
                          <select value={docOverrides.month || new Date().getMonth() + 1} onChange={e => setOverride('month', Number(e.target.value))} className="w-full h-8 rounded-md border border-input px-2 text-[12px] mt-0.5 bg-background">
                            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Year</Label>
                          <Input type="number" value={docOverrides.year || new Date().getFullYear()} onChange={e => setOverride('year', Number(e.target.value))} className="h-8 text-[12px] mt-0.5" />
                        </div>
                      </div>
                    </div>
                  </Section>
                )}

                {view === 'salary_cert' && (
                  <Section title="Certificate Options">
                    <div className="space-y-2.5">
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Certificate Date</Label>
                        <Input type="date" value={docOverrides.cert_date || new Date().toISOString().split('T')[0]} onChange={e => setOverride('cert_date', e.target.value)} className="h-8 text-[12px] mt-0.5" />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Purpose</Label>
                        <Input value={docOverrides.purpose || 'bank loan'} onChange={e => setOverride('purpose', e.target.value)} className="h-8 text-[12px] mt-0.5" placeholder="e.g. bank loan" />
                      </div>
                    </div>
                  </Section>
                )}

                {view === 'appointment' && (
                  <Section title="Letter Options">
                    <div className="space-y-2.5">
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Letter Date</Label>
                        <Input type="date" value={docOverrides.letter_date || currentEmp.joining_date} onChange={e => setOverride('letter_date', e.target.value)} className="h-8 text-[12px] mt-0.5" />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Probation (months)</Label>
                        <Input type="number" value={docOverrides.probation_months || 3} onChange={e => setOverride('probation_months', Number(e.target.value))} className="h-8 text-[12px] mt-0.5" />
                      </div>
                    </div>
                  </Section>
                )}

                {view === 'experience' && (
                  <Section title="Certificate Options">
                    <div className="space-y-2.5">
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Last Working Date</Label>
                        <Input type="date" value={docOverrides.leaving_date || ''} onChange={e => setOverride('leaving_date', e.target.value)} className="h-8 text-[12px] mt-0.5" />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Letter Date</Label>
                        <Input type="date" value={docOverrides.letter_date || docOverrides.leaving_date || new Date().toISOString().split('T')[0]} onChange={e => setOverride('letter_date', e.target.value)} className="h-8 text-[12px] mt-0.5" />
                      </div>
                    </div>
                  </Section>
                )}

                {view === 'employment_cert' && (
                  <Section title="Certificate Options">
                    <div className="space-y-2.5">
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Certificate Date</Label>
                        <Input type="date" value={docOverrides.cert_date || new Date().toISOString().split('T')[0]} onChange={e => setOverride('cert_date', e.target.value)} className="h-8 text-[12px] mt-0.5" />
                      </div>
                      <div>
                        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Purpose</Label>
                        <Input value={docOverrides.purpose || 'visa application'} onChange={e => setOverride('purpose', e.target.value)} className="h-8 text-[12px] mt-0.5" placeholder="e.g. visa application" />
                      </div>
                    </div>
                  </Section>
                )}

                <Section title="Salary Summary">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">Gross Salary</span><span className="font-semibold">৳{currentEmp.gross?.toLocaleString('en-IN') || '0'}</span></div>
                    <div className="flex justify-between text-[12px]"><span className="text-muted-foreground">Tax</span><span className="font-semibold">৳{currentEmp.tax?.toLocaleString('en-IN') || '0'}</span></div>
                    <Separator />
                    <div className="flex justify-between text-[12px]"><span className="font-semibold text-foreground">Net Salary</span><span className="font-bold" style={{ color: brandColor }}>৳{currentEmp.net?.toLocaleString('en-IN') || '0'}</span></div>
                  </div>
                </Section>
              </>
            ) : (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-[12px] text-muted-foreground">Select an employee to generate document</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Preview Panel */}
      <div className="flex-1 bg-muted flex flex-col overflow-hidden">
        <div className="h-9 bg-background border-b border-border flex items-center px-4 gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[12px] font-semibold text-foreground">Live Preview</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Updates as you type</span>
          <div className="ml-auto flex items-center gap-1.5">
            <Button onClick={handleDownloadPDF} disabled={pdfLoading || docxLoading || !currentEmp} variant="outline" size="sm" className="h-7 text-[11px] gap-1.5 px-3">
              {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF
            </Button>
            <Button onClick={handleDownloadDOC} disabled={pdfLoading || docxLoading || !currentEmp} variant="outline" size="sm" className="h-7 text-[11px] gap-1.5 px-3">
              {docxLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />} DOC
            </Button>
            <Button onClick={() => { if (previewSrc) window.open(previewSrc, '_blank') }} variant="outline" size="sm" className="h-7 text-[11px] gap-1.5 px-3">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden p-4">
          <div className="w-full h-full bg-background shadow-lg rounded overflow-hidden">
            {previewSrc ? (
              <iframe key={previewSrc} src={previewSrc} className="w-full h-full border-0" title="Preview" sandbox="allow-same-origin" style={{ transform: 'scale(0.55)', transformOrigin: 'top left', width: '181.8%', height: '181.8%' }} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Loading preview...</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
