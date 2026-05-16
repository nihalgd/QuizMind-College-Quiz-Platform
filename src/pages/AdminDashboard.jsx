import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import { DUMMY_QUIZZES, DUMMY_TEACHERS } from "../data/dummyData";

const AdminDashboard = () => {
  return (
    <div className="fade-in space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="users" label="Total Teachers" value={DUMMY_TEACHERS.length} color="bg-emerald-500" />
        <StatCard icon="graduation-cap" label="Total Students" value="1248" color="bg-blue-500" />
        <StatCard icon="file-text" label="Total Quizzes" value={DUMMY_QUIZZES.length} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="users" className="w-5 h-5 text-emerald-500" />
            Recent Teachers
          </h4>
          <div className="space-y-3">
            {DUMMY_TEACHERS.slice(0, 4).map(teacher => (
              <div key={teacher.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  {teacher.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{teacher.name}</p>
                  <p className="text-xs text-gray-400">{teacher.department}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Icon name="file-text" className="w-5 h-5 text-purple-500" />
            Recent Quizzes
          </h4>
          <div className="space-y-3">
            {DUMMY_QUIZZES.slice(0, 4).map(quiz => (
              <div key={quiz.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{quiz.title}</p>
                  <p className="text-xs text-gray-400">{quiz.subjectName}</p>
                </div>
                <StatusBadge status={quiz.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
