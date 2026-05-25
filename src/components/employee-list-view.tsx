"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Users, Plus, Pencil, Trash2, Search, List, Loader2,
  Upload, Download, UserPlus
} from "lucide-react"
import type { Employee } from "@/lib/storage"
import type { View } from "./app-sidebar"

interface EmployeeListViewProps {
  employees: Employee[]
  brandColor: string
  onUpdate: () => Promise<void>
  onSelectEmployee: (id: string) => void
  onNavigate: (view: View) => void
}

const EMPTY_EMPLOYEE: Employee = {
  id: '', name: '', designation: '', department: '', joining_date: '',
  basic: 0, house_rent: 0, conveyance: 0, medical: 0, food_mobile: 0,
  cash: 0, gross: 0, tax: 0, net: 0, bank_account: '', bank_name: '',
  nid: '', mobile: '', email: '', status: 'active', ref_code: '',
}

export function EmployeeListView({ employees, brandColor, onUpdate, onSelectEmployee, onNavigate }: EmployeeListViewProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [empDialogOpen, setEmpDialogOpen] = useState(false)
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null)
  const [empForm, setEmpForm] = useState<Employee>({ ...EMPTY_EMPLOYEE })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [csvImportOpen, setCsvImportOpen] = useState(false)

  const updateFormField = (field: keyof Employee, value: string | number) =>
    setEmpForm(p => ({ ...p, [field]: value }))

  const calcGross = (Number(empForm.basic)||0)+(Number(empForm.house_rent)||0)+(Number(empForm.conveyance)||0)+(Number(empForm.medical)||0)+(Number(empForm.food_mobile)||0)+(Number(empForm.cash)||0)
  const calcNet = calcGross - (Number(empForm.tax)||0)

  const openAddEmployee = () => {
    const nextId = `EMP${String(employees.length + 1).padStart(3, '0')}`
    setEditingEmp(null)
    setEmpForm({ ...EMPTY_EMPLOYEE, id: nextId, ref_code: `TBH-${Math.floor(10000 + Math.random() * 90000)}` })
    setEmpDialogOpen(true)
  }

  const openEditEmployee = (emp: Employee) => {
    setEditingEmp(emp)
    setEmpForm({ ...emp })
    setEmpDialogOpen(true)
  }

  const handleSaveEmployee = async () => {
    if (!empForm.name.trim()) return toast({ title: 'Error', description: 'Name required.', variant: 'destructive' })
    if (!empForm.designation.trim()) return toast({ title: 'Error', description: 'Designation required.', variant: 'destructive' })
    const gross = calcGross
    const net = calcNet
    setSaving(true)
    try {
      const res = await fetch('/api/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...empForm, gross, net }),
      })
      if (!res.ok) throw new Error('Failed')
      await onUpdate()
      setEmpDialogOpen(false)
      toast({ title: 'Success', description: `Employee ${editingEmp ? 'updated' : 'added'}.` })
    } catch {
      toast({ title: 'Error', description: 'Failed to save employee.', variant: 'destructive' })
    } finally { setSaving(false) }
  }

  const handleDeleteEmployee = async (id: string) => {
    try {
      const res = await fetch('/api/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Failed')
      await onUpdate()
      setDeleteConfirm(null)
      toast({ title: 'Deleted', description: 'Employee removed.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to delete employee.', variant: 'destructive' })
    }
  }

  const handleExportCSV = () => {
    if (employees.length === 0) {
      toast({ title: 'Error', description: 'No employees to export.', variant: 'destructive' })
      return
    }
    const headers = ['ID', 'Name', 'Designation', 'Department', 'Joining Date', 'Basic', 'House Rent', 'Conveyance', 'Medical', 'Food & Mobile', 'Cash', 'Gross', 'Tax', 'Net', 'Bank Account', 'Bank Name', 'Mobile', 'Email', 'Status', 'Ref Code']
    const rows = employees.map(e => [
      e.id, e.name, e.designation, e.department, e.joining_date,
      e.basic, e.house_rent, e.conveyance, e.medical, e.food_mobile,
      e.cash, e.gross, e.tax, e.net, e.bank_account, e.bank_name,
      e.mobile, e.email, e.status, e.ref_code
    ])
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '\\"')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title: 'Exported', description: `${employees.length} employees exported to CSV.` })
  }

  const handleImportCSV = (csvText: string) => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2) {
      toast({ title: 'Error', description: 'CSV file is empty or invalid.', variant: 'destructive' })
      return
    }
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"' && line[i + 1] === '"') {
          current += '"'
          i++
        } else if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim())
    const getField = (row: string[], name: string): string => {
      const idx = headers.indexOf(name.toLowerCase())
      return idx >= 0 ? row[idx].replace(/^"|"$/g, '') : ''
    }

    let imported = 0
    const importNext = async (i: number) => {
      if (i >= lines.length) {
        await onUpdate()
        toast({ title: 'Import Complete', description: `${imported} employees imported successfully.` })
        setCsvImportOpen(false)
        return
      }
      const row = parseCSVLine(lines[i])
      if (row.length < 3) { importNext(i + 1); return }
      const name = getField(row, 'name')
      if (!name) { importNext(i + 1); return }

      const basic = parseInt(getField(row, 'basic')) || 0
      const house_rent = parseInt(getField(row, 'house rent')) || parseInt(getField(row, 'houserent')) || parseInt(getField(row, 'house_rent')) || 0
      const conveyance = parseInt(getField(row, 'conveyance')) || 0
      const medical = parseInt(getField(row, 'medical')) || 0
      const food_mobile = parseInt(getField(row, 'food & mobile')) || parseInt(getField(row, 'food_mobile')) || parseInt(getField(row, 'foodmobile')) || 0
      const cash = parseInt(getField(row, 'cash')) || 0
      const tax = parseInt(getField(row, 'tax')) || 0
      const gross = basic + house_rent + conveyance + medical + food_mobile + cash
      const net = gross - tax

      const emp: Employee = {
        id: getField(row, 'id') || `EMP${String(employees.length + imported + i).padStart(3, '0')}`,
        name,
        designation: getField(row, 'designation') || 'Staff',
        department: getField(row, 'department') || 'General',
        joining_date: getField(row, 'joining date') || getField(row, 'joining_date') || getField(row, 'joiningdate') || new Date().toISOString().split('T')[0],
        basic, house_rent, conveyance, medical, food_mobile, cash, gross, tax, net,
        bank_account: getField(row, 'bank account') || getField(row, 'bank_account') || getField(row, 'bankaccount') || '',
        bank_name: getField(row, 'bank name') || getField(row, 'bank_name') || getField(row, 'bankname') || '',
        nid: getField(row, 'nid') || '',
        mobile: getField(row, 'mobile') || '',
        email: getField(row, 'email') || '',
        status: (getField(row, 'status') as 'active' | 'inactive') || 'active',
        ref_code: getField(row, 'ref code') || getField(row, 'ref_code') || getField(row, 'refcode') || '',
      }

      try {
        await fetch('/api/employees', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emp),
        })
        imported++
      } catch { /* skip failed */ }
      importNext(i + 1)
    }

    importNext(1)
  }

  const filteredEmps = employees.filter(e =>
    !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.ref_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.designation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 bg-background flex flex-col overflow-hidden">
      <div className="h-14 border-b border-border flex items-center justify-between px-6 flex-shrink-0">
        <h2 className="text-[15px] font-bold text-foreground flex items-center gap-2">
          <List className="w-5 h-5" style={{ color: brandColor }} />
          Employee Directory
          <span className="text-[12px] font-normal text-muted-foreground">({employees.length})</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="h-8 w-44 pl-7 text-[11px]" />
          </div>
          <Button onClick={() => setCsvImportOpen(true)} variant="outline" size="sm" className="h-8 text-[11px] gap-1">
            <Upload className="w-3 h-3" /> Import
          </Button>
          <Button onClick={handleExportCSV} variant="outline" size="sm" className="h-8 text-[11px] gap-1">
            <Download className="w-3 h-3" /> Export
          </Button>
          <Button onClick={openAddEmployee} className="gap-1.5 text-white h-8 text-[11px]" style={{ background: brandColor }}>
            <Plus className="w-3 h-3" /> Add
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {filteredEmps.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Users className="w-14 h-14 text-muted-foreground/20 mb-3" />
            <p className="text-muted-foreground text-sm">{searchQuery ? 'No matching employees' : 'No employees yet'}</p>
            {!searchQuery && (
              <div className="flex gap-2 mt-4">
                <Button onClick={openAddEmployee} variant="outline" size="sm" className="gap-1 text-[11px]">
                  <Plus className="w-3 h-3" /> Add Employee
                </Button>
                <Button onClick={() => setCsvImportOpen(true)} variant="outline" size="sm" className="gap-1 text-[11px]">
                  <Upload className="w-3 h-3" /> Import CSV
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Designation</th>
                  <th className="text-left px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Net Salary</th>
                  <th className="text-center px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmps.map(emp => (
                  <tr key={emp.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <button onClick={() => { onSelectEmployee(emp.id); onNavigate('payslip'); }} className="font-semibold text-foreground hover:underline text-left">
                        {emp.name}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground font-mono text-[11px]">{emp.ref_code || emp.id}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{emp.designation}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{emp.department}</td>
                    <td className="px-4 py-2.5 text-right font-bold" style={{ color: brandColor }}>৳{emp.net?.toLocaleString('en-IN') || '0'}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {emp.status || 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => { onSelectEmployee(emp.id); onNavigate('payslip'); }} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground" title="Generate docs">
                        <UserPlus className="w-3 h-3" />
                      </button>
                      <button onClick={() => openEditEmployee(emp)} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground" title="Edit">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => setDeleteConfirm(emp.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ScrollArea>

      {/* Add/Edit Dialog */}
      <Dialog open={empDialogOpen} onOpenChange={setEmpDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: brandColor }} />
              {editingEmp ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name *</Label>
              <Input value={empForm.name} onChange={e => updateFormField('name', e.target.value)} placeholder="e.g. Syed Ashfaqul Haque" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reference Code</Label>
              <Input value={empForm.ref_code} onChange={e => updateFormField('ref_code', e.target.value)} placeholder="e.g. TBH-46077" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Designation *</Label>
              <Input value={empForm.designation} onChange={e => updateFormField('designation', e.target.value)} placeholder="e.g. Editor" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department *</Label>
              <Input value={empForm.department} onChange={e => updateFormField('department', e.target.value)} placeholder="e.g. Editorial" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Joining Date</Label>
              <Input type="date" value={empForm.joining_date} onChange={e => updateFormField('joining_date', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={empForm.status} onChange={e => updateFormField('status', e.target.value)} className="w-full h-9 rounded-md border border-input px-3 text-sm bg-background">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="sm:col-span-2 mt-1">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: brandColor }} />
                Salary Components (BDT/month)
              </h4>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Basic Salary</Label><Input type="number" value={empForm.basic || ''} onChange={e => updateFormField('basic', Number(e.target.value))} placeholder="0" /></div>
            <div className="space-y-1.5"><Label className="text-xs">House Rent</Label><Input type="number" value={empForm.house_rent || ''} onChange={e => updateFormField('house_rent', Number(e.target.value))} placeholder="0" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Conveyance</Label><Input type="number" value={empForm.conveyance || ''} onChange={e => updateFormField('conveyance', Number(e.target.value))} placeholder="0" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Medical</Label><Input type="number" value={empForm.medical || ''} onChange={e => updateFormField('medical', Number(e.target.value))} placeholder="0" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Food & Mobile</Label><Input type="number" value={empForm.food_mobile || ''} onChange={e => updateFormField('food_mobile', Number(e.target.value))} placeholder="0" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Cash</Label><Input type="number" value={empForm.cash || ''} onChange={e => updateFormField('cash', Number(e.target.value))} placeholder="0" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Tax Deduction</Label><Input type="number" value={empForm.tax || ''} onChange={e => updateFormField('tax', Number(e.target.value))} placeholder="0" /></div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-900/40 space-y-1">
              <div className="text-[10px] text-muted-foreground font-medium">Auto-Calculated</div>
              <div className="flex justify-between"><span className="text-xs font-semibold text-foreground">Gross:</span><span className="text-xs font-bold text-foreground">৳{calcGross.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-xs font-semibold text-foreground">Net:</span><span className="text-xs font-bold" style={{ color: brandColor }}>৳{calcNet.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="sm:col-span-2 mt-1">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: brandColor }} />
                Contact & Banking
              </h4>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Mobile</Label><Input value={empForm.mobile} onChange={e => updateFormField('mobile', e.target.value)} placeholder="+880..." /></div>
            <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input type="email" value={empForm.email} onChange={e => updateFormField('email', e.target.value)} placeholder="name@company.com" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Bank Name</Label><Input value={empForm.bank_name} onChange={e => updateFormField('bank_name', e.target.value)} placeholder="e.g. BRAC Bank" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Bank Account</Label><Input value={empForm.bank_account} onChange={e => updateFormField('bank_account', e.target.value)} placeholder="e.g. 0012-3456-7890" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">NID Number</Label><Input value={empForm.nid} onChange={e => updateFormField('nid', e.target.value)} placeholder="National ID" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmpDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEmployee} disabled={saving} className="text-white" style={{ background: brandColor }}>
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />}
              {editingEmp ? 'Update' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Employee</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">Are you sure? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDeleteEmployee(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog open={csvImportOpen} onOpenChange={setCsvImportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Import Employees from CSV</DialogTitle></DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-[12px] text-muted-foreground">
              Upload a CSV file with columns: Name, Designation, Department, Basic, House Rent, Conveyance, Medical, Food & Mobile, Cash, Tax, etc.
            </p>
            <p className="text-[11px] text-muted-foreground bg-muted p-2 rounded">
              <strong>Required:</strong> Name<br/>
              <strong>Optional:</strong> ID, Designation, Department, Joining Date, Basic, House Rent, Conveyance, Medical, Food & Mobile, Cash, Tax, Bank Account, Bank Name, Mobile, Email, Status, Ref Code
            </p>
            <Input
              type="file"
              accept=".csv"
              onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  const text = ev.target?.result as string
                  if (text) handleImportCSV(text)
                }
                reader.readAsText(file)
              }}
              className="text-[12px]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
