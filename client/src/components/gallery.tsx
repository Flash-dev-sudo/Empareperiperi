import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Facebook, Star } from "lucide-react";

// Import authentic food images
import pizza1 from "@assets/ChatGPT Image May 18, 2025, 11_28_06 AM_1750005342083.png";
import pizza2 from "@assets/ChatGPT Image May 18, 2025, 11_58_25 AM_1750005342083.png";
import chicken1 from "@assets/ChatGPT Image May 18, 2025, 12_05_21 PM_1750005342083.png";
import chicken2 from "@assets/ChatGPT Image May 18, 2025, 12_22_28 PM_1750005342083.png";
import chicken3 from "@assets/ChatGPT Image May 18, 2025, 12_32_31 PM_1750005342084.png";
import chicken4 from "@assets/ChatGPT Image May 18, 2025, 12_40_20 PM_1750005342084.png";

const galleryImages = [
  {
    src: pizza1,
    alt: "Emparo's signature stone-baked pizza with fresh toppings",
    category: "Pizza"
  },
  {
    src: chicken1,
    alt: "Perfectly grilled peri peri chicken with authentic spices",
    category: "Chicken"
  },
  {
    src: pizza2,
    alt: "Fresh stone-baked pizza with premium ingredients",
    category: "Pizza"
  },
  {
    src: chicken2,
    alt: "Flame-grilled peri peri chicken pieces",
    category: "Chicken"
  },
  {
    src: chicken3,
    alt: "Authentic peri peri chicken with traditional marinade",
    category: "Chicken"
  },
  {
    src: chicken4,
    alt: "Grilled chicken with peri peri sauce and fresh sides",
    category: "Chicken"
  }
];

export default function Gallery() {
  return (
    <section className="py-20 bg-emparo-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-emparo-dark mb-4">
            Follow us on our <span className="text-emparo-orange">Socials</span>
          </h2>
          <p className="text-xl text-emparo-dark max-w-2xl mx-auto font-medium">
            Check out our Instagram and Facebook pages to hear about our latest offers
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {galleryImages.map((image, index) => (
            <Card key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden border-0 transition-all duration-300 hover:shadow-xl group">
              <div className="relative overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute bottom-4 left-4 bg-emparo-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                  @Username
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full">
                  <Instagram className="w-5 h-5 text-emparo-orange" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all"
              asChild
            >
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Instagram className="mr-2 w-5 h-5" />
                Follow on Instagram
              </a>
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              asChild
            >
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Facebook className="mr-2 w-5 h-5" />
                Like on Facebook
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}