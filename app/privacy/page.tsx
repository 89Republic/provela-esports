import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container } from '@/components/layout';

export const metadata = {
  title: 'Privacy Policy | Provela Esports',
  description: 'Learn how Provela Esports collects, uses, and protects your personal information.',
};

const LAST_UPDATED = 'June 1, 2026';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information"
      />
      <main className="py-20 bg-background">
        <Container>
          <article className="mx-auto max-w-3xl space-y-10 text-muted-foreground">
            <p className="text-sm text-muted-foreground/80">Last updated: {LAST_UPDATED}</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
              <p className="text-lg leading-relaxed">
                Provela Esports (&quot;Provela,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Provela Esports
                website and related digital services, including tournament platforms, community features, and
                streaming integrations. This Privacy Policy explains what information we collect, how we use it,
                and the choices you have when you visit our site, register for events, follow our teams, or
                interact with our content.
              </p>
              <p className="text-lg leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with
                this policy. If you do not agree, please discontinue use of our website and services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
              <p className="text-lg leading-relaxed">We may collect the following types of information:</p>
              <ul className="list-disc space-y-2 pl-6 text-lg leading-relaxed">
                <li>
                  <strong className="text-foreground">Account and profile information</strong> — such as your
                  name, username, email address, and gaming handles when you create an account or register for
                  tournaments.
                </li>
                <li>
                  <strong className="text-foreground">Communication data</strong> — messages you send to us
                  through contact forms, support requests, or social channels linked from our site.
                </li>
                <li>
                  <strong className="text-foreground">Usage and device data</strong> — including pages visited,
                  links clicked, browser type, IP address, and general location derived from your IP address.
                </li>
                <li>
                  <strong className="text-foreground">Tournament and event data</strong> — registration details,
                  match results, team affiliations, and eligibility information required to participate in
                  Provela competitions.
                </li>
                <li>
                  <strong className="text-foreground">Cookies and similar technologies</strong> — small files
                  stored on your device to remember preferences and understand how our site is used.
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">How We Use Your Information</h2>
              <p className="text-lg leading-relaxed">We use the information we collect to:</p>
              <ul className="list-disc space-y-2 pl-6 text-lg leading-relaxed">
                <li>Operate, maintain, and improve our website and esports services.</li>
                <li>Process tournament registrations, verify eligibility, and publish results.</li>
                <li>Communicate updates about events, news, teams, and community announcements.</li>
                <li>Respond to inquiries and provide customer support.</li>
                <li>Monitor site performance, prevent fraud, and protect the security of our platform.</li>
                <li>Comply with legal obligations and enforce our terms of service.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Cookies</h2>
              <p className="text-lg leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, remember
                your preferences, and analyze traffic patterns. You can control cookies through your browser
                settings. Disabling cookies may limit certain features of our website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Third-Party Services</h2>
              <p className="text-lg leading-relaxed">
                Our site may link to or integrate with third-party platforms such as Twitch, YouTube, Discord,
                and social media networks. We may also use analytics and hosting providers to operate our
                services. These third parties have their own privacy policies, and we encourage you to review
                them. Provela Esports is not responsible for the privacy practices of external sites or
                services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Sharing of Information</h2>
              <p className="text-lg leading-relaxed">
                We do not sell your personal information. We may share information in the following
                circumstances:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-lg leading-relaxed">
                <li>With service providers who assist us in hosting, analytics, communications, or event operations.</li>
                <li>With tournament partners or sponsors when necessary to administer competitions you enter.</li>
                <li>When required by law, regulation, legal process, or to protect the rights and safety of Provela and our community.</li>
                <li>In connection with a merger, acquisition, or sale of assets, subject to appropriate safeguards.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Data Retention</h2>
              <p className="text-lg leading-relaxed">
                We retain personal information only for as long as necessary to fulfill the purposes described
                in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
                Tournament records and public results may be retained for historical and competitive integrity
                purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Your Rights</h2>
              <p className="text-lg leading-relaxed">
                Depending on your location, you may have the right to access, correct, delete, or restrict the
                processing of your personal information, or to object to certain uses. You may also have the
                right to withdraw consent where processing is based on consent. To exercise these rights,
                contact us using the details below.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Children&apos;s Privacy</h2>
              <p className="text-lg leading-relaxed">
                Our services are not directed to children under 13, and we do not knowingly collect personal
                information from children under 13. If you believe we have collected information from a child,
                please contact us so we can take appropriate action.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Changes to This Policy</h2>
              <p className="text-lg leading-relaxed">
                We may update this Privacy Policy from time to time. When we do, we will revise the &quot;Last
                updated&quot; date at the top of this page. Continued use of our services after changes are posted
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="text-lg leading-relaxed">
                If you have questions about this Privacy Policy or how we handle your data, please contact us
                at{' '}
                <a href="mailto:privacy@provelaesports.com" className="text-primary hover:text-primary/90 transition-colors">
                  privacy@provelaesports.com
                </a>
                .
              </p>
            </section>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}
