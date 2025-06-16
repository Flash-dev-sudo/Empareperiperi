import { Card } from "@/components/ui/card";
import { MapPin, Clock, Phone, Star } from "lucide-react";
import chicken1 from "@assets/ChatGPT Image May 19, 2025, 09_37_01 PM_1750005342085.png";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-5xl md:text-6xl font-black text-emparo-dark mb-6">
              Marinated <br />
              For <br />
              <span className="text-emparo-orange">24 Hours.</span>
            </h2>
            
            <p className="text-xl text-emparo-dark mb-6 font-medium">
              Marinated for twenty-four hours, steam cooked, grilled to order.
            </p>
            
            <p className="text-lg text-emparo-dark/80 mb-8 leading-relaxed">
              This is the secret behind our chicken. However, we also do so much more, including beef 
              burgers made from 99% British and Irish beef. Click below to find out more about our tasty 
              menu offerings.
            </p>
            
            <div className="bg-emparo-cream rounded-3xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-emparo-orange mr-3" />
                  <div>
                    <p className="font-bold text-emparo-dark">Location</p>
                    <p className="text-emparo-dark/70 text-sm">24 Blackstock Rd, N4 2DW</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-emparo-orange mr-3" />
                  <div>
                    <p className="font-bold text-emparo-dark">Hours</p>
                    <p className="text-emparo-dark/70 text-sm">Daily 1 PM–4 AM</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-emparo-orange mr-3" />
                  <div>
                    <p className="font-bold text-emparo-dark">Phone</p>
                    <p className="text-emparo-dark/70 text-sm">020 3441 6940</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Star className="w-6 h-6 text-emparo-orange mr-3" />
                  <div>
                    <p className="font-bold text-emparo-dark">Quality</p>
                    <p className="text-emparo-dark/70 text-sm">100% Halal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={chicken1}
                alt="Emparo's perfectly marinated peri peri chicken" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}