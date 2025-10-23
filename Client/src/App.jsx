// Client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 
// import Products from "/src/pages/Products/Products.jsx";
import Products from "./pages/Products/ProductsList";
import ProductDetail from "/src/pages/ProductDetail.jsx"; // ← 这里没有 /Products 目录
import CreateProductPage from './pages/createNewProduct';
import LoginPage from './pages/Login';
import SignupPage from "./pages/Signup";
import ChangePwdPage from "./pages/ChangePwd";
import ErrorPage from "./pages/Error";
import AuthGuard from './router/AuthGuard';
import RoleGuard from './router/RoleGuard';
import PublicRoute from './router/PublicRoute';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
          element={
          <AuthGuard allowGuest={true}>
            <Products />
          </AuthGuard>
          } 
        />
        <Route path="/products/:id" element={
          <AuthGuard allowGuest={true}>
            <ProductDetail />
          </AuthGuard>
          } 
        />
        <Route 
          path="/admin/create-product" 
          element={
            <AuthGuard>
              <RoleGuard requiredRole="admin">
                <CreateProductPage />
              </RoleGuard>
            </AuthGuard>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route 
          path="/forget-pwd" 
          element={
          <PublicRoute>
            <ChangePwdPage />
          </PublicRoute>
          } 
        />
        <Route path='*' element={
          <PublicRoute>
            <ErrorPage />
          </PublicRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
