import Image from 'next/image';

const LOGO_SRC = '/images/LOGOS-03.png';

interface BrandLogoProps {
  className?: string;
  compact?: boolean;
  /** Override the image sizing classes (e.g. a larger header logo). */
  imgClassName?: string;
}

export function BrandLogo({ className = '', compact = false, imgClassName }: BrandLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={LOGO_SRC}
        alt="Provela Esports"
        width={compact ? 120 : 360}
        height={compact ? 40 : 112}
        className={
          imgClassName ??
          (compact ? 'h-8 w-auto object-contain' : 'h-9 w-auto object-contain sm:h-10')
        }
        priority
      />
    </div>
  );
}
