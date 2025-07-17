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
  },
  {
    name: "Grilled Peri Wrap",
    price: "£4.50",
    description: "Flame-grilled chicken wrapped in soft tortilla with fresh salad and peri peri sauce",
    image: "/attached_assets/ChatGPT Image May 22, 2025, 08_27_31 PM_1750005435412.png",
    spiceLevel: 1,
    badge: "Mild Spice"
  },
  {
    name: "Half Grilled Chicken",
    price: "£12.50",
    description: "Half chicken marinated overnight and grilled to perfection with authentic spices",
    image: "/attached_assets/ChatGPT Image May 22, 2025, 10_26_10 PM_1750005388243.png",
    spiceLevel: 2,
    badge: "Popular Choice"
  },
  {
    name: "Peri Peri Chips",
    price: "£3.00",
    description: "Crispy golden chips seasoned with our signature peri peri spice blend",
    image: "/attached_assets/ChatGPT Image May 22, 2025, 10_30_37 PM_1750005388243.png",
    spiceLevel: 1,
    badge: "Side Favorite"
  }
];

export default function FeaturedSpecialties() {
  return (
    <section id="menu" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-emparo-dark mb-4">
            <span className="text-emparo-orange">Best</span> Sellers
          </h2>
          <p className="text-xl text-emparo-dark max-w-2xl mx-auto font-semibold">
            Our most popular dishes - discover customer favorites grilled to perfection with authentic spices
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
