import { Flex, Layout } from "antd";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateProductPage from "./pages/createNewProduct";
import AppHeader from "./components/header";
import AppFooter from "./components/footer";
const { Header, Footer, Sider, Content } = Layout;
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ChangePwdPage from "./pages/ChangePwd"
import Products from "./pages/Products/ProductsList";
import ErrorPage from "./pages/Error";
import PublicRoute from "./router/PublicRoute";
import AuthGuard from "./router/AuthGuard";
import RoleGuard from "./router/RoleGuard";

function Home() {
  return (
    <Flex gap="middle" wrap>
      <Layout>
        <AppHeader />
        <Content>Content</Content>
        <AppFooter></AppFooter>
      </Layout>
    </Flex>
  );
}
// function Home() {
//   return (
//     <div style={{ padding: 24 }}>
//       <h1>Home Page</h1>
//       <p><Link to="/admin/create-product">Go to Create Product Page</Link></p>
//       <p><Link to="/login">Go to login Page</Link></p>
//     </div>
//   );
//   // return (
//   //   <div style={{ padding: 24 }}>
//   //     <h1>Home Page</h1>
//   //     <p>
//   //       <Link to="/admin/create-product">Go to Create Product Page</Link>
//   //     </p>
//   //   </div>
//   // );
// }

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
