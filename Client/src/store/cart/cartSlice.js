import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        storeCartItems: (state, action) => {
            state.items = action.payload || [];
        },
        clearCart: (state) => {
            state.items = [];
        }
     }
});

export const { storeCartItems, clearCart } = cartSlice.actions; 
export default cartSlice.reducer;