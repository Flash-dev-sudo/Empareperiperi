import { Link, useLocation } from "wouter";
import { Phone, Menu as MenuIcon } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌶️</span>
              </div>
              <div>
                <div className="font-bold text-gray-900">EMPARO</div>
                <div className="text-xs text-orange-500 font-medium">PERI PERI</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span
                  className={`px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                    location === item.path
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-700 hover:text-orange-500"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Phone Number Button */}
          <div className="hidden md:flex">
            <a
              href="tel:02034416940"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition-colors"
            >
              <Phone size={16} />
              <span className="font-medium">020 3441 6940</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-orange-500 p-2"
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`block px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                      location === item.path
                        ? "text-orange-500 bg-orange-50"
                        : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              <a
                href="tel:02034416940"
                className="block bg-orange-500 text-white px-3 py-2 rounded-lg text-center font-medium mt-4"
              >
                Call Now: 020 3441 6940
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}