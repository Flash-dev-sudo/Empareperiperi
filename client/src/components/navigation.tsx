import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Menu, X, Phone } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ["home", "menu", "about", "contact"];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { label: "Home", id: "home" },
    { label: "Menu", id: "menu" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-xl' : 'bg-white shadow-lg'
    }`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection("home")}>
            <div className={`bg-emparo-orange p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:rotate-12 ${
              isScrolled ? 'p-2' : 'p-3'
            }`}>
              <Flame className={`text-white transition-all duration-300 ${
                isScrolled ? 'w-6 h-6' : 'w-8 h-8'
              }`} />
            </div>
            <div>
              <h1 className={`font-black text-emparo-dark transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              }`}>EMPARO</h1>
              <p className={`text-emparo-orange font-bold -mt-1 transition-all duration-300 ${
                isScrolled ? 'text-xs' : 'text-sm'
              }`}>PERI PERI</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-semibold transition-all duration-300 relative hover:scale-105 ${
                  activeSection === item.id 
                    ? 'text-emparo-orange' 
                    : 'text-emparo-dark hover:text-emparo-orange'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emparo-orange rounded-full"></div>
                )}
              </button>
            ))}
            <Button 
              className="bg-emparo-orange hover:bg-emparo-orange/90 text-white px-6 py-2 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg"
              asChild
            >
              <a href="tel:02034416940">
                <Phone className="mr-2 w-4 h-4 animate-pulse" />
                020 3441 6940
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="border-emparo-orange text-emparo-orange hover:bg-emparo-orange hover:text-white"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-emparo-orange/20 py-4">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-emparo-dark hover:text-emparo-orange font-semibold text-left transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                className="bg-emparo-orange hover:bg-emparo-orange/90 text-white px-6 py-3 rounded-2xl font-bold w-full mt-4"
                asChild
              >
                <a href="tel:02034416940">
                  <Phone className="mr-2 w-4 h-4" />
                  Call: 020 3441 6940
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}