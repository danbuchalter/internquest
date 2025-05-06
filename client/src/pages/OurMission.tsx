// src/pages/OurMission.tsx
import React from "react";

export default function OurMission() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Our Mission
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          At InternQuest, our mission is to bridge the gap between education and employment
          for South African youth. We empower young people by connecting them with internships
          that offer real-world experience and career growth.
        </p>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            Together, we’re helping the next generation thrive in the workforce.
          </p>
        </div>
      </div>
    </main>
  );
}