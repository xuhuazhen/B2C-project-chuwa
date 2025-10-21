import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import AppHeader from "../Header/header";
import AppFooter from "../footer";
import CheckoutPage from "../../pages/Checkout/Checkout";

const { Content } = Layout;

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]); // 每当 pathname 变化, close shopping cart

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
