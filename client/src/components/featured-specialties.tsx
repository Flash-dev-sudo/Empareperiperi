import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star } from "lucide-react";

const specialties = [
  {
    name: "Peri Peri Wings",
    price: "£4.20",
    description: "Flame-grilled chicken wings marinated in our signature peri peri sauce",
    image: "/attached_assets/ChatGPT Image May 22, 2025, 07_44_19 PM_1750005388242.png",
    spiceLevel: 3,
    badge: "Spicy Level"
  },
  {
    name: "Quarter Grilled Chicken",
    price: "£7.50",
    description: "Tender quarter chicken grilled with authentic peri peri spices",
    image: "/attached_assets/ChatGPT Image May 22, 2025, 10_07_25 PM_1750005388243.png",
    spiceLevel: 2,
    badge: "Medium Spice"
  },
  {
    name: "Peri Peri Burger",
    price: "£5.50",
    description: "Juicy chicken burger with fresh vegetables and signature peri peri sauce",
    image: "/attached_assets/ChatGPT Image May 19, 2025, 12_03_53 PM_1750005388240.png",
    spiceLevel: 0,
    badge: "Customer Favorite",
    isStarRating: true
  }
];

export default function FeaturedSpecialties() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-emparo-dark mb-4">
            <span className="text-emparo-orange">Peri Peri</span> Specialties
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our signature peri peri dishes, grilled to perfection with authentic spices and served fresh daily
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((item, index) => (
            <Card key={index} className="bg-emparo-cream rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-emparo-dark">{item.name}</h3>
                  <span className="bg-emparo-orange text-white px-3 py-1 rounded-full text-sm font-semibold">{item.price}</span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center">
                  {item.isStarRating ? (
                    <div className="flex items-center text-emparo-yellow">
                      {[...Array(3)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 mr-1 fill-current" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{item.badge}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-emparo-red">
                      {[...Array(item.spiceLevel)].map((_, i) => (
                        <Flame key={i} className="w-4 h-4 mr-1" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{item.badge}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
