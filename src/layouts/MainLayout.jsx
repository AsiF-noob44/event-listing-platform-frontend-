import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
