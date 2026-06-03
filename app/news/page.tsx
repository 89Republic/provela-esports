import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, GridSection } from '@/components/layout';
import { NewsCard } from '@/components/cards';
import { getSiteContent } from '@/lib/site-content';

export const metadata = {
  title: 'News | Provela Esports',
  description: 'Stay updated with the latest news, announcements, and stories from Provela Esports.',
};

export default async function NewsPage() {
  const content = await getSiteContent();

  return (
    <>
      <Navbar />
      <PageHeader
        title="News"
        subtitle="Latest updates from the Provela community"
      />
      <main className="py-20">
        <Container>
          <GridSection cols={3}>
            {content.newsArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </GridSection>
        </Container>
      </main>
      <Footer />
    </>
  );
}
