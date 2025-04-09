import { Link } from "wouter";

export default function CTASection() {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to start your journey?</span>
          <span className="block text-primary-200">Join InternQuest today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
          <div className="inline-flex rounded-md shadow">
            <Link href="/auth">
              <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50">
                Sign Up
              </a>
            </Link>
          </div>
          <div className="inline-flex rounded-md shadow">
            <Link href="/internships">
              <a className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-700">
                Learn More
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
