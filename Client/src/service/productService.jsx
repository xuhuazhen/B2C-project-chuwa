import api from "../api";

//Get all products API
export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

//Get a specific product API
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

//Get search product
export const getSearch = async (query) => {
  if (!query) return [];
  const res = await api.get(`/products/search?q=${query}`);
  return res.data;
};
