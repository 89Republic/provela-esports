import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container } from '@/components/layout';

export const metadata = {
  title: 'Terms of Service | Provela Esports',
  description: 'Read the terms and conditions for using Provela Esports websites, tournaments, and community services.',
};

const LAST_UPDATED = 'June 1, 2026';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <PageHeader
        title="Terms of Service"
        subtitle="Rules and guidelines for using Provela Esports services"
      />
      <main className="py-20 bg-background">
        <Container>
          <article className="mx-auto max-w-3xl space-y-10 text-muted-foreground">
            <p className="text-sm text-muted-foreground/80">Last updated: {LAST_UPDATED}</p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Agreement to Terms</h2>
              <p className="text-lg leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Provela Esports website,
                tournament platforms, community features, and related services (collectively, the &quot;Services&quot;)
                operated by Provela Esports (&quot;Provela,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
              <p className="text-lg leading-relaxed">
                By accessing or using our Services, you agree to be bound by these Terms and our{' '}
                <Link href="/privacy" className="text-primary hover:text-primary/90 transition-colors">
                  Privacy Policy
                </Link>
                . If you do not agree, you may not use our Services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Eligibility</h2>
              <p className="text-lg leading-relaxed">
                You must be at least 13 years old to use our Services. If you are under 18, you represent that
                you have permission from a parent or legal guardian. Some tournaments or events may have
                additional age, residency, or eligibility requirements, which will be stated at registration.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Accounts and Registration</h2>
              <p className="text-lg leading-relaxed">
                When you create an account or register for an event, you agree to provide accurate and complete
                information and to keep it up to date. You are responsible for safeguarding your account
                credentials and for all activity that occurs under your account. Notify us immediately if you
                suspect unauthorized access.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Tournaments and Competitions</h2>
              <p className="text-lg leading-relaxed">
                Participation in Provela tournaments, leagues, and FCX events is subject to official rules,
                formats, and schedules published for each competition. By registering, you agree to:
              </p>
              <ul className="list-disc space-y-2 pl-6 text-lg leading-relaxed">
                <li>Follow all event rules, code of conduct, and staff instructions.</li>
                <li>Compete fairly and refrain from cheating, exploiting bugs, or using unauthorized software.</li>
                <li>Accept published results, standings, and administrative decisions made in good faith.</li>
                <li>Allow Provela to display your username, team name, and match results for promotional and historical purposes.</li>
              </ul>
              <p className="text-lg leading-relaxed">
                Provela reserves the right to modify, suspend, or cancel events, and to disqualify participants
                who violate rules or these Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Acceptable Use</h2>
              <p className="text-lg leading-relaxed">You agree not to:</p>
              <ul className="list-disc space-y-2 pl-6 text-lg leading-relaxed">
                <li>Use the Services for any unlawful purpose or in violation of applicable laws.</li>
                <li>Harass, threaten, defame, or discriminate against others in our community.</li>
                <li>Upload or transmit malware, spam, or content that infringes intellectual property rights.</li>
                <li>Attempt to gain unauthorized access to our systems, accounts, or data.</li>
                <li>Scrape, reverse engineer, or interfere with the normal operation of the Services.</li>
                <li>Impersonate Provela, our staff, players, or other users.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Intellectual Property</h2>
              <p className="text-lg leading-relaxed">
                All content on our Services — including logos, branding, text, graphics, videos, and software —
                is owned by Provela Esports or its licensors and is protected by intellectual property laws. You
                may not copy, modify, distribute, or create derivative works without our prior written consent,
                except as permitted by law or with proper attribution where explicitly allowed.
              </p>
              <p className="text-lg leading-relaxed">
                Game titles, publisher trademarks, and third-party assets remain the property of their respective
                owners. Provela Esports is not affiliated with or endorsed by game publishers unless stated
                otherwise.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">User Content</h2>
              <p className="text-lg leading-relaxed">
                If you submit content to our Services — such as comments, clips, or profile information — you
                grant Provela a non-exclusive, worldwide, royalty-free license to use, display, and distribute
                that content in connection with operating and promoting our Services. You represent that you
                have the rights to submit such content and that it does not violate these Terms or any
                third-party rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Prizes and Payments</h2>
              <p className="text-lg leading-relaxed">
                Prize pools, payouts, and eligibility for rewards are governed by the rules of each specific
                event. Winners may be required to complete verification steps before receiving prizes. Provela
                is not responsible for delays caused by incorrect payment details, tax obligations, or
                third-party payment processors.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Third-Party Links and Services</h2>
              <p className="text-lg leading-relaxed">
                Our Services may link to third-party websites or platforms such as Twitch, YouTube, and Discord.
                We do not control and are not responsible for third-party content, policies, or practices. Your
                use of those services is at your own risk and subject to their terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Disclaimer of Warranties</h2>
              <p className="text-lg leading-relaxed">
                The Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any
                kind, whether express or implied, including merchantability, fitness for a particular purpose,
                and non-infringement. We do not guarantee uninterrupted, error-free, or secure access to the
                Services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
              <p className="text-lg leading-relaxed">
                To the fullest extent permitted by law, Provela Esports and its officers, employees, partners,
                and affiliates shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of the Services, including loss of profits, data, or
                goodwill. Our total liability for any claim related to the Services shall not exceed the amount
                you paid to us, if any, in the twelve months preceding the claim.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Indemnification</h2>
              <p className="text-lg leading-relaxed">
                You agree to indemnify and hold harmless Provela Esports from any claims, damages, losses, or
                expenses (including reasonable legal fees) arising from your use of the Services, your violation
                of these Terms, or your infringement of any third-party rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Termination</h2>
              <p className="text-lg leading-relaxed">
                We may suspend or terminate your access to the Services at any time, with or without notice, if
                we believe you have violated these Terms or pose a risk to our community or platform. Upon
                termination, provisions that by their nature should survive will remain in effect.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Changes to These Terms</h2>
              <p className="text-lg leading-relaxed">
                We may update these Terms from time to time. When we do, we will revise the &quot;Last updated&quot;
                date at the top of this page. Continued use of the Services after changes are posted constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
              <p className="text-lg leading-relaxed">
                If you have questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@provelaesports.com" className="text-primary hover:text-primary/90 transition-colors">
                  legal@provelaesports.com
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
