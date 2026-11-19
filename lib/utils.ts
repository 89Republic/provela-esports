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

/**
 * Prize split for display: the currency unit ("GH₵") set small beside the figure ("5,000"),
 * so the number reads first. Falls back to the raw text as the figure.
 */
export function formatPrizeParts(value: string): { unit: string; amount: string } {
  const amount = parsePrizeAmount(value)
  if (amount === null) return { unit: '', amount: value }
  const parts = CEDIS_FORMATTER.formatToParts(amount)
  return {
    unit: parts.filter((p) => p.type === 'currency').map((p) => p.value).join('').trim(),
    amount: parts
      .filter((p) => p.type !== 'currency' && p.type !== 'literal')
      .map((p) => p.value)
      .join(''),
  }
}

const COMPACT_COUNT = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })

/** 112000 → "112K", 1500 → "1.5K", 850 → "850". Callers hide the count when it is 0. */
export function formatCount(value: number): string {
  return COMPACT_COUNT.format(value)
}

const SHORT_DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

/** "2026-07-05T23:59:00Z" → "5 Jul". UTC, which is Ghana time. Empty for missing or bad dates. */
export function formatShortDate(iso: string): string {
  const date = new Date(iso)
  return iso && !Number.isNaN(date.getTime()) ? SHORT_DATE.format(date) : ''
}
