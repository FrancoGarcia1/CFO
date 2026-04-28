import type { Metadata } from 'next';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Capital CFO — Tu CFO Senior Virtual',
  description:
    'IA que registra tus finanzas, analiza tu P&L, genera proyecciones y te dice exactamente qué hacer — como un CFO con 8 años de experiencia. Producto de Capital Founder Consulting E.I.R.L.',
  applicationName: 'Capital CFO',
  authors: [{ name: 'Capital Founder Consulting E.I.R.L.', url: 'https://capitalfounder.pe' }],
  keywords: ['CFO virtual', 'consultoría financiera', 'P&L', 'forecast', 'Capital Founder Consulting', 'PyMEs LatAm'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
