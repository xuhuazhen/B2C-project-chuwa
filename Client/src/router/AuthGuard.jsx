import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; 
import api from '../api';
import { storeUser, logout } from '../store/user/userSlice';
import { resetCart, storeCartItems } from '../store/cart/cartSlice';
import { updateCartThunk } from '../store/cart/cartThunk';
import LoadingSpin from '../components/UI/LoadingSpin';

export const AuthGuard = ({ children, allowGuest = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const curUser = useSelector((state) => state.user.curUser);
  const curCart = useSelector((state) => state.cart.items);

  const [isChecking, setIsChecking] = useState(true);

  // clear store function
  const clearStore = useCallback(() => {
    console.log("authchecking fail, cleaning");
    dispatch(logout());
    dispatch(resetCart());
    if (!allowGuest && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login', { replace: true });
    }
  }, [dispatch, allowGuest, location.pathname, navigate]);

  // memoize the function so it won't be recreated on every render
  const checkLoginStatus = useCallback(async()=> {
    setIsChecking(true);

    try {
      const res = await api.get(
        'user/login',
        { withCredentials: true }
      );
      
      if (res.data.status === "success") {
        const { cart, ...userInfo } = res.data.data;
        // if user is logged in but store do not contain user info, reset store
        console.log("authchecking", curUser);
        if (!curUser) {
            console.log("authchecking: no user,reset store");
            dispatch(storeUser(userInfo));
          if ( curCart.length !== 0 && cart.length === 0 ) {
            dispatch(updateCartThunk(curCart));
          } else {
            dispatch(storeCartItems(cart)); //后期可修改成merge cart
          }
        }
        // if login falied or expired, navigate to home
      } else {
        clearStore();
      }
    } catch {
      clearStore();
    } finally {
      setIsChecking(false);
    }
  }, [
    dispatch, 
    curUser,    
    clearStore
  ]);

  // useEffect only triggers the login check logic when AuthGuard is used 
  // and the checkLoginStatus function is (re)created due to dependency changes
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  if (isChecking) return <LoadingSpin />;

  return children;
}

export default AuthGuard;