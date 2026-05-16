import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import { DUMMY_QUESTIONS } from "../data/dummyData";

const QuizAttemptPage = () => {
  const { selectedQuiz, navigate, quizAnswers, setQuizAnswers, setQuizResult, showToast } = useApp();
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [submitted, setSubmitted] = useState(false);

  const questions = DUMMY_QUESTIONS.filter(q => q.quizId === selectedQuiz?.id);

  const handleSubmit = () => {
    if (!selectedQuiz) return;

    setSubmitted(true);
    let correct = 0;
    questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) correct++;
    });
    const result = {
      quizTitle: selectedQuiz.title,
      totalQuestions: questions.length,
      correct,
      incorrect: questions.length - correct,
      percentage: Math.round((correct / questions.length) * 100),
      answers: quizAnswers,
      questions
    };
    setQuizResult(result);
    navigate("student-result");
  };

  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) handleSubmit();
  }, [timeLeft]);

  useEffect(() => {
    if (!selectedQuiz) {
      navigate("student-dashboard");
    }
  }, [selectedQuiz, navigate]);

  if (!selectedQuiz) {
    return null;
  }

  if (questions.length === 0) {
    return (
      <div className="fade-in flex items-center justify-center py-20">
        <div className="text-center">
          <Icon name="file-question" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No questions available for this quiz.</p>
          <button onClick={() => navigate("student-dashboard")} className="mt-4 text-brand-600 hover:text-brand-700 font-medium text-sm">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const question = questions[currentQ];
  const isWarning = timeLeft <= 300 && !submitted;

  return (
    <div className="fade-in">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate("student-units")} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Icon name="x" className="w-5 h-5" />
                </button>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{selectedQuiz.title}</h3>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${isWarning ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-700"}`}>
                <Icon name="clock" className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-gray-500">Question {currentQ + 1} of {questions.length}</span>
                <span className="text-xs text-gray-400">{selectedQuiz.difficulty}</span>
              </div>

              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-6 leading-relaxed">{question.text}</h4>

              <div className="space-y-3">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const newAnswers = { ...quizAnswers };
                      newAnswers[currentQ] = i;
                      setQuizAnswers(newAnswers);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      quizAnswers[currentQ] === i
                        ? "border-brand-500 bg-brand-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      quizAnswers[currentQ] === i
                        ? "border-brand-500 bg-brand-600 text-white"
                        : "border-gray-300 text-gray-500"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`text-sm ${quizAnswers[currentQ] === i ? "text-brand-800 font-medium" : "text-gray-700"}`}>{opt}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                  disabled={currentQ === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="chevron-left" className="w-4 h-4" /> Previous
                </button>
                {currentQ < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQ(currentQ + 1)}
                    className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Next <Icon name="chevron-right" className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (Object.keys(quizAnswers).length < questions.length) {
                        showToast("Please answer all questions before submitting", "error");
                      } else {
                        handleSubmit();
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Icon name="send" className="w-4 h-4" /> Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-64">
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:sticky lg:top-20">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">Question Navigator</h4>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                    i === currentQ ? "bg-brand-600 text-white" :
                    quizAnswers[i] !== undefined ? "bg-brand-100 text-brand-700" :
                    "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-brand-600"></span> Current</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-brand-100"></span> Answered ({Object.keys(quizAnswers).length}/{questions.length})</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-gray-100"></span> Not Answered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptPage;
