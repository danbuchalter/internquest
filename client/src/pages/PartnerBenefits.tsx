// src/pages/PartnerBenefits.tsx
import React from "react";

export default function PartnerBenefits() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Partner Benefits
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Partnering with InternQuest allows your company to connect with South Africa’s most driven young talent. Benefits include:
        </p>
        <ul className="list-disc pl-8 space-y-4 text-gray-800 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-600">Access top talent:</span> Reach a large, diverse pool of aspiring interns.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Boost your brand:</span> Increase visibility among South African youth.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Full support:</span> Get help promoting and managing your listings.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Priority candidates:</span> Enjoy early access to standout interns.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Make a difference:</span> Help grow youth careers and support economic development.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            Your partnership powers South Africa’s future workforce.
          </p>
        </div>
      </div>
    </main>
  );
}