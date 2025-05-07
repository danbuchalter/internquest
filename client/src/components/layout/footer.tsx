import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const handleNav = (path: string) => () => navigate(path, { replace: true });

  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="font-montserrat font-bold text-2xl text-white">
              Intern<span className="text-amber-500">Quest</span>
            </span>
            <p className="mt-4 text-base text-gray-400">
              Connecting South African youth with career-building opportunities.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="/" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="/" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">For Students</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <button onClick={handleNav("/#testimonials")} className="text-left text-base text-gray-300 hover:text-white">
                  Success Stories
                </button>
              </li>
              <li>
                <button onClick={handleNav("/internships")} className="text-left text-base text-gray-300 hover:text-white">
                  Browse Internships
                </button>
              </li>
              <li>
                <button onClick={handleNav("/auth")} className="text-left text-base text-gray-300 hover:text-white">
                  Create Profile
                </button>
              </li>
              <li>
                <button onClick={handleNav("/application-tips")} className="text-left text-base text-gray-300 hover:text-white">
                  Application Tips
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">For Companies</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <button onClick={handleNav("/post-internship")} className="text-left text-base text-gray-300 hover:text-white">
                  Post Internships
                </button>
              </li>
              <li>
                <button onClick={handleNav("/company-dashboard")} className="text-left text-base text-gray-300 hover:text-white">
                  Company Dashboard
                </button>
              </li>
              <li>
                <button onClick={handleNav("/internship-guide")} className="text-left text-base text-gray-300 hover:text-white">
                  Internship Guide
                </button>
              </li>
              <li>
                <button onClick={handleNav("/partner-benefits")} className="text-left text-base text-gray-300 hover:text-white">
                  Partner Benefits
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <button onClick={handleNav("/our-mission")} className="text-left text-base text-gray-300 hover:text-white">
                  Our Mission
                </button>
              </li>
              <li>
                <button onClick={handleNav("/privacy-policy")} className="text-left text-base text-gray-300 hover:text-white">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={handleNav("/terms-of-service")} className="text-left text-base text-gray-300 hover:text-white">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={handleNav("/contact-us")} className="text-left text-base text-gray-300 hover:text-white">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} InternQuest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}