import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { logout, fetchUserSession } from '../store/user/userSlice';
import { resetCart } from '../store/cart/cartSlice'; 
import LoadingSpin from '../components/UI/LoadingSpin';

export const AuthGuard = ({ children, allowGuest = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
      await dispatch(fetchUserSession()).unwrap();
    } catch {
      clearStore();
    } finally {
      setIsChecking(false);
    }
  }, [
    dispatch, 
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