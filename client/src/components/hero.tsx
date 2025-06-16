import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Utensils, Phone, Star, Flame } from "lucide-react";
import pizza1 from "@assets/ChatGPT Image May 18, 2025, 11_28_06 AM_1750005342083.png";

export default function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const heroTexts = [
    "Fresh Stone Baked Pizza",
    "Authentic Grilled Chicken",
    "Spicy Peri Peri Specialties"
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero-gradient min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className={`text-center lg:text-left transform transition-all duration-1000 ${
            isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none text-emparo-yellow hover:scale-105 transition-transform duration-300 cursor-pointer">
              PERI PERI
            </h1>
            
            <div className="bg-emparo-dark rounded-3xl p-8 mb-8 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="flex items-center mb-4">
                <Flame className="w-8 h-8 text-emparo-yellow mr-3 group-hover:animate-pulse" />
                <p className="text-2xl md:text-3xl font-bold text-emparo-yellow transition-all duration-300">
                  {heroTexts[currentTextIndex]}
                </p>
              </div>
              <p className="text-lg text-white font-medium">Authentic Grilled Chicken & Peri Peri Specialties</p>
              <div className="flex items-center mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-emparo-yellow fill-current mr-1" />
                ))}
                <span className="text-white ml-2 text-sm">4.9/5 Customer Rating</span>
              </div>
            </div>
            
            <div className="bg-emparo-dark rounded-3xl p-8 mb-10">
              <p className="text-xl text-white leading-relaxed">
                Experience the authentic taste of flame-grilled peri peri chicken, fresh stone-baked pizzas, and mouth-watering specialties that will ignite your taste buds.
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-6 justify-center lg:justify-start transform transition-all duration-1000 delay-300 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Button 
                onClick={() => scrollToSection("menu")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <Utensils className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                View Our Menu
              </Button>
              <Button 
                variant="outline"
                className="bg-emparo-yellow text-emparo-dark hover:bg-emparo-yellow/90 px-10 py-6 rounded-2xl text-xl font-bold border-2 border-emparo-yellow transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                asChild
              >
                <a href="tel:02034416940">
                  <Phone className="mr-3 w-6 h-6 group-hover:animate-pulse" />
                  Order Now: 020 3441 6940
                </a>
              </Button>
            </div>
          </div>
          
          {/* Right Content - Image */}
          <div className={`relative transform transition-all duration-1000 delay-500 ${
            isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group">
              <img 
                src={pizza1}
                alt="Emparo Peri Peri delicious pizza" 
                className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-emparo-dark font-bold text-lg">Fresh Daily</p>
                  <p className="text-emparo-dark/70 text-sm">Stone-baked to perfection</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-emparo-orange text-white p-3 rounded-full shadow-lg animate-bounce">
              <Flame className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-emparo-yellow text-emparo-dark p-3 rounded-full shadow-lg animate-pulse">
              <Star className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}