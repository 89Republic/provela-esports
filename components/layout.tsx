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
    <div className="text-center mb-12">
      {subtitle && <p className="text-primary text-sm font-semibold mb-2 uppercase tracking-wide">{subtitle}</p>}
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">{title}</h2>
      {description && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>}
    </div>
  );
}

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-card border-b border-border py-12 mt-16">
      <Container>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">{title}</h1>
        {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
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
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return <div className={`grid ${colsClass[cols]} gap-6 ${className}`}>{children}</div>;
}
