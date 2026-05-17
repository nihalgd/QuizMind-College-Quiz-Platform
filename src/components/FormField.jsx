const FormField = ({ label, error, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
  </label>
);

export default FormField;
