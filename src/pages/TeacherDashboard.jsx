import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { formatDate } from "../utils/formatters";

const TeacherDashboard = () => {
  const { currentUser, navigate } = useApp();
  const { subjects, quizzes, attempts } = useQuiz();
  const assignedSubjects = subjects.filter((subject) => Number(subject.assignedTeacherId) === Number(currentUser?.id));
  const teacherQuizzes = quizzes.filter((quiz) => Number(quiz.teacherId) === Number(currentUser?.id));
  const teacherQuizIds = teacherQuizzes.map((quiz) => quiz.id);
  const teacherAttempts = attempts.filter((attempt) => teacherQuizIds.includes(attempt.quizId));

  return (
    <div className="fade-in space-y-8">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-bold text-emerald-700">
              {currentUser?.avatar}
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-gray-900">Welcome back, {currentUser?.name}</h3>
              <p className="text-sm text-gray-500">{currentUser?.department} Department</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("teacher-create-quiz")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            <Icon name="plus" className="h-4 w-4" />
            Create Quiz
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="book-marked" label="Assigned Subjects" value={assignedSubjects.length} color="bg-emerald-500" />
        <StatCard icon="file-text" label="My Quizzes" value={teacherQuizzes.length} color="bg-brand-500" />
        <StatCard icon="trophy" label="Student Attempts" value={teacherAttempts.length} color="bg-purple-500" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Icon name="book-marked" className="h-5 w-5 text-emerald-600" />
            Assigned Subjects
          </h3>
          <button type="button" onClick={() => navigate("teacher-subjects")} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assignedSubjects.slice(0, 6).map((subject) => (
            <div key={subject.id} className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-600">
                  {subject.subjectCode.replace(/\D/g, "").slice(-3)}
                </div>
                <span className="rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-400">Sem {subject.semester}</span>
              </div>
              <h4 className="mb-1 text-sm font-semibold text-gray-900">{subject.subjectName}</h4>
              <p className="mb-4 text-xs text-gray-400">{subject.subjectCode}</p>
              <button
                type="button"
                onClick={() => navigate(`/teacher/create-quiz?subjectId=${subject.id}`)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <Icon name="plus" className="h-4 w-4" />
                Add Quiz
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <Icon name="file-text" className="h-5 w-5 text-brand-600" />
            Recent Quizzes
          </h3>
          <button type="button" onClick={() => navigate("teacher-my-quizzes")} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Manage
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Quiz</th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">Subject</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-500 md:table-cell">Created</th>
              </tr>
            </thead>
            <tbody>
              {teacherQuizzes.slice(0, 5).map((quiz) => {
                const subject = subjects.find((candidate) => Number(candidate.id) === Number(quiz.subjectId));
                return (
                  <tr key={quiz.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{quiz.title}</td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{subject?.subjectName || "Deleted subject"}</td>
                    <td className="px-4 py-3"><StatusBadge status={quiz.published ? "published" : "draft"} /></td>
                    <td className="hidden px-4 py-3 text-gray-400 md:table-cell">{formatDate(quiz.createdAt)}</td>
                  </tr>
                );
              })}
              {teacherQuizzes.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-400">No quizzes yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
