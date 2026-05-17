import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";

const MySubjects = () => {
  const { currentUser, navigate } = useApp();
  const { subjects, quizzes } = useQuiz();
  const assignedSubjects = subjects.filter((subject) => Number(subject.assignedTeacherId) === Number(currentUser?.id));

  const subjectQuizCount = (subjectId) => quizzes.filter((quiz) => Number(quiz.subjectId) === Number(subjectId)).length;

  return (
    <div className="fade-in">
      <PageHeader
        title="My Subjects"
        description="Only subjects assigned by the admin are visible here."
      />

      {assignedSubjects.length === 0 ? (
        <EmptyState
          icon="book-marked"
          title="No assigned subjects yet"
          description="Ask the admin to assign subjects before creating quizzes."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assignedSubjects.map((subject) => (
            <div key={subject.id} className="rounded-xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-700">
                  {subject.subjectCode.replace(/\D/g, "").slice(-3)}
                </div>
                <StatusBadge status="assigned" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900">{subject.subjectName}</h4>
              <p className="mt-1 text-xs text-gray-400">{subject.subjectCode} - Semester {subject.semester}</p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs font-medium text-gray-500">{subjectQuizCount(subject.id)} quizzes</span>
                <button
                  type="button"
                  onClick={() => navigate(`/teacher/create-quiz?subjectId=${subject.id}`)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                >
                  Create Quiz
                  <Icon name="chevron-right" className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubjects;
