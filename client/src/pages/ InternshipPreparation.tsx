import React from "react";

export default function InternshipPreparation() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Internship Preparation
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Getting ready for your internship is key to making the most of the experience. Here are some tips to help you prepare:
        </p>
        <ul className="list-disc pl-8 space-y-4 text-gray-800 text-base leading-relaxed">
          <li>
            <span className="font-semibold text-blue-600">Resume Tips:</span> Craft a clear and concise resume that highlights your skills and achievements.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Interview Skills:</span> Practice common interview questions and learn to present yourself confidently.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Professional Etiquette:</span> Understand workplace norms, punctuality, and communication skills.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Goal Setting:</span> Define what you want to achieve during your internship to stay motivated and focused.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            For more detailed guidance, check out our <a href="/application-tips" className="text-blue-600 underline">Application Tips</a> page.
          </p>
        </div>
      </div>
    </main>
  );
}
