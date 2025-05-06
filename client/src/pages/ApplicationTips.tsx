// src/pages/ApplicationTips.tsx
import React from "react";

export default function ApplicationTips() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Application Tips
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          To improve your chances of getting an internship, follow these best practices:
        </p>
        <ul className="list-disc pl-8 space-y-4 text-gray-800 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-600">Customize your CV:</span> Tailor it to each opportunity.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Write a clear motivation letter:</span> Keep it concise and focused.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Highlight relevant skills:</span> Don’t forget volunteer work and extracurriculars.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Be professional:</span> Ensure professionalism in emails and communication.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Follow up:</span> A polite follow-up shows interest and determination.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            Your next opportunity could be one application away!
          </p>
        </div>
      </div>
    </main>
  );
}