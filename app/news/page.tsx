import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, GridSection } from '@/components/layout';
import { NewsCard } from '@/components/cards';
import { NEWS_ARTICLES } from '@/lib/constants';

export const metadata = {
  title: 'News | Provela Esports',
  description: 'Stay updated with the latest news, announcements, and stories from Provela Esports.',
};

export default function NewsPage() {
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
            {NEWS_ARTICLES.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </GridSection>
        </Container>
      </main>
      <Footer />
    </>
  );
}
