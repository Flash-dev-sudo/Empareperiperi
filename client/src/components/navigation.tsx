import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Menu, X, Phone } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-emparo-orange p-3 rounded-2xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-emparo-dark">EMPARO</h1>
              <p className="text-sm text-emparo-orange font-bold -mt-1">PERI PERI</p>
              <p className="text-xs text-blue-600 font-semibold -mt-1">DEV MODE</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-emparo-dark hover:text-emparo-orange font-semibold transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Button 
              className="bg-emparo-orange hover:bg-emparo-orange/90 text-white px-6 py-2 rounded-2xl font-bold"
              asChild
            >
              <a href="tel:02034416940">
                <Phone className="mr-2 w-4 h-4" />
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