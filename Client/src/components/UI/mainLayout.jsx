import React from "react";
import { Layout } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import AppHeader from "../header";
import AppFooter from "../footer";

const { Header, Content, Footer } = Layout;

export default function MainLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ color: "white", fontSize: 18 }}>
        <ShoppingOutlined /> Product Management
      </Header>
      {/* <AppHeader /> */}
      <Content style={{ padding: "50px", flex: 1 }}>{children}</Content>
      <AppFooter />
    </Layout>
  );
}
