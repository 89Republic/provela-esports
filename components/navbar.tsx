'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/brand-logo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/divisions', label: 'Divisions' },
    { href: '/streamers', label: 'Streamers' },
    { href: '/tournaments', label: 'FCX' },
    { href: '/news', label: 'News' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-primary/20 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-[0_8px_24px_rgba(2,6,23,0.22)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <BrandLogo className="transition-all duration-300 group-hover:opacity-90 group-hover:scale-[1.01]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 rounded-full border border-border/70 bg-card/40 px-2 py-1">
            {navLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                    active
                      ? 'text-primary bg-primary/15'
                      : 'text-foreground/90 hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {link.label}
                  {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded bg-primary" />}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border/70">
            <div className="px-2 pt-2 pb-3 space-y-1 rounded-b-xl bg-card/75 backdrop-blur-sm">
              {navLinks.map((link) => {
                const active = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded text-base font-semibold transition-colors ${
                      active
                        ? 'text-primary bg-primary/15'
                        : 'text-foreground hover:text-primary hover:bg-primary/10'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
