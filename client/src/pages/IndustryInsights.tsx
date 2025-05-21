import React from "react";

export default function IndustryInsights() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Industry Insights
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Stay informed with the latest trends shaping internships and the future workforce.
        </p>
        <ul className="list-disc pl-8 space-y-4 text-gray-800 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-600">Emerging Skills:</span> Discover which skills employers are seeking in interns and graduates.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Internship Trends:</span> Insights into how internship programs are evolving in different sectors.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Workforce Development:</span> The role of internships in shaping the future workforce in South Africa.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Success Stories:</span> Case studies and examples of effective internship programs.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            Explore more on our{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Home
            </a>{" "}
            page.
          </p>
        </div>
      </div>
    </main>
  );
}
