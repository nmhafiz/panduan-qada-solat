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
        "@type": "Organization",
        "name": "Galeri Mukmin",
        "url": "https://qadasolat.my",
        "logo": "https://qadasolat.my/logo.png",
        "sameAs": [
          "https://www.facebook.com/galerimukmin"
        ]
      },
      {
        "@type": "Article",
        "headline": "Panduan Qadha Solat: Cara Ganti Solat Yang Tertinggal Lama",
        "image": "https://qadasolat.my/bukuqadhasolat.png",
        "datePublished": "2024-01-01T08:00:00+08:00",
        "dateModified": new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": "Galeri Mukmin"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Apa itu Qadha Solat? (Penting)",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Qadha solat bermaksud menggantikan solat fardhu yang ditinggalkan (sama ada sengaja atau tidak sengaja) selepas berlalunya waktu solat tersebut. Ia berbeza dengan Solat Jamak/Qasar."
            }
          },
          {
            "@type": "Question",
            "name": "Wajibkah Qadha Solat yang tertinggal lama?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mengikut Jumhur Ulama (Majoriti) termasuk Mazhab Syafi'i, Maliki, Hanafi, dan Hanbali - WAJIB mengqadha semua solat fardhu yang ditinggalkan walaupun ia berlaku bertahun-tahun lamanya."
            }
          },
          {
            "@type": "Question",
            "name": "Bagaimana cara kira jumlah solat yang tertinggal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dalam buku ini, kami sediakan 'Sistem Log Mufashil' dan formula mudah untuk anda anggar jumlah tahun yang tertinggal. Cukup sekadar anggaran yakin (Ghalib ad-Zhan)."
            }
          },
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
