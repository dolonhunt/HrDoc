import type { CompanyConfig, Employee } from '@/lib/storage'

export async function bootstrapStorage(): Promise<void> {
  const res = await fetch('/api/bootstrap', { method: 'POST' })
  if (!res.ok) throw new Error('Bootstrap failed')
}

export async function getAllEmployees(): Promise<Employee[]> {
  const res = await fetch('/api/employees', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch employees')
  return res.json()
}

export async function saveEmployee(emp: Employee): Promise<void> {
  const res = await fetch('/api/employees', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emp),
  })
  if (!res.ok) throw new Error('Failed to save employee')
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch('/api/employees', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error('Failed to delete employee')
}

export async function getCompany(): Promise<CompanyConfig> {
  const res = await fetch('/api/company', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch company')
  return res.json()
}
