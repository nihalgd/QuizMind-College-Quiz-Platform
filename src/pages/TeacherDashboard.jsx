import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import { DUMMY_QUIZZES, DUMMY_SUBJECTS } from "../data/dummyData";

const TeacherDashboard = () => {
  const { navigate, currentUser } = useApp();
  const assignedSubjects = DUMMY_SUBJECTS.filter(s => s.teacherId === currentUser?.id);

  return (
    <div className="fade-in space-y-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-xl font-bold">
            {currentUser?.avatar}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Welcome back, {currentUser?.name}!</h3>
            <p className="text-sm text-gray-500">{currentUser?.department} Department</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="book-marked" className="w-5 h-5 text-emerald-600" />
          Assigned Subjects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {assignedSubjects.map(subject => (
            <div key={subject.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  {subject.code.replace("CS", "")}
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{subject.department}</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{subject.name}</h4>
              <p className="text-xs text-gray-400 mb-4">Semester {subject.semester} · {subject.code}</p>
              <button
                onClick={() => navigate("teacher-add-quiz", { subject })}
                className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-medium py-2 rounded-lg transition-colors"
              >
                <Icon name="plus" className="w-4 h-4" /> Add Quiz
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="file-text" className="w-5 h-5 text-emerald-600" />
          Recent Quizzes
        </h3>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Quiz Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_QUIZZES.filter(q => assignedSubjects.some(s => s.id === q.subjectId)).slice(0, 5).map(quiz => (
                  <tr key={quiz.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">{quiz.title}</td>
                    <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{quiz.subjectName}</td>
                    <td className="py-3 px-4"><StatusBadge status={quiz.status} /></td>
                    <td className="py-3 px-4 text-gray-400 hidden md:table-cell">{quiz.createdAt}</td>
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

export default TeacherDashboard;
