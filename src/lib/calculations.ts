// ─── Calculation helpers for HR documents ───

export function calculateGross(d: Record<string, any>): number {
  return (
    (Number(d.basic) || 0) +
    (Number(d.house_rent) || 0) +
    (Number(d.conveyance) || 0) +
    (Number(d.medical) || 0) +
    (Number(d.food_mobile) || 0) +
    (Number(d.cash) || 0)
  )
}

export function calculateNet(d: Record<string, any>): number {
  return calculateGross(d) - (Number(d.tax) || 0)
}

export function calculateBankTotal(d: Record<string, any>): number {
  return calculateGross(d) - (Number(d.cash) || 0)
}

export function formatBDT(amount: number): string {
  // Format in Indian/Bangladeshi style: 4,00,000.00
  const parts = Math.abs(amount).toFixed(2).split('.')
  let intPart = parts[0]
  const decPart = parts[1]
  const sign = amount < 0 ? '-' : ''

  // Indian numbering: first 3 digits from right, then groups of 2
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3)
    const rest = intPart.slice(0, -3)
    const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')
    intPart = formatted + ',' + last3
  }

  return sign + intPart + '.' + decPart
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const day = d.getDate()
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th'
    return `${day}${suffix} ${months[d.getMonth()]}, ${d.getFullYear()}`
  } catch {
    return dateStr
  }
}

export function formatMonthYear(month: number, year: number): string {
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const m = months[(month - 1) % 12] || 'January'
  return `${m}-${year}`
}

export function calculateDuration(start: string, end: string): string {
  if (!start || !end) return ''
  try {
    const s = new Date(start)
    const e = new Date(end)
    let years = e.getFullYear() - s.getFullYear()
    let months = e.getMonth() - s.getMonth()
    if (months < 0) { years--; months += 12 }
    const parts: string[] = []
    if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`)
    if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`)
    return parts.join(' ') || '0 months'
  } catch {
    return ''
  }
}

const ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
  'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
const TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']

function convertHundreds(n: number): string {
  if (n === 0) return ''
  if (n < 20) return ONES[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '')
  return ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertHundreds(n % 100) : '')
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero'
  if (num < 0) return 'Minus ' + numberToWords(-num)

  const lakh = 100000
  const crore = 10000000

  let result = ''

  if (num >= crore) {
    result += convertHundreds(Math.floor(num / crore)) + ' Crore '
    num %= crore
  }
  if (num >= lakh) {
    result += convertHundreds(Math.floor(num / lakh)) + ' Lakh '
    num %= lakh
  }
  if (num >= 1000) {
    result += convertHundreds(Math.floor(num / 1000)) + ' Thousand '
    num %= 1000
  }
  if (num > 0) {
    result += convertHundreds(num)
  }

  return result.trim() + ' Only'
}
