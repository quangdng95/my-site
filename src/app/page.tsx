
'use client';
import React from 'react';
import { Button, Typography, Card, Flex, theme } from 'antd'; 

const { Title, Paragraph } = Typography;

export default function Home() {
  const { token } = theme.useToken();

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: token.colorBgLayout, 
      padding: '20px',
      transition: 'background-color 0.3s ease'
    }}>
      <Card style={{ width: 500, textAlign: 'center', borderRadius:'12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        <Title level={2} style={{ margin: 0 }}>
          Xin chào! 👋
        </Title>
        
        <Paragraph style={{ marginTop: 10, marginBottom: 24, fontSize: '16px' }}>
          Đây là nút bấm sử dụng <b>Ant Design System</b> <br />
          đã được custom theo <span style={{ color: token.colorPrimary, fontWeight: 500}}>
            Norra System </span>.
        </Paragraph>

        <Flex vertical gap="middle" style={{ width: '100%' }}>
          
          <Button type="primary" size="large" block>
            Nút Primary (Màu Norra&apos;s Brand)
          </Button>

          <Button size="large" block>
            Nút Default (Viền xám)
          </Button>

          <Button type="dashed" block>
             Nút Dashed (Nét đứt)
          </Button>

        </Flex>
      </Card>
    </div>
  );
}

// Giống như style trong Figma
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    transition: 'background-color 0.3s ease',
    // Lưu ý: backgroundColor lấy động từ token nên mình để inline ở trên
  },
  card: {
    width: 500,
    textAlign: 'center' as const, // TypeScript cần cái as const này để hiểu
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 24,
    fontSize: 16,
  },
};