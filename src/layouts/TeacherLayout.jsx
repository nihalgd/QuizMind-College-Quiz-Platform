import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const teacherItems = [
  { page: "teacher-dashboard", label: "Dashboard", icon: "layout-dashboard" },
  { page: "teacher-subjects", label: "My Subjects", icon: "book-marked" },
  { page: "teacher-my-quizzes", label: "My Quizzes", icon: "file-text" },
  { page: "teacher-create-quiz", label: "Create Quiz", icon: "plus-circle" },
  { page: "teacher-results", label: "Results", icon: "trophy" },
];

const routeMeta = [
  ["/teacher/dashboard", "teacher-dashboard", "Teacher Dashboard"],
  ["/teacher/subjects", "teacher-subjects", "My Subjects"],
  ["/teacher/quizzes", "teacher-my-quizzes", "My Quizzes"],
  ["/teacher/create-quiz", "teacher-create-quiz", "Create Quiz"],
  ["/teacher/results", "teacher-results", "Student Results"],
];

const TeacherLayout = () => {
  const { pathname } = useLocation();
  const match = routeMeta.find(([path]) => pathname.startsWith(path));

  return (
    <DashboardLayout
      items={teacherItems}
      activePage={match?.[1] || "teacher-dashboard"}
      title={match?.[2] || "Teacher Dashboard"}
    />
  );
};

export default TeacherLayout;
