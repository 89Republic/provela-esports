'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import type { NewsArticle } from '@/lib/types';
import { SceneHeader } from '@/components/motion/scene-header';
import { Reveal } from '@/components/motion/reveal';

const DATE_FMT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const CATEGORY_LABEL: Record<NewsArticle['category'], string> = {
  Tournaments: 'Tournament Report',
  Results: 'Match Result',
  Community: 'Community Signal',
  Announcements: 'Stream Network',
};

export function Dispatch({ articles }: { articles: NewsArticle[] }) {
  const [lead, ...rest] = articles.slice(0, 4);
  if (!lead) return null;

  return (
    <section className="relative bg-section-d py-14 sm:py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SceneHeader
          index="06"
          eyebrow="Provela Dispatch"
          titleLines={['Field Reports']}
          description="Transmissions from across the network."
          align="left"
        />

        {/* grid-cols-1 = minmax(0,1fr): stops long headlines from widening the column past the viewport */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* lead story */}
          <Reveal from="left">
            <Link
              href={`/news/${lead.id}`}
              className="group relative block h-full min-h-88 overflow-hidden rounded-lg border border-cold/10"
            >
              <div
                className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url("${encodeURI(lead.image)}")` }}
              />
              <div className="absolute inset-0 bg-linear-to-t from-void via-void/75 to-transparent sm:via-void/40" />
              <div className="scanlines absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <span className="inline-block bg-provela px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-void">
                  {CATEGORY_LABEL[lead.category]}
                </span>
                <h3 className="mt-3 max-w-lg text-balance font-gaming text-2xl font-bold uppercase leading-tight text-cold md:text-3xl">
                  {lead.title}
                </h3>
                <p className="mt-2 max-w-md text-sm text-steel">{lead.excerpt}</p>
                <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-steel">
                  {lead.author} · {DATE_FMT.format(new Date(lead.date))}
                </p>
              </div>
            </Link>
          </Reveal>

          {/* secondary rows */}
          <div className="flex flex-col gap-3">
            {rest.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/news/${article.id}`}
                  className="group flex items-start gap-3 border-b border-cold/10 py-4 transition-colors hover:border-provela/40 sm:items-center sm:gap-4"
                >
                  <span className="hidden w-9 shrink-0 font-gaming text-2xl font-bold text-provela/40 transition-colors group-hover:text-provela sm:inline">
                    0{i + 1}
                  </span>
                  <div
                    className="h-14 w-20 shrink-0 overflow-hidden rounded bg-cover bg-center grayscale transition-all duration-500 group-hover:grayscale-0 sm:h-16 sm:w-24"
                    style={{ backgroundImage: `url("${encodeURI(article.image)}")` }}
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-provela">
                      {CATEGORY_LABEL[article.category]}
                    </p>
                    <h4 className="mt-1 line-clamp-2 font-gaming text-base font-semibold uppercase leading-snug text-cold transition-colors group-hover:text-provela">
                      {article.title}
                    </h4>
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-steel">
                      {DATE_FMT.format(new Date(article.date))}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
