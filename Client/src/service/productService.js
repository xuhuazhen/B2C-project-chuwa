import api from "/src/api";

<<<<<<< HEAD
//Get all products API
export const getProducts = async (page = 1, limit = 10, sort) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (sort) params.append("sort", sort);

  const res = await api.get(`/products?${params.toString()}`);
=======
// 获取全部
export const getProducts = async () => {
  const res = await api.get("/products");
>>>>>>> main
  return res.data;
};

// 获取单个
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

<<<<<<< HEAD
//Get search query
export const getSearch = async (query, signal) => {
  if (!query) return { products: [] };

  try {
    const res = await api.get(
      `/products/search?q=${encodeURIComponent(query)}`,
      { signal }
    );
    return res.data;
  } catch (err) {
    if (err.name === "CanceledError") return { products: [] };
    console.error("Search API error:", err);
    throw err;
  }
=======
// 搜索
export const getSearch = async (query) => {
  if (!query) return { products: [] };
  const res = await api.get(`/products/search?q=${query}`);
  return res.data;
>>>>>>> main
};

// === 别名导出（兼容旧命名）===
export const listProducts = getProducts;
export const fetchProductById = getProductById;
