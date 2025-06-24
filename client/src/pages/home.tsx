import { useQuery } from "@tanstack/react-query";
import { Star, Clock, MapPin, Phone, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import heroImage from "@assets/ChatGPT Image May 18, 2025, 11_28_06 AM_1750005342083.png";

export default function Home() {
  const { data: menuItems = [] } = useQuery({
    queryKey: ['/api/menu'],
  });

  const specialtyItems = menuItems.filter((item: any) => 
    item.category === "Peri Peri Specialties" || item.isCustomerFavorite === 1
  ).slice(0, 3);

  const getSpiceIndicator = (level: number) => {
    if (level === 0) return null;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: level }, (_, i) => (
          <Flame key={i} size={12} className="text-red-500" />
        ))}
        <span className="text-xs text-gray-600">
          {level === 1 ? "Mild Spice" : level === 2 ? "Medium Spice" : "Hot Spice"}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-black bg-opacity-30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-4">
                  <Flame className="text-yellow-400" size={24} />
                  <span className="text-yellow-400 font-semibold">Authentic Grilled Chicken</span>
                </div>
                <h1 className="text-5xl font-bold mb-4">PERI PERI</h1>
                <p className="text-xl mb-4">Authentic Grilled Chicken & Peri Peri Specialties</p>
                <div className="flex items-center space-x-2 mb-6">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2">4.9/5 Customer Rating</span>
                </div>
                <p className="text-lg mb-8 opacity-90">
                  Experience the authentic taste of flame-grilled peri peri chicken, fresh stone-baked pizzas, and mouth-watering specialties that will ignite your taste buds.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Link href="/menu">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full sm:w-auto">
                      View Our Menu
                    </button>
                  </Link>
                  <a href="tel:02034416940">
                    <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors w-full sm:w-auto">
                      Order Now: 020 3441 6940
                    </button>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Delicious Peri Peri Chicken" 
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Peri Peri Specialties Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-orange-500">Peri Peri</span> Specialties
            </h2>
            <p className="text-xl text-gray-600">
              Discover our signature peri peri dishes, grilled to perfection with authentic spices and served fresh daily
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specialtyItems.map((item: any) => (
              <Card key={item.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-xl overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-4 left-4">
                    {item.isCustomerFavorite === 1 && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star size={12} className="mr-1" />
                        Customer Favourite
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                      Add to Order
                    </button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <span className="text-2xl font-bold text-orange-600">£{item.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  {getSpiceIndicator(item.spiceLevel)}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors">
                View Full Menu
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Menu Items */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Popular <span className="text-orange-500">Menu Items</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.slice(0, 8).map((item: any) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <span className="text-lg font-bold text-orange-600">£{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    {getSpiceIndicator(item.spiceLevel)}
                    <button className="text-orange-500 text-sm font-medium hover:text-orange-600">
                      Add
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Banner */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-orange-500 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Order Now</h3>
                <p className="text-lg mb-4">Ready to experience authentic peri peri flavors?</p>
                <a href="tel:02034416940">
                  <button className="bg-white text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Call to Order
                  </button>
                </a>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-2">020 3441 6940</div>
                <div className="flex items-center justify-end space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>Daily 1 PM - 4 AM</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>24 Blackstock Road, London</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}