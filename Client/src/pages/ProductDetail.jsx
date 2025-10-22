import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Image, Typography } from "antd";

import { fetchProductById } from "/src/service/productService";
import  { useDebouncedCartSync }  from '../hooks/useDebouncedCartSync' 
import MainLayout from "../components/UI/mainLayout";

const { Title, Paragraph } = Typography;
const PLACEHOLDER = "https://via.placeholder.com/600x400?text=No+Image";

// 统一取图：兼容 imageURL / imageUrl / image / img
const getImage = (p) => p?.imageUrl || p?.imageURL || p?.image || p?.img || "";

const money = (n) => {
  const num = Number(n);
  return Number.isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const handleAdd = useDebouncedCartSync();

  // 兼容不同 slice 命名（任选存在的）
  const user =
    useSelector((s) => s.user?.user || s.user?.currentUser || s.auth?.user) || null;
  // const cartItems = useSelector((s) => s.cart?.items || []);

  const [loading, setLoading] = useState(true);
  const [prod, setProd] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProd(data.product);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div style={{ color: "red" }}>{err}</div>;
  if (!prod) return <div>Not Found</div>;

  const isAdmin = user?.role === "admin";
  const image = getImage(prod) || PLACEHOLDER;

  const inStock =
    (typeof prod.inStock === "boolean" ? prod.inStock : undefined) ??
    (typeof prod.stock === "number" ? prod.stock > 0 : true);

  // // 访客购物车（localStorage 兜底；结构与 Redux 对齐）
  // const addToGuestCart = (product, qty = 1) => {
  //   const key = "guest_cart";
  //   const raw = localStorage.getItem(key);
  //   const cart = raw ? JSON.parse(raw) : [];
  //   const idx = cart.findIndex(
  //     (it) => (it.product?._id || it.product?.id) === (product._id || product.id)
  //   );
  //   if (idx >= 0) cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + qty };
  //   else cart.push({ product, quantity: qty });
  //   localStorage.setItem(key, JSON.stringify(cart));
  //   alert("Added to cart (guest).");
  // };

  const onAddToCart = async () => {
    if (!inStock) return;
    handleAdd(prod);
    // if (!user) {
    //   addToGuestCart(prod, 1);
    //   return;
    // }

    // // 计算 nextCart（与你们 cart.items 结构一致）
    // const nextCart = (() => {
    //   const i = cartItems.findIndex(
    //     (it) => (it.product?._id || it.product?.id) === (prod._id || prod.id)
    //   );
    //   if (i >= 0) return cartItems.map((it, idx) => (idx === i ? { ...it, quantity: it.quantity + 1 } : it));
    //   return [...cartItems, { product: prod, quantity: 1 }];
    // })();

    // // 乐观更新
    // const prev = cartItems;
    // dispatch(storeCartItems(nextCart));

    // const userId = user._id || user.id;
    // try {
    //   await dispatch(updateCartThunk({ userId, prevCart: prev })).unwrap();
    //   alert("Added to cart.");
    // } catch (e) {
    //   console.error(e);
    //   alert(e || "Failed to update cart.");
    //   // 失败时 thunk 内已回滚 prevCart
    // }
  };

  const onEdit = () => navigate(`/admin/createNewProduct?id=${prod._id || prod.id}`);

  return (
    <MainLayout>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* 左侧图片 */}
        <div>
          <Image
            src={image}
            alt={prod.name}
            width="100%"
            fallback={PLACEHOLDER}
            placeholder
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
            style={{ borderRadius: 8 }}
          />
        </div>

        {/* 右侧信息 */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={3} style={{ margin: 0 }}>{prod.name}</Title>
            <span
              style={{
                padding: "4px 8px",
                fontSize: 12,
                borderRadius: 6,
                background: inStock ? "#dcfce7" : "#fee2e2",
                color: inStock ? "#166534" : "#991b1b",
              }}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <Title level={4} style={{ marginTop: 12 }}>{money(prod.price)}</Title>
          <Paragraph>{prod.description || "No description."}</Paragraph>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {!isAdmin && (
              <button
                disabled={!inStock}
                onClick={onAddToCart}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #000",
                  background: inStock ? "#000" : "#eee",
                  color: inStock ? "#fff" : "#999",
                  cursor: inStock ? "pointer" : "not-allowed",
                }}
              >
                Add to Cart
              </button>
            )}
            {isAdmin && (
              <button
                onClick={onEdit}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            )}
            <Link to="/" style={{ alignSelf: "center" }}>← Back to Products</Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
