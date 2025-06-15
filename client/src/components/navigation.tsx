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
    <nav className="bg-emparo-dark shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-emparo-orange rounded-full p-3 shadow-lg">
              <Flame className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="font-black text-3xl text-emparo-orange">EMPARO</h1>
              <p className="text-sm text-emparo-yellow font-bold tracking-wide">PERI PERI</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection("home")} className="text-white hover:text-emparo-orange transition-colors font-bold text-lg">HOME</button>
            <button onClick={() => scrollToSection("menu")} className="text-white hover:text-emparo-orange transition-colors font-bold text-lg">MENU</button>
            <button onClick={() => scrollToSection("about")} className="text-white hover:text-emparo-orange transition-colors font-bold text-lg">ABOUT</button>
            <button onClick={() => scrollToSection("gallery")} className="text-white hover:text-emparo-orange transition-colors font-bold text-lg">GALLERY</button>
            <button onClick={() => scrollToSection("contact")} className="text-white hover:text-emparo-orange transition-colors font-bold text-lg">CONTACT</button>
          </div>
          
          {/* Order Button */}
          <div className="flex items-center space-x-4">
            <a href="tel:02034416940" className="hidden sm:flex items-center space-x-3 bg-emparo-orange hover:bg-emparo-yellow text-emparo-dark px-8 py-4 rounded-full transition-all font-black text-lg shadow-2xl transform hover:scale-105 border-2 border-emparo-yellow">
              <Phone className="w-6 h-6" />
              <span>ORDER NOW</span>
            </a>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-emparo-orange hover:bg-emparo-orange hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-emparo-orange/20 bg-emparo-dark">
            <div className="flex flex-col space-y-4 mt-4">
              <button onClick={() => scrollToSection("home")} className="text-white hover:text-emparo-orange transition-colors text-left font-bold">HOME</button>
              <button onClick={() => scrollToSection("menu")} className="text-white hover:text-emparo-orange transition-colors text-left font-bold">MENU</button>
              <button onClick={() => scrollToSection("about")} className="text-white hover:text-emparo-orange transition-colors text-left font-bold">ABOUT</button>
              <button onClick={() => scrollToSection("gallery")} className="text-white hover:text-emparo-orange transition-colors text-left font-bold">GALLERY</button>
              <button onClick={() => scrollToSection("contact")} className="text-white hover:text-emparo-orange transition-colors text-left font-bold">CONTACT</button>
              <a href="tel:02034416940" className="bg-emparo-orange hover:bg-emparo-yellow text-emparo-dark px-6 py-3 rounded-full text-center flex items-center justify-center space-x-2 font-black shadow-lg">
                <Phone className="w-5 h-5" />
                <span>ORDER NOW</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
