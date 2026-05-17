import { useEffect, useMemo, useState } from "react";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { getInitials } from "../utils/formatters";

const AssignSubjects = () => {
  const { teachers, subjects, assignments, assignSubjectsToTeacher, unassignSubject } = useQuiz();
  const { showToast } = useApp();
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const selectedTeacherData = teachers.find((teacher) => Number(teacher.id) === Number(selectedTeacher));

  useEffect(() => {
    if (!selectedTeacher) {
      setSelectedSubjects([]);
      return;
    }
    setSelectedSubjects(
      subjects
        .filter((subject) => Number(subject.assignedTeacherId) === Number(selectedTeacher))
        .map((subject) => subject.id),
    );
  }, [selectedTeacher, subjects]);

  const subjectOwner = useMemo(
    () => (subject) => teachers.find((teacher) => Number(teacher.id) === Number(subject.assignedTeacherId)),
    [teachers],
  );

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((current) =>
      current.includes(subjectId) ? current.filter((id) => id !== subjectId) : [...current, subjectId],
    );
  };

  const handleSave = () => {
    if (!selectedTeacher) {
      showToast("Please select a teacher", "error");
      return;
    }

    assignSubjectsToTeacher(selectedTeacher, selectedSubjects);
    showToast("Subject assignments saved", "success");
  };

  const handleUnassign = (subjectId) => {
    unassignSubject(subjectId);
    showToast("Subject unassigned", "success");
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Assign Subjects"
        description="Control which teachers can see and manage each subject."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Select Teacher</label>
          <select
            value={selectedTeacher}
            onChange={(event) => setSelectedTeacher(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
          >
            <option value="">Choose a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.department}</option>
            ))}
          </select>

          {selectedTeacherData ? (
            <>
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                  {selectedTeacherData.avatar || getInitials(selectedTeacherData.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{selectedTeacherData.name}</p>
                  <p className="truncate text-xs text-gray-500">{selectedTeacherData.email}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                {subjects.map((subject) => {
                  const isSelected = selectedSubjects.includes(subject.id);
                  const owner = subjectOwner(subject);
                  const ownedByAnother = owner && Number(owner.id) !== Number(selectedTeacher);
                  return (
                    <button
                      type="button"
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-50"
                          : ownedByAnother
                            ? "border-yellow-200 bg-yellow-50/60"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">{subject.subjectName}</p>
                          <p className="text-xs text-gray-400">{subject.subjectCode} - Semester {subject.semester}</p>
                          {owner && (
                            <p className="mt-2 truncate text-xs text-gray-500">Current: {owner.name}</p>
                          )}
                        </div>
                        <Icon
                          name={isSelected ? "check-square" : "square"}
                          className={`h-5 w-5 flex-shrink-0 ${isSelected ? "text-brand-600" : "text-gray-300"}`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                <Icon name="link" className="h-4 w-4" />
                Save Assignments
              </button>
            </>
          ) : (
            <div className="mt-6">
              <EmptyState icon="users" title="Select a teacher" description="Choose a teacher to view and update their subject assignments." />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="flex items-center gap-2 font-semibold text-gray-900">
            <Icon name="list-checks" className="h-5 w-5 text-purple-500" />
            Current Assignments
          </h4>
          {assignments.map((assignment) => {
            const teacher = teachers.find((candidate) => Number(candidate.id) === Number(assignment.teacherId));
            const assigned = subjects.filter((subject) => assignment.subjects.includes(subject.id));
            if (!teacher) return null;
            return (
              <div key={assignment.teacherId} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-purple-50 text-xs font-bold text-purple-700">
                    {teacher.avatar || getInitials(teacher.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{teacher.name}</p>
                    <p className="truncate text-xs text-gray-400">{teacher.department}</p>
                  </div>
                  <StatusBadge status={assigned.length ? "assigned" : "unassigned"} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {assigned.length ? assigned.map((subject) => (
                    <span key={subject.id} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                      {subject.subjectCode}
                      <button
                        type="button"
                        onClick={() => handleUnassign(subject.id)}
                        className="rounded-full text-brand-500 transition-colors hover:text-red-600"
                        aria-label={`Unassign ${subject.subjectCode}`}
                      >
                        <Icon name="x" className="h-3 w-3" />
                      </button>
                    </span>
                  )) : <span className="text-xs text-gray-400">No subjects assigned</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignSubjects;
