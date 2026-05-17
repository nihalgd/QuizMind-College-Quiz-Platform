import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import StatCard from "../components/StatCard";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { formatDate, getInitials } from "../utils/formatters";

const AdminDashboard = () => {
  const { navigate } = useApp();
  const { teachers, students, subjects, quizzes } = useQuiz();
  const assignedSubjects = subjects.filter((subject) => subject.assignedTeacherId);
  const publishedQuizzes = quizzes.filter((quiz) => quiz.published);

  const recentQuizzes = quizzes.slice(0, 5).map((quiz) => ({
    ...quiz,
    subject: subjects.find((subject) => Number(subject.id) === Number(quiz.subjectId)),
    teacher: teachers.find((teacher) => Number(teacher.id) === Number(quiz.teacherId)),
  }));

  return (
    <div className="fade-in space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon="users" label="Teachers" value={teachers.length} color="bg-emerald-500" />
        <StatCard icon="graduation-cap" label="Students" value={students.length} color="bg-blue-500" />
        <StatCard icon="book-open" label="Subjects" value={subjects.length} color="bg-purple-500" />
        <StatCard icon="file-text" label="Published Quizzes" value={publishedQuizzes.length} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900">
              <Icon name="users" className="h-5 w-5 text-emerald-500" />
              Teacher Workload
            </h4>
            <button
              type="button"
              onClick={() => navigate("admin-teachers")}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Manage
            </button>
          </div>
          <div className="space-y-3">
            {teachers.slice(0, 5).map((teacher) => (
              <div key={teacher.id} className="flex min-w-0 items-center gap-3 rounded-lg p-2 hover:bg-gray-50">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                  {teacher.avatar || getInitials(teacher.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{teacher.name}</p>
                  <p className="truncate text-xs text-gray-400">{teacher.department}</p>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  {teacher.assignedSubjects.length} subjects
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h4 className="flex items-center gap-2 font-semibold text-gray-900">
              <Icon name="list-checks" className="h-5 w-5 text-purple-500" />
              Subject Assignments
            </h4>
            <button
              type="button"
              onClick={() => navigate("admin-assign-subjects")}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Assign
            </button>
          </div>
          <div className="space-y-3">
            {subjects.slice(0, 6).map((subject) => {
              const teacher = teachers.find((candidate) => Number(candidate.id) === Number(subject.assignedTeacherId));
              return (
                <div key={subject.id} className="flex min-w-0 items-center justify-between gap-3 rounded-lg p-2 hover:bg-gray-50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{subject.subjectName}</p>
                    <p className="truncate text-xs text-gray-400">{subject.subjectCode} - Semester {subject.semester}</p>
                  </div>
                  <StatusBadge status={teacher ? "assigned" : "unassigned"} />
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-gray-400">{assignedSubjects.length} of {subjects.length} subjects have teachers assigned.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h4 className="flex items-center gap-2 font-semibold text-gray-900">
            <Icon name="file-text" className="h-5 w-5 text-brand-600" />
            Recent Quizzes
          </h4>
          <button
            type="button"
            onClick={() => navigate("admin-quizzes")}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-4 py-3 text-left font-medium text-gray-500">Quiz</th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">Subject</th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-500 md:table-cell">Teacher</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="hidden px-4 py-3 text-left font-medium text-gray-500 lg:table-cell">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentQuizzes.map((quiz) => (
                <tr key={quiz.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                  <td className="px-4 py-3 font-medium text-gray-900">{quiz.title}</td>
                  <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{quiz.subject?.subjectCode || "Unassigned"}</td>
                  <td className="hidden px-4 py-3 text-gray-500 md:table-cell">{quiz.teacher?.name || "No teacher"}</td>
                  <td className="px-4 py-3"><StatusBadge status={quiz.published ? "published" : "draft"} /></td>
                  <td className="hidden px-4 py-3 text-gray-400 lg:table-cell">{formatDate(quiz.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
