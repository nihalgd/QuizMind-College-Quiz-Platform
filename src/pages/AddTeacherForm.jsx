import { useEffect, useState } from "react";
import FormField from "../components/FormField";
import Icon from "../components/Icon";
import PageHeader from "../components/PageHeader";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";
import { validateTeacher } from "../utils/validation";

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Applied Science",
];

const blankTeacher = {
  name: "",
  email: "",
  department: "",
};

const AddTeacherForm = ({ initialValue, onSubmit, onCancel, submitLabel = "Save Teacher" }) => {
  const { addTeacher, updateTeacher } = useQuiz();
  const { navigate, showToast } = useApp();
  const isStandalone = !onSubmit;
  const [teacher, setTeacher] = useState(initialValue || blankTeacher);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTeacher(initialValue || blankTeacher);
    setErrors({});
  }, [initialValue]);

  const handleChange = (field, value) => {
    setTeacher((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateTeacher(teacher);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = onSubmit
      ? onSubmit(teacher)
      : initialValue?.id
        ? updateTeacher(initialValue.id, teacher)
        : addTeacher(teacher);

    if (result?.success === false) {
      showToast(result.message, "error");
      return;
    }

    if (!onSubmit) {
      showToast(initialValue?.id ? "Teacher updated" : "Teacher added", "success");
      navigate("admin-teachers");
    }
  };

  const form = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Teacher Name" error={errors.name}>
          <input
            type="text"
            value={teacher.name}
            onChange={(event) => handleChange("name", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
            placeholder="Dr. Asha Mehta"
          />
        </FormField>

        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            value={teacher.email}
            onChange={(event) => handleChange("email", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
            placeholder="asha.mehta@college.edu"
          />
        </FormField>
      </div>

      <FormField label="Department" error={errors.department}>
        <select
          value={teacher.department}
          onChange={(event) => handleChange("department", event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm transition-colors focus:border-brand-500"
        >
          <option value="">Select Department</option>
          {DEPARTMENTS.map((department) => (
            <option key={department} value={department}>{department}</option>
          ))}
        </select>
      </FormField>

      <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
        New teachers can sign in with their email and the default password <span className="font-semibold">password</span>.
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel || (() => navigate("admin-teachers"))}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Icon name="save" className="h-4 w-4" />
          {submitLabel}
        </button>
      </div>
    </form>
  );

  if (!isStandalone) return form;

  return (
    <div className="fade-in max-w-2xl">
      <PageHeader title="Add Teacher" description="Create a teacher profile and assign subjects afterward." />
      <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        {form}
      </div>
    </div>
  );
};

export default AddTeacherForm;
