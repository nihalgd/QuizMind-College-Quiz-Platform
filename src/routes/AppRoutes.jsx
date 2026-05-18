import { Navigate, Route, Routes } from "react-router-dom";
import { DASHBOARD_ROUTES, PAGE_ROUTES } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import AddTeacherForm from "../pages/AddTeacherForm";
import AdminDashboard from "../pages/AdminDashboard";
import AssignSubjects from "../pages/AssignSubjects";
import LoginPage from "../pages/LoginPage";
import ManageQuizzes from "../pages/ManageQuizzes";
import ManageStudents from "../pages/ManageStudents";
import ManageSubjects from "../pages/ManageSubjects";
import ManageTeachers from "../pages/ManageTeachers";
import MyQuizzes from "../pages/MyQuizzes";
import MySubjects from "../pages/MySubjects";
import QuizEditor from "../pages/QuizEditor";
import QuizHistory from "../pages/QuizHistory";
import QuizPage from "../pages/QuizPage";
import RegistrationPage from "../pages/RegistrationPage";
import ResultPage from "../pages/ResultPage";
import StudentDashboard from "../pages/StudentDashboard";
import StudentResults from "../pages/StudentResults";
import SubjectPage from "../pages/SubjectPage";
import TeacherDashboard from "../pages/TeacherDashboard";
import ProtectedRoute from "./ProtectedRoute";

const LoginRoute = () => {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to={DASHBOARD_ROUTES[currentUser.role] || PAGE_ROUTES.login} replace />;
  }
  return <LoginPage />;
};

const RootRoute = () => {
  const { currentUser } = useAuth();
  return <Navigate to={currentUser ? DASHBOARD_ROUTES[currentUser.role] : PAGE_ROUTES.login} replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRoute />} />
    <Route path="/login" element={<LoginRoute />} />
    <Route path="/register" element={<RegistrationPage />} />

    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="teachers" element={<ManageTeachers />} />
        <Route path="teachers/new" element={<AddTeacherForm />} />
        <Route path="subjects" element={<ManageSubjects />} />
        <Route path="assign-subjects" element={<AssignSubjects />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="quizzes" element={<ManageQuizzes />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="subjects" element={<MySubjects />} />
        <Route path="quizzes" element={<MyQuizzes />} />
        <Route path="create-quiz" element={<QuizEditor />} />
        <Route path="quizzes/:quizId/edit" element={<QuizEditor />} />
        <Route path="results" element={<StudentResults />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="subjects" element={<SubjectPage />} />
        <Route path="subjects/:subjectId" element={<SubjectPage />} />
        <Route path="quiz/:id" element={<QuizPage />} />
        <Route path="results" element={<ResultPage />} />
        <Route path="results/:attemptId" element={<ResultPage />} />
        <Route path="history" element={<QuizHistory />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to={PAGE_ROUTES.login} replace />} />
  </Routes>
);

export default AppRoutes;
