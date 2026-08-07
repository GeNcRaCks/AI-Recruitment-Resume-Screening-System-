import React from 'react';
import './globals.css';
import { DataProvider } from '@/lib/DataContext';

export const metadata = {
  title: 'RecruitPro AI — Smart AI Resume Screening & Recruitment',
  description: 'Automate candidate screening, rank candidates using NLP & ML, and generate AI interview questions.',
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
