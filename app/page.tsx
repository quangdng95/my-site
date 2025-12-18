/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import { Button, Typography, Card, Flex, theme } from 'antd'; 

const { Title, Paragraph } = Typography;

export default function Home() {
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: colorBgLayout, 
      padding: '20px',
      transition: 'background-color 0.3s ease'
    }}>
      <Card style={{ width: 500, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        <Title level={2} style={{ marginBottom: 0 }}>
          Xin chào! 👋
        </Title>
        
        <Paragraph style={{ marginTop: 10, marginBottom: 24, fontSize: '16px' }}>
          Đây là nút bấm sử dụng <b>Ant Design System</b> đã được custom theo <b>Norra System</b>.
        </Paragraph>

        <Flex vertical gap="middle" style={{ width: '100%' }}>
          
          <Button type="primary" size="large" block>
            Nút Primary (Màu Norra's Brand)
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