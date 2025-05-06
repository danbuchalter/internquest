// src/pages/ContactUs.tsx
import React from "react";

export default function ContactUs() {
  return (
    <main className="flex-grow bg-gradient-to-b from-white to-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-lg text-gray-700 mb-6 text-center">
          Have questions or need help? We’re here for you!
        </p>
        <ul className="text-gray-800 text-base leading-relaxed space-y-4">
          <li>
            <span className="font-semibold text-blue-600">Email Us:</span> 
            <a href="mailto:support@internquest.co.za" className="text-amber-500">
              support@internquest.co.za
            </a>
          </li>
          <li>
            <span className="font-semibold text-blue-600">Response Time:</span> We aim to respond to all inquiries within 24 hours.
          </li>
          <li>
            <span className="font-semibold text-blue-600">Support Hours:</span> Our team is available Monday to Friday, from 9 AM to 5 PM.
          </li>
        </ul>
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 italic">
            We’re committed to helping you with anything you need — just reach out!
          </p>
        </div>
      </div>
    </main>
  );
}