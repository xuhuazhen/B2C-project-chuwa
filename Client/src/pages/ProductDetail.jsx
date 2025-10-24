import { useEffect, useState } from "react";
import { useParams, useNavigate, Link  } from "react-router-dom";
import { useSelector } from "react-redux";
import { Image, Typography, message } from "antd";

import { fetchProductById } from "/src/service/productService";
import { useDebouncedCartSync } from "../hooks/useDebouncedCartSync";
import MainLayout from "../components/UI/mainLayout";
import { getImage } from "../utils/getImage";

const { Title, Paragraph } = Typography;
const PLACEHOLDER = "/no-image.png"; // 本地占位图（放在 Client/public/no-image.png）

const money = (n) => {
  const num = Number(n);
  return Number.isNaN(num) ? "$0.00" : `$${num.toFixed(2)}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 购物车同步（你项目已有的 hook）
  const { handleAdd, handleQuantity, handleRemove } = useDebouncedCartSync();

  // 兼容不同 slice 命名（任选存在的）
  const user = useSelector((s) => s.user.curUser) || null;

  const [loading, setLoading] = useState(true);
  const [prod, setProd] = useState(null);
  const [err, setErr] = useState("");
  const [qty, setQty] = useState(1);

  // 获取cart中对应的item
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartItem = prod ? cartItems.find((i) => i.product._id === prod._id) : null;  
  const inCart = !!cartItem;

  
  useEffect(() => {
    (async () => { 
      console.log('fetch')
      try {
        setLoading(true);
        const data = await fetchProductById(id);
        setProd(data.product);
        setQty(1);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (cartItem) setQty(cartItem.quantity);
    else setQty(1); // 默认 1
  }, [cartItem]);

  if (loading) return <div>Loading...</div>;
  if (err) return <div style={{ color: "red" }}>{err}</div>;
  if (!prod) return <div>Not Found</div>;

  const isAdmin = user?.role === "admin";
  const image = getImage(prod) || PLACEHOLDER;

  // 以后端的 stock 为准；若无则仅用于展示 “In Stock”
  const stockNumber =
    typeof prod.stock === "number"
      ? prod.stock
      : typeof prod.inStock === "boolean"
      ? prod.inStock
        ? 9999
        : 0
      : 9999;

  const inStock = stockNumber > 0;

  // ✅ 数量控制：0..stock
  // const inc = () => {
  //   if (!inStock) return;
  //   setQty((q) => {
  //     const next = Math.min(q + 1, stockNumber);
  //     if (next === q) message.info("Reached stock limit");
  //     return next;
  //   });
  // };

  // const dec = () => {
  //   // 允许到 0；如果你希望“到 0 即自动移除”，可在这里调用 handleQuantity(pid, 0)
  //   setQty((q) => Math.max(0, q - 1));
  // };

  // // 提交：qty===0 走移除，>0 走加入（支持一次性加 qty）
  // const onAddToCart = async () => {
  //   if (!inStock && qty > 0) return; // 无库存时不允许新增
  //   const pid = prod?._id || prod?.id;
  //   try {
  //     if (qty === 0) {
  //       await Promise.resolve(handleQuantity?.(pid, 0)); // 设为 0 = 移除
  //       message.success("Removed from cart");
  //     } else {
  //       console.log(prod)
  //       await Promise.resolve(handleAdd?.(prod, qty)); // 一次性加入 qty
  //       message.success("Added to cart");
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     message.error("Failed to update cart");
  //   }
  // };
    const inc = () => {
    if (!inStock) return;
    const next = Math.min(qty + 1, stockNumber);
    setQty(next);
    handleQuantity(prod._id, next);
  };

  const dec = () => {
    const next = Math.max(qty - 1, 1);
    setQty(next);
     handleQuantity(prod._id, next);
  };

  const onAddToCart = () => {
    if (!inStock) return;
    try {
      handleAdd(prod, qty);
      message.success("Added to cart");
    } catch (e) {
      console.error(e);
      message.error("Failed to add to cart");
    }
  };
  
  const onRemove = () => {
    try {
      handleRemove(prod._id);
      message.success("Removed from cart");
    } catch (e) {
      console.error(e);
      message.error("Failed to remove from cart");
    }
  };

  const onEdit = () => navigate(`/admin/create-product/${prod._id || prod.id}`);

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
            style={{ borderRadius: 8 }}
          />
        </div>

        {/* 右侧信息 */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              {prod.name}
            </Title>
            <span
              style={{
                padding: "4px 8px",
                fontSize: 12,
                borderRadius: 6,
                background: inStock ? "#dcfce7" : "#fee2e2",
                color: inStock ? "#166534" : "#991b1b",
              }}
            >
              {inStock ? `In Stock (${stockNumber})` : "Out of Stock"}
            </span>
          </div>

          <Title level={4} style={{ marginTop: 12 }}>
            {money(prod.price)}
          </Title>
          <Paragraph>{prod.description || "No description."}</Paragraph>

          {/* ✅ 数量 +/- 控件（允许到 0） */}
          { inCart && <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 12,
            }}
          >
            <button
              onClick={dec}
              disabled={qty <= 0}
              aria-label="decrease"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: qty <= 0 ? "not-allowed" : "pointer",
                fontSize: 18,
                lineHeight: "34px",
              }}
            >
              −
            </button>
            <div
              style={{
                minWidth: 48,
                textAlign: "center",
                border: "1px solid #eee",
                borderRadius: 8,
                padding: "6px 10px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {qty}
            </div>
            <button
              onClick={inc}
              disabled={!inStock || qty >= stockNumber}
              aria-label="increase"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
                cursor:
                  !inStock || qty >= stockNumber ? "not-allowed" : "pointer",
                fontSize: 18,
                lineHeight: "34px",
              }}
            >
              +
            </button>
          </div>
          }

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button
                // disabled={!inStock && qty > 0}
                disabled={!inStock}
                onClick={!inCart ? onAddToCart : onRemove}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1px solid #000",
                  background: !inStock && qty > 0 ? "#eee" : "#000",
                  color: !inStock && qty > 0 ? "#999" : "#fff",
                  cursor: !inStock && qty > 0 ? "not-allowed" : "pointer",
                }}
              >
                {inCart ? "Remove" : "Add to Cart"}
              </button>
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
            <Link to="/products" style={{ alignSelf: "center" }}>
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
