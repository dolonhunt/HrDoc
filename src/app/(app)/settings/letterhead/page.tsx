'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { FileText, Save, Plus, Trash2, Edit2, ShieldAlert, Loader2, Check } from 'lucide-react'
import { useWorkspace } from '@/components/workspace-provider'

interface LetterheadType {
  id?: string
  name: string
  isDefault: boolean
  companyName: string
  logoPath: string
  tagline?: string
  address1: string
  address2?: string
  phone?: string
  email?: string
  website?: string
  headerLayout: string
  fullImageHeader?: string
  headerBgColor: string
  accentColor: string
  footerText?: string
  footerLayout: string
  fullImageFooter?: string
  paperSize: string
  marginTop: number
  marginBottom: number
  marginLeft: number
  marginRight: number
}

export default function LetterheadManagerPage() {
  const { company } = useWorkspace()
  const { toast } = useToast()

  const [profiles, setProfiles] = useState<LetterheadType[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [name, setName] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [tagline, setTagline] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [headerLayout, setHeaderLayout] = useState('LogoLeft')
  const [headerBgColor, setHeaderBgColor] = useState('#FFFFFF')
  const [accentColor, setAccentColor] = useState('#6C63FF')
  const [footerText, setFooterText] = useState('')
  const [footerLayout, setFooterLayout] = useState('TextOnly')
  const [paperSize, setPaperSize] = useState('A4')
  const [marginTop, setMarginTop] = useState(15)
  const [marginBottom, setMarginSet] = useState(15)
  const [marginLeft, setMarginLeft] = useState(15)
  const [marginRight, setMarginRight] = useState(15)

  // Upload previews
  const [logoPreview, setLogoPreview] = useState('')
  const [fullHeaderPreview, setFullHeaderPreview] = useState('')
  const [fullFooterPreview, setFullFooterPreview] = useState('')

  const logoRef = useRef<HTMLInputElement>(null)
  const headerRef = useRef<HTMLInputElement>(null)
  const footerRef = useRef<HTMLInputElement>(null)

  const brandColor = company?.brand_color || '#6C63FF'

  const fetchProfiles = async () => {
    try {
      const res = await fetch('/api/letterheads')
      if (res.ok) {
        const data = await res.json()
        setProfiles(data)
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load letterheads.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setter(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: 'Error', description: 'Profile name is required.', variant: 'destructive' })
      return
    }

    setSaving(true)
    const payload: LetterheadType = {
      id: editingId || undefined,
      name: name.trim(),
      isDefault,
      companyName: companyName.trim(),
      logoPath: logoPreview,
      tagline: tagline.trim(),
      address1: address1.trim(),
      address2: address2.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      headerLayout,
      fullImageHeader: fullHeaderPreview,
      headerBgColor,
      accentColor,
      footerText: footerText.trim(),
      footerLayout,
      fullImageFooter: fullFooterPreview,
      paperSize,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
    }

    try {
      const url = '/api/letterheads'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast({ title: 'Success', description: `Letterhead ${editingId ? 'updated' : 'created'} successfully.` })
        clearForm()
        fetchProfiles()
      } else {
        const d = await res.json()
        throw new Error(d.error)
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save letterhead profile.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (prof: LetterheadType) => {
    setEditingId(prof.id || null)
    setName(prof.name)
    setIsDefault(prof.isDefault)
    setCompanyName(prof.companyName)
    setLogoPreview(prof.logoPath || '')
    setTagline(prof.tagline || '')
    setAddress1(prof.address1)
    setAddress2(prof.address2 || '')
    setPhone(prof.phone || '')
    setEmail(prof.email || '')
    setWebsite(prof.website || '')
    setHeaderLayout(prof.headerLayout)
    setFullHeaderPreview(prof.fullImageHeader || '')
    setHeaderBgColor(prof.headerBgColor)
    setAccentColor(prof.accentColor)
    setFooterText(prof.footerText || '')
    setFooterLayout(prof.footerLayout)
    setFullFooterPreview(prof.fullImageFooter || '')
    setPaperSize(prof.paperSize)
    setMarginTop(prof.marginTop)
    setMarginSet(prof.marginBottom)
    setMarginLeft(prof.marginLeft)
    setMarginRight(prof.marginRight)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/letterheads', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        toast({ title: 'Deleted', description: 'Letterhead profile removed.' })
        fetchProfiles()
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete letterhead profile.', variant: 'destructive' })
    }
  }

  const clearForm = () => {
    setEditingId(null)
    setName('')
    setIsDefault(false)
    setCompanyName('')
    setLogoPreview('')
    setTagline('')
    setAddress1('')
    setAddress2('')
    setPhone('')
    setEmail('')
    setWebsite('')
    setHeaderLayout('LogoLeft')
    setFullHeaderPreview('')
    setHeaderBgColor('#FFFFFF')
    setAccentColor('#6C63FF')
    setFooterText('')
    setFooterLayout('TextOnly')
    setFullFooterPreview('')
    setPaperSize('A4')
    setMarginTop(15)
    setMarginSet(15)
    setMarginLeft(15)
    setMarginRight(15)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4.5 h-4.5" style={{ color: brandColor }} />
            Letterhead Profiles Manager
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage separate letterhead layouts non-destructively for document templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Letterhead Profiles Form */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-border bg-background">
            <CardHeader className="py-4">
              <CardTitle className="text-[13px]">{editingId ? 'Edit Letterhead Design' : 'Create New Profile'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-[11px]">Profile Name *</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Minimal 2026" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Company Display Name</Label>
                  <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Beyond Headlines" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-[11px]">Slogan / Tagline</Label>
                  <Input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="e.g. Innovation in Journalism" className="h-8 text-[12px]" />
                </div>
              </div>

              {/* Layout Styles */}
              <div className="space-y-3.5 pt-2 border-t border-border">
                <Label className="text-[11px] font-bold">Header Layout Settings</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'LogoLeft', label: 'Logo Left' },
                    { id: 'LogoCenter', label: 'Logo Center' },
                    { id: 'LogoRight', label: 'Logo Right' },
                    { id: 'FullImage', label: 'Full Image' },
                  ].map(l => (
                    <button
                      key={l.id}
                      onClick={() => setHeaderLayout(l.id)}
                      className={`py-1.5 px-2 rounded border text-[11px] font-semibold cursor-pointer text-center transition-all ${
                        headerLayout === l.id ? 'border-primary bg-accent' : 'border-border bg-background text-muted-foreground'
                      }`}
                      style={{ borderColor: headerLayout === l.id ? brandColor : undefined }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                {headerLayout === 'FullImage' ? (
                  <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground uppercase">Upload Full Scanned Pad Header</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-40 h-12 rounded border border-dashed flex items-center justify-center bg-muted/20 overflow-hidden">
                        {fullHeaderPreview ? (
                          <img src={fullHeaderPreview} alt="Header Preview" className="h-full w-full object-contain" />
                        ) : (
                          <span className="text-[10px] text-muted-foreground">No Header Image</span>
                        )}
                      </div>
                      <Input type="file" ref={headerRef} accept="image/*" onChange={e => handleImageUpload(e, setFullHeaderPreview)} className="h-8 text-[11px]" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-[10px] text-muted-foreground uppercase">Upload Logo</Label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded border border-dashed flex items-center justify-center bg-muted/20 overflow-hidden">
                        {logoPreview ? (
                          <img src={logoPreview} alt="Logo" className="h-full object-contain p-1" />
                        ) : (
                          <span className="text-[9px] text-muted-foreground">No Logo</span>
                        )}
                      </div>
                      <Input type="file" ref={logoRef} accept="image/*" onChange={e => handleImageUpload(e, setLogoPreview)} className="h-8 text-[11px]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Address details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="space-y-1">
                  <Label className="text-[11px]">Address Line 1</Label>
                  <Input value={address1} onChange={e => setAddress1(e.target.value)} placeholder="House, Road, Block..." className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Address Line 2</Label>
                  <Input value={address2} onChange={e => setAddress2(e.target.value)} placeholder="Area, City, ZIP..." className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Phone</Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880..." className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px]">Email</Label>
                  <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="contact@company.com" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-[11px]">Website</Label>
                  <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.company.com" className="h-8 text-[12px]" />
                </div>
              </div>

              {/* Borders, Margins, Paper */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[11px]">Paper Size</Label>
                    <select value={paperSize} onChange={e => setPaperSize(e.target.value)} className="w-full h-8 rounded-md border border-input bg-background px-3 text-[12px]">
                      <option value="A4">A4 (210mm x 297mm)</option>
                      <option value="Letter">Letter (8.5" x 11")</option>
                      <option value="Legal">Legal (8.5" x 14")</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Accent Line Color</Label>
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded border" style={{ background: accentColor }} />
                      <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} className="h-8 text-[12px] font-mono" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-bold">Margins (in millimeters)</Label>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase">Top</Label>
                      <Input type="number" value={marginTop} onChange={e => setMarginTop(Number(e.target.value))} className="h-8 text-[12px]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase">Bottom</Label>
                      <Input type="number" value={marginBottom} onChange={e => setMarginSet(Number(e.target.value))} className="h-8 text-[12px]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase">Left</Label>
                      <Input type="number" value={marginLeft} onChange={e => setMarginLeft(Number(e.target.value))} className="h-8 text-[12px]" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase">Right</Label>
                      <Input type="number" value={marginRight} onChange={e => setMarginRight(Number(e.target.value))} className="h-8 text-[12px]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Set Default */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="space-y-0.5">
                  <Label className="text-[11px]">Set as Workspace Default</Label>
                  <p className="text-[9px] text-muted-foreground">This letterhead style will be loaded automatically on document edits.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={e => setIsDefault(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-400"></div>
                </label>
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
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profiles List */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-semibold text-foreground">Designs Directory</h3>
          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex justify-center gap-2 items-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
          ) : profiles.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-6 text-center">
                <ShieldAlert className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-[11px] text-muted-foreground">No custom letterheads found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {profiles.map((prof) => (
                <Card key={prof.id} className="border-border bg-background hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-3 relative">
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[12px] font-bold text-foreground truncate">{prof.name}</h4>
                        {prof.isDefault && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{prof.companyName || 'Beyond Headlines'}</p>
                      
                      {/* Margins summary */}
                      <p className="text-[9px] text-muted-foreground/70 font-mono">
                        Margins: {prof.marginTop}t / {prof.marginBottom}b / {prof.marginLeft}l / {prof.marginRight}r (mm)
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-shrink-0 justify-center">
                      <button onClick={() => handleEdit(prof)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer" title="Edit"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(prof.id!)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
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
