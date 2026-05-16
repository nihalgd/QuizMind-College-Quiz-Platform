import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";

const ResultPage = () => {
  const { quizResult, navigate } = useApp();

  useEffect(() => {
    if (!quizResult) {
      navigate("student-dashboard");
    }
  }, [quizResult, navigate]);

  if (!quizResult) {
    return null;
  }

  const { quizTitle, totalQuestions, correct, incorrect, percentage, questions, answers } = quizResult;
  const gradeColor = percentage >= 70 ? "text-green-600" : percentage >= 50 ? "text-yellow-600" : "text-red-600";
  const gradeBg = percentage >= 70 ? "bg-green-50" : percentage >= 50 ? "bg-yellow-50" : "bg-red-50";

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className={`${gradeBg} rounded-xl border border-gray-200 p-6 sm:p-8 text-center mb-6`}>
        <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${gradeColor}`}>
          <Icon name={percentage >= 70 ? "trophy" : percentage >= 50 ? "target" : "alert-triangle"} className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Quiz Completed!</h3>
        <p className="text-sm text-gray-500 mb-4">{quizTitle}</p>
        <div className={`text-5xl font-bold ${gradeColor}`}>{percentage}%</div>
        <p className="text-sm text-gray-500 mt-2">Your Score</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
          <p className="text-xs text-gray-500 mt-1">Total Questions</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{correct}</p>
          <p className="text-xs text-gray-500 mt-1">Correct</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{incorrect}</p>
          <p className="text-xs text-gray-500 mt-1">Incorrect</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-4">Answer Summary</h4>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div key={i} className={`p-3 rounded-lg border ${isCorrect ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}`}>
                <div className="flex items-start gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCorrect ? "bg-green-500" : "bg-red-500"}`}>
                    <Icon name={isCorrect ? "check" : "x"} className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">{q.text}</p>
                    <div className="mt-1 text-xs">
                      {userAnswer !== undefined ? (
                        <span className={isCorrect ? "text-green-700" : "text-red-700"}>
                          Your answer: {q.options[userAnswer]}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not answered</span>
                      )}
                      {!isCorrect && (
                        <span className="text-green-700 ml-3">Correct: {q.options[q.correctAnswer]}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("student-dashboard")}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors"
        >
          <Icon name="layout-dashboard" className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
