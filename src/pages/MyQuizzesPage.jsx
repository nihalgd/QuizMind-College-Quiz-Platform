import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import { DUMMY_QUIZZES, DUMMY_SUBJECTS } from "../data/dummyData";

const MyQuizzesPage = () => {
  const { navigate, currentUser, showToast } = useApp();
  const assignedSubjects = DUMMY_SUBJECTS.filter(s => s.teacherId === currentUser?.id);
  const quizzes = DUMMY_QUIZZES.filter(q => assignedSubjects.some(s => s.id === q.subjectId));

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">My Quizzes</h3>
        <button onClick={() => navigate("teacher-add-quiz")} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Icon name="plus" className="w-4 h-4" /> New Quiz
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Quiz Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Unit</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(quiz => (
                <tr key={quiz.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-medium text-gray-900">{quiz.title}</td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{quiz.subjectName}</td>
                  <td className="py-3 px-4 text-gray-400 hidden md:table-cell text-xs">{quiz.unitName}</td>
                  <td className="py-3 px-4"><StatusBadge status={quiz.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate("teacher-quiz-editor", { quiz })} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Edit">
                        <Icon name="pencil" className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View">
                        <Icon name="eye" className="w-4 h-4" />
                      </button>
                      <button onClick={() => showToast("Quiz deleted", "success")} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Icon name="trash-2" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyQuizzesPage;
