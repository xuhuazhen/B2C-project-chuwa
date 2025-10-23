import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';  

const RoleGuard = ({ children, requiredRole }) => {
  const user = useSelector(state => state.user.curUser);
   
  if (!user || (requiredRole && user.role !== requiredRole)) {
    return <Navigate to="/error" replace />;
  }
  
  return children;

};

export default RoleGuard;