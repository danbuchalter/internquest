import React from "react";

const testimonials = [
  {
    name: "Alex M.",
    title: "Intern at TechNova",
    quote:
      "InternQuest helped me land my first internship! The application process was smooth and easy.",
  },
  {
    name: "Zanele K.",
    title: "Marketing Intern",
    quote:
      "I never imagined finding an internship could be this stress-free. InternQuest is a game changer!",
  },
  {
    name: "Thabo S.",
    title: "Design Intern",
    quote:
      "Thanks to InternQuest, I got real experience and built a portfolio I’m proud of.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          What Our Interns Say
        </h2>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-700 italic">"{t.quote}"</p>
              <div className="mt-4 text-sm font-medium text-gray-900">
                — {t.name}, <span className="text-gray-500">{t.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}