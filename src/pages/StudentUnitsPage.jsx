import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import { DUMMY_QUIZZES, DUMMY_UNITS } from "../data/dummyData";

const StudentUnitsPage = () => {
  const { selectedSubject, navigate, showToast } = useApp();

  useEffect(() => {
    if (!selectedSubject) {
      navigate("student-dashboard");
    }
  }, [selectedSubject, navigate]);

  if (!selectedSubject) {
    return null;
  }

  const units = DUMMY_UNITS[selectedSubject.id] || [];

  return (
    <div className="fade-in">
      <button onClick={() => navigate("student-dashboard")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
        <Icon name="arrow-left" className="w-4 h-4" /> Back to Dashboard
      </button>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">{selectedSubject.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{selectedSubject.code} · {selectedSubject.teacherName} · Semester {selectedSubject.semester}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {units.map(unit => (
          <div key={unit.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  unit.attemptStatus === "attempted" ? "bg-green-50 text-green-600" :
                  unit.attemptStatus === "not_attempted" ? "bg-blue-50 text-blue-600" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  <Icon name={
                    unit.attemptStatus === "attempted" ? "check-circle" :
                    unit.attemptStatus === "not_attempted" ? "circle-dot" : "lock"
                  } className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{unit.name}</h4>
                  <StatusBadge status={unit.attemptStatus} />
                </div>
              </div>
            </div>
            {unit.quizAvailable && (
              <div className="flex gap-2 mt-4">
                {unit.attemptStatus === "not_attempted" && (
                  <button
                    onClick={() => {
                      const quiz = DUMMY_QUIZZES.find(q => q.unitId === unit.id);
                      if (quiz) {
                        navigate("student-quiz", { quiz });
                      } else {
                        showToast("Quiz not available yet", "error");
                      }
                    }}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Icon name="play" className="w-4 h-4" /> Start Quiz
                  </button>
                )}
                {unit.attemptStatus === "attempted" && (
                  <button
                    onClick={() => {
                      const quiz = DUMMY_QUIZZES.find(q => q.unitId === unit.id);
                      if (quiz) navigate("student-quiz", { quiz });
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Icon name="eye" className="w-4 h-4" /> View Result
                  </button>
                )}
                {unit.attemptStatus === "locked" && (
                  <button disabled className="flex-1 bg-gray-100 text-gray-400 text-sm font-medium py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5">
                    <Icon name="lock" className="w-4 h-4" /> Locked
                  </button>
                )}
              </div>
            )}
            {!unit.quizAvailable && unit.attemptStatus !== "locked" && (
              <p className="text-xs text-gray-400 mt-3 italic">Quiz will be available soon</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentUnitsPage;
