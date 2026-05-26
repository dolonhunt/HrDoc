"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import {
  FileText, Search, Trash2, Clock, Receipt, DollarSign,
  Briefcase, Award, BadgeCheck, Loader2, RefreshCw, Send, Archive
} from "lucide-react"
import { DOC_TYPES } from "./app-sidebar"

interface HistoryRecord {
  id: string
  refNo: string
  employeeId: string
  employeeName: string
  docType: string
  generatedBy: string
  status: string
  createdAt: string
}

export function HistoryView({ brandColor }: { brandColor: string }) {
  const { toast } = useToast()
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/history')
      if (res.ok) {
        const data = await res.json()
        setRecords(data)
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch document history.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        toast({ title: "Deleted", description: "History log record deleted." })
        fetchHistory()
      }
    } catch {
      toast({ title: "Error", description: "Failed to delete record.", variant: "destructive" })
    }
  }

  const handleClearAll = async () => {
    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        toast({ title: "Cleared", description: "History has been fully cleared." })
        fetchHistory()
      }
    } catch {
      toast({ title: "Error", description: "Failed to clear history.", variant: "destructive" })
    }
  }

  const getDocMeta = (key: string) => {
    return DOC_TYPES.find(d => d.key === key)
  }

  const filtered = records.filter(r =>
    !search ||
    r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    r.refNo.toLowerCase().includes(search.toLowerCase()) ||
    (getDocMeta(r.docType)?.label || r.docType).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 bg-muted/20 flex flex-col overflow-hidden">
      <div className="h-14 border-b border-border bg-background flex items-center justify-between px-6 flex-shrink-0">
        <h2 className="text-[15px] font-bold text-sidebar-foreground flex items-center gap-2">
          <FileText className="w-5 h-5" style={{ color: brandColor }} />
          Generated Document Logs
        </h2>
        <div className="flex gap-2">
          {records.length > 0 && (
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 text-destructive cursor-pointer" onClick={handleClearAll}>
              <Trash2 className="w-3 h-3" /> Clear History
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1 cursor-pointer" onClick={fetchHistory}>
            <RefreshCw className="w-3 h-3" /> Refresh
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 flex-shrink-0 bg-background/50 border-b border-border/40">
          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Employee, Ref No, or Type..."
              className="h-8 pl-7 text-[11px] bg-background border-border"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/20 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">
                {search ? 'No matching records found' : 'No document logs recorded yet'}
              </p>
              {!search && <p className="text-[11px] text-muted-foreground/60 mt-1">Generated documents will automatically log in SQLite.</p>}
            </div>
          ) : (
            <div className="space-y-2.5 max-w-4xl">
              {filtered.map(record => {
                const meta = getDocMeta(record.docType)
                return (
                  <Card key={record.id} className="hover:bg-accent/30 hover:border-border transition-all">
                    <CardContent className="p-3.5 flex items-center gap-3.5">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                        style={{ background: brandColor }}
                      >
                        {meta?.icon || <FileText className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div className="col-span-1">
                          <p className="text-[11.5px] font-bold text-foreground truncate">{meta?.label || record.docType}</p>
                          <p className="text-[10px] text-muted-foreground font-mono truncate">{record.refNo}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[11px] font-semibold text-foreground truncate">{record.employeeName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{record.employeeId}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Created By</p>
                          <p className="text-[11px] text-foreground font-medium">{record.generatedBy}</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase border ${
                            record.status === 'Sent'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : record.status === 'Archived'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 flex-shrink-0">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                          {new Date(record.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                            onClick={() => handleDelete(record.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Keep helper API proxy to support historical code without breakage
export async function addDocumentHistory(docType: string, employeeName: string, employeeId: string, refNo: string, generatedBy: string = 'Super Admin') {
  try {
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refNo,
        employeeId,
        employeeName,
        docType,
        generatedBy,
        status: 'Final'
      })
    })
  } catch (err) {
    console.error('Failed to log history on backend:', err)
  }
}
