import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { fetchUserSession } from '../store/user/userSlice';
import { useEffect, useState } from 'react';
import LoadingSpin from '../components/UI/LoadingSpin';
import { message } from 'antd';

const PublicRoute = ({ children }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isLoggedIn } = useSelector((state) => state.user);
    const [isChecking, setIsChecking] = useState(true);

   useEffect(() => { 
    console.log("public route active...")
    const check = async () => { 
      try {
        await dispatch(fetchUserSession()).unwrap(); 
      } catch {
        // ignore errors, just means user not logged in
      } finally { 
        setIsChecking(false);
      }
    };
    check();
  }, [dispatch]);

  if (isChecking) return <LoadingSpin />;
  
   if (isLoggedIn && (
        location.pathname === '/login' 
        || location.pathname === '/signup' 
        || location.pathname === '/forget-pwd'))
    {
        message.warning('You already logged in');
    return <Navigate to="/" replace />;
  }

  
  return children;
};

export default PublicRoute;