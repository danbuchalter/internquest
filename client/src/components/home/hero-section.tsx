"use client";

import { Link } from "wouter";
import React from "react";

export default function HeroSection() {
  return (
    <div className="relative bg-white overflow-hidden min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-gray-800">InternQuest</div>
        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          <a href="#internships" className="hover:text-blue-600">
            Internships
          </a>
          <a href="#companies" className="hover:text-blue-600">
            For Companies
          </a>
          <a href="#howitworks" className="hover:text-blue-600">
            How It Works
          </a>
        </div>
        <div className="hidden md:flex gap-4">
          <Link href="/login">
            <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white">
              Log In
            </button>
          </Link>
          <Link href="/register">
            <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="text-gray-600 focus:outline-none">
            ☰
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Start Your Career</span>
                  <span className="block text-primary">With InternQuest</span>
                </h1>
                <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  The free platform connecting South African teens with internships that launch careers. Find opportunities that match your passion and build your professional future.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div>
                    <Link href="/internships" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10">
                      Find Internships
                    </Link>
                  </div>
                  <div>
                    <Link href="/post-internship" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary/80 bg-primary/10 hover:bg-primary/20 md:py-4 md:text-lg md:px-10">
                      Post Internships
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Hero Image */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
            alt="Diverse group of South African students collaborating on a project"
          />
        </div>
      </div>
    </div>
  );
}