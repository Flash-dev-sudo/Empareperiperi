import { Link, useLocation } from "wouter";
import { Phone, Menu as MenuIcon, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" }
  ];

  return (
    <nav className="bg-white shadow-xl sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-2xl">EP</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">EMPARO</h1>
                <p className="text-sm text-orange-600 font-bold tracking-wide">PERI PERI</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`px-4 py-2 text-lg font-bold cursor-pointer transition-all duration-200 ${
                    location === item.path
                      ? "text-orange-600 bg-orange-50 rounded-full"
                      : "text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-full"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-full">
              <Phone size={18} className="text-orange-600" />
              <span className="font-bold">020 3441 6940</span>
            </div>
            
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all">
              <Link href="/menu" className="flex items-center gap-2">
                <ShoppingBag size={18} />
                Order Now
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3"
            >
              {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-6">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`block px-4 py-3 text-lg font-bold cursor-pointer transition-colors rounded-xl ${
                      location === item.path
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              
              <div className="flex items-center space-x-2 text-gray-700 bg-gray-50 px-4 py-3 rounded-xl">
                <Phone size={18} className="text-orange-600" />
                <span className="font-bold">020 3441 6940</span>
              </div>
              
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg w-full">
                <Link href="/menu" className="flex items-center justify-center gap-2">
                  <ShoppingBag size={18} />
                  Order Now
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}