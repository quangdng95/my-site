import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ThemeSwitch from './components/ThemeSwitch'; // <-- Import cái switch xịn xò
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
      {/* style={{ margin: 0 }} để theme nó tràn viền không bị hở trắng */}
      <body className={inter.className} style={{ margin: 0 }}>
        <AntdRegistry>
           {/* Gắn bộ chuyển đổi theme vào đây */}
           <ThemeSwitch>
              {children}
           </ThemeSwitch>
        </AntdRegistry>
      </body>
    </html>
  );
}