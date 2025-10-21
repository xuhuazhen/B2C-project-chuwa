import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Button } from "antd";
import { ShoppingOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import AppHeader from "../header";
import AppFooter from "../footer";
import CheckoutPage from "../../pages/Checkout/Checkout";

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]); // 每当 pathname 变化, close shopping cart

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* <Header style={{ color: "white", fontSize: 18 }}>
        <ShoppingOutlined /> Product Management
      </Header> */}
      <AppHeader setOpen={setOpen} />
      <Content style={{ padding: "50px", flex: 1, position: "relative" }}>
        {children}
        <CheckoutPage
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        />
      </Content>
      <AppFooter />
    </Layout>
  );
}
