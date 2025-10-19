import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeItem, addToCart } from '../store/cart/cartSlice';
import { updateCartThunk } from '../store/cart/cartThunk';
import store from "../store/store";
import { debounce } from 'lodash';
import { useRef } from 'react';


export const useDebouncedCartSync  = (wait = 300) => {
    const dispatch = useDispatch(); 
    const user = useSelector(state => state.user);
    const userId = user.curUser?._id;
 
    //remember the shpping cart sync with backend
    const lastSyncedCart = useRef(
        store.getState().cart.items.map(i => ({
            product: i.product._id,
            quantity: i.quantity
        }))
    );

    const debouncedUpdate = useRef(
        debounce((prevCart) => { 
            console.log("debounce to database", userId); 
            dispatch(updateCartThunk({ userId, prevCart }))
                .unwrap()
                .then((updatedCart) => {
                    lastSyncedCart.current = updatedCart.map(i => ({
                        product: i.product._id,
                        quantity: i.quantity
                    }));
                });
        }, wait),
    ).current;

    const handleQuantity = (productId, qty) => {
        if (qty < 1) return;
        dispatch(updateQuantity({ productId, quantity: qty }));
        //同步状态到后端, lastSyncedCart记录未更新后端前的数据 
        if (user.isLoggedIn) debouncedUpdate(lastSyncedCart.current);
    };

    const handleRemove = (productId) => { 
        dispatch(removeItem(productId));
        //同步状态到后端, lastSyncedCart记录未更新后端前的数据
        if (user.isLoggedIn) debouncedUpdate(lastSyncedCart.current);
    }
    
    const handleAdd = (product) => { 
        dispatch(addToCart(product));
        //同步状态到后端, lastSyncedCart记录未更新后端前的数据
        if (user.isLoggedIn) debouncedUpdate(lastSyncedCart.current);
    };

    return { handleQuantity, handleRemove, handleAdd};
};