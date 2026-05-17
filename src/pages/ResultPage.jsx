import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { formatDateTime } from "../utils/formatters";

const ResultPage = () => {
  const { attemptId } = useParams();
  const { currentUser, navigate } = useApp();
  const { attempts, quizzes, subjects } = useQuiz();
  const studentAttempts = attempts.filter((attempt) => Number(attempt.studentId) === Number(currentUser?.id));
  const attempt = attemptId
    ? studentAttempts.find((candidate) => Number(candidate.id) === Number(attemptId))
    : studentAttempts[0];
  const quiz = quizzes.find((candidate) => Number(candidate.id) === Number(attempt?.quizId));
  const subject = subjects.find((candidate) => Number(candidate.id) === Number(quiz?.subjectId));

  if (!attempt || !quiz) {
    return (
      <div className="fade-in">
        <EmptyState
          icon="history"
          title="No result found"
          description="Submit a quiz to see detailed results here."
          actionLabel="View Subjects"
          onAction={() => navigate("student-subjects")}
        />
      </div>
    );
  }

  const gradeColor = attempt.percentage >= 70 ? "text-green-600" : attempt.percentage >= 50 ? "text-yellow-600" : "text-red-600";
  const gradeBg = attempt.percentage >= 70 ? "bg-green-50" : attempt.percentage >= 50 ? "bg-yellow-50" : "bg-red-50";
  const incorrect = attempt.totalQuestions - attempt.score;

  return (
    <div className="fade-in mx-auto max-w-4xl">
      <div className={`mb-6 rounded-xl border border-gray-200 p-6 text-center sm:p-8 ${gradeBg}`}>
        <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${gradeColor}`}>
          <Icon name={attempt.percentage >= 70 ? "trophy" : attempt.percentage >= 50 ? "target" : "alert-triangle"} className="h-10 w-10" />
        </div>
        <h3 className="mb-1 text-xl font-bold text-gray-900">Quiz Completed</h3>
        <p className="mb-4 text-sm text-gray-500">{quiz.title} - {subject?.subjectName || "Deleted subject"}</p>
        <div className={`text-5xl font-bold ${gradeColor}`}>{attempt.percentage}%</div>
        <p className="mt-2 text-sm text-gray-500">Submitted {formatDateTime(attempt.submittedAt)}</p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{attempt.totalQuestions}</p>
          <p className="mt-1 text-xs text-gray-500">Questions</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{attempt.score}</p>
          <p className="mt-1 text-xs text-gray-500">Correct</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-white p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{incorrect}</p>
          <p className="mt-1 text-xs text-gray-500">Incorrect</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h4 className="mb-4 font-semibold text-gray-900">Answer Summary</h4>
        <div className="space-y-3">
          {quiz.questions.map((question, index) => {
            const userAnswer = attempt.answers[index];
            const isCorrect = Number(userAnswer) === Number(question.correctAnswer);
            return (
              <div key={question.id} className={`rounded-lg border p-3 ${isCorrect ? "border-green-200 bg-green-50/60" : "border-red-200 bg-red-50/60"}`}>
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                    <Icon name={isCorrect ? "check" : "x"} className="h-3 w-3 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">{question.question}</p>
                    <div className="mt-1 text-xs">
                      {userAnswer !== undefined ? (
                        <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                          Your answer: {question.options[userAnswer]}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not answered</span>
                      )}
                      {!isCorrect && (
                        <span className="ml-3 text-green-700">Correct: {question.options[question.correctAnswer]}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => navigate("student-history")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          <Icon name="history" className="h-4 w-4" />
          Quiz History
        </button>
        <button
          type="button"
          onClick={() => navigate(subject?.id ? `/student/subjects/${subject.id}` : "student-subjects")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Icon name="book-open" className="h-4 w-4" />
          Back to Subject
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
