import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jackie Kim | Founder & CEO",
  description: "Personal website of Jackie Kim - Entrepreneur, Builder, Learner",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
