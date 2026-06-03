'use client';

import type { PlayerProfile } from '@/lib/types';
import { SocialIconLink } from '@/components/social-icon';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function SquadCarousel({
  roster,
  divisionName,
}: {
  roster: PlayerProfile[];
  divisionName: string;
}) {
  return (
    <section className="mb-12">
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="relative"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2 font-gaming">Squad</h2>
            <p className="text-muted-foreground">Meet the active roster competing under {divisionName}.</p>
          </div>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="static size-10 translate-x-0 translate-y-0 rounded-full border-primary/30 bg-card text-primary hover:bg-primary/10 hover:text-primary disabled:opacity-30" />
            <CarouselNext className="static size-10 translate-x-0 translate-y-0 rounded-full border-primary/30 bg-card text-primary hover:bg-primary/10 hover:text-primary disabled:opacity-30" />
          </div>
        </div>

        <CarouselContent className="-ml-3">
          {roster.map((member) => {
            const isBrandLogo = member.avatar?.includes('LOGOS-03');
            return (
              <CarouselItem
                key={member.id}
                className="pl-3 basis-[44%] sm:basis-[31%] md:basis-[23%] lg:basis-[18%] xl:basis-[15%]"
              >
                <article className="group relative aspect-[3/5] w-full overflow-hidden rounded-lg border border-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-lg hover:shadow-primary/15">
                  <img
                    src={member.avatar || '/placeholder-user.jpg'}
                    alt={member.name}
                    className={`absolute inset-0 h-full w-full transition-transform duration-300 group-hover:scale-105 ${
                      isBrandLogo ? 'object-contain bg-black p-4' : 'object-cover'
                    }`}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.45)_42%,rgba(0,0,0,0.12)_68%,transparent_100%)]" />

                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
                      {member.tag}
                    </p>
                    <h3 className="mt-1 text-sm font-bold leading-tight text-white sm:text-base">{member.name}</h3>
                    <p className="mt-0.5 text-[11px] text-white/80 sm:text-xs">{member.role}</p>

                    {member.socialLinks.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {member.socialLinks.map((social) => (
                          <SocialIconLink
                            key={`${member.id}-${social.platform}`}
                            social={social}
                            size="sm"
                            className="border-white/20 bg-black/45 text-white hover:border-primary/50 hover:bg-primary/25"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
