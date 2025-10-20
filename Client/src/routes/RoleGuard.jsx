import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleGuard({ allow = [] }) {
  const user = useSelector((s) => s.user?.user || s.user?.currentUser || s.auth?.user) || null;
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}
