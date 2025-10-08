import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import CreateProductPage from './pages/createNewProduct'; 
function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Home Page</h1>
      <p><Link to="/admin/create-product">Go to Create Product Page</Link></p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/create-product" element={<CreateProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}
