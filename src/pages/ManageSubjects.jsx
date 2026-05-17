import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import FormField from "../components/FormField";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { useSearch } from "../hooks/useSearch";
import { validateSubject } from "../utils/validation";

const blankSubject = {
  subjectName: "",
  subjectCode: "",
  semester: "",
  assignedTeacherId: "",
};

const SubjectForm = ({ initialValue, teachers, onSubmit, onCancel }) => {
  const [subject, setSubject] = useState(initialValue || blankSubject);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setSubject(initialValue || blankSubject);
    setErrors({});
  }, [initialValue]);

  const handleChange = (field, value) => {
    setSubject((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateSubject(subject);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit(subject);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Subject Name" error={errors.subjectName}>
        <input
          type="text"
          value={subject.subjectName}
          onChange={(event) => handleChange("subjectName", event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
          placeholder="Computer Networks"
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Subject Code" error={errors.subjectCode}>
          <input
            type="text"
            value={subject.subjectCode}
            onChange={(event) => handleChange("subjectCode", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase transition-colors focus:border-brand-500"
            placeholder="CS504"
          />
        </FormField>

        <FormField label="Semester" error={errors.semester}>
          <select
            value={subject.semester}
            onChange={(event) => handleChange("semester", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
          >
            <option value="">Select Semester</option>
            {["1", "2", "3", "4", "5", "6", "7", "8"].map((semester) => (
              <option key={semester} value={semester}>Semester {semester}</option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Assigned Teacher">
        <select
          value={subject.assignedTeacherId || ""}
          onChange={(event) => handleChange("assignedTeacherId", event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
        >
          <option value="">Unassigned</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>{teacher.name} - {teacher.department}</option>
          ))}
        </select>
      </FormField>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Icon name="save" className="h-4 w-4" />
          Save Subject
        </button>
      </div>
    </form>
  );
};

const ManageSubjects = () => {
  const { subjects, teachers, addSubject, updateSubject, deleteSubject } = useQuiz();
  const { showToast } = useApp();
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(subjects, ["subjectName", "subjectCode", "semester"]);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const openAdd = () => {
    setEditingSubject(null);
    setIsModalOpen(true);
  };

  const openEdit = (subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  };

  const handleSubmit = (payload) => {
    const result = editingSubject ? updateSubject(editingSubject.id, payload) : addSubject(payload);
    if (!result.success) {
      showToast(result.message, "error");
      return;
    }
    showToast(editingSubject ? "Subject updated" : "Subject created", "success");
    closeModal();
  };

  const handleDelete = (subject) => {
    const confirmed = window.confirm(`Delete ${subject.subjectName}? Related quizzes will also be removed.`);
    if (!confirmed) return;
    deleteSubject(subject.id);
    showToast("Subject deleted", "success");
  };

  const teacherName = (teacherId) => teachers.find((teacher) => Number(teacher.id) === Number(teacherId))?.name;

  return (
    <div className="fade-in">
      <PageHeader
        title="Manage Subjects"
        description="Create semester subjects and optionally assign ownership to a teacher."
        actionLabel="Create Subject"
        actionIcon="plus"
        onAction={openAdd}
      />

      <div className="mb-4">
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search subjects by name, code, or semester..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-brand-500"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState icon="book-open" title="No subjects found" description="Create a subject to start assigning faculty and quizzes." actionLabel="Create Subject" onAction={openAdd} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Subject</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Semester</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 md:table-cell">Teacher</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((subject) => (
                  <tr key={subject.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{subject.subjectName}</p>
                      <p className="text-xs text-gray-400">{subject.subjectCode}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">Semester {subject.semester}</td>
                    <td className="hidden px-4 py-3 text-gray-500 md:table-cell">{teacherName(subject.assignedTeacherId) || "Unassigned"}</td>
                    <td className="px-4 py-3"><StatusBadge status={subject.assignedTeacherId ? "assigned" : "unassigned"} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(subject)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                          title="Edit subject"
                        >
                          <Icon name="pencil" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(subject)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete subject"
                        >
                          <Icon name="trash-2" className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isModalOpen && (
        <Modal title={editingSubject ? "Edit Subject" : "Create Subject"} onClose={closeModal}>
          <SubjectForm
            initialValue={editingSubject || undefined}
            teachers={teachers}
            onSubmit={handleSubmit}
            onCancel={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageSubjects;
