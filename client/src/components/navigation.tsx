import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Menu, X, Phone, ShoppingCart, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleNavigation = (item: any) => {
    if (item.isCall) {
      window.location.href = item.path;
    } else if (item.path && item.path !== "/") {
      setLocation(item.path);
    } else if (item.path === "/") {
      setLocation("/");
    } else {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: "Home", id: "home", path: "/", isHome: true },
    { label: "Call Us", id: "call", path: "tel:+442075551234", isCall: true },
    { label: "Order Online", id: "order", path: "/order", isBubble: true }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => setLocation("/")}
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <div className="bg-emparo-orange p-3 rounded-2xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-emparo-dark">EMPARO</h1>
              <p className="text-sm text-emparo-orange font-bold -mt-1">PERI PERI</p>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={
                  item.isHome 
                    ? "text-emparo-dark hover:text-emparo-orange transition-colors p-2 rounded-full hover:bg-emparo-orange/10"
                    : item.isBubble 
                    ? "bg-emparo-orange hover:bg-emparo-orange/90 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
                    : item.isCall
                    ? "text-emparo-dark hover:text-emparo-orange font-semibold transition-colors flex items-center"
                    : "text-emparo-dark hover:text-emparo-orange font-semibold transition-colors"
                }
              >
                {item.isHome ? <Home className="w-5 h-5" /> : item.isCall ? <><Phone className="w-4 h-4 mr-2" />{item.label}</> : item.label}
              </button>
            ))}
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
                  onClick={() => handleNavigation(item)}
                  className={
                    item.isHome 
                      ? "text-emparo-dark hover:text-emparo-orange transition-colors text-left px-4 py-2 flex items-center space-x-3"
                      : item.isBubble 
                      ? "bg-emparo-orange hover:bg-emparo-orange/90 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg mx-4"
                      : item.isCall
                      ? "text-emparo-dark hover:text-emparo-orange font-semibold transition-colors text-left px-4 py-2 flex items-center space-x-3"
                      : "text-emparo-dark hover:text-emparo-orange font-semibold transition-colors text-left px-4 py-2"
                  }
                >
                  {item.isHome ? (
                    <>
                      <Home className="w-5 h-5" />
                      <span>{item.label}</span>
                    </>
                  ) : item.isCall ? (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{item.label}</span>
                    </>
                  ) : item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}