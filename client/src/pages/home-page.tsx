// home-page.tsx
import { useEffect } from "react";
import { Element, scroller } from "react-scroll";
import { useLocation } from "react-router-dom";

import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import HowItWorks from "@/components/home/how-it-works";
import FeaturedInternships from "@/components/home/featured-internships";
import ForCompanies from "@/components/home/for-companies";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";
import FAQSection from "@/components/home/faq-section";

export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const sectionName = location.hash.substring(1); // remove the '#' symbol
      scroller.scrollTo(sectionName, {
        duration: 500,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -100, // adjust this if your header overlaps
      });
    }
  }, [location]);

  return (
    <div className="w-full">
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <Element name="internships">
        <FeaturedInternships />
      </Element>
      <Element name="for-companies">
        <ForCompanies />
      </Element>
      <Element name="testimonials">
        <Testimonials />
      </Element>
      <FAQSection />
      <CTASection />
    </div>
  );
}