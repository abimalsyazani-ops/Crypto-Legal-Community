import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Crypto Legal Community | Media Hukum, Crypto, dan Ekonomi Digital",
    template: "%s | Crypto Legal Community",
  },
  description:
    "Media dan komunitas edukasi tentang cryptocurrency, blockchain, Web3, regulasi, hukum, investasi, pajak, keamanan aset digital, dan ekonomi digital Indonesia.",
  metadataBase: new URL("https://cryptolegal.community"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Crypto Legal Community",
    description: "Media Hukum, Crypto, dan Ekonomi Digital",
    type: "website",
    locale: "id_ID",
    images: ["/clc-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Legal Community",
    description: "Media Hukum, Crypto, dan Ekonomi Digital",
    images: ["/clc-logo.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Crypto Legal Community",
    url: "https://cryptolegal.community",
    description:
      "Media hukum, crypto, blockchain, Web3, regulasi, investasi, dan ekonomi digital.",
  };

  return (
    <html lang="id">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
