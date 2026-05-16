const StatusBadge = ({ status }) => {
  const styles = {
    published: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    attempted: "bg-green-100 text-green-700",
    not_attempted: "bg-blue-100 text-blue-700",
    locked: "bg-gray-100 text-gray-500",
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700"
  };
  const label = status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>{label}</span>;
};

export default StatusBadge;
