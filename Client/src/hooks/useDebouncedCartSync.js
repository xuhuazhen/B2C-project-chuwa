import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeItem, addToCart } from '../store/cart/cartSlice';
import { updateCartThunk } from '../store/cart/cartThunk';
import store from '../store/store';
import { debounce } from 'lodash';
import { useMemo, useRef } from 'react';
import { message } from 'antd';

export const useDebouncedCartSync = (wait = 500) => {
  const dispatch = useDispatch();
  // 仅用于触发重渲染，确保登录态变化后 hook 内逻辑最新
  const user = useSelector((s) => s.user);


    const debouncedUpdate = useRef(
        debounce(async () => {
            const latestUserId = store.getState()?.user?.curUser?._id;
            if (!latestUserId) return;

            try {
                const action = await dispatch(updateCartThunk({ userId: latestUserId })).unwrap();
                // 失败提示
                if (updateCartThunk.rejected.match(action)) {
                    message.error("Edit cart failed, please try again!")
                }
            } catch (err) {
                console.error(err);
            }
        }, wait)
    );

    const triggerSync = () => {
        if (user.isLoggedIn) {
        debouncedUpdate.current();
        }
    };

  const handleQuantity = (productId, qty) => {
    // const prev = lastSyncedCart.current; 
    dispatch(updateQuantity({ productId, quantity: qty }));
    triggerSync();
    
    // if (user.isLoggedIn) debouncedUpdate(prev);
  };

  const handleRemove = (productId) => {
    // const prev = lastSyncedCart.current;
    dispatch(removeItem(productId));
    triggerSync();
    // if (user.isLoggedIn) debouncedUpdate(prev);
  };
 
  const handleAdd = (product) => {
    // const prev = lastSyncedCart.current;
    dispatch(addToCart(product));
    triggerSync();
    // if (user.isLoggedIn) debouncedUpdate(prev);
  };

  return { handleQuantity, handleRemove, handleAdd };
};


//   const snapshot = () => {
//     const st = store.getState();
//     return (st.cart?.items || []).map((i) => ({
//       product: i.product._id || i.product.id,
//       quantity: i.quantity,
//     }));
//   };

  // 记录上一次已成功同步到后端的购物车快照
//   const lastSyncedCart = useRef(snapshot());

//   // 注意：每次触发时取 store 里的最新 userId，避免闭包过期
//   const debouncedUpdate = useMemo(
//     () =>
//       debounce((prevCart) => {
//         const latestUserId = store.getState()?.user?.curUser?._id;
//         if (!latestUserId) return;
//         // 把“变更前”的快照传给 thunk 做回滚依据
//         dispatch(updateCartThunk({ userId: latestUserId, prevCart }))
//           .unwrap()
//           .then((updatedCart) => {
//             // 后端返回成功后，刷新 lastSyncedCart
//             lastSyncedCart.current = (updatedCart || []).map((i) => ({
//               product: i.product._id || i.product.id,
//               quantity: i.quantity,
//             }));
//           })
//           .catch(() => {
//             // 失败时，thunk 内部应做回滚；这里无需抛错
//           });
//       }, wait),
//     [dispatch, wait]
//   );