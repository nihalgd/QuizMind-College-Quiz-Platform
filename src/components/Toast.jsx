import { useApp } from "../context/AppContext";
import Icon from "./Icon";

const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;
  const bgColor = toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-blue-500";
  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg fade-in flex items-center gap-2`}>
      <Icon name={toast.type === "success" ? "check-circle" : toast.type === "error" ? "alert-circle" : "info"} className="w-5 h-5" />
      <span className="font-medium">{toast.message}</span>
    </div>
  );
};

export default Toast;
