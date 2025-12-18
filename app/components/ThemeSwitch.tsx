'use client';

import React, { useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { ConfigProvider, theme as antdTheme, Button } from 'antd';
import { AppTheme } from '../themeConfig';

// 1. Component con: Xử lý Logic đổi màu Antd + Màu nền Web
const AntdAdapter = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme, setTheme } = useTheme(); // Lấy thêm hàm setTheme để làm nút bấm
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Logic: Máy Dark -> Dùng Dark
  const isDark = resolvedTheme === 'dark';

  // --- XỬ LÝ MÀU NỀN BODY ---
  // Mỗi khi isDark thay đổi, ta ép màu nền của thẻ body đổi theo
  useEffect(() => {
    if (mounted) {
      document.body.style.backgroundColor = isDark ? '#000000' : '#f5f5f5'; // Đen hoặc Xám sáng
      document.body.style.color = isDark ? '#ffffff' : '#000000'; // Đổi màu chữ ngược lại
    }
  }, [isDark, mounted]);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }
  
  return (
    <ConfigProvider
      theme={{
        ...(isDark ? AppTheme.dark : AppTheme.light),
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      {/* --- CÁI NÚT NẰM LƠ LỬNG Ở ĐÂY NÈ --- */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
        <Button 
          type="primary" 
          shape="round" 
          size="large"
          onClick={() => setTheme(isDark ? 'light' : 'dark')} // Bấm cái là đổi theme
        >
          {isDark ? '☀️ Turn Light' : '🌙 Turn Dark'}
        </Button>
      </div>

      {children}
    </ConfigProvider>
  );
};

// 2. Component cha
export default function ThemeSwitch({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <AntdAdapter>{children}</AntdAdapter>
    </NextThemesProvider>
  );
}