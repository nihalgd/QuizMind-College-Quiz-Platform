import { useState } from "react";
import EmptyState from "../components/EmptyState";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { useSearch } from "../hooks/useSearch";
import { getInitials } from "../utils/formatters";
import AddTeacherForm from "./AddTeacherForm";

const ManageTeachers = () => {
  const { teachers, subjects, deleteTeacher, updateTeacher, addTeacher } = useQuiz();
  const { showToast } = useApp();
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(teachers, ["name", "email", "department"]);
  const [modalMode, setModalMode] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const openAdd = () => {
    setEditingTeacher(null);
    setModalMode("add");
  };

  const openEdit = (teacher) => {
    setEditingTeacher(teacher);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingTeacher(null);
  };

  const handleSubmit = (payload) => {
    const result = editingTeacher ? updateTeacher(editingTeacher.id, payload) : addTeacher(payload);
    if (!result.success) return result;
    showToast(editingTeacher ? "Teacher updated" : "Teacher added", "success");
    closeModal();
    return result;
  };

  const handleDelete = (teacher) => {
    const confirmed = window.confirm(`Delete ${teacher.name}? Their assigned subjects will be unassigned.`);
    if (!confirmed) return;
    deleteTeacher(teacher.id);
    showToast("Teacher deleted", "success");
  };

  const subjectNamesFor = (teacher) =>
    subjects
      .filter((subject) => Number(subject.assignedTeacherId) === Number(teacher.id))
      .map((subject) => subject.subjectCode);

  return (
    <div className="fade-in">
      <PageHeader
        title="Manage Teachers"
        description="Add faculty, edit profiles, remove inactive teachers, and see assigned subjects in one place."
        actionLabel="Add Teacher"
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
            placeholder="Search teachers by name, email, or department..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm transition-colors focus:border-brand-500"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState icon="users" title="No teachers found" description="Try a different search or add a new teacher." actionLabel="Add Teacher" onAction={openAdd} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Teacher</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Department</th>
                  <th className="hidden px-4 py-3 text-left font-medium text-gray-500 lg:table-cell">Assigned Subjects</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((teacher) => {
                  const subjectCodes = subjectNamesFor(teacher);
                  return (
                    <tr key={teacher.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                            {teacher.avatar || getInitials(teacher.name)}
                          </div>
                          <span className="font-medium text-gray-900">{teacher.name}</span>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-gray-500 sm:table-cell">{teacher.email}</td>
                      <td className="px-4 py-3 text-gray-500">{teacher.department}</td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <div className="flex flex-wrap gap-1.5">
                          {subjectCodes.length ? subjectCodes.map((code) => (
                            <span key={code} className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">{code}</span>
                          )) : <span className="text-xs text-gray-400">No subjects</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(teacher)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
                            title="Edit teacher"
                          >
                            <Icon name="pencil" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(teacher)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete teacher"
                          >
                            <Icon name="trash-2" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalMode && (
        <Modal title={modalMode === "edit" ? "Edit Teacher" : "Add Teacher"} onClose={closeModal}>
          <AddTeacherForm
            initialValue={editingTeacher || undefined}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            submitLabel={modalMode === "edit" ? "Update Teacher" : "Add Teacher"}
          />
        </Modal>
      )}
    </div>
  );
};

export default ManageTeachers;
