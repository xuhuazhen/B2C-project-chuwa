import { createSlice } from "@reduxjs/toolkit";
import { updateCartThunk, validatePromoCodeThunk } from "./cartThunk";

const initialState = {
  items: [],
  promoCode: null,
  discountRate: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    storeCartItems: (state, action) => {
      state.items = action.payload || [];
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.product._id === productId);
      if (item) item.quantity = quantity;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product._id !== action.payload
      ); //payload = productid
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.product._id === product._id
      );
      existingItem
        ? (existingItem.quantity += 1)
        : state.items.push({ product, quantity: 1 });
    },
    resetCart: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(updateCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(validatePromoCodeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(validatePromoCodeThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.promoCode = action.payload.code;
        state.discountRate = action.payload.discountRate;
      })
      .addCase(validatePromoCodeThunk.rejected, (state, action) => {
        state.loading = false;
        state.promoCode = action.payload.code;
        state.discountRate = action.payload.discountRate;
      });
  },
});

export const {
  storeCartItems,
  updateQuantity,
  removeItem,
  addToCart,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;

// // Client/src/store/cart/cartSlice.js
// import { createSlice } from '@reduxjs/toolkit';
// import { updateCartThunk, validatePromoCodeThunk } from './cartThunk';

// const initialState = {
//   items: [],               // 形如 [{ product: {...}, quantity }]
//   promoCode: null,
//   discountRate: 0,
//   loading: false,
//   error: null,
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     // 覆盖 items（初始化/回滚/服务端同步）
//     storeCartItems: (state, action) => {
//       state.items = action.payload || [];
//     },

//     // ✅ 新增：添加到购物车（若已存在则累加数量）
//     addToCart: (state, action) => {
//       const { product, quantity = 1 } = action.payload || {};
//       if (!product || !product._id) return;
//       const existing = state.items.find((it) => it.product._id === product._id);
//       if (existing) {
//         existing.quantity += quantity;
//       } else {
//         state.items.push({ product, quantity });
//       }
//     },
//     extraReducers: (builder) => {
//       builder
//         // .addCase(updateCartThunk.pending, (state) => {
//         //     state.loading = true;
//         //     state.error = null;
//         // })
//         .addCase(updateCartThunk.fulfilled, (state, action) => { 
//             state.items = action.payload || []; 
//         })
//         // .addCase(updateCartThunk.rejected, (state, action) => {
//         //     state.loading = false;
//         //     state.error = action.payload;
//         // })
//         // .addCase(validatePromoCodeThunk.pending, (state) => {
//         //     state.loading = true; 
//         // })
//         .addCase(validatePromoCodeThunk.fulfilled, (state, action) => {  
//             state.promoCode = action.payload.code;
//             state.discountRate = action.payload.discountRate; 
//         })
//         .addCase(validatePromoCodeThunk.rejected, (state, action) => { 
//             state.promoCode = action.payload.code;
//             state.discountRate = action.payload.discountRate; 
//         });

//     // 调整某个商品数量（直接设定）
//     updateQuantity: (state, action) => {
//       const { productId, quantity } = action.payload;
//       const item = state.items.find((it) => it.product._id === productId);
//       if (item) item.quantity = quantity;
//     },

//     // 移除某个商品
//     removeItem: (state, action) => {
//       state.items = state.items.filter((it) => it.product._id !== action.payload);
//     },

//     // 清空
//     clearCart: (state) => {
//       state.items = [];
//       state.promoCode = null;
//       state.discountRate = 0;
//       state.loading = false;
//       state.error = null;
//     },

//     // 供 header.jsx 使用：重置为初始状态
//     resetCart: () => ({ ...initialState }),
//   },

//   extraReducers: (builder) => {
//     builder
//       // 与后端同步购物车
//       .addCase(updateCartThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateCartThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.items = action.payload || [];
//       })
//       .addCase(updateCartThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to update cart';
//       })

//       // 校验优惠码
//       .addCase(validatePromoCodeThunk.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(validatePromoCodeThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.promoCode = action.payload.code;
//         state.discountRate = action.payload.discountRate;
//       })
//       .addCase(validatePromoCodeThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.promoCode = action.payload.code;
//         state.discountRate = action.payload.discountRate;
//       });
//   },
// });

// export const {
//   storeCartItems,
//   addToCart,        // ← 新增导出
//   updateQuantity,
//   removeItem,
//   clearCart,
//   resetCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;