import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const adminItems = [
  { page: "admin-dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { page: "admin-teachers", label: "Manage Teachers", icon: "users" },
  { page: "admin-assign", label: "Assign Subjects", icon: "list-checks" },
];

const titleByPath = {
  "/admin/dashboard": "Admin Dashboard",
  "/admin/teachers": "Manage Teachers",
  "/admin/assign": "Assign Subjects",
};

const activePageByPath = {
  "/admin/dashboard": "admin-dashboard",
  "/admin/teachers": "admin-teachers",
  "/admin/assign": "admin-assign",
};

const AdminLayout = () => {
  const { pathname } = useLocation();

  return (
    <DashboardLayout
      items={adminItems}
      activePage={activePageByPath[pathname] || "admin-dashboard"}
      title={titleByPath[pathname] || "Admin Dashboard"}
    />
  );
};

export default AdminLayout;
