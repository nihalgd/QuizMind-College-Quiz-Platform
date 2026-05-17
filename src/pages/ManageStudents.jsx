import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import FormField from "../components/FormField";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { useSearch } from "../hooks/useSearch";
import { getInitials } from "../utils/formatters";
import { validateStudent } from "../utils/validation";

const blankStudent = {
  name: "",
  email: "",
  rollNo: "",
  department: "",
  semester: "",
};

const StudentForm = ({ initialValue, onSubmit, onCancel }) => {
  const [student, setStudent] = useState(initialValue || blankStudent);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setStudent(initialValue || blankStudent);
    setErrors({});
  }, [initialValue]);

  const handleChange = (field, value) => {
    setStudent((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateStudent(student);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit(student);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Student Name" error={errors.name}>
          <input
            type="text"
            value={student.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
            placeholder="Student name"
          />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            value={student.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
            placeholder="student@skitm.in"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Roll Number" error={errors.rollNo}>
          <input
            type="text"
            value={student.rollNo}
            onChange={(event) => handleChange("rollNo", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm uppercase transition-colors focus:border-brand-500"
            placeholder="CS2023045"
          />
        </FormField>
        <FormField label="Semester" error={errors.semester}>
          <select
            value={student.semester}
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

      <FormField label="Department" error={errors.department}>
        <select
          value={student.department}
          onChange={(event) => handleChange("department", event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
        >
          <option value="">Select Department</option>
          {["Computer Science", "Information Technology", "Electronics", "Mechanical Engineering", "Civil Engineering"].map((department) => (
            <option key={department} value={department}>{department}</option>
          ))}
        </select>
      </FormField>

      <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
        Students can sign in with email or roll number. The default password is <span className="font-semibold">password</span>.
      </div>

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
          Save Student
        </button>
      </div>
    </form>
  );
};

const ManageStudents = () => {
  const { students, attempts, addStudent, updateStudent, deleteStudent } = useQuiz();
  const { showToast } = useApp();
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(students, ["name", "email", "rollNo", "department", "semester"]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingStudent(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (payload) => {
    const result = editingStudent ? updateStudent(editingStudent.id, payload) : addStudent(payload);
    if (!result.success) {
      showToast(result.message, "error");
      return;
    }
    showToast(editingStudent ? "Student updated" : "Student added", "success");
    closeModal();
  };

  const handleDelete = (student) => {
    const confirmed = window.confirm(`Delete ${student.name}? Their quiz attempts will also be removed.`);
    if (!confirmed) return;
    deleteStudent(student.id);
    showToast("Student deleted", "success");
  };

  const attemptCount = (studentId) => attempts.filter((attempt) => Number(attempt.studentId) === Number(studentId)).length;

  return (
    <div className="fade-in">
      <PageHeader
        title="Manage Students"
        description="Maintain enrolled students and keep their quiz access current."
        actionLabel="Add Student"
        actionIcon="user-plus"
        onAction={openAdd}
      />

      <div className="mb-4">
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search students by name, roll number, email, department..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-brand-500"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState icon="graduation-cap" title="No students found" description="Add students so they can take published quizzes." actionLabel="Add Student" onAction={openAdd} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Student</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">Roll No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Semester</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 lg:table-cell">Attempts</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((student) => (
                  <tr key={student.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                          {student.avatar || getInitials(student.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">{student.name}</p>
                          <p className="truncate text-xs text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{student.rollNo}</td>
                    <td className="px-4 py-3 text-gray-500">Sem {student.semester}</td>
                    <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">{attemptCount(student.id)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(student)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                          title="Edit student"
                        >
                          <Icon name="pencil" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete student"
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
        <Modal title={editingStudent ? "Edit Student" : "Add Student"} onClose={closeModal}>
          <StudentForm initialValue={editingStudent || undefined} onSubmit={handleSubmit} onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default ManageStudents;
