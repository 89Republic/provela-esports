import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Division } from '@/lib/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** First media image — same source as the division detail hero. */
export function getDivisionHeroImage(division: Division): string {
  const hero = division.media.find((item) => item.type === 'image' && item.url.trim())
  return hero?.url.trim() || '/images/hero.png'
}

const CEDIS_FORMATTER = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  maximumFractionDigits: 0,
})

const COMPACT_CEDIS_FORMATTER = new Intl.NumberFormat('en-GH', {
  style: 'currency',
  currency: 'GHS',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function parsePrizeAmount(value: string): number | null {
  const normalized = value.trim()
  if (!normalized) return null

  const digits = normalized.replace(/[^0-9.]/g, '')
  if (!digits) return null

  const amount = Number(digits)
  return Number.isFinite(amount) ? amount : null
}

export function formatCedis(amount: number, compact = false): string {
  return (compact ? COMPACT_CEDIS_FORMATTER : CEDIS_FORMATTER).format(amount)
}

export function formatPrizePool(value: string): string {
  const amount = parsePrizeAmount(value)
  if (amount === null) return value
  return formatCedis(amount)
}
