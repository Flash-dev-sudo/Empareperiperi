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
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl opacity-90">Discover our signature peri peri dishes, grilled to perfection with authentic spices and served fresh daily</p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {categories.map((category) => {
          const categoryItems = menuItems.filter((item: any) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div key={category} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{getCategoryIcon(category)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                  {category === "Peri Peri Specialties" && (
                    <p className="text-gray-600">Our signature dishes with authentic peri peri flavors</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item: any) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-orange-600">£{item.price}</span>
                          {item.isCustomerFavorite === 1 && (
                            <Badge variant="warning" className="flex items-center space-x-1">
                              <Star size={12} />
                              <span>Favorite</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center">
                        {getSpiceIndicator(item.spiceLevel)}
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
                          Add to Order
                        </button>
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
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-gray-300 mb-6">Call us now for takeaway or delivery</p>
          <a
            href="tel:02034416940"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors inline-block"
          >
            Call Now: 020 3441 6940
          </a>
        </div>
      </div>
    </div>
  );
}