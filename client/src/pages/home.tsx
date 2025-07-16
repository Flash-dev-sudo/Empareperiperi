import { useEffect } from "react";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import FeaturedSpecialties from "@/components/featured-specialties";
import MenuShowcase from "@/components/menu-showcase";
import CTABanner from "@/components/cta-banner";
import Gallery from "@/components/gallery";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-emparo-cream text-emparo-dark">
      <Navigation />
      <Hero />
      <FeaturedSpecialties />
      <MenuShowcase />
      <CTABanner />
      <Gallery />
      <ContactSection />
      <Footer />
    </div>
  );
}
