import { Button } from "@/components/ui/button";
import { Phone, Clock, Star } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-emparo-orange to-emparo-red text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 text-emparo-yellow mr-2" />
            <span className="text-sm font-semibold">Limited Time Offer</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl text-white">
            HUNGRY FOR <span className="text-emparo-yellow drop-shadow-2xl">PERI PERI?</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 font-bold drop-shadow-2xl max-w-3xl mx-auto text-white">
            Order now and taste the authentic flame-grilled flavors that made us famous. 
            Fresh ingredients, bold spices, unbeatable taste!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg"
              className="bg-emparo-yellow text-emparo-dark hover:bg-emparo-yellow/90 text-xl font-bold px-8 py-4 h-auto shadow-2xl"
              asChild
            >
              <a href="tel:02034416940">
                <Phone className="mr-3 w-6 h-6" />
                ORDER NOW: 020 3441 6940
              </a>
            </Button>
            
            <div className="flex items-center text-white/90">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-semibold">Open Daily 1PM - 4AM</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-8 mt-12 justify-center text-white/90">
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 fill-current text-emparo-yellow" />
              <span className="font-semibold">100% Halal Certified</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 fill-current text-emparo-yellow" />
              <span className="font-semibold">Fresh Daily Preparation</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2 fill-current text-emparo-yellow" />
              <span className="font-semibold">Authentic Peri Peri Spices</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}