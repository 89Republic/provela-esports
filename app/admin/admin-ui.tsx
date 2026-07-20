'use client';

import { type ReactNode } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { SocialLink } from '@/lib/types';

const SOCIAL_PLATFORMS: SocialLink['platform'][] = ['x', 'instagram', 'facebook', 'youtube', 'twitch', 'tiktok', 'discord'];

export function SocialLinksEditor({
  links,
  onChange,
  onRemove,
  removeDisabled,
}: {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
  onRemove?: (index: number, link: SocialLink) => void | Promise<void>;
  removeDisabled?: boolean;
}) {
  const add = () => onChange([...links, { platform: 'x', url: '' }]);
  const update = (i: number, key: keyof SocialLink, val: string) =>
    onChange(links.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));
  const remove = async (i: number) => {
    const link = links[i];
    if (onRemove) {
      await onRemove(i, link);
      return;
    }
    onChange(links.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-3">
      {links.map((s, i) => (
        <div key={i} className="grid grid-cols-[160px_1fr_auto] gap-2 items-center">
          <Select value={s.platform} onValueChange={v => update(i, 'platform', v)}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SOCIAL_PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="https://…" value={s.url} onChange={e => update(i, 'url', e.target.value)} />
          <button
            type="button"
            onClick={() => void remove(i)}
            disabled={removeDisabled}
            className="text-muted-foreground hover:text-destructive p-2 transition-colors disabled:opacity-50"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="size-3 mr-1" />Add Link
      </Button>
      {links.length === 0 && <p className="text-xs text-muted-foreground">No social links yet.</p>}
    </div>
  );
}

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

export function StatCard({ label, value, sub, color, className }: { label: string; value: string | number; sub?: string; color?: StatCardColor; className?: string }) {
  const theme = color ? STAT_CARD_THEMES[color] : null;
  return (
    <div className={cn('rounded-xl border p-5', theme ? `${theme.card}` : 'bg-card border-border', className)}>
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

export function DeleteConfirmDialog({
  title,
  description,
  onConfirm,
  disabled,
  children,
  confirmLabel = 'Delete',
}: {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  disabled?: boolean;
  children: ReactNode;
  confirmLabel?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild disabled={disabled}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <div className="flex flex-col items-center px-6 pt-8 pb-2 text-center sm:items-start sm:text-left">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 ring-1 ring-destructive/20">
            <Trash2 className="size-5 text-destructive" />
          </div>
          <AlertDialogHeader className="space-y-2">
            <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="gap-2 border-t border-border bg-muted/30 px-6 py-4 sm:gap-3">
          <AlertDialogCancel className="sm:min-w-24">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90 sm:min-w-24"
            onClick={() => void onConfirm()}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
