import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';
import { SocialIconLink } from '@/components/social-icon';
import { listBrandSocials } from '@/lib/brand-socials';
import { BRAND_SOCIALS } from '@/lib/constants';

export async function Footer() {
  const socials = await listBrandSocials().catch(() => BRAND_SOCIALS);

  return (
    <footer className="bg-section-f border-t border-border/50 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <BrandLogo className="mb-4" />
            <p className="text-muted-foreground text-sm">
              Premier esports organization bringing competitive gaming to the world.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/divisions" className="text-muted-foreground hover:text-primary transition-colors">
                  Divisions
                </Link>
              </li>
              <li>
                <Link href="/fcx" className="text-muted-foreground hover:text-primary transition-colors">
                  FCX
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

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-muted-foreground hover:text-primary transition-colors">
                  Partners
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

          <div>
            <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <SocialIconLink key={`${social.platform}-${social.url}`} social={social} size="lg" />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Provela Esports. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
