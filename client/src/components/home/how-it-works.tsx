import { Link } from "wouter";
import { UserPlus, Search, Send } from "lucide-react";

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How InternQuest Works</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            A simple process to connect you with your perfect internship opportunity
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                <UserPlus size={24} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Create Your Profile</h3>
              <p className="mt-2 text-base text-gray-600">
                Sign up and build a profile showcasing your skills, interests, and educational background.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                <Search size={24} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Discover Opportunities</h3>
              <p className="mt-2 text-base text-gray-600">
                Browse and filter through internships that match your skills, location, and industry preferences.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary">
                <Send size={24} />
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Apply & Track</h3>
              <p className="mt-2 text-base text-gray-600">
                Submit applications directly through our platform and track your application status in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/auth" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600">
            Get Started Now
            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
