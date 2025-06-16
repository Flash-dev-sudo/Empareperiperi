import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Info, Navigation } from "lucide-react";

export default function ContactSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="contact" className="py-16 bg-emparo-dark text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Visit <span className="text-emparo-orange">Emparo</span>
          </h2>
          <p className="text-xl text-emparo-yellow">Find us, call us, or order online</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Location */}
          <div className="bg-emparo-darker rounded-2xl p-8 text-center">
            <div className="bg-emparo-orange rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <MapPin className="text-2xl text-white w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-emparo-orange">Location</h3>
            <div className="text-gray-300 leading-relaxed mb-4">
              <p>24 Blackstock Rd</p>
              <p>Finsbury Park</p>
              <p>London N4 2DW</p>
            </div>
            <Button className="bg-emparo-orange hover:bg-emparo-orange-light" asChild>
              <a href="https://maps.google.com/?q=24+Blackstock+Rd,+Finsbury+Park,+London+N4+2DW" target="_blank" rel="noopener noreferrer">
                <Navigation className="mr-2 w-4 h-4" />
                Get Directions
              </a>
            </Button>
          </div>
          
          {/* Contact */}
          <div className="bg-emparo-darker rounded-2xl p-8 text-center">
            <div className="bg-emparo-red rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Phone className="text-2xl text-white w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-emparo-orange">Order Now</h3>
            <p className="text-gray-300 mb-4">Call us for takeaway or delivery</p>
            <a href="tel:02034416940" className="text-2xl font-bold text-emparo-yellow hover:text-white transition-colors block mb-4">
              020 3441 6940
            </a>
            <Button className="bg-emparo-red hover:bg-emparo-red-light" asChild>
              <a href="tel:02034416940">
                <Phone className="mr-2 w-4 h-4" />
                Call Now
              </a>
            </Button>
          </div>
          
          {/* Hours */}
          <div className="bg-emparo-darker rounded-2xl p-8 text-center">
            <div className="bg-emparo-yellow rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Clock className="text-2xl text-emparo-dark w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-emparo-orange">Opening Hours</h3>
            <div className="text-gray-300 space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Daily</span>
                <span>1:00 PM - 4:00 AM</span>
              </div>
            </div>
            <div className="text-emparo-yellow font-semibold flex items-center justify-center">
              <Info className="mr-2 w-4 h-4" />
              Fresh food daily
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-emparo-orange to-emparo-red rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Ready to Experience Emparo?</h3>
            <p className="text-lg mb-6 opacity-90">Order now and taste the authentic flavors of peri peri cuisine</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-emparo-dark hover:bg-gray-100" asChild>
                <a href="tel:02034416940">
                  <Phone className="mr-2 w-4 h-4" />
                  Call to Order
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="bg-transparent border-2 border-white hover:bg-white hover:text-emparo-dark text-white"
                onClick={() => scrollToSection("menu")}
              >
                <MapPin className="mr-2 w-4 h-4" />
                View Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
