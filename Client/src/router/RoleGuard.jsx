import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 

const RoleGuard = ({ children, requiredRole }) => {
  const user = useSelector(state => state.user.curUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (requiredRole && user?.role !== requiredRole) {
      navigate('/error', { replace: true });
    }
  }, [requiredRole, user, navigate]);

  return children;
};

export default RoleGuard;