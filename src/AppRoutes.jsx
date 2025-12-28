import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import EventPage from "./pages/EventPage.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" Component={MainLayout}>
        <Route index Component={HomePage} />
        <Route path="/events" Component={EventPage} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
