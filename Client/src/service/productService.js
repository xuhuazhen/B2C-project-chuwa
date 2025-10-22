import api from "../api";

//Get all products API
export const getProducts = async (page = 1, limit = 10, sort) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (sort) params.append("sort", sort);

  const res = await api.get(`/products?${params.toString()}`);
  return res.data;
};

//Get a specific product API
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
