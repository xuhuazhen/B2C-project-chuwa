import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    curUser: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        storeUser: (state, action) => {
            state.curUser = action.payload;
            state.isLoggedIn = true;
        },
        logout: (state) => {
            state.curUser = null;
            state.isLoggedIn = false;
        }
    }
});

export const {storeUser, logout} = userSlice.actions;
export default userSlice.reducer;