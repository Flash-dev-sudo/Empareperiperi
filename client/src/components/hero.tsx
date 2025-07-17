import { Button } from "@/components/ui/button";
import { Utensils, Phone, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import pizza1 from "@assets/ChatGPT Image May 18, 2025, 11_28_06 AM_1750005342083.png";

export default function Hero() {
  const [, setLocation] = useLocation();
  
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
            
            <div className="bg-emparo-dark rounded-3xl p-8 mb-10">
              <p className="text-2xl md:text-3xl font-bold text-emparo-yellow mb-4">Flame-Grilled Chicken</p>
              <p className="text-lg text-white font-medium mb-6">✓ Halal Certified • ✓ Fresh Daily • ✓ Authentic Spices</p>
              <p className="text-xl text-white leading-relaxed mb-6">
                Order now and taste the authentic flame-grilled flavors that made us famous. Fresh ingredients, bold spices, unbeatable taste!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => window.location.href = "tel:+442034416940"}
                  className="bg-emparo-yellow hover:bg-emparo-yellow/90 text-emparo-dark px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  ORDER NOW: 020 3441 6940
                </Button>
                <Button 
                  onClick={() => setLocation("/order")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg"
                >
                  <ShoppingCart className="mr-2 w-5 h-5" />
                  Order Online
                </Button>
              </div>
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