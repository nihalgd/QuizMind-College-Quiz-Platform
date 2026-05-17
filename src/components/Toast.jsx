import { useApp } from "../context/AppContext";
import Icon from "./Icon";

const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;

  const bgColor = toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className={`fixed left-4 right-4 top-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lg fade-in sm:left-auto sm:right-4 sm:max-w-sm ${bgColor}`}>
      <Icon name={toast.type === "success" ? "check-circle" : toast.type === "error" ? "alert-circle" : "info"} className="h-5 w-5 flex-shrink-0" />
      <span className="min-w-0 font-medium">{toast.message}</span>
    </div>
  );
};

export default Toast;
