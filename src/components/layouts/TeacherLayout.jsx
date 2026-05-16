import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const teacherItems = [
  { page: "teacher-dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { page: "teacher-my-quizzes", label: "My Quizzes", icon: "file-text" },
  { page: "teacher-add-quiz", label: "Create Quiz", icon: "plus-circle" },
];

const titleByPath = {
  "/teacher/dashboard": "Teacher Dashboard",
  "/teacher/add-quiz": "Create Quiz",
  "/teacher/quizzes": "My Quizzes",
  "/teacher/editor": "Quiz Editor",
};

const activePageByPath = {
  "/teacher/dashboard": "teacher-dashboard",
  "/teacher/add-quiz": "teacher-add-quiz",
  "/teacher/quizzes": "teacher-my-quizzes",
  "/teacher/editor": "teacher-my-quizzes",
};

const TeacherLayout = () => {
  const { pathname } = useLocation();

  return (
    <DashboardLayout
      items={teacherItems}
      activePage={activePageByPath[pathname] || "teacher-dashboard"}
      title={titleByPath[pathname] || "Teacher Dashboard"}
    />
  );
};

export default TeacherLayout;
