"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { SocialIconLink } from '@/components/social-icon';
import { BRAND_SOCIALS } from '@/lib/constants';

export function Footer() {
  const [socials, setSocials] = useState(BRAND_SOCIALS);

  useEffect(() => {
    let cancelled = false;

    const loadSocials = async () => {
      try {
        const response = await fetch('/api/admin/content', { cache: 'no-store' });
        if (!response.ok || cancelled) return;

        const payload = (await response.json()) as {
          data?: {
            brandSocials?: typeof BRAND_SOCIALS;
          };
        };

        if (!cancelled && Array.isArray(payload.data?.brandSocials)) {
          setSocials(payload.data.brandSocials);
        }
      } catch {
        // Keep defaults if managed content is not available.
      }
    };

    void loadSocials().catch(() => {
      // Prevent dev-time unhandledRejection noise from aborted fetches.
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="bg-section-f border-t border-border/50 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <BrandLogo className="mb-4" />
            <p className="text-muted-foreground text-sm">
              Premier esports organization bringing competitive gaming to the world.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/divisions" className="text-muted-foreground hover:text-primary transition-colors">
                  Divisions
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="text-muted-foreground hover:text-primary transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-muted-foreground hover:text-primary transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/streamers" className="text-muted-foreground hover:text-primary transition-colors">
                  Streamers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <SocialIconLink key={`${social.platform}-${social.url}`} social={social} size="lg" />
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Provela Esports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
