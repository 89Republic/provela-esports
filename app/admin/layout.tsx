import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin | Provela Esports',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
