import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import { DUMMY_QUESTIONS } from "../data/dummyData";

const QuizEditorPage = () => {
  const { selectedQuiz, navigate, showToast } = useApp();
  const [questions, setQuestions] = useState(DUMMY_QUESTIONS.slice(0, 5));

  useEffect(() => {
    if (!selectedQuiz) {
      navigate("teacher-dashboard");
    }
  }, [selectedQuiz, navigate]);

  if (!selectedQuiz) {
    return null;
  }

  const deleteQuestion = (id) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    showToast("Question deleted", "success");
  };

  return (
    <div className="fade-in">
      <button onClick={() => navigate("teacher-my-quizzes")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <Icon name="arrow-left" className="w-4 h-4" /> Back to My Quizzes
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{selectedQuiz.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{selectedQuiz.subjectName} · {selectedQuiz.unitName}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={selectedQuiz.status} />
          <span className="text-xs text-gray-400">{questions.length} questions</span>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-bold text-gray-400">Q{i + 1}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => showToast("Edit mode enabled", "info")} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                  <Icon name="pencil" className="w-4 h-4" />
                </button>
                <button onClick={() => deleteQuestion(q.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Icon name="trash-2" className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-3">{q.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi) => (
                <div key={oi} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${oi === q.correctAnswer ? "bg-green-50 border border-green-200 text-green-700 font-medium" : "bg-gray-50 text-gray-600"}`}>
                  <span className="w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center flex-shrink-0">{
                    oi === q.correctAnswer
                      ? <Icon name="check" className="w-3 h-3" />
                      : String.fromCharCode(65 + oi)
                  }</span>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => showToast("Add question form opened", "info")} className="w-full mt-4 border-2 border-dashed border-gray-300 hover:border-brand-400 rounded-xl py-4 text-sm font-medium text-gray-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2">
        <Icon name="plus" className="w-4 h-4" /> Add Question
      </button>

      <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
        <button onClick={() => showToast("Draft saved", "success")} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-lg transition-colors">
          <Icon name="save" className="w-4 h-4" /> Save Draft
        </button>
        <button onClick={() => showToast("Quiz published!", "success")} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-lg transition-colors">
          <Icon name="send" className="w-4 h-4" /> Publish Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizEditorPage;
