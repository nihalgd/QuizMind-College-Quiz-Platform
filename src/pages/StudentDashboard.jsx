import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import { DUMMY_RECENT_ATTEMPTS, DUMMY_SUBJECTS } from "../data/dummyData";

const StudentDashboard = () => {
  const { navigate } = useApp();
  const enrolledSubjects = DUMMY_SUBJECTS.slice(0, 4);

  return (
    <div className="fade-in space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="book-open" className="w-5 h-5 text-brand-600" />
          Enrolled Subjects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {enrolledSubjects.map(subject => (
            <div key={subject.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-brand-50 text-brand-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  {subject.code.replace("CS", "")}
                </div>
                <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{subject.code}</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-1">{subject.name}</h4>
              <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                <Icon name="user" className="w-3 h-3" />
                {subject.teacherName}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Sem {subject.semester}</span>
                <button
                  onClick={() => navigate("student-units", { subject })}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
                >
                  View Units <Icon name="chevron-right" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="history" className="w-5 h-5 text-brand-600" />
          Recent Quiz Attempts
        </h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Unit</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_RECENT_ATTEMPTS.map(attempt => (
                  <tr key={attempt.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">{attempt.subjectName}</td>
                    <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{attempt.unitName}</td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${attempt.percentage >= 70 ? "text-green-600" : attempt.percentage >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">({attempt.percentage}%)</span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{attempt.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
