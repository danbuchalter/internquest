import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const scrollToSection = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.history.pushState(null, "", `#${id}`);
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <span className="font-bold text-2xl text-primary">
                  Intern<span className="text-amber-500">Quest</span>
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <a
                href="#internships"
                className={`px-3 py-2 text-sm font-medium ${isActive("/internships") ? "text-primary" : "text-gray-700 hover:text-primary"} transition cursor-pointer`}
                onClick={(e) => scrollToSection("internships", e)}
              >
                Internships
              </a>
              <a
                href="#for-companies"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition cursor-pointer"
                onClick={(e) => scrollToSection("for-companies", e)}
              >
                For Companies
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary transition cursor-pointer"
                onClick={(e) => scrollToSection("how-it-works", e)}
              >
                How It Works
              </a>
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium rounded-md text-primary hover:bg-primary-50 transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close main menu" : "Open main menu"}
              </span>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <a
              href="#internships"
              className={`block px-3 py-2 text-base font-medium ${isActive("/internships") ? "text-primary bg-primary-50" : "text-gray-700 hover:bg-gray-50 hover:text-primary"}`}
              onClick={(e) => scrollToSection("internships", e)}
            >
              Internships
            </a>
            <a
              href="#for-companies"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              onClick={(e) => scrollToSection("for-companies", e)}
            >
              For Companies
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary"
              onClick={(e) => scrollToSection("how-it-works", e)}
            >
              How It Works
            </a>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4 space-x-3">
              <Link
                to="/login"
                className="block px-4 py-2 w-full text-center text-sm font-medium rounded-md text-primary hover:bg-primary-50 transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 w-full text-center text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}