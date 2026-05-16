import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";

const Sidebar = ({ items, activePage }) => {
  const { navigate, currentUser, sidebarOpen, setSidebarOpen } = useApp();

  const roleLabel = currentUser?.role === "student" ? "Student" : currentUser?.role === "teacher" ? "Teacher" : "Admin";
  const roleColor = currentUser?.role === "student" ? "bg-blue-600" : currentUser?.role === "teacher" ? "bg-emerald-600" : "bg-purple-600";

  useEffect(() => {
    if (!sidebarOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [sidebarOpen]);

  const handleNavigate = (page) => {
    navigate(page);
    setSidebarOpen(false);
  };

  return (
    <>
      <div
        data-testid="sidebar-overlay"
        className={`fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-[1px] transition-opacity duration-300 ease-out lg:hidden ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        data-testid="app-sidebar"
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[280px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out lg:w-[260px] lg:max-w-none lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex-shrink-0 px-5 pb-4 pt-5 lg:px-6 lg:pt-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600">
                <Icon name="brain" className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-bold text-gray-900">QuizMind</h1>
                <span className={`inline-flex max-w-full items-center rounded-full px-2 py-0.5 text-xs font-medium text-white ${roleColor}`}>
                  <span className="truncate">{roleLabel}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                aria-label="Close sidebar"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-5 pb-4 lg:px-6">
            {items.map((item) => (
              <button
                type="button"
                key={item.page}
                onClick={() => handleNavigate(item.page)}
                className={`group flex w-full min-w-0 items-center gap-3 rounded-lg px-3.5 py-3 text-left text-sm font-medium transition-colors ${
                  activePage === item.page
                    ? "bg-brand-50 text-brand-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex-shrink-0 border-t border-gray-100 p-4">
            <div className="flex min-w-0 items-center gap-3 rounded-xl px-2 py-2">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                {currentUser?.avatar}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="truncate text-xs text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
