import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useNavigate as useRouterNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const PAGE_ROUTES = {
  login: "/login",
  register: "/register",
  home: "/",
  "student-dashboard": "/student/dashboard",
  "student-subjects": "/student/subjects",
  "student-history": "/student/history",
  "student-results": "/student/results",
  "student-units": "/student/subjects",
  "student-quiz": "/student/quiz",
  "student-result": "/student/results",
  "teacher-dashboard": "/teacher/dashboard",
  "teacher-subjects": "/teacher/subjects",
  "teacher-my-quizzes": "/teacher/quizzes",
  "teacher-create-quiz": "/teacher/create-quiz",
  "teacher-results": "/teacher/results",
  "teacher-add-quiz": "/teacher/create-quiz",
  "teacher-quiz-editor": "/teacher/quizzes/new/edit",
  "admin-dashboard": "/admin/dashboard",
  "admin-teachers": "/admin/teachers",
  "admin-subjects": "/admin/subjects",
  "admin-assign-subjects": "/admin/assign-subjects",
  "admin-students": "/admin/students",
  "admin-quizzes": "/admin/quizzes",
  "admin-assign": "/admin/assign-subjects",
};

export const DASHBOARD_ROUTES = {
  admin: PAGE_ROUTES["admin-dashboard"],
  teacher: PAGE_ROUTES["teacher-dashboard"],
  student: PAGE_ROUTES["student-dashboard"],
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const routerNavigate = useRouterNavigate();
  const { currentUser, login: authLogin, loginWithBackend, logout: authLogout, setCurrentUser } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useCallback(
    (pageOrPath, data = {}) => {
      if (Object.prototype.hasOwnProperty.call(data, "subject")) setSelectedSubject(data.subject);
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
      const result = authLogin(email, password);
      if (result.success) {
        routerNavigate(DASHBOARD_ROUTES[result.user.role] || PAGE_ROUTES.login, { replace: true });
      }
      return result;
    },
    [authLogin, routerNavigate],
  );

  const loginBackend = useCallback(
    async (email, password) => {
      const result = await loginWithBackend(email, password);
      if (result.success) {
        const role = result.user.role || "student";
        routerNavigate(DASHBOARD_ROUTES[role] || PAGE_ROUTES.login, { replace: true });
      }
      return result;
    },
    [loginWithBackend, routerNavigate],
  );

  const logout = useCallback(() => {
    authLogout();
    setSelectedSubject(null);
    setSelectedQuiz(null);
    setQuizAnswers({});
    setQuizResult(null);
    setSidebarOpen(false);
    routerNavigate(PAGE_ROUTES.login, { replace: true });
  }, [authLogout, routerNavigate]);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser,
      selectedSubject,
      setSelectedSubject,
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
      loginBackend,
      logout,
    }),
    [
      currentUser,
      login,
      loginBackend,
      logout,
      navigate,
      quizAnswers,
      quizResult,
      selectedQuiz,
      selectedSubject,
      setCurrentUser,
      showToast,
      sidebarOpen,
      toast,
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
