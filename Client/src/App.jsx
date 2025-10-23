import { Flex, Layout } from "antd";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateProductPage from "./pages/createNewProduct";
import AppHeader from "./components/header";
import AppFooter from "./components/footer";
const { Header, Footer, Sider, Content } = Layout;
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ChangePwdPage from "./pages/ChangePwd";
import Products from "./pages/Products/ProductsList";
import ProductDetail from "/src/pages/ProductDetail.jsx"; // ← 这里没有 /Products 目录
import CreateProductPage from "./pages/createNewProduct";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ChangePwdPage from "./pages/ChangePwd";
import ErrorPage from "./pages/Error";
import AuthGuard from './router/AuthGuard';
import RoleGuard from './router/RoleGuard';
import PublicRoute from './router/PublicRoute';

export default function App() {
  useEffect(() => {
    initGlobalMessage();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard allowGuest={true}>
              <Products />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/create-product"
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
        <Route path="*" element={<ErrorPage />} />
        <Route path='*' element={
          <PublicRoute>
            <ErrorPage />
          </PublicRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
