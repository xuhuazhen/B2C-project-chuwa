import { useDispatch, useSelector } from "react-redux";
import { updateQuantity, removeItem, addToCart } from "../store/cart/cartSlice";
import { updateCartThunk } from "../store/cart/cartThunk";
import store from "../store/store";
import { debounce } from "lodash";
import { useRef } from "react";

export const useDebouncedCartSync = (wait = 300) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const userId = user.curUser?._id;

  // 记录最近一次成功同步到后端的购物车快照
  const lastSyncedCart = useRef(
    store.getState().cart.items.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
    }))
  );

  const debouncedUpdate = useRef(
    debounce((prevCart) => {
      if (!user?.isLoggedIn) return;
      dispatch(updateCartThunk({ userId, prevCart }))
        .unwrap()
        .then((updatedCart) => {
          lastSyncedCart.current = updatedCart.map((i) => ({
            product: i.product._id,
            quantity: i.quantity,
          }));
        })
        .catch(() => {
          // 失败可在 thunk 中回滚；这里不额外处理
        });
    }, wait)
  ).current;

  const handleQuantity = (productId, qty) => {
    const prev = lastSyncedCart.current; 
    dispatch(updateQuantity({ productId, quantity: qty }));
    
    if (user.isLoggedIn) debouncedUpdate(prev);
  };

  // 一次性加入 qty 件
  const handleAdd = (product, qty = 1) => {
    dispatch(addToCart({ product, quantity: qty }));
    if (user.isLoggedIn) debouncedUpdate(lastSyncedCart.current);
  };

  const handleRemove = (productId) => {
    dispatch(removeItem(productId));
    if (user.isLoggedIn) debouncedUpdate(lastSyncedCart.current);
  };

  return { handleQuantity, handleRemove, handleAdd };
};