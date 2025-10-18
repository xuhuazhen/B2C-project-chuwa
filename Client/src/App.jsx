// Client/src/App.jsx
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Layout, Button, Flex } from "antd";


import Products from "./pages/Products/Products";
import ProductDetail from "./pages/Products/ProductDetail";
import CreateProductPage from "./pages/createNewProduct";

const { Content } = Layout;

function Home() {
  const navigate = useNavigate();

  // 方便切换角色：localStorage.setItem('role', 'admin' | 'user')
  const setRole = (r) => {
    localStorage.setItem("role", r);
    // 仅提示
    alert(`Role set to: ${r}`);
  };

  return (
    <Flex gap="middle" wrap>
      <Layout>
        <AppHeader />
        <Content style={{ padding: 24 }}>
          <h1>Welcome to Management System</h1>
          <p>Use the navigation bar to explore.</p>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <Button onClick={() => setRole("user")}>Set Role: user</Button>
            <Button onClick={() => setRole("admin")}>Set Role: admin</Button>
          </div>
          <Button type="primary" onClick={() => navigate("/products")}>
            View Products
          </Button>
        </Content>
        <AppFooter />
      </Layout>
    </Flex>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 产品列表与详情 */}
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        {/* 示例：admin 创建商品页（未加鉴权，可自行套 RoleGuard） */}
        <Route path="/admin/create-product" element={<CreateProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
