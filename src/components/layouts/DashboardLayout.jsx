import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const DashboardLayout = ({ items, activePage, title, showSidebar = true }) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      {showSidebar && <Sidebar items={items} activePage={activePage} />}

      <div className={`min-h-screen w-full min-w-0 transition-[padding] duration-300 ease-out ${showSidebar ? "lg:pl-[260px]" : ""}`}>
        <Navbar title={title} showMenuButton={showSidebar} />
        <main className="w-full min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
