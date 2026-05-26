'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Signature, Save, Plus, Trash2, Edit2, ShieldAlert, Loader2, Undo, Check } from 'lucide-react'
import { useWorkspace } from '@/components/workspace-provider'

interface SignatoryType {
  id?: string
  name: string
  title: string
  department?: string
  method: string
  signatureData?: string
  typedFont?: string
  typedText?: string
  sealPath?: string
  email?: string
}

export default function SignatoriesPage() {
  const { company } = useWorkspace()
  const { toast } = useToast()

  const [signatories, setSignatories] = useState<SignatoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [email, setEmail] = useState('')
  const [method, setMethod] = useState('draw') // 'draw' | 'upload' | 'type'
  
  // Typed signature states
  const [typedText, setTypedText] = useState('')
  const [typedFont, setTypedFont] = useState('cursive-1')

  // Canvas drawing states
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const pointsRef = useRef<{ x: number; y: number }[]>([])

  const [sealPreview, setSealPreview] = useState('')
  const [uploadedSig, setUploadedSig] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const brandColor = company?.brand_color || '#6C63FF'

  const fetchSignatories = async () => {
    try {
      const res = await fetch('/api/signatories')
      if (res.ok) {
        const data = await res.json()
        setSignatories(data)
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load signatories.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSignatories()
  }, [])

  // Canvas Mouse/Touch handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#FFFFFF' // Smooth white line on dark canvas
    setIsDrawing(true)
    pointsRef.current = [{ x, y }]
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    pointsRef.current.push({ x, y })
    const points = pointsRef.current

    // Bezier curve smoothing logic
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Redraw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    ctx.strokeStyle = '#00D4AA' // Vibrant cyan for drawing
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (points.length < 3) {
      ctx.beginPath()
      ctx.arc(points[0].x, points[0].y, ctx.lineWidth / 2, 0, Math.PI * 2)
      ctx.fill()
      return
    }

    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < points.length - 2; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2
      const yc = (points[i].y + points[i + 1].y) / 2
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
    }

    // Curve to the last two points
    ctx.quadraticCurveTo(
      points[points.length - 2].x,
      points[points.length - 2].y,
      points[points.length - 1].x,
      points[points.length - 1].y
    )
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pointsRef.current = []
  }

  const handleSealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setSealPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSigUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setUploadedSig(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!name.trim() || !title.trim()) {
      toast({ title: 'Error', description: 'Name and Title are required.', variant: 'destructive' })
      return
    }

    setSaving(true)
    let sigData = ''

    if (method === 'draw' && canvasRef.current) {
      sigData = canvasRef.current.toDataURL('image/png')
    } else if (method === 'upload') {
      sigData = uploadedSig
    } else {
      sigData = typedText
    }

    const payload: SignatoryType = {
      id: editingId || undefined,
      name: name.trim(),
      title: title.trim(),
      department: department.trim(),
      email: email.trim(),
      method,
      signatureData: sigData,
      typedFont,
      typedText,
      sealPath: sealPreview,
    }

    try {
      const url = '/api/signatories'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast({ title: 'Success', description: `Signatory ${editingId ? 'updated' : 'added'} successfully.` })
        clearForm()
        fetchSignatories()
      } else {
        const d = await res.json()
        throw new Error(d.error)
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save signatory.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (sig: SignatoryType) => {
    setEditingId(sig.id || null)
    setName(sig.name)
    setTitle(sig.title)
    setDepartment(sig.department || '')
    setEmail(sig.email || '')
    setMethod(sig.method)
    setSealPreview(sig.sealPath || '')
    
    if (sig.method === 'upload') {
      setUploadedSig(sig.signatureData || '')
    } else if (sig.method === 'type') {
      setTypedText(sig.signatureData || '')
      setTypedFont(sig.typedFont || 'cursive-1')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/signatories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        toast({ title: 'Deleted', description: 'Signatory profile removed.' })
        fetchSignatories()
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete signatory.', variant: 'destructive' })
    }
  }

  const clearForm = () => {
    setEditingId(null)
    setName('')
    setTitle('')
    setDepartment('')
    setEmail('')
    setMethod('draw')
    setTypedText('')
    setUploadedSig('')
    setSealPreview('')
    clearCanvas()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2">
            <Signature className="w-4.5 h-4.5" style={{ color: brandColor }} />
            Digital Signatory Manager
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Add seals, stamps, and handwritten signatures for HR approvals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signatory Form Panel */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-border bg-background">
            <CardHeader className="py-4">
              <CardTitle className="text-[13px]">{editingId ? 'Edit Signatory Profile' : 'Add New Signatory'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[11px]">Signatory Full Name *</Label>
                  <Input value={name} onChange={e => { setName(e.target.value); if (method === 'type') setTypedText(e.target.value) }} placeholder="e.g. Saqib Ahmed" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Official Designation *</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Director Operations" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Department</Label>
                  <Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. HR & Administration" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Email Address</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="saqib@company.com" className="h-8 text-[12px]" />
                </div>
              </div>

              {/* Signature Generation Method */}
              <div className="space-y-3.5 pt-2">
                <Label className="text-[11px]">Signature Input Method</Label>
                <div className="flex gap-2 p-1.5 bg-muted/40 rounded-lg">
                  {['draw', 'upload', 'type'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`flex-1 py-1 rounded-md text-[11px] font-bold capitalize transition-all cursor-pointer ${
                        method === m
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {m} Signature
                    </button>
                  ))}
                </div>

                {/* Drawing Pad */}
                {method === 'draw' && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                      <span>Draw signature using mouse or touchpad</span>
                      <button onClick={clearCanvas} className="text-red-400 hover:text-red-500 font-semibold cursor-pointer">Clear Pad</button>
                    </div>
                    <canvas
                      ref={canvasRef}
                      width={480}
                      height={140}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full h-32 rounded-xl bg-black/60 border border-border shadow-inner cursor-crosshair"
                    />
                  </div>
                )}

                {/* Upload Image */}
                {method === 'upload' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground uppercase">Upload Transparent PNG/SVG</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-16 rounded border border-dashed flex items-center justify-center bg-muted/20 overflow-hidden">
                        {uploadedSig ? (
                          <img src={uploadedSig} alt="Uploaded signature" className="h-full object-contain p-1" />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">No image</span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Input type="file" accept="image/*" onChange={handleSigUpload} className="h-8 text-[11px] cursor-pointer" />
                        <p className="text-[9px] text-muted-foreground">Transparent background PNG is highly recommended.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cursive Font Typing */}
                {method === 'type' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-[11px]">Type Signature Text</Label>
                      <Input value={typedText} onChange={e => setTypedText(e.target.value)} placeholder="Saqib Ahmed" className="h-8 text-[12px]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] text-muted-foreground uppercase">Choose Typeface Font</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'cursive-1', label: 'Playball Style', class: 'font-[family-name:Georgia] italic' },
                          { id: 'cursive-2', label: 'Signature Cursive', class: 'font-serif italic font-semibold' },
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setTypedFont(f.id)}
                            className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                              typedFont === f.id ? 'border-primary bg-accent' : 'border-border bg-background'
                            }`}
                            style={{ borderColor: typedFont === f.id ? brandColor : undefined }}
                          >
                            <p className="text-[10px] text-muted-foreground mb-1">{f.label}</p>
                            <p className={`text-base leading-none text-foreground truncate ${f.class}`}>
                              {typedText || 'Signature'}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Seal Stamp Upload */}
              <div className="space-y-2 pt-3 border-t border-border">
                <Label className="text-[11px]">Official Seal / Stamp (Optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-dashed flex items-center justify-center bg-muted/20 overflow-hidden">
                    {sealPreview ? (
                      <img src={sealPreview} alt="Seal Stamp" className="h-full object-contain p-2" />
                    ) : (
                      <span className="text-[9px] text-muted-foreground">No Seal</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Input type="file" accept="image/*" onChange={handleSealUpload} className="h-8 text-[11px] cursor-pointer" />
                    <p className="text-[9px] text-muted-foreground">Upload scanned stamp PNG with alpha transparent channel.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-border">
                {editingId && <Button onClick={clearForm} variant="ghost" className="h-8 text-[11px] cursor-pointer">Cancel</Button>}
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  size="sm"
                  className="gap-1.5 text-white h-8 cursor-pointer"
                  style={{ background: brandColor }}
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Signatory
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Directory Signatories List */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-semibold text-foreground">Signatories List</h3>
          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex justify-center gap-2 items-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
          ) : signatories.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <ShieldAlert className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-[11px] text-muted-foreground">No signatories defined yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {signatories.map((sig) => (
                <Card key={sig.id} className="border-border bg-background hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-3.5 relative">
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div>
                        <h4 className="text-[12px] font-bold text-foreground truncate">{sig.name}</h4>
                        <p className="text-[10px] text-muted-foreground leading-tight">{sig.title} • {sig.department}</p>
                      </div>
                      
                      {/* Signature Preview */}
                      <div className="h-10 w-full bg-muted/40 rounded flex items-center justify-center overflow-hidden border border-border/40 p-1">
                        {sig.method === 'type' ? (
                          <span className={`text-sm italic text-foreground ${sig.typedFont === 'cursive-2' ? 'font-serif' : 'font-sans'}`}>{sig.signatureData}</span>
                        ) : sig.signatureData ? (
                          <img src={sig.signatureData} alt="signature" className="h-full object-contain filter invert dark:invert-0" />
                        ) : (
                          <span className="text-[9px] text-muted-foreground">No sign</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => handleEdit(sig)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(sig.id!)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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
