import React from 'react';
import { Layout } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: 'white', fontSize: 18 }}>
        <ShoppingOutlined /> Product Management
      </Header>

      <Content style={{ padding: '50px', flex: 1 }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        ©2025 Product Management System
      </Footer>
    </Layout>
  );
}