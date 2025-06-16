import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "DappCon Discount Portal | Protocol Berg Attendees",
  description: "Protocol Berg attendees get 25% off DappCon tickets. Verify your attendance with zero-knowledge proof to unlock your exclusive discount.",
  keywords: "DappCon, Protocol Berg, discount, zero-knowledge proof, blockchain conference, ethereum",
  authors: [{ name: "DappCon Team" }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "DappCon Discount Portal | Protocol Berg Attendees",
    description: "Protocol Berg attendees get 25% off DappCon tickets. Verify your attendance with zero-knowledge proof.",
    type: "website",
    url: "https://dappcon.discountzu.app",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DappCon Discount Portal - 25% Off for Protocol Berg Attendees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DappCon Discount Portal | Protocol Berg Attendees",
    description: "Protocol Berg attendees get 25% off DappCon tickets. Verify your attendance with zero-knowledge proof.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.avif" type="image/avif" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
