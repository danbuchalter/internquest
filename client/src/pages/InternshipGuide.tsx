// src/pages/InternshipGuide.tsx
import React from "react";

export default function InternshipGuide() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Internship Guide</h1>
      <p className="mb-4">
        InternQuest helps companies find talented interns. Here’s how to make the most of your listing:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Write a clear role description and required skills.</li>
        <li>Set realistic expectations on duration and stipend.</li>
        <li>Respond quickly to applicants and give feedback.</li>
        <li>Provide mentorship during the internship.</li>
      </ul>
    </div>
  );
}
