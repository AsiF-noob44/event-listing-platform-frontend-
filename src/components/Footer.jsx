import { Calendars, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-300 border-t-2 border-base-content/10 mt-auto">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Calendars className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xl font-bold tracking-tight italic text-accent-content">
              Eventify
            </span>
          </Link>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-sm text-base-content/70">
              © {currentYear} All rights reserved |{" "}
              <span className="font-semibold text-base-content">
                Abu Sayeed Rifat
              </span>
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/AsiF-noob44"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-content/15"
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/abu-sayeed-rifat-260535336/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost btn-sm btn-circle hover:bg-base-content/15"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
