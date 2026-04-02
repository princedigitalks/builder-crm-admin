import type {Metadata} from 'next';
import {Syne, DM_Sans} from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'BuildFlow CRM — Super Admin',
  description: 'Super Admin dashboard for managing builders, subscriptions, and WhatsApp activity.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} dark`}>
      <body suppressHydrationWarning className="bg-bg text-text min-h-screen">
        {children}
      </body>
    </html>
  );
}
