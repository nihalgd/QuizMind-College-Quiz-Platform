import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";

const QUIZ_SECONDS = 1800;

const QuizPage = () => {
  const { id } = useParams();
  const { currentUser, navigate, showToast } = useApp();
  const { quizzes, subjects, submitQuizAttempt } = useQuiz();
  const quiz = quizzes.find((candidate) => Number(candidate.id) === Number(id));
  const subject = subjects.find((candidate) => Number(candidate.id) === Number(quiz?.subjectId));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_SECONDS);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(QUIZ_SECONDS);
    setSubmitted(false);
  }, [id]);

  const handleSubmit = () => {
    if (!quiz || submitted) return;
    setSubmitted(true);
    const result = submitQuizAttempt(quiz.id, currentUser.id, answers);
    if (!result.success) {
      showToast(result.message, "error");
      navigate("student-subjects");
      return;
    }
    showToast("Quiz submitted", "success");
    navigate(`/student/results/${result.attempt.id}`);
  };

  useEffect(() => {
    if (!quiz || submitted || timeLeft <= 0) return undefined;
    const timer = window.setInterval(() => setTimeLeft((current) => current - 1), 1000);
    return () => window.clearInterval(timer);
  }, [quiz, submitted, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  if (!quiz || !quiz.published) {
    return (
      <div className="fade-in">
        <EmptyState
          icon="alert-circle"
          title="Quiz not available"
          description="This quiz may be unpublished or deleted."
          actionLabel="Back to Subjects"
          onAction={() => navigate("student-subjects")}
        />
      </div>
    );
  }

  if (!subject || String(subject.semester) !== String(currentUser?.semester)) {
    return (
      <div className="fade-in">
        <EmptyState
          icon="lock"
          title="Quiz outside your semester"
          description="Only quizzes from your semester subjects can be attempted."
          actionLabel="Back to Dashboard"
          onAction={() => navigate("student-dashboard")}
        />
      </div>
    );
  }

  if (!quiz.questions.length) {
    return (
      <div className="fade-in">
        <EmptyState
          icon="file-question"
          title="No questions available"
          description="The teacher needs to add questions before students can attempt this quiz."
          actionLabel="Back to Subject"
          onAction={() => navigate(`/student/subjects/${subject.id}`)}
        />
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const isWarning = timeLeft <= 300;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="fade-in">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/student/subjects/${subject.id}`)}
                  className="flex-shrink-0 text-gray-400 transition-colors hover:text-gray-600"
                  aria-label="Exit quiz"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">{quiz.title}</h3>
                  <p className="truncate text-xs text-gray-400">{subject.subjectName}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${isWarning ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700"}`}>
                <Icon name="clock" className="h-4 w-4" />
                {formattedTime}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-gray-500">Question {currentQuestion + 1} of {quiz.questions.length}</span>
                <span className="text-xs font-medium text-gray-400">{quiz.difficulty}</span>
              </div>

              <h4 className="mb-6 text-base font-medium leading-relaxed text-gray-900 sm:text-lg">{question.question}</h4>

              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    type="button"
                    key={`${question.id}-${index}`}
                    onClick={() => setAnswers((current) => ({ ...current, [currentQuestion]: index }))}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      Number(answers[currentQuestion]) === index
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      Number(answers[currentQuestion]) === index
                        ? "border-brand-500 bg-brand-600 text-white"
                        : "border-gray-300 text-gray-500"
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={`text-sm ${Number(answers[currentQuestion]) === index ? "font-medium text-brand-800" : "text-gray-700"}`}>
                      {option}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentQuestion((current) => Math.max(0, current - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  <Icon name="chevron-left" className="h-4 w-4" />
                  Previous
                </button>
                {currentQuestion < quiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestion((current) => current + 1)}
                    className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    Next
                    <Icon name="chevron-right" className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (answeredCount < quiz.questions.length) {
                        showToast("Please answer all questions before submitting", "error");
                        return;
                      }
                      handleSubmit();
                    }}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <Icon name="send" className="h-4 w-4" />
                    Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:w-64">
          <div className="rounded-xl border border-gray-200 bg-white p-4 lg:sticky lg:top-24">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Question Navigator</h4>
            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`aspect-square rounded-lg text-xs font-bold transition-colors ${
                    index === currentQuestion
                      ? "bg-brand-600 text-white"
                      : answers[index] !== undefined
                        ? "bg-brand-100 text-brand-700"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-brand-600" /> Current</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-brand-100" /> Answered ({answeredCount}/{quiz.questions.length})</div>
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-gray-100" /> Not Answered</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuizPage;
