import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate as useRouterNavigate } from "react-router-dom";
import { DUMMY_USERS } from "../data/dummyData";

export const PAGE_ROUTES = {
  login: "/",
  "student-dashboard": "/student/dashboard",
  "student-units": "/student/units",
  "student-quiz": "/student/quiz",
  "student-result": "/student/result",
  "teacher-dashboard": "/teacher/dashboard",
  "teacher-add-quiz": "/teacher/add-quiz",
  "teacher-my-quizzes": "/teacher/quizzes",
  "teacher-quiz-editor": "/teacher/editor",
  "admin-dashboard": "/admin/dashboard",
  "admin-teachers": "/admin/teachers",
  "admin-assign": "/admin/assign",
};

const DASHBOARD_ROUTES = {
  student: PAGE_ROUTES["student-dashboard"],
  teacher: PAGE_ROUTES["teacher-dashboard"],
  admin: PAGE_ROUTES["admin-dashboard"],
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const routerNavigate = useRouterNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useCallback(
    (pageOrPath, data = {}) => {
      if (Object.prototype.hasOwnProperty.call(data, "subject")) setSelectedSubject(data.subject);
      if (Object.prototype.hasOwnProperty.call(data, "unit")) setSelectedUnit(data.unit);
      if (Object.prototype.hasOwnProperty.call(data, "quiz")) setSelectedQuiz(data.quiz);
      setSidebarOpen(false);
      routerNavigate(PAGE_ROUTES[pageOrPath] || pageOrPath);
    },
    [routerNavigate],
  );

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback(
    (email, password) => {
      const user = DUMMY_USERS.find((candidate) => candidate.email === email && candidate.password === password);

      if (!user) {
        return { success: false, message: "Invalid credentials" };
      }

      setCurrentUser(user);
      navigate(DASHBOARD_ROUTES[user.role] || "/");
      return { success: true, user };
    },
    [navigate],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    setSelectedSubject(null);
    setSelectedUnit(null);
    setSelectedQuiz(null);
    setQuizAnswers({});
    setQuizResult(null);
    setSidebarOpen(false);
    routerNavigate(PAGE_ROUTES.login);
  }, [routerNavigate]);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      selectedSubject,
      setSelectedSubject,
      selectedUnit,
      setSelectedUnit,
      selectedQuiz,
      setSelectedQuiz,
      quizAnswers,
      setQuizAnswers,
      quizResult,
      setQuizResult,
      sidebarOpen,
      setSidebarOpen,
      toast,
      showToast,
      navigate,
      login,
      logout,
    }),
    [
      currentUser,
      selectedSubject,
      selectedUnit,
      selectedQuiz,
      quizAnswers,
      quizResult,
      sidebarOpen,
      toast,
      showToast,
      navigate,
      login,
      logout,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
};
