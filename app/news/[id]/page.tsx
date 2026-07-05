import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container, backLinkClass, backLinkArrowClass } from '@/components/layout';
import { getSiteContent } from '@/lib/site-content';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsDetailPage(props: NewsDetailPageProps) {
  const params = await props.params;
  const content = await getSiteContent();
  const article = content.newsArticles.find((a) => a.id === params.id);

  if (!article) {
    return (
      <>
        <Navbar />
        <PageHeader title="Article Not Found" />
        <div className="py-20">
          <Container className="text-center">
            <p className="text-muted-foreground mb-4">We couldn&apos;t find the article you&apos;re looking for.</p>
            <Link href="/news" className={backLinkClass}>
              <ArrowLeft className={backLinkArrowClass} />
              Back to News
            </Link>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  const relatedArticles = content.newsArticles.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  return (
    <>
      <Navbar />
      <div
        className="relative mt-16 h-64 overflow-hidden bg-cover bg-center sm:h-80 md:h-96"
        style={{ backgroundImage: `url(${article.image})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end">
          <Container className="w-full pb-6 sm:pb-8">
            <div className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground sm:mb-4">
              {article.category}
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl lg:text-5xl">{article.title}</h1>
          </Container>
        </div>
      </div>

      <main className="py-12 sm:py-16 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            <div className="md:col-span-2">
              <div className="prose prose-invert max-w-none">
                <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground sm:pb-8">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                </div>

                <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {article.content.map((paragraph, idx) => (
                    <p key={idx} className="text-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              {relatedArticles.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-foreground mb-6">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((related) => (
                      <Link key={related.id} href={`/news/${related.id}`}>
                        <div className="group cursor-pointer">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm line-clamp-2 mb-2">
                            {related.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(related.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-8 mt-12">
            <Link href="/news" className={backLinkClass}>
              <ArrowLeft className={backLinkArrowClass} />
              Back to News
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
