import { format, parseISO, isValid } from 'date-fns'

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return format(date, 'd MMM yyyy')
  } catch {
    return dateString
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPricePerWeek(amount: number): string {
  return `${formatCurrency(amount)}/week`
}

