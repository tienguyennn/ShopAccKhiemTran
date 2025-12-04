"use client";
import React from "react";
import styled from "@emotion/styled";
import "./layout.css";
import "@/app/assets/css/global.css";
import { Providers } from "@/store/providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const AuthContainer = styled.div(() => ({
  height: "100vh",
}));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body>
        <Providers>
          <AuthContainer>{children}</AuthContainer>
        </Providers>
      </body>
    </html>
  );
}
