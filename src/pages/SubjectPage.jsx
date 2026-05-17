import { useMemo } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { formatDateTime } from "../utils/formatters";

const SubjectPage = () => {
  const { subjectId } = useParams();
  const { currentUser, navigate } = useApp();
  const { subjects, teachers, quizzes, attempts } = useQuiz();

  const enrolledSubjects = useMemo(
    () => subjects.filter((subject) => String(subject.semester) === String(currentUser?.semester)),
    [currentUser?.semester, subjects],
  );
  const selectedSubject = subjectId
    ? enrolledSubjects.find((subject) => Number(subject.id) === Number(subjectId))
    : null;

  const teacherName = (teacherId) => teachers.find((teacher) => Number(teacher.id) === Number(teacherId))?.name || "Faculty pending";
  const studentAttempts = attempts.filter((attempt) => Number(attempt.studentId) === Number(currentUser?.id));
  const latestAttemptForQuiz = (quizId) => studentAttempts.find((attempt) => Number(attempt.quizId) === Number(quizId));

  if (!subjectId) {
    return (
      <div className="fade-in">
        <PageHeader title="Subjects" description="Open a subject to attempt published quizzes and review your progress." />
        {enrolledSubjects.length === 0 ? (
          <EmptyState icon="book-open" title="No subjects available" description="Subjects matching your semester will appear here." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {enrolledSubjects.map((subject) => {
              const count = quizzes.filter((quiz) => quiz.published && Number(quiz.subjectId) === Number(subject.id)).length;
              return (
                <div key={subject.id} className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-600">
                      {subject.subjectCode.replace(/\D/g, "").slice(-3)}
                    </div>
                    <span className="rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-400">{subject.subjectCode}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">{subject.subjectName}</h4>
                  <p className="mt-1 text-xs text-gray-500">{teacherName(subject.assignedTeacherId)}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-400">{count} published quizzes</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/student/subjects/${subject.id}`)}
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                    >
                      Open
                      <Icon name="chevron-right" className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <div className="fade-in">
        <EmptyState
          icon="alert-circle"
          title="Subject not available"
          description="This subject is not available for your semester."
          actionLabel="Back to Subjects"
          onAction={() => navigate("student-subjects")}
        />
      </div>
    );
  }

  const subjectQuizzes = quizzes.filter((quiz) => quiz.published && Number(quiz.subjectId) === Number(selectedSubject.id));

  return (
    <div className="fade-in">
      <button
        type="button"
        onClick={() => navigate("student-subjects")}
        className="mb-4 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <Icon name="arrow-left" className="h-4 w-4" />
        Back to Subjects
      </button>

      <PageHeader
        title={selectedSubject.subjectName}
        description={`${selectedSubject.subjectCode} - Semester ${selectedSubject.semester} - ${teacherName(selectedSubject.assignedTeacherId)}`}
      />

      {subjectQuizzes.length === 0 ? (
        <EmptyState icon="file-text" title="No published quizzes" description="Published quizzes for this subject will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {subjectQuizzes.map((quiz) => {
            const latestAttempt = latestAttemptForQuiz(quiz.id);
            return (
              <div key={quiz.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                    <p className="mt-1 text-xs text-gray-400">{quiz.questions.length} questions</p>
                  </div>
                  <StatusBadge status={quiz.difficulty} />
                </div>
                {latestAttempt ? (
                  <div className="mb-4 rounded-lg bg-gray-50 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-500">Last score</span>
                      <span className="font-semibold text-gray-900">{latestAttempt.score}/{latestAttempt.totalQuestions} ({latestAttempt.percentage}%)</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{formatDateTime(latestAttempt.submittedAt)}</p>
                  </div>
                ) : (
                  <p className="mb-4 text-sm text-gray-500">No attempt submitted yet.</p>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    <Icon name="play" className="h-4 w-4" />
                    {latestAttempt ? "Retake Quiz" : "Attempt Quiz"}
                  </button>
                  {latestAttempt && (
                    <button
                      type="button"
                      onClick={() => navigate(`/student/results/${latestAttempt.id}`)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Icon name="eye" className="h-4 w-4" />
                      View Result
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectPage;
