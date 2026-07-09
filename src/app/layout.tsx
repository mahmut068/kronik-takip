import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'T.C. Sağlık Bakanlığı Kronik Hasta Takip Sistemi',
  description: 'Kronik hasta uzaktan takip, erken uyarı ve yapay zeka destekli risk analizi. Devlet hastaneleri için entegre dijital klinik çözümü.',
  keywords: ['kronik hastalık', 'hasta takip', 'sağlık bakanlığı', 'diyabet', 'hipertansiyon', 'dijital klinik'],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏥</text></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="/icon.png" />
        {/* Premium Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
