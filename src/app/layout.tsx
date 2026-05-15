import type { Metadata } from 'next';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Capital Founder Consulting — Decisiones que hacen crecer negocios',
  description:
    'Consultora integral peruana. Rigor financiero, pensamiento estratégico y tecnología aplicada para empresas medianas, emprendedores y startups en LatAm.',
  applicationName: 'Capital Founder Consulting',
  authors: [{ name: 'Capital Founder Consulting E.I.R.L.', url: 'https://capitalfounderconsulting.com' }],
  keywords: ['consultora integral', 'finanzas', 'estrategia', 'tecnología', 'Capital CFO', 'CFO virtual', 'Capital Founder Consulting', 'PyMEs LatAm', 'Lima Perú'],
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
