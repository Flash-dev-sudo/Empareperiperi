import { useQuery } from "@tanstack/react-query";
import { Star, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MenuPage() {
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['/api/menu'],
  });

  const categories = ["Peri Peri Specialties", "Starters", "Platters", "Mains", "Pizzas", "Chicken", "Milkshakes"];
  
  const getSpiceIndicator = (level: number) => {
    if (level === 0) return null;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: level }, (_, i) => (
          <Flame key={i} size={12} className="text-red-500" />
        ))}
        <span className="text-xs text-gray-600">
          {level === 1 ? "Mild" : level === 2 ? "Medium" : level === 3 ? "Hot" : "Extra Hot"}
        </span>
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Starters": "🍟",
      "Platters": "🍽️", 
      "Mains": "🍔",
      "Pizzas": "🍕",
      "Chicken": "🍗",
      "Milkshakes": "🥤",
      "Peri Peri Specialties": "🌶️"
    };
    return icons[category] || "🍽️";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-600 via-red-500 to-orange-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <Badge className="bg-yellow-400 text-black mb-6 text-lg font-bold px-6 py-2">
            FULL MENU
          </Badge>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight">
            OUR DELICIOUS<br/>
            <span className="text-yellow-400">MENU</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Authentic Peri Peri flavors, flame-grilled to perfection. Choose your spice level and enjoy the taste of Portugal in London.
          </p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {categories.map((category) => {
          const categoryItems = menuItems.filter((item: any) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="mb-12">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">{getCategoryIcon(category)}</span>
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-black text-gray-900">{category}</h2>
                  {category === "Peri Peri Specialties" && (
                    <p className="text-lg text-gray-600 font-medium">Our signature dishes with authentic peri peri flavors</p>
                  )}
                  {category === "Starters" && (
                    <p className="text-lg text-gray-600 font-medium">Perfect appetizers to start your meal</p>
                  )}
                  {category === "Mains" && (
                    <p className="text-lg text-gray-600 font-medium">Hearty burgers and main dishes</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {categoryItems.map((item: any) => (
                  <Card key={item.id} className="group hover:shadow-2xl transition-all duration-300 border-0 rounded-3xl overflow-hidden bg-white">
                    <div className="relative">
                      {/* Image */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
                        {item.image && (
                          <img 
                            src={`/attached_assets/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        {!item.image && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-6xl opacity-20">{getCategoryIcon(category)}</div>
                          </div>
                        )}
                      </div>
                      {/* Favorite Badge */}
                      {item.isCustomerFavorite === 1 && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                          <Star size={14} className="fill-current" />
                          Popular
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Badge className="bg-orange-100 text-orange-600 mb-3 font-semibold">
                            {item.category}
                          </Badge>
                          <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        
                        {getSpiceIndicator(item.spice_level)}
                        
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-3xl font-black text-gray-900">£{item.price}</span>
                          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-6 transform -rotate-2">
            ORDER NOW
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to Order?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Call us now for takeaway or delivery. Fresh, authentic peri peri flavors delivered to your door in Finsbury Park and surrounding areas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:02034416940"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-xl font-bold transition-all hover:scale-105 shadow-lg"
            >
              Call Now: 020 3441 6940
            </a>
            <div className="bg-white bg-opacity-10 px-8 py-4 rounded-full backdrop-blur-sm">
              <p className="text-white font-bold">Daily: 1:00 PM - 4:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}