import { useApp } from "../context/AppContext";
import Icon from "./Icon";

const Navbar = ({ title, showMenuButton = true }) => {
  const { currentUser, logout, sidebarOpen, setSidebarOpen } = useApp();
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {showMenuButton && (
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-gray-900">{title}</h2>
            {currentUser?.role === "student" && (
              <p className="truncate text-sm text-gray-500">{currentUser.department} · Semester {currentUser.semester}</p>
            )}
          </div>
        </div>
        <div className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden max-w-[14rem] min-w-0 items-center gap-2 text-sm text-gray-600 sm:flex">
            <Icon name="user" className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{currentUser?.name}</span>
          </div>
          <button onClick={logout} className="flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 sm:px-4">
            <Icon name="log-out" className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
