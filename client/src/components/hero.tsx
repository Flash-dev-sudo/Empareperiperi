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
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--emparo-orange) 2px, transparent 2px), radial-gradient(circle at 75% 75%, var(--emparo-yellow) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="text-emparo-orange">EMPARO</span><br />
                <span className="text-emparo-yellow">PERI PERI</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-2">Fresh Stone Baked Pizza</p>
              <p className="text-lg text-emparo-orange font-semibold">Authentic Grilled Chicken & Peri Peri Specialties</p>
            </div>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Experience the authentic taste of flame-grilled peri peri chicken, fresh stone-baked pizzas, and mouth-watering specialties that will ignite your taste buds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                onClick={() => scrollToSection("menu")}
                className="bg-emparo-orange hover:bg-emparo-orange-light px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <Utensils className="mr-2" />
                View Menu
              </Button>
              <Button 
                variant="outline"
                className="bg-transparent border-2 border-emparo-yellow text-emparo-yellow hover:bg-emparo-yellow hover:text-emparo-dark px-8 py-4 rounded-full text-lg font-semibold transition-all"
                asChild
              >
                <a href="tel:02084440040">
                  <Phone className="mr-2" />
                  Order Now
                </a>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1527477396000-e27163b481c2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Delicious peri peri chicken wings" 
              className="rounded-2xl shadow-2xl w-full h-auto animate-pulse-slow" 
            />
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-emparo-yellow text-emparo-dark px-4 py-2 rounded-full font-bold animate-bounce-slow flex items-center">
              <Flame className="mr-1 w-4 h-4" />
              HOT!
            </div>
            <div className="absolute -bottom-4 -left-4 bg-emparo-red text-white px-4 py-2 rounded-full font-bold flex items-center">
              <Star className="mr-1 w-4 h-4" />
              Fresh Daily
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
