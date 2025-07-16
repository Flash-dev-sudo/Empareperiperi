import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-emparo-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Visit <span className="text-emparo-orange">Us Today</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Come experience our authentic peri peri flavors at our Finsbury Park location
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-emparo-orange p-3 rounded-2xl">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emparo-dark mb-2">Our Location</h3>
                  <p className="text-emparo-dark/80 mb-4">
                    24 Blackstock Road<br />
                    Finsbury Park<br />
                    London N4 2DW
                  </p>
                  <Button 
                    className="bg-emparo-orange hover:bg-emparo-orange/90 text-white rounded-2xl"
                    asChild
                  >
                    <a 
                      href="https://maps.google.com/maps?q=24+Blackstock+Road,+Finsbury+Park,+London+N4+2DW" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Get Directions
                    </a>
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-emparo-orange p-3 rounded-2xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emparo-dark mb-2">Opening Hours</h3>
                  <div className="space-y-2 text-emparo-dark/80">
                    <p><span className="font-semibold">Monday - Sunday:</span> 1:00 PM - 4:00 AM</p>
                    <p className="text-sm text-emparo-orange font-semibold">Open Late Every Day!</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-emparo-orange p-3 rounded-2xl">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emparo-dark mb-2">Order Now</h3>
                  <p className="text-2xl font-black text-emparo-orange mb-2">020 3441 6940</p>
                  <Button 
                    className="bg-emparo-orange hover:bg-emparo-orange/90 text-white rounded-2xl"
                    asChild
                  >
                    <a href="tel:02034416940">Call to Order</a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Interactive Map */}
          <div className="relative">
            <Card className="bg-white rounded-3xl overflow-hidden shadow-lg h-full">
              <div className="h-full min-h-[500px] relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.7424789543997!2d-0.11030162342847156!3d51.56216797184234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761c7a8e0e3c25%3A0x1d1d1d1d1d1d1d1d!2s24%20Blackstock%20Rd%2C%20London%20N4%202DW%2C%20UK!5e0!3m2!1sen!2sus!4v1643723400000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '1.5rem' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Emparo Peri Peri Location"
                  className="absolute inset-0"
                />
                
                {/* Overlay with restaurant info */}
                <div className="absolute top-4 left-4 right-4 z-10">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-emparo-orange p-2 rounded-full">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-emparo-dark">Emparo Peri Peri</h3>
                        <p className="text-sm text-emparo-dark/70">24 Blackstock Road, Finsbury Park</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}