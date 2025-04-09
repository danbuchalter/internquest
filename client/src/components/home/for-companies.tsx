import { Link } from "wouter";
import { Users, Rocket, HandshakeIcon } from "lucide-react";

export default function ForCompanies() {
  return (
    <div id="for-companies" className="py-16 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full">
        <div className="h-full w-full bg-gradient-to-l from-primary/10 to-transparent opacity-70"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">For Companies</h2>
            <p className="mt-4 text-lg text-gray-600">
              Connect with talented, eager South African students ready to contribute to your organization
            </p>
            
            <div className="mt-8 space-y-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <Users size={20} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Access a Diverse Talent Pool</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Connect with motivated students from various backgrounds, skills, and educational paths.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <Rocket size={20} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Streamlined Recruiting</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Simplify your internship program with our easy-to-use platform for posting, reviewing, and managing applications.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    <HandshakeIcon size={20} />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Community Impact</h3>
                  <p className="mt-2 text-base text-gray-600">
                    Contribute to developing the next generation of South African professionals while addressing youth unemployment.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Link href="/post-internship" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600">
                Post an Internship
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="mt-10 lg:mt-0 lg:w-5/12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900">Join 300+ South African Companies</h3>
                  <p className="mt-2 text-sm text-gray-600">Companies that are investing in future talent</p>
                </div>
                
                <div className="mt-8 grid grid-cols-3 gap-8">
                  <div className="flex items-center justify-center h-12 opacity-60">
                    <div className="text-gray-400 font-semibold">TechSA</div>
                  </div>
                  <div className="flex items-center justify-center h-12 opacity-60">
                    <div className="text-gray-400 font-semibold">FinGroup</div>
                  </div>
                  <div className="flex items-center justify-center h-12 opacity-60">
                    <div className="text-gray-400 font-semibold">MediaPro</div>
                  </div>
                  <div className="flex items-center justify-center h-12 opacity-60">
                    <div className="text-gray-400 font-semibold">EduTech</div>
                  </div>
                  <div className="flex items-center justify-center h-12 opacity-60">
                    <div className="text-gray-400 font-semibold">HealthCo</div>
                  </div>
                  <div className="flex items-center justify-center h-12 opacity-60">
                    <div className="text-gray-400 font-semibold">RetailOne</div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <a href="#" className="text-green-500 hover:text-green-600 font-medium">
                    View all partner companies <span className="ml-1">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
