// src/pages/TermsOfService.tsx
import React from "react";

export default function TermsOfService() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Terms of Service
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          By using InternQuest, you agree to use our platform ethically and respect other users.
        </p>
        <ul className="list-disc pl-8 space-y-4 text-gray-800 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-600">For Companies:</span> Listings must be truthful, inclusive, and professional.
          </li>
          <li>
            <span className="font-semibold text-blue-600">For Interns:</span> Apply in good faith, respecting the opportunity and communication expectations.
          </li>
          <li>
            <span className="font-semibold text-blue-600">General Conduct:</span> Harassment, dishonesty, or abuse of the platform is strictly prohibited.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Enforcement:</span> We reserve the right to remove any user who violates these terms.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            We’re here to build a trustworthy and empowering internship ecosystem.
          </p>
        </div>
      </div>
    </main>
  );
}