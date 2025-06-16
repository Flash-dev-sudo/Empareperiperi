import { Flame, MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-emparo-dark text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emparo-orange p-3 rounded-2xl">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">EMPARO</h1>
                <p className="text-sm text-emparo-orange font-bold -mt-1">PERI PERI</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              Authentic peri peri flavors, fresh stone-baked pizzas, and premium quality ingredients since 2019.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-white/80">
              <li><a href="#home" className="hover:text-emparo-orange transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-emparo-orange transition-colors">Menu</a></li>
              <li><a href="#about" className="hover:text-emparo-orange transition-colors">About</a></li>
              <li><a href="#contact" className="hover:text-emparo-orange transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <div className="space-y-4 text-white/80">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emparo-orange mt-1" />
                <div>
                  <p>24 Blackstock Road</p>
                  <p>Finsbury Park, London N4 2DW</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emparo-orange" />
                <a href="tel:02034416940" className="hover:text-emparo-orange transition-colors">020 3441 6940</a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-emparo-orange" />
                <p>Daily 1 PM – 4 AM</p>
              </div>
            </div>
          </div>
          
          {/* Follow Us */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Follow Us</h3>
            <p className="text-white/80 mb-4">Stay updated with our latest offers and new menu items</p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>
              <a 
                href="#" 
                className="bg-blue-600 p-3 rounded-2xl hover:bg-blue-700 transition-all"
              >
                <Facebook className="w-6 h-6 text-white" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © 2024 Emparo Peri Peri. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-white/60">
              <a href="#" className="hover:text-emparo-orange transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-emparo-orange transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}