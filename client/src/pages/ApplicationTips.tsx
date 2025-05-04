// src/pages/ApplicationTips.tsx
import React from "react";

export default function ApplicationTips() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Application Tips</h1>
      <p className="mb-4">
        To improve your chances of getting an internship, follow these best practices:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Customize your CV for each opportunity.</li>
        <li>Write a clear, concise motivation letter.</li>
        <li>Highlight relevant skills and volunteer work.</li>
        <li>Be professional in emails and communication.</li>
        <li>Follow up after submitting your application.</li>
      </ul>
    </div>
  );
}
