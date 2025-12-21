"use client";

import React from 'react';
import { Button, Checkbox, Form, Input, Card, Typography, theme } from 'antd';
import { UserIcon, LockIcon } from '@/app/components/icons/anticon'; 

const { Title, Text } = Typography;

interface LoginFieldType {
  username: string;
  password: string;
  remember?: string;
}

export default function LoginPage() {
  const {
    token: { colorBgLayout, colorTextSecondary },
  } = theme.useToken();

  const onFinish = (values: LoginFieldType) => {
    console.log('Success:', values);
    alert('Đăng nhập thành công (Demo)!');
  };

  const onFinishFailed = (errorInfo: object) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: colorBgLayout,
      transition: 'all 0.3s' 
    }}>
      
      <Card style={{ 
        width: 400, 
        borderRadius:'16px', 
        boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)' 
      }}>
        {/* Tiêu đề */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Welcome back to <b>Norra</b></Title>
          <Text style={{ color: colorTextSecondary }}>It&apos;s time to work</Text>
        </div>

        {/* Form nhập liệu */}
        <Form
          name="login_form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          size="large"
          layout="vertical" // Để label nằm trên input cho đẹp (Optional)
        >
          {/* Username */}
          <Form.Item<LoginFieldType>
            name="username"
            rules={[{ required: true, message: 'username is required!' }]}
          >
            <Input prefix={<UserIcon />} placeholder="Your username/email" />
          </Form.Item>

          {/* Password */}
          <Form.Item<LoginFieldType>
            name="password"
            rules={[{ required: true, message: 'password is required!' }]}
          >
            <Input.Password prefix={<LockIcon />} placeholder="Your Password" />
          </Form.Item>

          {/* Checkbox & Forgot Password */}
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember login</Checkbox>
            </Form.Item>
            <a style={{ float: 'right' }} href="#">Forgot your passwords?</a>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}