import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalPrice: 0
};
const calTotal = (items) => {
    items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        storeCartItems: (state, action) => {
            state.items = action.payload || [];
            state.totalPrice = calTotal(state.items);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find( item => item.product._id === productId);
            if (item) item.quantity = quantity;
            state.totalPrice = calTotal(state.items);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.product._id === action.payload); //payload = productid
            state.totalPrice = calTotal(state.items);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
        }
     }
});

export const { 
    storeCartItems, 
    updateQuantity,
    removeItem,
    clearCart 
} = cartSlice.actions; 
export default cartSlice.reducer;