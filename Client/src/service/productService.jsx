import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/** 获取产品列表 */
export async function listProducts() {
  const res = await axios.get(`${API_BASE}/api/products`, { withCredentials: true });
  return res.data?.products || res.data?.data?.products || [];
}

/** 根据 id 获取详情 */
export async function fetchProductById(id) {
  const res = await axios.get(`${API_BASE}/api/products/${id}`, { withCredentials: true });
  return res.data?.product || res.data?.data?.product || null;
}

/** 搜索产品（支持两种命名：getSearch / searchProducts） */
export async function getSearch(q) {
  const res = await axios.get(`${API_BASE}/api/products/search`, {
    params: { q },
    withCredentials: true,
  });
  return res.data?.products || [];
}
export const searchProducts = getSearch; // 别名
