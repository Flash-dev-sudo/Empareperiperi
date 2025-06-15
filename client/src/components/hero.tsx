import { Button } from "@/components/ui/button";
import { Utensils, Phone, Flame, Star } from "lucide-react";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-emparo-dark via-emparo-darker to-emparo-dark text-white min-h-screen flex items-center">
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            {/* Premium Badge */}
            <div className="inline-flex items-center bg-emparo-orange/20 backdrop-blur-sm border border-emparo-orange/30 px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4 text-emparo-yellow mr-2" />
              <span className="text-sm font-semibold text-emparo-orange">Premium Quality Since 2019</span>
            </div>
            
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none">
                <span className="text-emparo-orange drop-shadow-lg">EMPARO</span><br />
                <span className="text-emparo-yellow drop-shadow-lg">PERI PERI</span>
              </h1>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <p className="text-2xl md:text-3xl font-bold text-emparo-yellow mb-2">Fresh Stone Baked Pizza</p>
                <p className="text-lg text-emparo-orange font-semibold">Authentic Grilled Chicken & Peri Peri Specialties</p>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-light">
              Experience the authentic taste of flame-grilled peri peri chicken, fresh stone-baked pizzas, and mouth-watering specialties that will ignite your taste buds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Button 
                onClick={() => scrollToSection("menu")}
                className="bg-gradient-to-r from-emparo-orange to-emparo-red hover:from-emparo-red hover:to-emparo-orange px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl border-2 border-white/20"
              >
                <Utensils className="mr-3 w-6 h-6" />
                View Our Menu
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-emparo-yellow text-emparo-yellow hover:bg-emparo-yellow hover:text-emparo-dark px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105"
                asChild
              >
                <a href="tel:02034416940">
                  <Phone className="mr-3 w-6 h-6" />
                  Order Now: 020 3441 6940
                </a>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start">
              <div className="flex items-center text-emparo-orange">
                <Star className="w-5 h-5 mr-2 fill-current" />
                <span className="font-semibold">100% Halal</span>
              </div>
              <div className="flex items-center text-emparo-yellow">
                <Flame className="w-5 h-5 mr-2" />
                <span className="font-semibold">Fresh Daily</span>
              </div>
              <div className="flex items-center text-white">
                <Star className="w-5 h-5 mr-2 fill-current" />
                <span className="font-semibold">Premium Quality</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Main Hero Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img 
                src="@assets/ChatGPT Image May 22, 2025, 08_27_31 PM_1750005435412.png" 
                alt="Emparo's perfectly grilled peri peri chicken with flames - authentic flame-grilled experience" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            {/* Floating Offer Cards */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-emparo-yellow to-emparo-orange text-emparo-dark px-6 py-4 rounded-2xl font-black text-lg shadow-2xl animate-bounce-slow transform -rotate-12">
              <div className="flex items-center">
                <Flame className="mr-2 w-5 h-5" />
                SPICY DEALS!
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-emparo-red to-emparo-orange text-white px-6 py-4 rounded-2xl font-bold shadow-2xl transform rotate-6">
              <div className="flex items-center">
                <Star className="mr-2 w-5 h-5 fill-current" />
                <div>
                  <div className="text-sm">Open Daily</div>
                  <div className="text-lg font-black">1PM - 4AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
