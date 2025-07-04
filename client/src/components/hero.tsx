import { Button } from "@/components/ui/button";
import { Utensils, Phone } from "lucide-react";
import pizza1 from "@assets/ChatGPT Image May 18, 2025, 11_28_06 AM_1750005342083.png";

export default function Hero() {
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
          <div className="text-center lg:text-left">
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none text-emparo-yellow">
              PERI PERI
            </h1>
            
            <div className="bg-emparo-dark rounded-3xl p-8 mb-8">
              <p className="text-2xl md:text-3xl font-bold text-emparo-yellow mb-4">Fresh Stone Baked Pizza</p>
              <p className="text-lg text-white font-medium">Authentic Grilled Chicken & Peri Peri Specialties</p>
            </div>
            
            <div className="bg-emparo-dark rounded-3xl p-8 mb-10">
              <p className="text-xl text-white leading-relaxed">
                Experience the authentic taste of flame-grilled peri peri chicken, fresh stone-baked pizzas, and mouth-watering specialties that will ignite your taste buds.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button 
                onClick={() => scrollToSection("menu")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all"
              >
                <Utensils className="mr-3 w-6 h-6" />
                View Our Menu
              </Button>
              <Button 
                variant="outline"
                className="bg-emparo-yellow text-emparo-dark hover:bg-emparo-yellow/90 px-10 py-6 rounded-2xl text-xl font-bold border-2 border-emparo-yellow transition-all"
                asChild
              >
                <a href="tel:02034416940">
                  <Phone className="mr-3 w-6 h-6" />
                  Order Now: 020 3441 6940
                </a>
              </Button>
            </div>
          </div>
          
          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={pizza1}
                alt="Emparo Peri Peri delicious pizza" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}