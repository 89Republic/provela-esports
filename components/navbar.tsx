'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BrandLogo } from '@/components/brand-logo';

const navLinks = [
  { href: '/divisions', label: 'Divisions' },
  { href: '/fcx', label: 'FCX' },
  { href: '/streamers', label: 'Streamers' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About Us' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-cold/10 bg-void/85 py-1 backdrop-blur-xl'
          : 'border-transparent bg-linear-to-b from-void/80 to-transparent py-3'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center">
          <BrandLogo
            imgClassName="h-4 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_16px_oklch(0.66_0.17_256/0.5)] sm:h-5 mt-0.5"
          />
        </Link>

        {/* desktop command bar */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => {
            const active = pathname.startsWith(link.href) && link.href !== '/';
            return (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                className={`group relative px-3 py-2 font-gaming text-xs font-semibold uppercase tracking-[0.15em] transition-colors ${
                  active ? 'text-provela' : 'text-cold/70 hover:text-cold'
                }`}
              >
                {/* HUD brackets on hover */}
                <span className="pointer-events-none absolute left-0 top-1 h-1.5 w-1.5 border-l border-t border-provela opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-1 right-0 h-1.5 w-1.5 border-b border-r border-provela opacity-0 transition-opacity group-hover:opacity-100" />
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-px bg-provela"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="p-2 text-cold transition-colors hover:text-provela md:hidden"
          aria-label="Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* mobile tactical overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="scanlines fixed inset-0 top-0 z-[100] flex flex-col bg-void/97 backdrop-blur-xl md:hidden"
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'linear-gradient(oklch(0.66 0.17 256) 1px, transparent 1px), linear-gradient(90deg, oklch(0.66 0.17 256) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="relative flex items-center justify-between px-4 py-4">
              <BrandLogo />
              <button onClick={() => setIsOpen(false)} className="p-2 text-cold" aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="relative flex flex-1 flex-col justify-center gap-1 overflow-y-auto px-6 pb-8 sm:gap-2 sm:px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={`${link.href}-${i}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-baseline gap-3 border-b border-cold/10 py-3 sm:gap-4 sm:py-4"
                  >
                    <span className="font-mono text-xs text-provela">0{i + 1}</span>
                    <span className="font-gaming text-xl font-bold uppercase tracking-wide text-cold sm:text-2xl">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
