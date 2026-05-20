'use client';

import { MapPin } from 'lucide-react';
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

        <CarouselContent className="-ml-4">
          {roster.map((member) => (
            <CarouselItem key={member.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-[30%]">
              <article className="group h-full rounded-xl border border-primary/20 bg-card/95 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/15">
                <div className="relative h-56 bg-black/20">
                  <img
                    src={member.avatar || '/placeholder-user.jpg'}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.65),rgba(0,0,0,0.1))]" />
                  <p className="absolute left-4 bottom-4 text-primary font-semibold tracking-wide text-sm uppercase">
                    {member.tag}
                  </p>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{member.location}</span>
                  </div>

                  {member.socialLinks.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {member.socialLinks.map((social) => (
                        <SocialIconLink key={`${member.id}-${social.platform}`} social={social} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
