import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { useSearch } from "../hooks/useSearch";
import { formatDateTime, scoreTone } from "../utils/formatters";

const StudentResults = () => {
  const { currentUser } = useApp();
  const { quizzes, subjects, attempts, students } = useQuiz();
  const [quizFilter, setQuizFilter] = useState("all");

  const teacherQuizzes = quizzes.filter((quiz) => Number(quiz.teacherId) === Number(currentUser?.id));
  const rows = useMemo(
    () =>
      attempts
        .filter((attempt) => teacherQuizzes.some((quiz) => Number(quiz.id) === Number(attempt.quizId)))
        .map((attempt) => {
          const quiz = quizzes.find((candidate) => Number(candidate.id) === Number(attempt.quizId));
          const subject = subjects.find((candidate) => Number(candidate.id) === Number(quiz?.subjectId));
          const student = students.find((candidate) => Number(candidate.id) === Number(attempt.studentId));
          return {
            ...attempt,
            quizTitle: quiz?.title || "Deleted quiz",
            subjectName: subject?.subjectName || "Deleted subject",
            studentName: student?.name || "Deleted student",
            rollNo: student?.rollNo || "--",
            resultStatus: attempt.percentage >= 50 ? "passed" : "needs_work",
          };
        }),
    [attempts, quizzes, students, subjects, teacherQuizzes],
  );

  const visibleRows = rows.filter((row) => quizFilter === "all" || Number(row.quizId) === Number(quizFilter));
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(visibleRows, ["studentName", "rollNo", "quizTitle", "subjectName"]);

  return (
    <div className="fade-in">
      <PageHeader
        title="Student Results"
        description="Review attempts submitted for quizzes created by you."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by student, roll number, quiz, or subject..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-brand-500"
          />
        </div>
        <select
          value={quizFilter}
          onChange={(event) => setQuizFilter(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
        >
          <option value="all">All Quizzes</option>
          {teacherQuizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState icon="trophy" title="No results yet" description="Student attempts will appear here after published quizzes are submitted." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Student</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">Quiz</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Score</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 md:table-cell">Status</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 lg:table-cell">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((row) => (
                  <tr key={row.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{row.studentName}</p>
                      <p className="text-xs text-gray-400">{row.rollNo}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                      <p>{row.quizTitle}</p>
                      <p className="text-xs text-gray-400">{row.subjectName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${scoreTone(row.percentage)}`}>{row.score}/{row.totalQuestions}</span>
                      <span className="ml-1 text-xs text-gray-400">({row.percentage}%)</span>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell"><StatusBadge status={row.resultStatus} /></td>
                    <td className="hidden px-4 py-3 text-gray-400 lg:table-cell">{formatDateTime(row.submittedAt)}</td>
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

export default StudentResults;
