import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'A2A Frontend',
  description: 'Simple frontend for A2A agents',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>{children}</body>
    </html>
  );
}

