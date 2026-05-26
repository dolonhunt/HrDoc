'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Building2, Save, Upload, Palette, Phone, Mail, User, MapPin, Check, Loader2 } from 'lucide-react'
import { useWorkspace } from '@/components/workspace-provider'
import type { CompanyConfig } from '@/lib/storage'

export default function CompanySettingsPage() {
  const { company, updateCompany } = useWorkspace()
  const { toast } = useToast()
  
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<CompanyConfig | null>(null)
  const [logoPreview, setLogoPreview] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (company) {
      setForm({ ...company })
      setLogoPreview(company.logo_path)
    }
  }, [company])

  if (!form) return null

  const updateField = (field: keyof CompanyConfig, value: string) => {
    setForm(prev => prev ? ({ ...prev, [field]: value }) : null)
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Logo must be under 2MB', variant: 'destructive' })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setLogoPreview(base64)
      updateField('logo_path', base64)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Error', description: 'Company name is required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/company', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed to save')
      updateCompany(form)
      toast({ title: 'Success', description: 'Company settings saved successfully.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const presetColors = [
    '#6C63FF', '#00D4AA', '#FF2109', '#DC2626', '#EA580C',
    '#D97706', '#CA8A04', '#16A34A', '#059669', '#0D9488',
    '#0891B2', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED',
    '#C026D3', '#DB2777', '#E11D48', '#1E293B', '#475569',
  ]

  const brandColor = form.brand_color || '#6C63FF'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-4.5 h-4.5" style={{ color: brandColor }} />
            Company Profile Settings
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Manage details linked in document headers and templates.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="gap-2 text-white h-8 cursor-pointer"
          style={{ background: brandColor }}
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Profile
        </Button>
      </div>

      {/* Brand Identity */}
      <Card className="border-border">
        <CardHeader className="py-4">
          <CardTitle className="text-[13px] flex items-center gap-2">
            <Palette className="w-4 h-4" style={{ color: brandColor }} />
            Brand Identity
          </CardTitle>
          <CardDescription className="text-[11px]">Customize logo and accent color for the platform interface and defaults.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-2">
          {/* Logo */}
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Company Logo</Label>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogoClick}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted/30 cursor-pointer"
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <Upload className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              <div className="space-y-1">
                <Button variant="outline" size="sm" onClick={handleLogoClick} className="h-7 text-[11px] gap-1 cursor-pointer">
                  <Upload className="w-3 h-3" /> Upload Logo
                </Button>
                <p className="text-[10px] text-muted-foreground">PNG, JPG, SVG. Max 2MB.</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Brand Color */}
          <div className="space-y-2">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Brand Accent Color</Label>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg border border-border shadow-sm flex-shrink-0"
                style={{ background: brandColor }}
              />
              <Input
                value={form.brand_color}
                onChange={e => updateField('brand_color', e.target.value)}
                className="w-24 h-8 text-[12px] font-mono"
                placeholder="#6C63FF"
              />
              <div className="flex gap-1 flex-wrap">
                {presetColors.map(c => (
                  <button
                    key={c}
                    onClick={() => updateField('brand_color', c)}
                    className="w-5.5 h-5.5 rounded-full border border-border/50 hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
                    style={{ background: c }}
                  >
                    {form.brand_color === c && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card className="border-border">
        <CardHeader className="py-4">
          <CardTitle className="text-[13px] flex items-center gap-2">
            <Building2 className="w-4 h-4" style={{ color: brandColor }} />
            Company Information
          </CardTitle>
          <CardDescription className="text-[11px]">Specify office addresses, phone contacts, and proprietor signatures.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-[11px] flex items-center gap-1"><Building2 className="w-3 h-3" /> Company Name *</Label>
              <Input value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Beyond Headlines" className="h-8 text-[12px]" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] flex items-center gap-1"><User className="w-3 h-3" /> Proprietor Name</Label>
              <Input value={form.proprietor_name} onChange={e => updateField('proprietor_name', e.target.value)} placeholder="e.g. Saqib Ahmed" className="h-8 text-[12px]" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] flex items-center gap-1"><User className="w-3 h-3" /> Proprietor Designation</Label>
              <Input value={form.proprietor_designation} onChange={e => updateField('proprietor_designation', e.target.value)} placeholder="e.g. Proprietor" className="h-8 text-[12px]" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] flex items-center gap-1"><Phone className="w-3 h-3" /> Contact Phone</Label>
              <Input value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+880-2..." className="h-8 text-[12px]" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[11px] flex items-center gap-1"><Mail className="w-3 h-3" /> Contact Email</Label>
              <Input value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="info@company.com" className="h-8 text-[12px]" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] flex items-center gap-1"><MapPin className="w-3 h-3" /> Registered Office Address</Label>
            <textarea
              value={form.address}
              onChange={e => updateField('address', e.target.value)}
              placeholder="Full office address..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-[12px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Design Preview */}
      <Card className="border-border">
        <CardHeader className="py-3">
          <CardTitle className="text-[12px]">Letterhead Branding Preview</CardTitle>
        </CardHeader>
        <CardContent className="py-2 pb-4">
          <div className="border border-border rounded-xl p-4 flex items-center gap-4 bg-muted/20">
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="h-10 object-contain" />
            )}
            <div>
              <p className="text-[13px] font-bold" style={{ color: brandColor }}>{form.name || 'Your Company'}</p>
              <p className="text-[10px] text-muted-foreground">{form.address || 'Office address'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
