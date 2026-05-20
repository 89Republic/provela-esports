'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const STAT_CARD_THEMES = {
  violet:  { card: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400', value: 'text-blue-300' },
  sky:     { card: 'bg-blue-500/12 border-blue-400/30', text: 'text-blue-300', value: 'text-blue-200' },
  emerald: { card: 'bg-blue-600/10 border-blue-600/30', text: 'text-blue-400', value: 'text-blue-300' },
  amber:   { card: 'bg-blue-400/10 border-blue-400/30', text: 'text-blue-300', value: 'text-blue-200' },
  rose:    { card: 'bg-blue-700/10 border-blue-700/30', text: 'text-blue-400', value: 'text-blue-300' },
  cyan:    { card: 'bg-blue-500/8 border-blue-300/30', text: 'text-blue-300', value: 'text-blue-200' },
} as const;

export type StatCardColor = keyof typeof STAT_CARD_THEMES;

export function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: StatCardColor }) {
  const theme = color ? STAT_CARD_THEMES[color] : null;
  return (
    <div className={cn('rounded-xl border p-5', theme ? `${theme.card}` : 'bg-card border-border')}>
      <p className={cn('text-sm font-medium', theme ? theme.text : 'text-muted-foreground')}>{label}</p>
      <p className={cn('mt-1 text-3xl font-bold', theme ? theme.value : 'text-foreground')}>{value}</p>
      {sub && <p className={cn('mt-1 text-xs', theme ? theme.text : 'text-muted-foreground')}>{sub}</p>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 px-5 py-4 border-b border-border', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-4 sm:p-5', className)}>{children}</div>;
}

export function Toast({ message, kind }: { message: string; kind: 'success' | 'error' | 'idle' }) {
  if (kind === 'idle' || !message) return null;
  return (
    <div
      className={cn(
        'fixed bottom-5 right-5 z-50 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg',
        kind === 'success' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-destructive/10 border-destructive/30 text-destructive',
      )}
    >
      {message}
    </div>
  );
}

export function FieldRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2', className)}>{children}</div>;
}

export function Field({ label, children, required }: { label: string; children: ReactNode; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-16 text-center">
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

export function InfoBanner({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground', className)}>
      {children}
    </div>
  );
}

export function ImagePreview({ src, alt, contain }: { src: string; alt: string; contain?: boolean }) {
  if (!src) return null;
  return (
    <div className="mt-2 overflow-hidden rounded-md border border-border bg-black h-20 w-full max-w-[200px]">
      <img
        src={src}
        alt={alt}
        className={cn('h-full w-full', contain ? 'object-contain p-2' : 'object-cover')}
      />
    </div>
  );
}
