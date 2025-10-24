import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeItem, addToCart } from '../store/cart/cartSlice';
import { updateCartThunk } from '../store/cart/cartThunk';
import store from '../store/store';
import { debounce } from 'lodash';
import { useMemo, useRef } from 'react';

export const useDebouncedCartSync = (wait = 300) => {
  const dispatch = useDispatch();
  // 仅用于触发重渲染，确保登录态变化后 hook 内逻辑最新
  const user = useSelector((s) => s.user);

  const snapshot = () => {
    const st = store.getState();
    return (st.cart?.items || []).map((i) => ({
      product: i.product._id || i.product.id,
      quantity: i.quantity,
    }));
  };

  // 记录上一次已成功同步到后端的购物车快照
  const lastSyncedCart = useRef(snapshot());

  // 注意：每次触发时取 store 里的最新 userId，避免闭包过期
  const debouncedUpdate = useMemo(
    () =>
      debounce((prevCart) => {
        const latestUserId = store.getState()?.user?.curUser?._id;
        if (!latestUserId) return;
        // 把“变更前”的快照传给 thunk 做回滚依据
        dispatch(updateCartThunk({ userId: latestUserId, prevCart }))
          .unwrap()
          .then((updatedCart) => {
            // 后端返回成功后，刷新 lastSyncedCart
            lastSyncedCart.current = (updatedCart || []).map((i) => ({
              product: i.product._id || i.product.id,
              quantity: i.quantity,
            }));
          })
          .catch(() => {
            // 失败时，thunk 内部应做回滚；这里无需抛错
          });
      }, wait),
    [dispatch, wait]
  );

  const handleQuantity = (productId, qty) => {
    const prev = lastSyncedCart.current; 
    dispatch(updateQuantity({ productId, quantity: qty }));
    
    if (user.isLoggedIn) debouncedUpdate(prev);
  };

  const handleRemove = (productId) => {
    const prev = lastSyncedCart.current;
    dispatch(removeItem(productId));
    if (user.isLoggedIn) debouncedUpdate(prev);
  };

  // 新增：支持一次性添加多个（qty 默认 1）
  // 兼容两种 reducer 写法：
  // - addToCart(product)
  // - addToCart({ product, qty })
  const handleAdd = (product) => {
    const prev = lastSyncedCart.current;
    dispatch(addToCart(product));
    if (user.isLoggedIn) debouncedUpdate(prev);
  };

  return { handleQuantity, handleRemove, handleAdd };
};