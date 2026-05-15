import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "FashionAI Studio — IA para Moda e E-commerce",
    template: "%s | FashionAI Studio",
  },
  description:
    "Plataforma de IA especializada em moda. Troca de roupas, avatares, Virtual Try-On, fotos para e-commerce e campanhas automáticas para Instagram, Shopee e Mercado Livre.",
  keywords: [
    "IA moda",
    "virtual try-on",
    "troca de roupa IA",
    "avatar IA",
    "fotos e-commerce",
    "campanha automática",
    "geração criativa IA",
    "fashion AI",
  ],
  authors: [{ name: "FashionAI Studio" }],
  creator: "FashionAI Studio",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "FashionAI Studio — IA para Moda e E-commerce",
    description:
      "Crie fotos de moda, troque roupas em modelos, gere avatares e automatize campanhas com IA.",
    siteName: "FashionAI Studio",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FashionAI Studio",
    description: "IA especializada em moda e e-commerce",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#F5A623",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen bg-background antialiased`}
      >
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "hsl(220 14% 8%)",
                border: "1px solid hsl(220 14% 16%)",
                color: "hsl(210 40% 98%)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
