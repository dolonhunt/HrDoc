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
  Users, ChevronDown, ChevronUp, ShieldCheck, Signature, LayoutGrid, Calendar, HelpCircle
} from "lucide-react"
import type { Employee } from "@/lib/storage"
import type { DocType } from "./app-sidebar"
import { DOC_TYPES } from "./app-sidebar"
import { addDocumentHistory } from "./history-view"

interface DocumentViewProps {
  view: DocType
  employees: Employee[]
  company: any
  selectedEmpId: string
  onSelectEmployee: (id: string) => void
  brandColor: string
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function buildDocData(
  docType: DocType,
  emp: Employee,
  overrides: Record<string, any> = {},
  selectedLh: any = null,
  selectedSig: any = null,
  selectedDual: any = null
): Record<string, any> {
  const base: Record<string, any> = { ...emp, ...overrides }
  base.employee_id = emp.id

  // Auto-generate reference number if not manually set
  if (!base.ref_code) {
    const prefix = docType.substring(0, 3).toUpperCase()
    const year = new Date().getFullYear()
    const rand = Math.floor(1000 + Math.random() * 9000)
    base.ref_code = `${prefix}-${year}-${rand}`
  }

  // Bind Letterhead Settings
  if (selectedLh) {
    base.letterhead_profile = selectedLh
  }

  // Bind Signatory Settings
  if (selectedSig) {
    base.signatory_name = selectedSig.name
    base.signatory_title = selectedSig.title
    base.signature_data = selectedSig.signatureData
    base.signatory_seal = selectedSig.sealPath
    base.signatory_method = selectedSig.method
  }

  if (overrides.dual_signatory && selectedDual) {
    base.dual_signatory = true
    base.dual_name = selectedDual.name
    base.dual_title = selectedDual.title
  } else {
    base.dual_signatory = false
  }

  // Context variables depending on type
  if (docType === 'payslip') {
    base.month = base.month || new Date().getMonth() + 1
    base.year = base.year || new Date().getFullYear()
    base.days_present = base.days_present || 30
    base.days_in_month = base.days_in_month || 30
  }
  if (['salary_cert', 'employment_cert', 'noc_cert'].includes(docType)) {
    base.cert_date = base.cert_date || new Date().toISOString().split('T')[0]
    base.purpose = base.purpose || 'official requirements'
  }
  if (docType === 'appointment' || docType === 'offer_letter') {
    base.letter_date = base.letter_date || emp.joining_date || new Date().toISOString().split('T')[0]
    base.probation_months = base.probation_months || 3
  }
  if (docType === 'experience' || docType === 'relieving_letter' || docType === 'resignation_accept' || docType === 'final_settlement') {
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
        className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted transition-colors text-left cursor-pointer"
      >
        <span className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {open && <div className="p-3 space-y-3">{children}</div>}
    </div>
  )
}

export function DocumentView({ view, employees, company, selectedEmpId, onSelectEmployee, brandColor }: DocumentViewProps) {
  const { toast } = useToast()
  
  // Database resources
  const [letterheads, setLetterheads] = useState<any[]>([])
  const [signatories, setSignatories] = useState<any[]>([])
  const [selectedLhId, setSelectedLhId] = useState('')
  const [selectedSigId, setSelectedSigId] = useState('')
  const [selectedDualId, setSelectedDualId] = useState('')

  const [docOverrides, setDocOverrides] = useState<Record<string, any>>({
    watermark_enabled: true,
    watermark_text: 'CONFIDENTIAL',
    dual_signatory: false
  })
  
  const [previewSrc, setPreviewSrc] = useState('')
  const [pdfLoading, setPdfLoading] = useState(false)
  const [docxLoading, setDocxLoading] = useState(false)
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const prevBlobRef = useRef<string>('')

  const currentEmp = employees.find(e => e.id === selectedEmpId)
  const activeDocMeta = DOC_TYPES.find(d => d.key === view)

  // Fetch profiles from SQLite
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [lhRes, sigRes] = await Promise.all([
          fetch('/api/letterheads'),
          fetch('/api/signatories')
        ])
        if (lhRes.ok) {
          const lhData = await lhRes.json()
          setLetterheads(lhData)
          const defLh = lhData.find((l: any) => l.isDefault) || lhData[0]
          if (defLh) setSelectedLhId(defLh.id)
        }
        if (sigRes.ok) {
          const sigData = await sigRes.json()
          setSignatories(sigData)
          if (sigData.length > 0) {
            setSelectedSigId(sigData[0].id)
            if (sigData.length > 1) setSelectedDualId(sigData[1].id)
          }
        }
      } catch (err) {
        console.error('Failed to load signature/letterhead resources:', err)
      }
    }
    fetchConfigs()
  }, [])

  const selectedLh = letterheads.find(l => l.id === selectedLhId) || null
  const selectedSig = signatories.find(s => s.id === selectedSigId) || null
  const selectedDual = signatories.find(s => s.id === selectedDualId) || null

  const fetchPreview = useCallback(async () => {
    if (!currentEmp) {
      setPreviewSrc(`/api/document?type=${view}`)
      return
    }
    try {
      const data = buildDocData(view, currentEmp, docOverrides, selectedLh, selectedSig, selectedDual)
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
    } catch (err) {
      console.error(err)
      setPreviewSrc(`/api/document?type=${view}`)
    }
  }, [view, currentEmp, docOverrides, company, selectedLh, selectedSig, selectedDual])

  useEffect(() => { fetchPreview() }, [fetchPreview])
  useEffect(() => {
    return () => { if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current) }
  }, [])

  const setOverride = (key: string, val: any) => setDocOverrides(p => ({ ...p, [key]: val }))

  // Helper to extract edited HTML from iframe to support inline edits on export
  const getActiveHtml = (): string => {
    const iframe = iframeRef.current
    if (iframe && iframe.contentDocument) {
      return iframe.contentDocument.documentElement.outerHTML
    }
    return ''
  }

  const handleDownloadPDF = async () => {
    if (!currentEmp) return toast({ title: 'Error', description: 'Select an employee first.', variant: 'destructive' })
    setPdfLoading(true)
    try {
      const htmlContent = getActiveHtml()
      if (!htmlContent) throw new Error('Preview document DOM missing')

      const pdfRes = await fetch('/api/generate-pdf', { method: 'POST', headers: { 'Content-Type': 'text/html' }, body: htmlContent })
      if (!pdfRes.ok) throw new Error('PDF failed')
      const blob = await pdfRes.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${DOC_TYPES.find(d => d.key === view)?.label || 'Document'}-${currentEmp.name}.pdf`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Add to SQLite History
      const activeData = buildDocData(view, currentEmp, docOverrides, selectedLh, selectedSig, selectedDual)
      await addDocumentHistory(view, currentEmp.name, currentEmp.id, activeData.ref_code)
      toast({ title: 'Success', description: 'PDF generated and log saved to database.' })
    } catch (err) {
      console.error(err)
      toast({ title: 'Error', description: 'PDF generation failed.', variant: 'destructive' })
    } finally { setPdfLoading(false) }
  }

  const handleDownloadDOC = async () => {
    if (!currentEmp) return toast({ title: 'Error', description: 'Select an employee first.', variant: 'destructive' })
    setDocxLoading(true)
    try {
      const htmlContent = getActiveHtml()
      if (!htmlContent) throw new Error('Preview document DOM missing')

      const docRes = await fetch('/api/generate-docx', { method: 'POST', headers: { 'Content-Type': 'text/html' }, body: htmlContent })
      if (!docRes.ok) throw new Error('DOC failed')
      const blob = await docRes.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${DOC_TYPES.find(d => d.key === view)?.label || 'Document'}-${currentEmp.name}.doc`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Add to SQLite History
      const activeData = buildDocData(view, currentEmp, docOverrides, selectedLh, selectedSig, selectedDual)
      await addDocumentHistory(view, currentEmp.name, currentEmp.id, activeData.ref_code)
      toast({ title: 'Success', description: 'DOCX document exported.' })
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
            
            {/* Employee Selector */}
            <Section title="Employee">
              <select
                value={selectedEmpId}
                onChange={e => { onSelectEmployee(e.target.value); setDocOverrides({ watermark_enabled: true, watermark_text: 'CONFIDENTIAL', dual_signatory: false }) }}
                className="w-full h-8 rounded-md border border-input px-3 text-[12px] bg-background focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="">-- Select Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.id} — {emp.name}</option>
                ))}
              </select>
            </Section>

            {currentEmp ? (
              <>
                {/* Reference & Dates */}
                <Section title="Document Reference">
                  <div className="space-y-2">
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Ref No (Editable)</Label>
                      <Input
                        value={docOverrides.ref_code || ''}
                        onChange={e => setOverride('ref_code', e.target.value)}
                        placeholder="APT-2026-XXXX"
                        className="h-8 text-[12px] mt-0.5"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Document Date</Label>
                      <Input
                        type="date"
                        value={docOverrides.date || new Date().toISOString().split('T')[0]}
                        onChange={e => setOverride('date', e.target.value)}
                        className="h-8 text-[12px] mt-0.5"
                      />
                    </div>
                  </div>
                </Section>

                {/* Letterhead Selector */}
                <Section title="Branding Letterhead">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] text-muted-foreground uppercase">Letterhead Design Profile</Label>
                    <select
                      value={selectedLhId}
                      onChange={e => setSelectedLhId(e.target.value)}
                      className="w-full h-8 rounded-md border border-input px-2 text-[12px] bg-background cursor-pointer"
                    >
                      {letterheads.map(lh => (
                        <option key={lh.id} value={lh.id}>
                          {lh.name} {lh.isDefault ? '(Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </Section>

                {/* Signatory Options */}
                <Section title="Digital Endorsement">
                  <div className="space-y-2.5">
                    {/* Primary */}
                    <div>
                      <Label className="text-[10px] text-muted-foreground uppercase">Primary Signatory</Label>
                      <select
                        value={selectedSigId}
                        onChange={e => setSelectedSigId(e.target.value)}
                        className="w-full h-8 rounded-md border border-input px-2 text-[12px] bg-background mt-0.5 cursor-pointer"
                      >
                        {signatories.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.title})</option>
                        ))}
                      </select>
                    </div>

                    {/* Dual signatory checkbox */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <Signature className="w-3.5 h-3.5 text-muted-foreground" />
                        <Label className="text-[11px]">Dual Signatories</Label>
                      </div>
                      <button
                        onClick={() => setOverride('dual_signatory', !docOverrides.dual_signatory)}
                        className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors cursor-pointer ${
                          docOverrides.dual_signatory ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          docOverrides.dual_signatory ? 'translate-x-[15px]' : 'translate-x-[2px]'
                        }`} />
                      </button>
                    </div>

                    {/* Dual Selector */}
                    {docOverrides.dual_signatory && (
                      <div className="animate-scale-up">
                        <Label className="text-[10px] text-muted-foreground uppercase">Second Signatory</Label>
                        <select
                          value={selectedDualId}
                          onChange={e => setSelectedDualId(e.target.value)}
                          className="w-full h-8 rounded-md border border-input px-2 text-[12px] bg-background mt-0.5 cursor-pointer"
                        >
                          {signatories.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.title})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </Section>

                {/* Specific Document Inputs */}
                <Section title="Document Variables">
                  <div className="space-y-2">
                    {/* Payslip parameters */}
                    {view === 'payslip' && (
                      <div className="grid grid-cols-2 gap-2 animate-scale-up">
                        <div>
                          <Label className="text-[9px] uppercase text-muted-foreground">Month</Label>
                          <select value={docOverrides.month || new Date().getMonth() + 1} onChange={e => setOverride('month', Number(e.target.value))} className="w-full h-8 rounded-md border border-input px-2 text-[12px] bg-background cursor-pointer">
                            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label className="text-[9px] uppercase text-muted-foreground">Year</Label>
                          <Input type="number" value={docOverrides.year || new Date().getFullYear()} onChange={e => setOverride('year', Number(e.target.value))} className="h-8 text-[12px]" />
                        </div>
                      </div>
                    )}

                    {/* Certificates Purpose */}
                    {['salary_cert', 'employment_cert', 'noc_cert', 'bank_intro', 'embassy_support'].includes(view) && (
                      <div className="space-y-1.5 animate-scale-up">
                        <Label className="text-[9px] uppercase text-muted-foreground">Letter Purpose / Target</Label>
                        <Input
                          value={docOverrides.purpose || ''}
                          onChange={e => setOverride('purpose', e.target.value)}
                          placeholder="e.g. visa application / bank loan"
                          className="h-8 text-[12px]"
                        />
                      </div>
                    )}

                    {/* Travel Dates */}
                    {view === 'embassy_support' && (
                      <div className="space-y-1.5 animate-scale-up">
                        <Label className="text-[9px] uppercase text-muted-foreground">Travel Dates Range</Label>
                        <Input
                          value={docOverrides.travel_dates || ''}
                          onChange={e => setOverride('travel_dates', e.target.value)}
                          placeholder="e.g. June 15 to June 30, 2026"
                          className="h-8 text-[12px]"
                        />
                      </div>
                    )}

                    {/* Incident Details */}
                    {view === 'show_cause' && (
                      <div className="space-y-2.5 animate-scale-up">
                        <div>
                          <Label className="text-[9px] uppercase text-muted-foreground">Incident Date</Label>
                          <Input type="date" value={docOverrides.incident_date || ''} onChange={e => setOverride('incident_date', e.target.value)} className="h-8 text-[12px]" />
                        </div>
                        <div>
                          <Label className="text-[9px] uppercase text-muted-foreground">Breach Description</Label>
                          <Input value={docOverrides.incident_desc || ''} onChange={e => setOverride('incident_desc', e.target.value)} placeholder="e.g. absenteeism without notification" className="h-8 text-[12px]" />
                        </div>
                      </div>
                    )}

                    {/* Probation months */}
                    {['appointment', 'offer_letter', 'probation_confirm'].includes(view) && (
                      <div className="space-y-1.5 animate-scale-up">
                        <Label className="text-[9px] uppercase text-muted-foreground">Probation Period (Months)</Label>
                        <Input type="number" value={docOverrides.probation_months || 3} onChange={e => setOverride('probation_months', Number(e.target.value))} className="h-8 text-[12px]" />
                      </div>
                    )}

                    {/* Leaves range */}
                    {view === 'leave_approval' && (
                      <div className="grid grid-cols-2 gap-2 animate-scale-up">
                        <div>
                          <Label className="text-[9px] uppercase text-muted-foreground">Start Date</Label>
                          <Input type="date" value={docOverrides.start_date || ''} onChange={e => setOverride('start_date', e.target.value)} className="h-8 text-[12px]" />
                        </div>
                        <div>
                          <Label className="text-[9px] uppercase text-muted-foreground">End Date</Label>
                          <Input type="date" value={docOverrides.end_date || ''} onChange={e => setOverride('end_date', e.target.value)} className="h-8 text-[12px]" />
                        </div>
                      </div>
                    )}
                  </div>
                </Section>

                {/* Watermark Panel */}
                <Section title="Watermark Controls">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                        <Label className="text-[11px] font-medium">Enable Watermark</Label>
                      </div>
                      <button
                        onClick={() => setOverride('watermark_enabled', !docOverrides.watermark_enabled)}
                        className={`relative inline-flex h-4.5 w-8 items-center rounded-full transition-colors cursor-pointer ${
                          docOverrides.watermark_enabled ? 'bg-primary' : 'bg-muted-foreground/30'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          docOverrides.watermark_enabled ? 'translate-x-[15px]' : 'translate-x-[2px]'
                        }`} />
                      </button>
                    </div>
                    {docOverrides.watermark_enabled && (
                      <div className="space-y-1.5 animate-scale-up">
                        <Label className="text-[9px] uppercase text-muted-foreground">Watermark Text</Label>
                        <Input
                          value={docOverrides.watermark_text || 'CONFIDENTIAL'}
                          onChange={e => setOverride('watermark_text', e.target.value)}
                          className="h-8 text-[12px]"
                        />
                      </div>
                    )}
                  </div>
                </Section>
              </>
            ) : (
              <div className="text-center py-16">
                <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-[12px] text-muted-foreground">Select an employee from the dropdown list to configure settings.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Preview Panel */}
      <div className="flex-1 bg-muted/40 flex flex-col overflow-hidden">
        <div className="h-10 bg-background border-b border-border flex items-center px-4 gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span className="text-[12px] font-bold text-foreground">A4 Live Paper Editor</span>
          </div>
          <span className="text-[10px] text-muted-foreground/80">Click paper body text to edit inline directly</span>
          
          <div className="ml-auto flex items-center gap-1.5">
            <Button onClick={handleDownloadPDF} disabled={pdfLoading || docxLoading || !currentEmp} variant="outline" size="sm" className="h-7 text-[11px] gap-1 px-2.5 cursor-pointer">
              {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} PDF
            </Button>
            <Button onClick={handleDownloadDOC} disabled={pdfLoading || docxLoading || !currentEmp} variant="outline" size="sm" className="h-7 text-[11px] gap-1 px-2.5 cursor-pointer">
              {docxLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />} DOC
            </Button>
            <Button onClick={() => { if (previewSrc) window.open(previewSrc, '_blank') }} variant="outline" size="sm" className="h-7 text-[11px] gap-1 px-2.5 cursor-pointer">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
          </div>
        </div>

        {/* Paper Container */}
        <div className="flex-1 overflow-hidden p-6 flex justify-center items-start">
          <div className="w-[660px] h-full bg-background shadow-xl border border-border/80 rounded-xl overflow-hidden relative">
            {previewSrc ? (
              <iframe
                ref={iframeRef}
                key={previewSrc}
                src={previewSrc}
                className="w-full h-full border-0"
                title="A4 Paper Frame"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/60 mr-2" /> Loading document preview...
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
