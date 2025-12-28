import { Calendars } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
const Navbar = () => {
  const handleNavClick = () => {
    // Close dropdown by removing focus from the dropdown trigger
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };

  const navLinks = (
    <>
      <li onClick={handleNavClick}>
        <NavLink
          to="/"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending opacity-50"
              : isActive
              ? "bg-primary text-primary-content font-semibold"
              : "hover:bg-base-200"
          }
        >
          Home
        </NavLink>
      </li>

      <li onClick={handleNavClick}>
        <NavLink
          to="/events"
          className={({ isActive, isPending }) =>
            isPending
              ? "pending opacity-50"
              : isActive
              ? "bg-primary text-primary-content font-semibold"
              : "hover:bg-base-200"
          }
        >
          Events
        </NavLink>
      </li>
    </>
  );
  return (
    <div className="navbar sticky top-0 z-50 bg-base-100 shadow-lg border-b border-base-300 backdrop-blur-sm">
      {/* Mobile Menu Dropdown */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-3 shadow-xl border border-base-300"
          >
            {navLinks}
            <div className="divider my-2"></div>
            <li onClick={handleNavClick}>
              <NavLink to="/login" className="hover:bg-base-200 font-medium">
                Login
              </NavLink>
            </li>
            <li onClick={handleNavClick} className="mt-1">
              <NavLink
                to="/register"
                className="btn btn-primary btn-sm normal-case"
              >
                Register
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Logo - Left side on mobile, Left on desktop */}
        <Link to="/" className="flex items-center gap-2 group lg:mr-8">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-300 group-hover:bg-base-200">
            <Calendars className="w-7 h-7 lg:w-8 lg:h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span className="text-2xl lg:text-3xl font-bold tracking-tight italic text-accent-content textarea-info">
              Eventify
            </span>
          </div>
        </Link>
      </div>

      {/* Center Navigation Links - Desktop only */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-2 px-1 text-base">
          {navLinks}
        </ul>
      </div>

      {/* Auth Buttons - Right side - Desktop only */}
      <div className="navbar-end gap-2">
        <Link
          to="/login"
          className="btn btn-outline btn-warning btn-sm lg:btn-md hidden lg:inline-flex"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="btn btn-info btn-sm lg:btn-md hidden lg:inline-flex"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
