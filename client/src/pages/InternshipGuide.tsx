// src/pages/InternshipGuide.tsx
import React from "react";

export default function InternshipGuide() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Internship Guide
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          InternQuest helps companies find talented interns. Here’s how to make the most of your listing:
        </p>
        <ul className="list-disc pl-8 space-y-4 text-gray-800 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-600">Craft a clear role description:</span> Highlight the responsibilities and required skills.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Set expectations:</span> Clearly mention duration, work setup, and any stipend or benefits.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Communicate fast:</span> Respond to applications promptly and provide constructive feedback.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Offer mentorship:</span> Provide guidance, check-ins, and support throughout the internship.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            Empower the next generation — one internship at a time.
          </p>
        </div>
      </div>
    </main>
  );
}
