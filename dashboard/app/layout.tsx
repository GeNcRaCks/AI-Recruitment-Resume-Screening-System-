import React from 'react';
import './globals.css';
import { DataProvider } from '@/lib/DataContext';

import type { Metadata } from 'next';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://recruitpro-ai-six.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'RecruitPro AI — Smart AI Resume Screening & Recruitment',
    template: '%s | RecruitPro AI',
  },
  description: 'Automate candidate screening, rank resumes using multi-model NLP & ML, and generate tailored interview questions.',
  keywords: ['AI recruitment', 'resume screening', 'NLP resume parser', 'candidate ranking', 'AI interview generator', 'talent acquisition'],
  authors: [{ name: 'RecruitPro AI' }],
  creator: 'RecruitPro AI',
  icons: {
    icon: '/recruitpro-logo.svg',
    shortcut: '/recruitpro-logo.svg',
    apple: '/recruitpro-logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appUrl,
    siteName: 'RecruitPro AI',
    title: 'RecruitPro AI — Smart AI Resume Screening & Recruitment',
    description: 'Automate candidate screening, rank resumes using multi-model NLP & ML, and generate tailored interview questions.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RecruitPro AI Platform Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RecruitPro AI — Smart AI Resume Screening & Recruitment',
    description: 'Automate candidate screening, rank resumes using multi-model NLP & ML, and generate tailored interview questions.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
