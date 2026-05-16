import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import { DUMMY_ASSIGNMENTS, DUMMY_SUBJECTS, DUMMY_TEACHERS } from "../data/dummyData";

const AssignSubjectsPage = () => {
  const { showToast } = useApp();
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [assignments, setAssignments] = useState(DUMMY_ASSIGNMENTS);

  const teacherSubjects = assignments.find(a => a.teacherId === parseInt(selectedTeacher))?.subjects || [];

  const toggleSubject = (subjectId) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const assignSubjects = () => {
    if (!selectedTeacher || selectedSubjects.length === 0) {
      showToast("Please select a teacher and at least one subject", "error");
      return;
    }
    const teacher = DUMMY_TEACHERS.find(t => t.id === parseInt(selectedTeacher));
    setAssignments(prev => {
      const existing = prev.find(a => a.teacherId === parseInt(selectedTeacher));
      if (existing) {
        return prev.map(a => a.teacherId === parseInt(selectedTeacher) ? { ...a, subjects: [...new Set([...a.subjects, ...selectedSubjects])] } : a);
      }
      return [...prev, { teacherId: parseInt(selectedTeacher), teacherName: teacher.name, subjects: selectedSubjects }];
    });
    setSelectedSubjects([]);
    showToast("Subjects assigned successfully!", "success");
  };

  return (
    <div className="fade-in max-w-3xl">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Assign Subjects to Teachers</h3>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Teacher</label>
          <select value={selectedTeacher} onChange={(e) => { setSelectedTeacher(e.target.value); setSelectedSubjects([]); }} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors">
            <option value="">Choose a teacher...</option>
            {DUMMY_TEACHERS.map(t => <option key={t.id} value={t.id}>{t.name} — {t.department}</option>)}
          </select>
        </div>

        {selectedTeacher && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Subjects</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DUMMY_SUBJECTS.map(subject => {
                  const isSelected = selectedSubjects.includes(subject.id);
                  const isAlreadyAssigned = teacherSubjects.includes(subject.id);
                  return (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? "border-brand-500 bg-brand-50"
                          : isAlreadyAssigned
                          ? "border-green-200 bg-green-50/50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{subject.name}</p>
                          <p className="text-xs text-gray-400">{subject.code} · Sem {subject.semester}</p>
                        </div>
                        {isSelected ? (
                          <Icon name="check-square" className="w-5 h-5 text-brand-600 flex-shrink-0 ml-2" />
                        ) : isAlreadyAssigned ? (
                          <Icon name="check-circle" className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                        ) : (
                          <Icon name="square" className="w-5 h-5 text-gray-300 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={assignSubjects} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Icon name="link" className="w-4 h-4" /> Assign Selected Subjects
            </button>
          </>
        )}
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="list-checks" className="w-5 h-5 text-purple-500" />
          Current Assignments
        </h4>
        <div className="space-y-3">
          {assignments.map(assignment => {
            const teacher = DUMMY_TEACHERS.find(t => t.id === assignment.teacherId);
            if (!teacher) return null;
            return (
              <div key={assignment.teacherId} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {teacher.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                    <p className="text-xs text-gray-400">{teacher.department}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {assignment.subjects.map(sId => {
                    const subject = DUMMY_SUBJECTS.find(s => s.id === sId);
                    if (!subject) return null;
                    return (
                      <span key={sId} className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
                        {subject.code}
                        <button onClick={() => showToast("Subject unassigned", "success")} className="hover:text-red-600 transition-colors">
                          <Icon name="x" className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignSubjectsPage;
