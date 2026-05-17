import { useMemo } from "react";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { useSearch } from "../hooks/useSearch";
import { formatDateTime, scoreTone } from "../utils/formatters";

const QuizHistory = () => {
  const { currentUser, navigate } = useApp();
  const { attempts, quizzes, subjects } = useQuiz();

  const rows = useMemo(
    () =>
      attempts
        .filter((attempt) => Number(attempt.studentId) === Number(currentUser?.id))
        .map((attempt) => {
          const quiz = quizzes.find((candidate) => Number(candidate.id) === Number(attempt.quizId));
          const subject = subjects.find((candidate) => Number(candidate.id) === Number(quiz?.subjectId));
          return {
            ...attempt,
            quizTitle: quiz?.title || "Deleted quiz",
            subjectName: subject?.subjectName || "Deleted subject",
            subjectCode: subject?.subjectCode || "--",
            resultStatus: attempt.percentage >= 50 ? "passed" : "needs_work",
          };
        }),
    [attempts, currentUser?.id, quizzes, subjects],
  );

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(rows, ["quizTitle", "subjectName", "subjectCode"]);
  const bestScore = rows.length ? Math.max(...rows.map((row) => row.percentage)) : 0;
  const averageScore = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.percentage, 0) / rows.length) : 0;

  return (
    <div className="fade-in space-y-6">
      <PageHeader
        title="Quiz History"
        description="Track submitted quizzes, score trends, and detailed results."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon="history" label="Attempts" value={rows.length} color="bg-brand-500" />
        <StatCard icon="target" label="Average Score" value={`${averageScore}%`} color="bg-emerald-500" />
        <StatCard icon="trophy" label="Best Score" value={`${bestScore}%`} color="bg-purple-500" />
      </div>

      <div className="relative">
        <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search quiz history..."
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-brand-500"
        />
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState icon="history" title="No quiz history" description="Attempts will be recorded after you submit a quiz." actionLabel="View Subjects" onAction={() => navigate("student-subjects")} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Quiz</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">Subject</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Score</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 md:table-cell">Status</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 lg:table-cell">Submitted</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{row.quizTitle}</td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                      <p>{row.subjectName}</p>
                      <p className="text-xs text-gray-400">{row.subjectCode}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${scoreTone(row.percentage)}`}>{row.score}/{row.totalQuestions}</span>
                      <span className="ml-1 text-xs text-gray-400">({row.percentage}%)</span>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell"><StatusBadge status={row.resultStatus} /></td>
                    <td className="hidden px-4 py-3 text-gray-400 lg:table-cell">{formatDateTime(row.submittedAt)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/student/results/${row.id}`)}
                        className="text-sm font-medium text-brand-600 hover:text-brand-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
