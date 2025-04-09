import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from "lucide-react";

export default function Footer() {
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
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
                
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">For Students</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/internships" className="text-base text-gray-300 hover:text-white">
                  Browse Internships
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-base text-gray-300 hover:text-white">
                  Create Profile
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">Application Tips</a>
              </li>
              <li>
                <Link href="/#testimonials" className="text-base text-gray-300 hover:text-white">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
                
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">For Companies</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/post-internship" className="text-base text-gray-300 hover:text-white">
                  Post Internships
                </Link>
              </li>
              <li>
                <Link href="/company/dashboard" className="text-base text-gray-300 hover:text-white">
                  Company Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">Internship Guide</a>
              </li>
              <li>
                <Link href="/#for-companies" className="text-base text-gray-300 hover:text-white">
                  Partner Benefits
                </Link>
              </li>
            </ul>
          </div>
                
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">Our Mission</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white">Contact Us</a>
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
