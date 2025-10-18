import { createSlice } from '@reduxjs/toolkit';
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
} = cartSlice.actions; 
export default cartSlice.reducer;