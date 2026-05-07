'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { PageHeader, Container } from '@/components/layout';
import { NEWS_ARTICLES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsDetailPage(props: NewsDetailPageProps) {
  const params = await props.params;
  const article = NEWS_ARTICLES.find((a) => a.id === params.id);

  if (!article) {
    return (
      <>
        <Navbar />
        <PageHeader title="Article Not Found" />
        <div className="py-20">
          <Container className="text-center">
            <p className="text-muted-foreground mb-4">We couldn&apos;t find the article you&apos;re looking for.</p>
            <Link href="/news">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  const relatedArticles = NEWS_ARTICLES.filter(
    (a) => a.category === article.category && a.id !== article.id
  ).slice(0, 3);

  return (
    <>
      <Navbar />
      <div
        className="relative h-96 overflow-hidden bg-cover bg-center mt-16"
        style={{ backgroundImage: `url(${article.image})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-8 w-full">
            <div className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold mb-4">
              {article.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">{article.title}</h1>
          </Container>
        </div>
      </div>

      <main className="py-20">
        <Container>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="prose prose-invert max-w-none">
                <div className="flex items-center space-x-4 text-muted-foreground mb-8 pb-8 border-b border-border">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                </div>

                <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                  {article.content.split('\n').map((paragraph, idx) => (
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
            <Link href="/news">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
