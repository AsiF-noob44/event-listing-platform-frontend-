import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import EventPage from "./pages/EventPage.jsx";
import EventDetailsPage from "./pages/EventDetailsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" Component={MainLayout}>
        <Route index Component={HomePage} />
        <Route path="/events" Component={EventPage} />
        <Route path="/events/:id" Component={EventDetailsPage} />
        <Route path="/profile" Component={ProfilePage} />
      </Route>

      <Route path="/" Component={AuthLayout}>
        <Route path="/login" Component={LoginPage} />
        <Route path="/register" Component={RegisterPage} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
