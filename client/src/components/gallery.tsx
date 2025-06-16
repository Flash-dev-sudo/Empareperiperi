import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Award } from "lucide-react";

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
    category: "Pizza",
    rating: 5,
    likes: 124
  },
  {
    src: chicken1,
    alt: "Perfectly grilled peri peri chicken with authentic spices",
    category: "Chicken",
    rating: 5,
    likes: 89
  },
  {
    src: pizza2,
    alt: "Fresh stone-baked pizza with premium ingredients",
    category: "Pizza",
    rating: 4,
    likes: 156
  },
  {
    src: chicken2,
    alt: "Flame-grilled peri peri chicken pieces",
    category: "Chicken",
    rating: 5,
    likes: 203
  },
  {
    src: chicken3,
    alt: "Authentic peri peri chicken with traditional marinade",
    category: "Chicken",
    rating: 5,
    likes: 78
  },
  {
    src: chicken4,
    alt: "Grilled chicken with peri peri sauce and fresh sides",
    category: "Chicken",
    rating: 4,
    likes: 95
  }
];

export default function Gallery() {
  return (
    <section className="py-20 bg-emparo-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-emparo-dark mb-4">
            Our <span className="text-emparo-orange">Gallery</span>
          </h2>
          <p className="text-xl text-emparo-dark max-w-2xl mx-auto font-medium">
            Fresh ingredients, authentic flavors, and premium quality in every dish
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {galleryImages.map((image, index) => (
            <Card key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden border-0 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <div className="relative overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 left-4 bg-emparo-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {image.category}
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 rounded-full p-2 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-emparo-dark">{image.likes}</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 rounded-full p-2 flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < image.rating ? 'text-emparo-yellow fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            className="bg-emparo-orange hover:bg-emparo-orange/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Award className="mr-2 w-5 h-5" />
            Order Your Favorites
          </Button>
        </div>
      </div>
    </section>
  );
}