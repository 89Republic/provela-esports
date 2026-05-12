interface BrandLogoProps {
  className?: string;
  compact?: boolean;
}

export function BrandLogo({ className = '', compact = false }: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative h-10 w-10 rounded-lg bg-linear-to-br from-primary via-primary to-primary/70 shadow-[0_8px_24px_-12px_hsl(var(--primary))]">
        <div className="absolute inset-px rounded-[7px] border border-white/20 bg-black/10" />
        <span className="relative z-10 flex h-full w-full items-center justify-center text-sm font-black tracking-wide text-primary-foreground">
          PV
        </span>
      </div>

      <div className="leading-none">
        <p className="text-sm font-black uppercase tracking-[0.14em] text-foreground sm:text-base">Provela</p>
        {!compact && (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-primary/90">Esports</p>
        )}
      </div>
    </div>
  );
}
