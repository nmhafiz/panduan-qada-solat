import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: `Panduan Qadha Solat ${new Date().getFullYear()} - Galeri Mukmin`,
  description: "Panduan lengkap qadha solat bergambar, mudah difahami, dan praktikal untuk setiap Muslim.",
  metadataBase: new URL('https://qadasolat.my'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `Panduan Qadha Solat ${new Date().getFullYear()}`,
    description: "Jangan bertaruh ajal. Selesaikan hutang solat dengan panduan yang betul dan mudah.",
    url: 'https://qadasolat.my',
    siteName: 'QadhaSolat.my',
    images: [
      {
        url: '/bukuqadhasolat.png',
        width: 800,
        height: 600,
        alt: 'Buku Panduan Qadha Solat',
      },
    ],
    locale: 'ms_MY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Panduan Qadha Solat ${new Date().getFullYear()}`,
    description: "Selesaikan hutang solat dengan panduan yang betul dan mudah.",
    images: ['/bukuqadhasolat.png'],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
