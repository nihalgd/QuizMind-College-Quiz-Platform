import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const studentItems = [
  { page: "student-dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { page: "student-units", label: "My Subjects", icon: "book-open" },
];

const titleByPath = {
  "/student/dashboard": "Student Dashboard",
  "/student/units": "Subject Units",
  "/student/quiz": "Quiz Attempt",
  "/student/result": "Quiz Result",
};

const activePageByPath = {
  "/student/dashboard": "student-dashboard",
  "/student/units": "student-units",
  "/student/quiz": "student-units",
  "/student/result": "student-dashboard",
};

const StudentLayout = () => {
  const { pathname } = useLocation();
  const hideSidebar = pathname === "/student/quiz";

  return (
    <DashboardLayout
      items={studentItems}
      activePage={activePageByPath[pathname] || "student-dashboard"}
      title={titleByPath[pathname] || "Student Dashboard"}
      showSidebar={!hideSidebar}
    />
  );
};

export default StudentLayout;
