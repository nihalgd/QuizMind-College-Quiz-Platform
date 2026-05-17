import { useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { useSearch } from "../hooks/useSearch";
import { formatDate } from "../utils/formatters";

const MyQuizzes = () => {
  const { currentUser, navigate, showToast } = useApp();
  const { quizzes, subjects, attempts, publishQuiz, deleteQuiz } = useQuiz();
  const [statusFilter, setStatusFilter] = useState("all");

  const rows = useMemo(
    () =>
      quizzes
        .filter((quiz) => Number(quiz.teacherId) === Number(currentUser?.id))
        .map((quiz) => {
          const subject = subjects.find((candidate) => Number(candidate.id) === Number(quiz.subjectId));
          return {
            ...quiz,
            subjectName: subject?.subjectName || "Deleted subject",
            subjectCode: subject?.subjectCode || "--",
            status: quiz.published ? "published" : "draft",
            attempts: attempts.filter((attempt) => Number(attempt.quizId) === Number(quiz.id)).length,
          };
        }),
    [attempts, currentUser?.id, quizzes, subjects],
  );

  const visibleRows = rows.filter((quiz) => statusFilter === "all" || quiz.status === statusFilter);
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(visibleRows, ["title", "subjectName", "subjectCode", "difficulty"]);

  const handleDelete = (quiz) => {
    const confirmed = window.confirm(`Delete ${quiz.title}? Student attempts for this quiz will also be removed.`);
    if (!confirmed) return;
    deleteQuiz(quiz.id);
    showToast("Quiz deleted", "success");
  };

  const handlePublish = (quiz) => {
    publishQuiz(quiz.id, !quiz.published);
    showToast(quiz.published ? "Quiz moved to draft" : "Quiz published", "success");
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="My Quizzes"
        description="Create, edit, publish, and retire quizzes for your assigned subjects."
        actionLabel="New Quiz"
        actionIcon="plus"
        onAction={() => navigate("teacher-create-quiz")}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search your quizzes..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-brand-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState icon="file-text" title="No quizzes found" description="Create a quiz for one of your assigned subjects." actionLabel="Create Quiz" onAction={() => navigate("teacher-create-quiz")} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Quiz</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">Subject</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 md:table-cell">Attempts</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((quiz) => (
                  <tr key={quiz.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{quiz.title}</p>
                      <p className="text-xs text-gray-400">{quiz.difficulty} - {quiz.questions.length} questions - {formatDate(quiz.createdAt)}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">
                      <p>{quiz.subjectName}</p>
                      <p className="text-xs text-gray-400">{quiz.subjectCode}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={quiz.status} /></td>
                    <td className="hidden px-4 py-3 text-gray-500 md:table-cell">{quiz.attempts}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => navigate(`/teacher/quizzes/${quiz.id}/edit`)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                          title="Edit quiz"
                        >
                          <Icon name="pencil" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePublish(quiz)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
                          title={quiz.published ? "Unpublish quiz" : "Publish quiz"}
                        >
                          <Icon name={quiz.published ? "x" : "send"} className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(quiz)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete quiz"
                        >
                          <Icon name="trash-2" className="h-4 w-4" />
                        </button>
                      </div>
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

export default MyQuizzes;
