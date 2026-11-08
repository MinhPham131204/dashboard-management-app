import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const MainPage = () => {
  return (
    <div className="flex">
      <nav className="w-1/6 p-0">
        <div className="fixed top-0 left-0 bottom-0 bg-gray-900 w-1/6">
          <Sidebar />
        </div>
      </nav>

      <main className="w-5/6 ml-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainPage;