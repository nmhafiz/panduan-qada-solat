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
  keywords: ["qadha solat", "ganti solat", "buku solat", "panduan solat mufashil", "galeri mukmin", "cara qadha solat lama", "jadual qadha solat"],
  manifest: '/manifest.json',
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": "Buku Panduan Qadha Solat",
        "image": "https://qadasolat.my/bukuqadhasolat.png",
        "description": "Panduan lengkap qadha solat bergambar, mudah difahami, dan praktikal untuk setiap Muslim.",
        "brand": {
          "@type": "Brand",
          "name": "Galeri Mukmin"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://qadasolat.my",
          "priceCurrency": "MYR",
          "price": "49.00",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Boleh bayar masa barang sampai (COD)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Boleh, tiada masalah. Kami menggunakan khidmat kurier DHL untuk barang sampai baru anda bayar. Cuma pilih 'COD' di borang tempahan."
            }
          },
          {
            "@type": "Question",
            "name": "Adakah buku ini patuh syariah?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ya, isi kandungan buku ini telah disemak oleh panel syariah bertauliah dan mengikut pegangan Ahli Sunnah Wal Jamaah (Mazhab Syafi'i)."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="ms">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
