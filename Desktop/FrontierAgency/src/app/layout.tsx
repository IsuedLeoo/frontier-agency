import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import AnalyticsScript from "@/components/AnalyticsScript";

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
      className="font-sans"
    >
      <head>
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="bg-black text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
        <AnalyticsScript />
      </body>
    </html>
  );
}
