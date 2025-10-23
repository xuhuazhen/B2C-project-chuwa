import React from "react";
import { Card } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { makeSelectCartItemById } from "../store/cart/selectors";
import Button from "../components/Button";
import { useDebouncedCartSync } from "../hooks/useDebouncedCartSync";
import { useNavigate } from "react-router-dom";

const ProductCard = React.memo(({ product }) => {
  const userRole = useSelector((state) => state.user.curUser?.role);
  const { handleAdd, handleQuantity } = useDebouncedCartSync();
  const navigate = useNavigate();

  //Create a memoized selector for this product
  const selectCartItem = React.useMemo(
    () => makeSelectCartItemById(product._id),
    [product._id]
  );

  //Subscribe to only this cart item
  const cartItem = useSelector(selectCartItem);

  // const editProduct = () => {
  //   console.log("navigate to product detail");
  // };

  const isOutOfStock = product.stock === 0;
  console.log(isOutOfStock);

  return (
    <Card
      onClick={() => {
        navigate(`products/${product._id}`);
      }}
      style={{
        border: "1px solid #CCC",
        borderRadius: "4px",
        width: "100%",
      }}
      styles={{
        cover: {
          padding: "12px",
        },
        body: {
          padding: "0 12px 0 12px",
        },
        actions: {
          borderTop: "none",
        },
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
          {/* Product Image */}
          <img
            src={product.imageURL}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              borderRadius: 0,
            }}
          />

          {/* Overlay */}
          {isOutOfStock && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
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
          gap: "6px",
          fontSize: "10px",
          padding: "12px 0",
        }}
      >
        {cartItem ? (
          <Button
            onClick={(e) => {
              e.stopPropagation(); // prevent redirect
            }}
            size="small"
            style={{
              width: "110px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <MinusOutlined
              style={{ fontSize: "15px" }}
              onClick={() => handleQuantity(product._id, cartItem.quantity - 1)}
            />
            <span>{cartItem?.quantity || 0}</span>

            <PlusOutlined
              style={{ fontSize: "15px" }}
              onClick={() => handleQuantity(product._id, cartItem.quantity + 1)}
            />
          </Button>
        ) : (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleAdd(product);
            }}
            style={{
              width: "110px",
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
              width: "110px",
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
