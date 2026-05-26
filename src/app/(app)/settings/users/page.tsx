'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Users, UserPlus, Trash2, Key, Loader2, ShieldCheck, Check } from 'lucide-react'
import { useWorkspace } from '@/components/workspace-provider'

interface UserType {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

export default function UserRolesPage() {
  const { company } = useWorkspace()
  const { toast } = useToast()

  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)

  // Form states
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState('HR_Admin')

  const brandColor = company?.brand_color || '#6C63FF'

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load users list.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || !inviteRole) {
      toast({ title: 'Error', description: 'Email and role are required.', variant: 'destructive' })
      return
    }

    setInviting(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inviteName.trim(),
          email: inviteEmail.trim().toLowerCase(),
          role: inviteRole,
        }),
      })

      if (res.ok) {
        toast({ title: 'Success', description: 'User invite created successfully.' })
        setInviteEmail('')
        setInviteName('')
        fetchUsers()
      } else {
        const d = await res.json()
        throw new Error(d.error)
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create user.', variant: 'destructive' })
    } finally {
      setInviting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (id === 'admin-default') {
      toast({ title: 'Error', description: 'Cannot delete default Super Admin.', variant: 'destructive' })
      return
    }

    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        toast({ title: 'Success', description: 'User removed successfully.' })
        fetchUsers()
      } else {
        const d = await res.json()
        throw new Error(d.error)
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to delete user.', variant: 'destructive' })
    }
  }

  // Permissions matrix definition
  const permissionRoles = [
    { name: 'Generate Documents', super: true, admin: true, manager: true, view: false },
    { name: 'Edit Templates', super: true, admin: true, manager: false, view: false },
    { name: 'Approve & Digital Sign', super: true, admin: false, manager: true, view: false },
    { name: 'Manage Company Letterhead', super: true, admin: false, manager: false, view: false },
    { name: 'Invite/Remove Users', super: true, admin: false, manager: false, view: false },
    { name: 'Download PDF/DOCX logs', super: true, admin: true, manager: true, view: true },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2">
            <Users className="w-4.5 h-4.5" style={{ color: brandColor }} />
            User Roles & Invitations
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Invite team members and manage role-based authorization scopes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User invites form */}
        <div className="lg:col-span-2 space-y-5">
          <Card className="border-border bg-background">
            <CardHeader className="py-4">
              <CardTitle className="text-[13px] flex items-center gap-2">
                <UserPlus className="w-4 h-4" style={{ color: brandColor }} />
                Invite Team Member
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[11px]">User Full Name</Label>
                    <Input value={inviteName} onChange={e => setInviteName(e.target.value)} placeholder="e.g. Syed Ashfaqul Haque" className="h-8 text-[12px]" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Work Email *</Label>
                    <Input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="name@company.com" className="h-8 text-[12px]" required />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Access Permission Role *</Label>
                    <select
                      value={inviteRole}
                      onChange={e => setInviteRole(e.target.value)}
                      className="w-full h-8 rounded-md border border-input bg-background px-3 text-[12px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="Super_Admin">Super Admin (Full Workspace Ownership)</option>
                      <option value="HR_Admin">HR Admin (Create / Edit documents & templates)</option>
                      <option value="HR_Manager">HR Manager (Approve, Sign & Review)</option>
                      <option value="View_Only">View Only (Read documents & Download)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-border">
                  <Button
                    type="submit"
                    disabled={inviting}
                    size="sm"
                    className="gap-1.5 text-white h-8 cursor-pointer"
                    style={{ background: brandColor }}
                  >
                    {inviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                    Send Invite
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Permissions Matrix */}
          <Card className="border-border bg-background">
            <CardHeader className="py-4">
              <CardTitle className="text-[13px] flex items-center gap-2">
                <Key className="w-4 h-4" style={{ color: brandColor }} />
                Role Permissions Matrix
              </CardTitle>
              <CardDescription className="text-[11px]">Summary of active features allowed for each role.</CardDescription>
            </CardHeader>
            <CardContent className="py-2">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-muted/20">
                    <th className="text-left px-3 py-2 text-muted-foreground font-semibold uppercase tracking-wider">Scope Feature</th>
                    <th className="text-center px-2 py-2 text-muted-foreground font-semibold uppercase tracking-wider">Super</th>
                    <th className="text-center px-2 py-2 text-muted-foreground font-semibold uppercase tracking-wider">Admin</th>
                    <th className="text-center px-2 py-2 text-muted-foreground font-semibold uppercase tracking-wider">Manager</th>
                    <th className="text-center px-2 py-2 text-muted-foreground font-semibold uppercase tracking-wider">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {permissionRoles.map((row, idx) => (
                    <tr key={idx} className="hover:bg-accent/30 transition-colors">
                      <td className="px-3 py-2 text-foreground font-medium">{row.name}</td>
                      <td className="px-2 py-2 text-center">{row.super ? <Check className="w-3.5 h-3.5 mx-auto text-emerald-400" /> : '—'}</td>
                      <td className="px-2 py-2 text-center">{row.admin ? <Check className="w-3.5 h-3.5 mx-auto text-emerald-400" /> : '—'}</td>
                      <td className="px-2 py-2 text-center">{row.manager ? <Check className="w-3.5 h-3.5 mx-auto text-emerald-400" /> : '—'}</td>
                      <td className="px-2 py-2 text-center">{row.view ? <Check className="w-3.5 h-3.5 mx-auto text-emerald-400" /> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Users list Panel */}
        <div className="space-y-4">
          <h3 className="text-[13px] font-semibold text-foreground">Workspace Users</h3>
          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground flex justify-center gap-2 items-center"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
          ) : (
            <div className="space-y-3">
              {users.map((item) => (
                <Card key={item.id} className="border-border bg-background hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex gap-3 relative">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-[12px] font-bold text-foreground truncate">{item.name || 'Invited User'}</h4>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-primary/10 text-primary border border-primary/20 uppercase">
                          {item.role.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{item.email}</p>
                      <p className="text-[8px] text-muted-foreground/50">Joined {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>

                    {item.id !== 'admin-default' && (
                      <div className="flex flex-col justify-center flex-shrink-0">
                        <button onClick={() => handleDelete(item.id)} className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 cursor-pointer" title="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    )}
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
