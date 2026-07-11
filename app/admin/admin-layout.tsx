'use client';

import { type ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Swords,
  Trophy,
  Radio,
  Newspaper,
  Settings,
  Handshake,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/divisions', label: 'Divisions', icon: Swords },
  { href: '/admin/tournaments', label: 'Tournaments', icon: Trophy },
  { href: '/admin/streamers', label: 'Streamers', icon: Radio },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/sponsors', label: 'Sponsors', icon: Handshake },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <Link href="/" className="hover:opacity-80 transition-opacity"><BrandLogo compact /></Link>
        {onClose && (
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors md:hidden">
            <X className="size-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href) && href !== '/admin';
          const isExactActive = pathname === '/admin' && href === '/admin';
          const isActive = active || isExactActive;

          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink className="size-4 shrink-0" />
          View Website
        </a>
      </div>
    </aside>
  );
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-60 md:shrink-0 md:sticky md:top-0 md:self-start md:h-screen">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 shrink-0 flex flex-col h-full">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
          <button
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <Link href="/" className="hover:opacity-80 transition-opacity"><BrandLogo compact /></Link>
          <span className="ml-auto text-xs text-muted-foreground font-semibold uppercase tracking-wide">Admin</span>
        </header>

        <main className="flex-1 p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
