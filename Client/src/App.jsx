// Client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "/src/components/UI/mainLayout.jsx";
import Products from "/src/pages/Products/Products.jsx";
import ProductDetail from "/src/pages/ProductDetail.jsx"; // ← 这里没有 /Products 目录

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
