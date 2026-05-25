"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  Building2, Save, Upload, Palette, Phone, Mail, User, MapPin,
  Check, Loader2
} from "lucide-react"
import type { CompanyConfig } from "@/lib/storage"

interface SettingsViewProps {
  company: CompanyConfig
  onUpdate: (company: CompanyConfig) => void
  brandColor: string
}

export function SettingsView({ company, onUpdate, brandColor }: SettingsViewProps) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<CompanyConfig>({ ...company })
  const [logoPreview, setLogoPreview] = useState(company.logo_path)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateField = (field: keyof CompanyConfig, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Error", description: "Logo must be under 2MB", variant: "destructive" })
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
      toast({ title: "Error", description: "Company name is required", variant: "destructive" })
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
      onUpdate(form)
      toast({ title: "Success", description: "Company settings saved." })
    } catch {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const presetColors = [
    '#FF2109', '#DC2626', '#EA580C', '#D97706', '#CA8A04',
    '#65A30D', '#16A34A', '#059669', '#0D9488', '#0891B2',
    '#0284C7', '#2563EB', '#4F46E5', '#7C3AED', '#9333EA',
    '#C026D3', '#DB2777', '#E11D48', '#1E293B', '#475569',
  ]

  return (
    <div className="flex-1 bg-muted/30 flex flex-col overflow-hidden">
      <div className="h-14 border-b border-border bg-background flex items-center justify-between px-6 flex-shrink-0">
        <h2 className="text-[15px] font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-5 h-5" style={{ color: brandColor }} />
          Company Settings
        </h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="gap-2 text-white h-8"
          style={{ background: brandColor }}
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Changes
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Branding */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[14px] flex items-center gap-2">
                <Palette className="w-4 h-4" style={{ color: brandColor }} />
                Brand Identity
              </CardTitle>
              <CardDescription className="text-[12px]">Customize your company branding for documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Logo */}
              <div className="space-y-2">
                <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLogoClick}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center overflow-hidden bg-muted"
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <Button variant="outline" size="sm" onClick={handleLogoClick} className="h-7 text-[11px] gap-1">
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
                <Label className="text-[11px] text-muted-foreground uppercase tracking-wider">Brand Color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg border border-border shadow-sm"
                    style={{ background: form.brand_color }}
                  />
                  <Input
                    value={form.brand_color}
                    onChange={e => updateField('brand_color', e.target.value)}
                    className="w-28 h-8 text-[12px] font-mono"
                    placeholder="#FF2109"
                  />
                  <div className="flex gap-1 flex-wrap">
                    {presetColors.map(c => (
                      <button
                        key={c}
                        onClick={() => updateField('brand_color', c)}
                        className="w-6 h-6 rounded-full border border-border/50 hover:scale-110 transition-transform"
                        style={{ background: c }}
                      >
                        {form.brand_color === c && <Check className="w-3 h-3 text-white mx-auto" strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[14px] flex items-center gap-2">
                <Building2 className="w-4 h-4" style={{ color: brandColor }} />
                Company Information
              </CardTitle>
              <CardDescription className="text-[12px]">Basic company details for document headers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] flex items-center gap-1"><Building2 className="w-3 h-3" /> Company Name *</Label>
                  <Input value={form.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Beyond Headlines" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] flex items-center gap-1"><User className="w-3 h-3" /> Proprietor Name</Label>
                  <Input value={form.proprietor_name} onChange={e => updateField('proprietor_name', e.target.value)} placeholder="e.g. John Doe" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] flex items-center gap-1"><User className="w-3 h-3" /> Proprietor Designation</Label>
                  <Input value={form.proprietor_designation} onChange={e => updateField('proprietor_designation', e.target.value)} placeholder="e.g. Proprietor" className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</Label>
                  <Input value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+880..." className="h-8 text-[12px]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] flex items-center gap-1"><Mail className="w-3 h-3" /> Email</Label>
                  <Input value={form.email} onChange={e => updateField('email', e.target.value)} placeholder="info@company.com" className="h-8 text-[12px]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] flex items-center gap-1"><MapPin className="w-3 h-3" /> Office Address</Label>
                <textarea
                  value={form.address}
                  onChange={e => updateField('address', e.target.value)}
                  placeholder="Full office address..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[12px] ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[14px]">Preview</CardTitle>
              <CardDescription className="text-[12px]">How your branding will appear on documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg p-4 flex items-center gap-4">
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" className="h-10 object-contain" />
                )}
                <div>
                  <p className="text-[14px] font-bold" style={{ color: form.brand_color }}>{form.name || 'Your Company'}</p>
                  <p className="text-[11px] text-muted-foreground">{form.address || 'Office address'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pb-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 text-white h-9 px-6"
              style={{ background: brandColor }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
