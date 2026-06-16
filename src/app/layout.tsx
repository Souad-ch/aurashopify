import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura — منصة التجارة الإلكترونية",
  description:
    "Aura هي المنصة التي تحتاجها لبناء متجرك الإلكتروني وإدارته وتنميته. ابدأ البيع اليوم.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
