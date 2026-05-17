import Icon from "../components/Icon";
import StatCard from "../components/StatCard";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { formatDateTime, scoreTone } from "../utils/formatters";

const StudentDashboard = () => {
  const { currentUser, navigate } = useApp();
  const { subjects, teachers, quizzes, attempts } = useQuiz();
  const enrolledSubjects = subjects.filter((subject) => String(subject.semester) === String(currentUser?.semester));
  const publishedQuizzes = quizzes.filter((quiz) => quiz.published && enrolledSubjects.some((subject) => Number(subject.id) === Number(quiz.subjectId)));
  const studentAttempts = attempts.filter((attempt) => Number(attempt.studentId) === Number(currentUser?.id));
  const averageScore = studentAttempts.length
    ? Math.round(studentAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / studentAttempts.length)
    : 0;

  const teacherName = (teacherId) => teachers.find((teacher) => Number(teacher.id) === Number(teacherId))?.name || "Faculty pending";

  return (
    <div className="fade-in space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="book-open" label="Subjects" value={enrolledSubjects.length} color="bg-blue-500" />
        <StatCard icon="file-text" label="Available Quizzes" value={publishedQuizzes.length} color="bg-purple-500" />
        <StatCard icon="target" label="Average Score" value={`${averageScore}%`} color="bg-emerald-500" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Icon name="book-open" className="h-5 w-5 text-brand-600" />
            Subjects
          </h3>
          <button type="button" onClick={() => navigate("student-subjects")} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {enrolledSubjects.slice(0, 6).map((subject) => {
            const count = publishedQuizzes.filter((quiz) => Number(quiz.subjectId) === Number(subject.id)).length;
            return (
              <div key={subject.id} className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-600">
                    {subject.subjectCode.replace(/\D/g, "").slice(-3)}
                  </div>
                  <span className="rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-400">{subject.subjectCode}</span>
                </div>
                <h4 className="mb-1 text-sm font-semibold text-gray-900">{subject.subjectName}</h4>
                <p className="mb-4 flex items-center gap-1 text-xs text-gray-500">
                  <Icon name="user" className="h-3 w-3" />
                  {teacherName(subject.assignedTeacherId)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{count} quizzes</span>
                  <button
                    type="button"
                    onClick={() => navigate(`/student/subjects/${subject.id}`)}
                    className="flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                  >
                    Open
                    <Icon name="chevron-right" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h3 className="flex items-center gap-2 font-semibold text-gray-900">
            <Icon name="history" className="h-5 w-5 text-brand-600" />
            Recent Quiz Attempts
          </h3>
          <button type="button" onClick={() => navigate("student-history")} className="text-sm font-medium text-brand-600 hover:text-brand-700">
            History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Quiz</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Score</th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-500 md:table-cell">Submitted</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentAttempts.slice(0, 5).map((attempt) => {
                const quiz = quizzes.find((candidate) => Number(candidate.id) === Number(attempt.quizId));
                return (
                  <tr key={attempt.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{quiz?.title || "Deleted quiz"}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${scoreTone(attempt.percentage)}`}>{attempt.score}/{attempt.totalQuestions}</span>
                      <span className="ml-1 text-xs text-gray-400">({attempt.percentage}%)</span>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-400 md:table-cell">{formatDateTime(attempt.submittedAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/student/results/${attempt.id}`)}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {studentAttempts.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-400">No quiz attempts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
