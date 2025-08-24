import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function getDateRange(range) {
  const now = new Date()
  const ranges = {
    'last_month': {
      start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      end: new Date(now.getFullYear(), now.getMonth(), 0)
    },
    'last_3_months': {
      start: new Date(now.getFullYear(), now.getMonth() - 3, 1),
      end: now
    },
    'this_year': {
      start: new Date(now.getFullYear(), 0, 1),
      end: now
    }
  }
  
  return ranges[range] || ranges['last_3_months']
}
