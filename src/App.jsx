import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Toast from "./components/Toast";
import AdminLayout from "./components/layouts/AdminLayout";
import StudentLayout from "./components/layouts/StudentLayout";
import TeacherLayout from "./components/layouts/TeacherLayout";
import { PAGE_ROUTES, useApp } from "./context/AppContext";
import AddQuizPage from "./pages/AddQuizPage";
import AdminDashboard from "./pages/AdminDashboard";
import AssignSubjectsPage from "./pages/AssignSubjectsPage";
import LoginPage from "./pages/LoginPage";
import ManageTeachersPage from "./pages/ManageTeachersPage";
import MyQuizzesPage from "./pages/MyQuizzesPage";
import QuizAttemptPage from "./pages/QuizAttemptPage";
import QuizEditorPage from "./pages/QuizEditorPage";
import ResultPage from "./pages/ResultPage";
import StudentDashboard from "./pages/StudentDashboard";
import StudentUnitsPage from "./pages/StudentUnitsPage";
import TeacherDashboard from "./pages/TeacherDashboard";

const dashboardPathForRole = (role) => {
  if (role === "student") return PAGE_ROUTES["student-dashboard"];
  if (role === "teacher") return PAGE_ROUTES["teacher-dashboard"];
  if (role === "admin") return PAGE_ROUTES["admin-dashboard"];
  return PAGE_ROUTES.login;
};

const HomeRoute = () => {
  const { currentUser } = useApp();

  if (currentUser) {
    return <Navigate to={dashboardPathForRole(currentUser.role)} replace />;
  }

  return <LoginPage />;
};

const RequireAuth = ({ allowedRoles }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to={PAGE_ROUTES.login} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={dashboardPathForRole(currentUser.role)} replace />;
  }

  return <Outlet />;
};

const App = () => (
  <>
    <Routes>
      <Route path="/" element={<HomeRoute />} />

      <Route element={<RequireAuth allowedRoles={["student"]} />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="units" element={<StudentUnitsPage />} />
          <Route path="quiz" element={<QuizAttemptPage />} />
          <Route path="result" element={<ResultPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth allowedRoles={["teacher"]} />}>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="add-quiz" element={<AddQuizPage />} />
          <Route path="quizzes" element={<MyQuizzesPage />} />
          <Route path="editor" element={<QuizEditorPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<ManageTeachersPage />} />
          <Route path="assign" element={<AssignSubjectsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={PAGE_ROUTES.login} replace />} />
    </Routes>
    <Toast />
  </>
);

export default App;
