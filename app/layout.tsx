import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WiFaKey OAuth",

  description:
    "Cổng đăng ký dịch vụ ủy quyền OAuth tích hợp công nghệ xác thực khuôn mặt Wifakey. Bảo mật tuyệt đối, xác minh danh tính nhanh chóng và an toàn.",

  keywords: [
    "OAuth",
    "Wifakey",
    "Xác thực khuôn mặt",
    "Face Auth",
    "Bảo mật sinh trắc học",
  ],

  openGraph: {
    title: "Đăng ký Ủy quyền OAuth - Wifakey",
    description:
      "Hệ thống xác thực khuôn mặt tiên tiến bảo vệ tài khoản của bạn.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
