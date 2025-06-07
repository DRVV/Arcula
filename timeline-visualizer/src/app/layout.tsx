import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TimelineProvider } from '@/contexts/TimelineContext';
import { ChatProvider } from '@/contexts/ChatContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mobile Device Timeline | Interactive Visualization",
  description: "An interactive visualization of mobile device development history using React Flow and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        <ChatProvider>
          <TimelineProvider>
            {children}
          </TimelineProvider>
        </ChatProvider>
      </body>
    </html>
  );
}
