import { useEffect } from "react";
import { Element } from "react-scroll";
import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import HowItWorks from "@/components/home/how-it-works";
import FeaturedInternships from "@/components/home/featured-internships";
import ForCompanies from "@/components/home/for-companies";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";
import FAQSection from "@/components/home/faq-section";

export default function HomePage() {
  useEffect(() => {
    // Check if there’s a section we need to scroll to
    const urlHash = window.location.hash.replace("#", "");

    if (urlHash) {
      setTimeout(() => {
        const element = document.getElementById(urlHash);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // Give time for the page to render
    }
  }, []);

  return (
    <div className="w-full">
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <Element name="internships" id="internships">
        <FeaturedInternships />
      </Element>
      <Element name="for-companies" id="for-companies">
        <ForCompanies />
      </Element>
      <Element name="testimonials" id="testimonials">
        <Testimonials />
      </Element>
      <FAQSection />
      <CTASection />
    </div>
  );
}