import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ThemeSwitch from '@/components/common/ThemeSwitch'; // <-- Import SwithTheme
import themeConfig from '@/themeConfig';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Web Test",
  description: "Norra Testing Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* style={{ margin: 0 }} notes không bị hở trắng */}
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <AntdRegistry>
           {/* Gắn bộ chuyển đổi theme */}
           <ThemeSwitch>
              {children}
           </ThemeSwitch>
        </AntdRegistry>
      </body>
    </html>
  );
}