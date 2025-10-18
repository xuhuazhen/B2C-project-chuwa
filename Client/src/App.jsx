import { Flex, Layout } from "antd";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateProductPage from "./pages/createNewProduct";
import AppHeader from "./components/header";
import AppFooter from "./components/footer";
const { Header, Footer, Sider, Content } = Layout;
import LoginPage from "./pages/Login/Login";
import SignupPage from "./pages/Signup/Signup";
import { ChangePwdPage } from "./pages/ChangePwd/ChangPwd";
import Products from "./pages/Products/ProductsList";

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
        <Route path="/" element={<Products />} />
        <Route path="/admin/create-product" element={<CreateProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget-pwd" element={<ChangePwdPage />} />
      </Routes>
    </BrowserRouter>
  );
}
