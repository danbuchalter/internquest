"use client";

import { Link } from "wouter";
import React from "react";

export default function HeroSection() {
  return (
    <div className="relative bg-white min-h-screen flex flex-col">
      <div className="flex-grow relative z-10 lg:flex">
        {/* Text Section */}
        <div className="lg:w-1/2 flex items-center justify-center px-6 py-20">
          <div>
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Start Your Career</span>
              <span className="block text-primary">With InternQuest</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              The free platform connecting South African teens with internships that launch careers. Find opportunities that match your passion and build your professional future.
            </p>
            <div className="mt-6">
              <Link
                href="/internships"
                className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
              >
                Find Internships
              </Link>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2">
          <img
            className="object-cover h-full w-full"
            src="https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
            alt="South African student writing in class"
          />
        </div>
      </div>
    </div>
  );
}