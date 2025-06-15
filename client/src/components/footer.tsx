import { Flame } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-emparo-darker text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-emparo-orange rounded-full p-2">
                <Flame className="text-white w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-emparo-orange">EMPARO</h3>
                <p className="text-xs text-emparo-yellow">PERI PERI</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Authentic peri peri cuisine and fresh stone baked pizzas, made with love and served with passion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-emparo-orange hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-emparo-orange hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-emparo-orange hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-emparo-orange">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => scrollToSection("menu")} className="hover:text-white transition-colors">Our Menu</button></li>
              <li><button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => scrollToSection("gallery")} className="hover:text-white transition-colors">Gallery</button></li>
              <li><button onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-emparo-orange">Contact Info</h4>
            <div className="space-y-2 text-gray-400">
              <p><i className="fas fa-phone mr-2 text-emparo-orange"></i>020 8444 0040</p>
              <p><i className="fas fa-clock mr-2 text-emparo-orange"></i>Daily 4:00 PM - Late</p>
              <p><i className="fas fa-map-marker-alt mr-2 text-emparo-orange"></i>London, UK</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-emparo-dark pt-6 mt-8 text-center text-gray-400">
          <p>&copy; 2024 Emparo Peri Peri. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
