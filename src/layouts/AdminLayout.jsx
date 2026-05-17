import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const adminItems = [
  { page: "admin-dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { page: "admin-teachers", label: "Teachers", icon: "users" },
  { page: "admin-subjects", label: "Subjects", icon: "book-open" },
  { page: "admin-assign-subjects", label: "Assignments", icon: "list-checks" },
  { page: "admin-students", label: "Students", icon: "graduation-cap" },
  { page: "admin-quizzes", label: "Quizzes", icon: "file-text" },
];

const routeMeta = [
  ["/admin/dashboard", "admin-dashboard", "Admin Dashboard"],
  ["/admin/teachers", "admin-teachers", "Manage Teachers"],
  ["/admin/subjects", "admin-subjects", "Manage Subjects"],
  ["/admin/assign-subjects", "admin-assign-subjects", "Assign Subjects"],
  ["/admin/students", "admin-students", "Manage Students"],
  ["/admin/quizzes", "admin-quizzes", "Manage Quizzes"],
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const match = routeMeta.find(([path]) => pathname.startsWith(path));

  return (
    <DashboardLayout
      items={adminItems}
      activePage={match?.[1] || "admin-dashboard"}
      title={match?.[2] || "Admin Dashboard"}
    />
  );
};

export default AdminLayout;
