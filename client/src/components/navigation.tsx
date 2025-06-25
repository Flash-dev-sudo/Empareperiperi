import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Phone, MapPin, Clock, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2 relative z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span className="font-medium">020 3441 6940</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Clock size={16} />
              <span className="font-medium">Daily: 1:00 PM - 4:00 AM</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <MapPin size={16} />
              <span className="font-medium">24 Blackstock Rd, Finsbury Park</span>
            </div>
          </div>
          <Badge className="bg-yellow-400 text-black font-bold px-3 py-1 animate-pulse">
            FREE DELIVERY OVER £25
          </Badge>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-2xl' 
          : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/50 transition-all group-hover:scale-110">
                  <span className="text-2xl font-black text-white">E</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">
                  EMPARO
                </h1>
                <p className="text-xs font-bold text-red-600 -mt-1">PERI PERI</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <Button 
                  variant={isActive('/') ? "default" : "ghost"}
                  className={`font-bold text-lg px-6 py-3 rounded-full transition-all ${
                    isActive('/') 
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                      : 'hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  Home
                </Button>
              </Link>
              <Link href="/menu">
                <Button 
                  variant={isActive('/menu') ? "default" : "ghost"}
                  className={`font-bold text-lg px-6 py-3 rounded-full transition-all ${
                    isActive('/menu') 
                      ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                      : 'hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <ShoppingBag className="mr-2" size={20} />
                  Menu
                </Button>
              </Link>
            </div>

            {/* Call to Action */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="tel:02034416940">
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-black px-6 py-3 rounded-full shadow-lg hover:shadow-yellow-400/50 transform hover:scale-105 transition-all">
                  ORDER NOW
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden p-2 hover:bg-red-50"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-2xl">
            <div className="px-6 py-8 space-y-6">
              <Link href="/">
                <Button 
                  variant={isActive('/') ? "default" : "ghost"}
                  className={`w-full justify-start font-bold text-xl py-4 rounded-2xl ${
                    isActive('/') 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'hover:bg-red-50 hover:text-red-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Button>
              </Link>
              <Link href="/menu">
                <Button 
                  variant={isActive('/menu') ? "default" : "ghost"}
                  className={`w-full justify-start font-bold text-xl py-4 rounded-2xl ${
                    isActive('/menu') 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'hover:bg-red-50 hover:text-red-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBag className="mr-3" size={24} />
                  Menu & Order
                </Button>
              </Link>
              
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="text-center space-y-2">
                  <p className="font-bold text-gray-900">Contact Us</p>
                  <p className="text-red-600 font-bold text-lg">020 3441 6940</p>
                </div>
                <a href="tel:02034416940">
                  <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-black py-4 rounded-2xl text-xl shadow-lg">
                    CALL TO ORDER
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}