import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/** 用法：<RoleGuard allow={['admin']}>{children}</RoleGuard> */
export default function RoleGuard({ allow = [], children }) {
  // 确保这里与 userSlice 对齐：curUser 里有 role
  const role = useSelector((s) => s.user?.curUser?.role) || "guest";
  const location = useLocation();

  if (!allow.includes(role)) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}
