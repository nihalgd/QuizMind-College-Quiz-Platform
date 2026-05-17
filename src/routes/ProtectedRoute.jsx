import { Navigate, Outlet, useLocation } from "react-router-dom";
import { DASHBOARD_ROUTES, PAGE_ROUTES } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={PAGE_ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={DASHBOARD_ROUTES[currentUser.role] || PAGE_ROUTES.login} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
