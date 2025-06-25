import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, Phone, MapPin, Clock, ShoppingBag, Zap, Flame } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location === path;

  return (
    <>
      {/* Dynamic Top Bar */}
      <div className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white py-3 relative z-50 animate-gradient">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 animate-pulse">
              <Phone size={18} className="animate-bounce" />
              <span className="font-bold">020 3441 6940</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Clock size={18} />
              <span className="font-medium">Daily: 1:00 PM - 4:00 AM</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <MapPin size={18} />
              <span className="font-medium">24 Blackstock Rd, Finsbury Park</span>
            </div>
          </div>
          <Badge className="bg-black text-yellow-400 font-black px-4 py-2 animate-pulse">
            🔥 FREE DELIVERY OVER £25 🔥
          </Badge>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-40 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl shadow-2xl shadow-orange-500/20 border-b border-orange-500/30' 
          : 'bg-black/80 backdrop-blur-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Revolutionary Logo */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-orange-500/50 transition-all group-hover:scale-110 animate-glow">
                  <Flame size={32} className="text-white animate-bounce" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-3xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-orange-400 transition-all">
                  EMPARO
                </h1>
                <p className="text-sm font-bold text-orange-400 -mt-1 tracking-wider">PERI PERI REVOLUTION</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <Button 
                  variant="ghost"
                  className={`font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 scale-110' 
                      : 'text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-orange-400'
                  }`}
                >
                  🏠 Home
                </Button>
              </Link>
              <Link href="/menu">
                <Button 
                  variant="ghost"
                  className={`font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 ${
                    isActive('/menu') 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50 scale-110' 
                      : 'text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-orange-400'
                  }`}
                >
                  <ShoppingBag className="mr-2" size={20} />
                  🔥 Menu
                </Button>
              </Link>
            </div>

            {/* Dynamic CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="tel:02034416940">
                <Button className="btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 transition-all animate-pulse-custom">
                  <Zap className="mr-2" size={20} />
                  ORDER NOW
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden p-3 text-white hover:bg-orange-500/20 rounded-full"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={32} /> : <Menu size={32} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-orange-500/30 shadow-2xl">
            <div className="px-6 py-10 space-y-8">
              <Link href="/">
                <Button 
                  variant="ghost"
                  className={`w-full justify-start font-black text-2xl py-6 rounded-2xl transition-all ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                      : 'text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-orange-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  🏠 Home
                </Button>
              </Link>
              <Link href="/menu">
                <Button 
                  variant="ghost"
                  className={`w-full justify-start font-black text-2xl py-6 rounded-2xl transition-all ${
                    isActive('/menu') 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' 
                      : 'text-white hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 hover:text-orange-400'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <ShoppingBag className="mr-4" size={28} />
                  🔥 Menu & Order
                </Button>
              </Link>
              
              <div className="pt-8 border-t border-orange-500/30 space-y-6">
                <div className="text-center space-y-4">
                  <p className="font-black text-white text-xl">🔥 CONTACT THE FIRE 🔥</p>
                  <p className="text-orange-400 font-black text-2xl animate-pulse">020 3441 6940</p>
                </div>
                <a href="tel:02034416940">
                  <Button className="w-full btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black py-6 rounded-2xl text-2xl shadow-2xl transform hover:scale-105 transition-all">
                    <Phone className="mr-3" size={24} />
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