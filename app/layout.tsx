import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/Providers';
import { Toaster } from 'react-hot-toast';

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
        <ReduxProvider>
          {children}
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              style: { 
                borderRadius: '16px', 
                background: '#1e293b', 
                color: '#fff',
                fontSize: '11px',
                fontWeight: '600'
              } 
            }} 
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
