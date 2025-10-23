import api from "../api";

//Get all products API
export const getProducts = async (
  page = 1,
  limit = 10,
  sort = "-createdAt"
) => {
  const url = `/products?page=${page}&limit=${limit}&sort=${sort}`;
  // console.log("Fetching URL:", url);
  const res = await api.get(url);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

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
};

// 搜索
// export const getSearch = async (query) => {
//   if (!query) return { products: [] };
//   const res = await api.get(`/products/search?q=${query}`);
//   return res.data;
// };

// === 别名导出（兼容旧命名）===
export const listProducts = getProducts;
export const fetchProductById = getProductById;
