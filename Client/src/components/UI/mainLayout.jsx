import React, { useState } from 'react';
import { Layout, Button } from "antd";
import { ShoppingOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import AppHeader from "../header";
import AppFooter from "../footer";
import CheckoutPage from "../../pages/Checkout/Checkout";

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false); 


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "white", fontSize: 18 }}>
        <ShoppingOutlined /> Product Management
        <Button 
          icon={<ShoppingCartOutlined/>} 
          onClick={()=>setOpen(true)}
        >
          $0.0
        </Button>
      </Header>
      {/* <AppHeader /> */}
      <Content style={{ padding: '24px', background: '#f0f2f5', position: 'relative', flex: 1 }}>
        {children}
        
        <CheckoutPage open={open} onClose={() => {setOpen(false)}} />
      </Content>
      <AppFooter />
    </Layout>
  );
}
