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
    icon: "/logoblack.png",
    shortcut: "/logoblack.png",
    apple: "/logoblack.png",
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
        <link rel="icon" href="/logoblack.png" />
      </head>
      <body className="bg-black text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
