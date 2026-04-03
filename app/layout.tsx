import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BuildFlow CRM — Super Admin',
  description: 'Super Admin dashboard for managing builders, subscriptions, and WhatsApp activity.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body suppressHydrationWarning className="bg-bg text-text min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
