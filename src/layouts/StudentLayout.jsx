import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const studentItems = [
  { page: "student-dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { page: "student-subjects", label: "Subjects", icon: "book-open" },
  { page: "student-history", label: "Quiz History", icon: "history" },
];

const routeMeta = [
  ["/student/dashboard", "student-dashboard", "Student Dashboard"],
  ["/student/subjects", "student-subjects", "Subjects"],
  ["/student/quiz", "student-subjects", "Attempt Quiz"],
  ["/student/results", "student-history", "Quiz Result"],
  ["/student/history", "student-history", "Quiz History"],
];

const StudentLayout = () => {
  const { pathname } = useLocation();
  const match = routeMeta.find(([path]) => pathname.startsWith(path));
  const hideSidebar = pathname.startsWith("/student/quiz/");

  return (
    <DashboardLayout
      items={studentItems}
      activePage={match?.[1] || "student-dashboard"}
      title={match?.[2] || "Student Dashboard"}
      showSidebar={!hideSidebar}
    />
  );
};

export default StudentLayout;
