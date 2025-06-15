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
    <nav className="bg-white shadow-xl border-b-4 border-emparo-orange sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emparo-orange to-emparo-red rounded-full p-3 shadow-lg">
              <Flame className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="font-black text-2xl text-emparo-dark">EMPARO</h1>
              <p className="text-sm text-emparo-orange font-bold">PERI PERI</p>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection("home")} className="text-emparo-dark hover:text-emparo-orange transition-colors font-semibold">Home</button>
            <button onClick={() => scrollToSection("menu")} className="text-emparo-dark hover:text-emparo-orange transition-colors font-semibold">Menu</button>
            <button onClick={() => scrollToSection("about")} className="text-emparo-dark hover:text-emparo-orange transition-colors font-semibold">About</button>
            <button onClick={() => scrollToSection("gallery")} className="text-emparo-dark hover:text-emparo-orange transition-colors font-semibold">Gallery</button>
            <button onClick={() => scrollToSection("contact")} className="text-emparo-dark hover:text-emparo-orange transition-colors font-semibold">Contact</button>
          </div>
          
          {/* Order Button */}
          <div className="flex items-center space-x-4">
            <a href="tel:02034416940" className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-emparo-orange to-emparo-red hover:from-emparo-red hover:to-emparo-orange text-white px-6 py-3 rounded-full transition-all font-bold shadow-lg transform hover:scale-105">
              <Phone className="w-5 h-5" />
              <span>020 3441 6940</span>
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
          <div className="md:hidden mt-4 pb-4 border-t border-emparo-orange/20 bg-white">
            <div className="flex flex-col space-y-4 mt-4">
              <button onClick={() => scrollToSection("home")} className="text-emparo-dark hover:text-emparo-orange transition-colors text-left font-semibold">Home</button>
              <button onClick={() => scrollToSection("menu")} className="text-emparo-dark hover:text-emparo-orange transition-colors text-left font-semibold">Menu</button>
              <button onClick={() => scrollToSection("about")} className="text-emparo-dark hover:text-emparo-orange transition-colors text-left font-semibold">About</button>
              <button onClick={() => scrollToSection("gallery")} className="text-emparo-dark hover:text-emparo-orange transition-colors text-left font-semibold">Gallery</button>
              <button onClick={() => scrollToSection("contact")} className="text-emparo-dark hover:text-emparo-orange transition-colors text-left font-semibold">Contact</button>
              <a href="tel:02034416940" className="bg-gradient-to-r from-emparo-orange to-emparo-red text-white px-6 py-3 rounded-full text-center flex items-center justify-center space-x-2 font-bold shadow-lg">
                <Phone className="w-5 h-5" />
                <span>020 3441 6940</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
