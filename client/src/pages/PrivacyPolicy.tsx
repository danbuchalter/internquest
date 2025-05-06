// src/pages/PrivacyPolicy.tsx
import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          InternQuest values your privacy and is committed to protecting your personal information.
        </p>
        <ul className="list-disc pl-8 space-y-4 text-gray-800 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-600">Data Collection:</span> We collect only essential information to improve our platform and match users with internships.
          </li>
          <li>
            <span className="font-semibold text-blue-600">No Selling or Sharing:</span> We do not sell or share your data with third parties without your consent.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Data Access:</span> You can request access to your data or ask us to delete your account anytime by contacting us.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            Your privacy is our priority — we’re here to keep your data safe and secure.
          </p>
        </div>
      </div>
    </main>
  );
}