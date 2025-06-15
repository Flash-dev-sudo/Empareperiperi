import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import FeaturedSpecialties from "@/components/featured-specialties";
import MenuShowcase from "@/components/menu-showcase";
import MenuSection from "@/components/menu-section";
import AboutSection from "@/components/about-section";
import Gallery from "@/components/gallery";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-emparo-cream text-emparo-dark">
      <Navigation />
      <Hero />
      <FeaturedSpecialties />
      <MenuShowcase />
      <MenuSection />
      <AboutSection />
      <Gallery />
      <ContactSection />
      <Footer />
    </div>
  );
}
