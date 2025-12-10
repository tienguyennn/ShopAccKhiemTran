'use client';
import React from 'react';
import styled from '@emotion/styled';
import './layout.css';
import '@/app/assets/css/global.css';
import { Providers } from '@/store/providers';
import { Saira } from 'next/font/google';

const saira = Saira({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-saira',
});

const AuthContainer = styled.div(() => ({
  minHeight: '100vh',
}));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={saira.variable}>
      <body>
        <Providers>
          <AuthContainer>{children}</AuthContainer>
        </Providers>
      </body>
    </html>
  );
}
