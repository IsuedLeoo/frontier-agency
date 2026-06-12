import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frontier Agency",
  description:
    "Frontier Agency builds personalized AI agencies for businesses of every size. Custom AI operations on demand.",
  openGraph: {
    title: "Frontier Agency",
    description:
      "Frontier Agency builds personalized AI agencies for businesses of every size. Custom AI operations on demand.",
    type: "website",
  },
  icons: {
    // fallback favicon
    // Note: the actual link tag is added below to guarantee loading

    icon: [{ url: "/logoblack.png", sizes: "any" }],
    shortcut: [{ url: "/logoblack.png", sizes: "any" }],
    apple: [{ url: "/logoblack.png", sizes: "any" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="bg-black text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
