'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from 'next-themes'
import { Settings, Save, Moon, Sun, Monitor, Loader2 } from 'lucide-react'
import { useWorkspace } from '@/components/workspace-provider'

export default function PreferencesPage() {
  const { company } = useWorkspace()
  const { toast } = useToast()
  
  // Try to use next-themes if possible
  let themeHook: any = null
  try {
    const { useTheme: useNextTheme } = require('next-themes')
    themeHook = useNextTheme()
  } catch {}

  const [saving, setSaving] = useState(false)
  const [theme, setTheme] = useState('system')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [exportFormat, setExportFormat] = useState('pdf')
  const [autoSave, setAutoSave] = useState(true)

  useEffect(() => {
    if (themeHook) {
      setTheme(themeHook.theme || 'system')
    }
  }, [themeHook])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (themeHook) {
        themeHook.setTheme(theme)
      }
      toast({ title: 'Success', description: 'Preferences updated successfully.' })
    } catch {
      toast({ title: 'Error', description: 'Failed to update preferences.', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  const brandColor = company?.brand_color || '#6C63FF'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2">
            <Settings className="w-4.5 h-4.5" style={{ color: brandColor }} />
            Application Preferences
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Customize UI display theme, regional date formats, and defaults.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="gap-2 text-white h-8 cursor-pointer"
          style={{ background: brandColor }}
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Preferences
        </Button>
      </div>

      {/* Theme Card */}
      <Card className="border-border">
        <CardHeader className="py-4">
          <CardTitle className="text-[13px] flex items-center gap-2">Appearance Theme</CardTitle>
          <CardDescription className="text-[11px]">Select your default theme look for the app interface.</CardDescription>
        </CardHeader>
        <CardContent className="py-2 pb-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light', icon: <Sun className="w-4.5 h-4.5" /> },
              { id: 'dark', label: 'Dark', icon: <Moon className="w-4.5 h-4.5" /> },
              { id: 'system', label: 'System', icon: <Monitor className="w-4.5 h-4.5" /> },
            ].map(t => {
              const active = theme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                    active
                      ? 'bg-accent/40 border-primary shadow-sm text-foreground'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-accent/20'
                  }`}
                  style={{ borderColor: active ? brandColor : undefined }}
                >
                  <div className="mb-2" style={{ color: active ? brandColor : undefined }}>{t.icon}</div>
                  <span className="text-[11px] font-semibold">{t.label}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Formatting & Behavior */}
      <Card className="border-border">
        <CardHeader className="py-4">
          <CardTitle className="text-[13px]">Formats & Exporters</CardTitle>
          <CardDescription className="text-[11px]">Adjust values applied automatically on document creation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-2">
          {/* Date Format */}
          <div className="space-y-1.5">
            <Label className="text-[11px]">Default Date Format</Label>
            <select
              value={dateFormat}
              onChange={e => setDateFormat(e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-3 text-[12px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g., 27/05/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g., 05/27/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g., 2026-05-27)</option>
            </select>
          </div>

          {/* Export Format */}
          <div className="space-y-1.5">
            <Label className="text-[11px]">Primary Download Format</Label>
            <select
              value={exportFormat}
              onChange={e => setExportFormat(e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-3 text-[12px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="pdf">PDF Document (*.pdf)</option>
              <option value="doc">Word Document (*.doc)</option>
            </select>
          </div>

          {/* Auto-save */}
          <div className="flex items-center justify-between pt-1">
            <div className="space-y-0.5">
              <Label className="text-[11px]">Auto-Save Drafts</Label>
              <p className="text-[10px] text-muted-foreground">Keep unfinished document generations saved automatically.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={e => setAutoSave(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-400"></div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
