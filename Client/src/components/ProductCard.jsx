import React from "react";
import { Card } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux"; 
import { makeSelectCartItemById } from "../store/cart/selectors";
import Button from "../components/Button";
import  { useDebouncedCartSync }  from '../hooks/useDebouncedCartSync'
import store from '../store/store'

const ProductCard = React.memo(({ product }) => {
  // const dispatch = useDispatch();

  const userId = store.getState().user.curUser?._id;
  const { handleAdd, handleQuantity } = useDebouncedCartSync(userId);

  //Create a memoized selector for this product
  const selectCartItem = React.useMemo(
    () => makeSelectCartItemById(product._id),
    [product._id]
  );

  //Subscribe to only this cart item
  const cartItem = useSelector(selectCartItem);

  // const addToCartHandler = () => {
  //   dispatch(addToCart(product));
  //   console.log(product);
  // };

  // const incrementHandler = () => {
  //   dispatch(incrementItemQuantity(product._id));
  //   console.log(product._id);
  // };
  // const decrementHandler = () => {
  //   dispatch(decrementItemQuantity(product._id));
  // };

  const editProduct = () => {
    console.log('navigate to product detail');
  }

  return (
    <Card
      style={{ border: "1px solid #CCC", borderRadius: "4px", width: "100%" }}
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
        <img
          src={product.imageURL}
          style={{
            height: 198,
            objectFit: "cover",
            borderRadius: 0,
          }}
        />
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
          <Button size="small" style={{ width: "110px" }}>
            <MinusOutlined onClick={() => handleQuantity(product._id, cartItem.quantity - 1)} />
            <span>{cartItem?.quantity || 0}</span>
            <PlusOutlined onClick={() => handleQuantity(product._id, cartItem.quantity + 1)} />
          </Button>
        ) : (
          <Button
            size="small"
            onClick={() => handleAdd(product)}
            style={{ width: "110px" }}
          >
            Add
          </Button>
        )}
        <Button
          size="small"
          style={{
            width: "110px",
            backgroundColor: "#fff",
            color: "#535353",
            border: "1px solid #CCC",
          }}
          onClick={editProduct}
        >
          Edit
        </Button>
      </div>
    </Card>
  );
});

export default ProductCard;
