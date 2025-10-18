import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

/** 仅登录用户可访问 */
export default function ProtectedRoute({ children }) {
  const curUser = useSelector((s) => s.user?.curUser);
  const isAuthed = !!curUser; // 你也可以换成 !!curUser?.token
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
