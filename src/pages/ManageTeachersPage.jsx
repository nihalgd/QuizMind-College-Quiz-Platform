import { useState } from "react";
import { useApp } from "../context/AppContext";
import Icon from "../components/Icon";
import { DUMMY_TEACHERS } from "../data/dummyData";

const ManageTeachersPage = () => {
  const { showToast } = useApp();
  const [teachers, setTeachers] = useState(DUMMY_TEACHERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", department: "" });

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.department) {
      showToast("Please fill all fields", "error");
      return;
    }
    setTeachers(prev => [...prev, { id: Date.now(), ...newTeacher }]);
    setNewTeacher({ name: "", email: "", department: "" });
    setShowAddModal(false);
    showToast("Teacher added successfully!", "success");
  };

  const deleteTeacher = (id) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast("Teacher removed", "success");
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-gray-900">Manage Teachers</h3>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Icon name="user-plus" className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="mb-4 relative">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search teachers by name, email, or department..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500 transition-colors"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Teacher Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden sm:table-cell">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map(teacher => (
                <tr key={teacher.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {teacher.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-900">{teacher.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">{teacher.email}</td>
                  <td className="py-3 px-4 text-gray-500">{teacher.department}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => showToast("Edit teacher form opened", "info")} className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Edit">
                        <Icon name="pencil" className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteTeacher(teacher.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Icon name="trash-2" className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400">No teachers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-lg font-semibold text-gray-900">Add New Teacher</h4>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Icon name="x" className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={newTeacher.name} onChange={(e) => setNewTeacher(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500" placeholder="Dr. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={newTeacher.email} onChange={(e) => setNewTeacher(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500" placeholder="john.doe@college.edu" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                <select value={newTeacher.department} onChange={(e) => setNewTeacher(prev => ({ ...prev, department: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-brand-500">
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={addTeacher} className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-lg transition-colors">Add Teacher</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeachersPage;
