// 统一取图，优先后端产品最终保存的 image 字段
export const getImage = (p) =>
  p?.image || p?.imageUrl || p?.imageURL || p?.img || "";
