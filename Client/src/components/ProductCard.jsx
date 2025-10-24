import React from "react";
import { Card } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { makeSelectCartItemById } from "../store/cart/selectors";
import Button from "../components/Button";
import { useDebouncedCartSync } from "../hooks/useDebouncedCartSync";
import { useNavigate } from "react-router-dom";
import "./productCard.css";

// 统一取图：兼容 imageURL / imageUrl / image / img
const getImage = (p) => p?.imageUrl || p?.imageURL || p?.image || p?.img || "";

const PLACEHOLDER = "/no-image.png"; // 放在 Client/public/no-image.png

const ProductCard = React.memo(({ product }) => {
  const userRole = useSelector((state) => state.user.curUser?.role);
  const { handleAdd, handleQuantity } = useDebouncedCartSync();
  const navigate = useNavigate();

  const selectCartItem = React.useMemo(
    () => makeSelectCartItemById(product._id),
    [product._id]
  );
  const cartItem = useSelector(selectCartItem);

  const isOutOfStock = Number(product?.stock ?? 0) === 0;

  const src = getImage(product) || PLACEHOLDER;

  return (
    <Card
      onClick={() => {
        navigate(`products/${product._id}`);
      }}
      style={{
        border: "1px solid #CCC",
        borderRadius: 4,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      styles={{
        cover: { padding: 12 },
        body: { padding: "0 12px 0 12px" },
        actions: { borderTop: "none" },
      }}
      hoverable
      cover={
        <div
          style={{
            position: "relative",
            height: 198,
            overflow: "hidden",
            borderRadius: 0,
          }}
        >
          <img
            src={src}
            alt={product.name}
            onError={(e) => {
              // 如果字段是空或加载失败，强制替换为本地占位图
              if (e.currentTarget.src !== window.location.origin + PLACEHOLDER) {
                e.currentTarget.src = PLACEHOLDER;
              }
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              borderRadius: 0,
            }}
          />

          {isOutOfStock && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                zIndex: 2,
              }}
            >
              Out of Stock
            </div>
          )}
        </div>
      }
    >
      <div style={{ margin: 0, lineHeight: 1.2 }}>
        <div
          style={{
            margin: 0,
            fontWeight: 400,
            fontSize: 14,
            color: "#6B7280",
            lineHeight: 1.2,
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            margin: "3px 0 0 0",
            fontWeight: 600,
            fontSize: 16,
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          $ {product.price}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          fontSize: 10,
          padding: "12px 0",
          flexWrap: "wrap",
          marginTop: "auto",
        }}
      >
        {cartItem ? (
          <Button
            onClick={(e) => e.stopPropagation()}
            size="small"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flex: "1 1",
              padding: "0 10px",
            }}
          >
            <MinusOutlined className="edit-button"
              style={{ fontSize: "15px", width: "100%" }}
              onClick={() => handleQuantity(product._id, cartItem.quantity - 1)}
            />
            <span>{cartItem?.quantity || 0}</span>

            <PlusOutlined className="edit-button"
              style={{ fontSize: "15px", width: "100%"  }}
              onClick={() => handleQuantity(product._id, cartItem.quantity + 1)}
            />
          </Button>
        ) : (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) handleAdd(product);
            }}
            style={{
              flex: "1 1",
              padding: "0 10px",
              backgroundColor: isOutOfStock ? "#e5e7eb" : "#5048E5",
              color: isOutOfStock ? "#9ca3af" : "#fff",
              border: isOutOfStock ? "1px solid #d1d5db" : "none",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
            }}
            disabled={isOutOfStock}
          >
            Add
          </Button>
        )}

        {userRole === "admin" && (
          <Button
            size="small"
            style={{
              flex: "1 1",
              padding: "0 10px",
              backgroundColor: "#fff",
              color: "#535353",
              border: "1px solid #CCC",
            }}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/create-product/${product._id}`);
            }}
          >
            Edit
          </Button>
        )}
      </div>
    </Card>
  );
});

export default ProductCard;
