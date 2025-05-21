import React from "react";

export default function EmployerResources() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Employer Resources
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Create a meaningful internship experience using these employer-focused resources.
        </p>
        <ul className="list-disc pl-8 space-y-4 text-gray-800 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-600">Hosting Best Practices:</span> Tips on onboarding, mentoring, and supporting interns effectively.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Legal & Compliance:</span> Understand labor laws and regulations to ensure your internship program is compliant.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Maximizing Impact:</span> Strategies for making internships valuable for both your company and the intern.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Feedback & Evaluation:</span> How to provide meaningful feedback and assess intern performance.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            Learn more about hosting interns on our{" "}
            <a href="/partner-benefits" className="text-blue-600 hover:underline">
              Partner Benefits
            </a>{" "}
            page.
          </p>
        </div>
      </div>
    </main>
  );
}