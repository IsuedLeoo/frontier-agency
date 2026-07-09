import type { Metadata } from "next";
import "./globals.css";
import UpdateNotifier from "./UpdateNotifier";

export const metadata: Metadata = {
  title: "A.M.",
  description: "A.M. — AI Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="h-full antialiased overflow-hidden">
        <UpdateNotifier />
        {children}
      </body>
    </html>
  );
}
