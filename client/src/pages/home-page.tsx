import HeroSection from "@/components/home/hero-section";
import StatsSection from "@/components/home/stats-section";
import HowItWorks from "@/components/home/how-it-works";
import FeaturedInternships from "@/components/home/featured-internships";
import ForCompanies from "@/components/home/for-companies";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";
import FAQSection from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturedInternships />
      <ForCompanies />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </div>
  );
}