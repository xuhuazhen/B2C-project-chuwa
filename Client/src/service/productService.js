import api from "/src/api";

// 获取全部
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

// 获取单个
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// 搜索
export const getSearch = async (query) => {
  if (!query) return { products: [] };
  const res = await api.get(`/products/search?q=${query}`);
  return res.data;
};

// === 别名导出（兼容旧命名）===
export const listProducts = getProducts;
export const fetchProductById = getProductById;
