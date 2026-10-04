import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Edge India Business Group | Building Connections. Creating Opportunities.',
  description:
    'EDGE India Manjeri is a business community in Manjeri, Kerala, connecting entrepreneurs, professionals, and business leaders through networking, collaboration, and learning.',
  openGraph: {
    title: 'Edge India Business Group | Building Connections. Creating Opportunities.',
    description:
      'EDGE India Manjeri is a business community in Manjeri, Kerala, connecting entrepreneurs, professionals, and business leaders through networking, collaboration, and learning.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Edge India Business Group | Building Connections. Creating Opportunities.',
    description:
      'EDGE India Manjeri is a business community in Manjeri, Kerala, connecting entrepreneurs, professionals, and business leaders through networking, collaboration, and learning.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
