export const backLinkClass =
  'group inline-flex cursor-pointer items-center text-sm font-semibold text-primary transition-all duration-200 hover:text-primary/90';

export const backLinkHeroClass =
  'group mb-8 inline-flex cursor-pointer items-center text-sm font-semibold text-white/85 transition-all duration-200 hover:text-white';

export const backLinkArrowClass =
  'mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1';

export function SectionHeader({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle?: string;
  description?: string;
}) {
  return (
    <div className="text-center mb-6">
      {subtitle && <p className="text-primary text-sm font-semibold mb-2 uppercase tracking-wide font-gaming">{subtitle}</p>}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance font-gaming">{title}</h2>
      {description && <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2 sm:px-0">{description}</p>}
    </div>
  );
}

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="scanlines relative mt-16 overflow-hidden py-12 sm:py-16 md:py-20 bg-[radial-gradient(ellipse_90%_130%_at_0%_0%,_oklch(0.66_0.17_256/0.22),_transparent_55%),radial-gradient(ellipse_65%_110%_at_100%_100%,_oklch(0.84_0.12_218/0.13),_transparent_52%),linear-gradient(to_bottom,_var(--section-c),_var(--void-black))]">
      {/* faint blueprint grid, faded toward the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(oklch(1_0_0/0.045)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/0.045)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_100%_at_30%_0%,black,transparent_75%)]"
      />
      {/* oversized ghost wordmark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 bottom-[-1.5rem] select-none font-gaming text-[3.5rem] font-bold uppercase leading-none tracking-tighter text-cold/[0.035] sm:-right-4 sm:bottom-[-2.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem]"
      >
        {title}
      </span>
      {/* accent underline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,oklch(0.66_0.17_256/0.55),oklch(0.84_0.12_218/0.35),transparent)]"
      />

      <Container className="relative">
        <span aria-hidden className="mb-5 block h-1 w-12 bg-provela" />
        <h1 className="mb-2 font-gaming text-3xl font-bold uppercase tracking-tight text-foreground sm:text-4xl md:text-6xl">
          {title}
        </h1>
        {subtitle && <p className="max-w-2xl text-base sm:text-lg text-muted-foreground">{subtitle}</p>}
      </Container>
    </div>
  );
}

export function GridSection({
  children,
  cols = 3,
  className = '',
}: {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };

  return <div className={`grid ${colsClass[cols]} gap-6 ${className}`}>{children}</div>;
}
