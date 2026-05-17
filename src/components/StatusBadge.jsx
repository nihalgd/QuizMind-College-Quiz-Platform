const StatusBadge = ({ status }) => {
  const normalizedStatus = String(status).toLowerCase().replace(/\s+/g, "_");
  const styles = {
    published: "bg-green-100 text-green-700",
    unpublished: "bg-gray-100 text-gray-600",
    draft: "bg-yellow-100 text-yellow-700",
    attempted: "bg-green-100 text-green-700",
    not_attempted: "bg-blue-100 text-blue-700",
    locked: "bg-gray-100 text-gray-500",
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
    assigned: "bg-green-100 text-green-700",
    unassigned: "bg-gray-100 text-gray-600",
    passed: "bg-green-100 text-green-700",
    needs_work: "bg-red-100 text-red-700",
  };
  const label = normalizedStatus.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[normalizedStatus] || "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
