import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Phone, Menu, X } from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-emparo-dark/95 backdrop-blur-sm text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-emparo-orange rounded-full p-2">
              <Flame className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-emparo-orange">EMPARO</h1>
              <p className="text-xs text-emparo-yellow">PERI PERI</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection("home")} className="hover:text-emparo-orange transition-colors">Home</button>
            <button onClick={() => scrollToSection("menu")} className="hover:text-emparo-orange transition-colors">Menu</button>
            <button onClick={() => scrollToSection("about")} className="hover:text-emparo-orange transition-colors">About</button>
            <button onClick={() => scrollToSection("gallery")} className="hover:text-emparo-orange transition-colors">Gallery</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-emparo-orange transition-colors">Contact</button>
          </div>
          
          {/* Order Button */}
          <div className="flex items-center space-x-4">
            <a href="tel:02034416940" className="hidden sm:flex items-center space-x-2 bg-emparo-orange hover:bg-emparo-orange-light px-4 py-2 rounded-full transition-colors">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">020 3441 6940</span>
            </a>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-emparo-orange hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-emparo-orange/20">
            <div className="flex flex-col space-y-3 mt-4">
              <button onClick={() => scrollToSection("home")} className="hover:text-emparo-orange transition-colors text-left">Home</button>
              <button onClick={() => scrollToSection("menu")} className="hover:text-emparo-orange transition-colors text-left">Menu</button>
              <button onClick={() => scrollToSection("about")} className="hover:text-emparo-orange transition-colors text-left">About</button>
              <button onClick={() => scrollToSection("gallery")} className="hover:text-emparo-orange transition-colors text-left">Gallery</button>
              <button onClick={() => scrollToSection("contact")} className="hover:text-emparo-orange transition-colors text-left">Contact</button>
              <a href="tel:02034416940" className="bg-emparo-orange text-white px-4 py-2 rounded-full text-center flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>020 3441 6940</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
