import { createSlice } from "@reduxjs/toolkit"; 
import { updateCartThunk, validatePromoCodeThunk } from './cartThunk';

const initialState = {
    items: [], 
    promoCode: null,
    discountRate: 0
}; 

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        storeCartItems: (state, action) => {
            state.items = action.payload || []; 
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find( item => item.product._id === productId);
            if (item) item.quantity = quantity; 
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.product._id !== action.payload); //payload = productid
        },
        addToCart: (state, action) => {
          const product = action.payload;
          const existingItem = state.items.find((item) => item.product._id === product._id);
          existingItem
            ? (existingItem.quantity += 1)
            : state.items.push({product, quantity: 1 });
        }
    // incrementItemQuantity: (state, action) => {
    //   const productId = action.payload;
    //   const existingItem = state.items.find((item) => item._id === productId);
    //   if (existingItem) {
    //     existingItem.quantity += 1;
    //     state.totalQuantity += 1;
    //     state.totalPrice += existingItem.price;
    //   }
    // },
    // decrementItemQuantity: (state, action) => {
    //   const productId = action.payload;
    //   const existingItem = state.items.find((item) => item._id === productId);
    //   if (existingItem && existingItem.quantity > 0) {
    //     existingItem.quantity -= 1;
    //     state.totalQuantity -= 1;
    //     state.totalPrice -= existingItem.price;

    //     if (existingItem.quantity === 0) {
    //       state.items = state.items.filter((item) => item._id !== productId);
    //     }
    //   }
    // }, 
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
  // incrementItemQuantity,
  // decrementItemQuantity,
} = cartSlice.actions; 
export default cartSlice.reducer;
