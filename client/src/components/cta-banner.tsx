import { Button } from "@/components/ui/button";
import { Phone, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";

export default function CTABanner() {
  const [, setLocation] = useLocation();

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
          <h2 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl">
            <span className="text-emparo-dark">HUNGRY FOR</span> <span className="text-emparo-yellow drop-shadow-2xl">PERI PERI?</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 font-black drop-shadow-2xl max-w-3xl mx-auto text-emparo-dark">
            Order now and taste the authentic flame-grilled flavors that made us famous. 
            Fresh ingredients, bold spices, unbeatable taste!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => window.location.href = "tel:+442034416940"}
              className="bg-emparo-yellow text-emparo-dark hover:bg-emparo-yellow/90 text-xl font-bold px-8 py-4 h-auto shadow-2xl"
            >
              <Phone className="mr-3 w-6 h-6" />
              ORDER NOW: 020 3441 6940
            </Button>
            
            <Button 
              onClick={() => setLocation("/order")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-xl font-bold h-auto shadow-2xl"
            >
              <ShoppingCart className="mr-3 w-6 h-6" />
              Order Online
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}