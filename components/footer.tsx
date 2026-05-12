"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Twitch, Youtube, Twitter } from 'lucide-react';
import { BrandLogo } from '@/components/brand-logo';
import { BRAND_SOCIALS } from '@/lib/constants';

const SOCIAL_ICON_MAP = {
  twitch: Twitch,
  youtube: Youtube,
  x: Twitter,
};

export function Footer() {
  const [socials, setSocials] = useState(BRAND_SOCIALS);

  useEffect(() => {
    const loadSocials = async () => {
      try {
        const response = await fetch('/api/admin/content', { cache: 'no-store' });
        const payload = (await response.json()) as {
          data?: {
            brandSocials?: typeof BRAND_SOCIALS;
          };
        };

        if (Array.isArray(payload.data?.brandSocials)) {
          setSocials(payload.data.brandSocials);
        }
      } catch {
        // Keep defaults if managed content is not available.
      }
    };

    void loadSocials();
  }, []);

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socials.map((social) => {
                const Icon = SOCIAL_ICON_MAP[social.platform as keyof typeof SOCIAL_ICON_MAP] ?? Twitter;
                return (
                  <a
                    key={`${social.platform}-${social.url}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-primary hover:bg-primary/90 rounded-full text-primary-foreground transition-colors"
                    aria-label={social.platform}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
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
