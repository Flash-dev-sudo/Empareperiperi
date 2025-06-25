import { useQuery } from "@tanstack/react-query";
import { Star, Clock, MapPin, Phone, Flame, ArrowRight, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const { data: menuItems = [] } = useQuery({
    queryKey: ['/api/menu'],
  });

  const specialtyItems = menuItems.filter((item: any) => 
    item.category === "Peri Peri Specialties" || item.isCustomerFavorite === 1
  ).slice(0, 3);

  const featuredItems = menuItems.filter((item: any) => 
    item.image && item.image.length > 0
  ).slice(0, 6);

  const getSpiceIndicator = (level: number) => {
    if (level === 0) return null;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: level }, (_, i) => (
          <Flame key={i} size={12} className="text-red-500" />
        ))}
        <span className="text-xs text-gray-600">
          {level === 1 ? "Mild" : level === 2 ? "Medium" : "Hot"}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - McDonald's Style */}
      <div className="relative bg-gradient-to-br from-orange-600 via-red-500 to-orange-700 text-white overflow-hidden min-h-[70vh]">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[50vh]">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-yellow-400 text-black text-sm font-bold px-4 py-2 rounded-full">
                  🔥 AUTHENTIC PERI PERI
                </Badge>
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  THE NEW<br/>
                  <span className="text-yellow-400">BIG FLAVOUR</span><br/>
                  EXPERIENCE
                </h1>
                <p className="text-xl lg:text-2xl text-gray-100 max-w-md leading-relaxed">
                  Flame-grilled chicken with signature peri peri sauce. Three layers of spicy goodness in every bite.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold text-lg px-8 py-4 rounded-full">
                  <Link href="/menu" className="flex items-center gap-2">
                    Order Now <ShoppingBag size={20} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-bold text-lg px-8 py-4 rounded-full">
                  View Menu <ArrowRight size={20} />
                </Button>
              </div>
            </div>
            <div className="relative">
              {featuredItems.length > 0 && (
                <div className="relative">
                  <div className="absolute -inset-4 bg-yellow-400 rounded-3xl transform rotate-6 opacity-20"></div>
                  <img 
                    src={`/attached_assets/${featuredItems[0].image}`}
                    alt={featuredItems[0].name}
                    className="relative w-full max-w-lg mx-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section - Subway Style */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-600 mb-4">NEW ARRIVALS</Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
              GET WRAPPED UP IN<br/>
              <span className="text-orange-600">FLAVOUR</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get wrapped up in flavour with our delicious range. From Peri Peri Wings to Emparo Burgers, there's something for everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.slice(0, 4).map((item: any, index: number) => (
              <Card key={item.id} className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50">
                <div className={`h-3 ${index % 4 === 0 ? 'bg-red-500' : index % 4 === 1 ? 'bg-green-500' : index % 4 === 2 ? 'bg-yellow-500' : 'bg-purple-500'}`}></div>
                <CardContent className="p-6">
                  <div className="aspect-square mb-4 rounded-2xl overflow-hidden bg-gray-100">
                    {item.image && (
                      <img 
                        src={`/attached_assets/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    <Badge className={`${index % 4 === 0 ? 'bg-red-100 text-red-600' : index % 4 === 1 ? 'bg-green-100 text-green-600' : index % 4 === 2 ? 'bg-yellow-100 text-yellow-600' : 'bg-purple-100 text-purple-600'}`}>
                      {item.category}
                    </Badge>
                    <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    {getSpiceIndicator(item.spice_level)}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-2xl font-black text-gray-900">£{item.price}</span>
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 rounded-full">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Order Section - Domino's Style */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-6 transform -rotate-2">
              ORDER PERI PERI NEAR YOU
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-8">
              PERI PERI DELIVERY OR COLLECTION
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Welcome to Emparo Peri Peri, London's favourite peri peri takeaway! Get peri peri delivery near you, or collect from our Finsbury Park location.
            </p>
            
            <div className="max-w-lg mx-auto space-y-6">
              <div className="bg-white bg-opacity-10 rounded-3xl p-8 backdrop-blur-sm border border-white border-opacity-20 shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 text-center">How would you like to order?</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    🚚 DELIVERY
                  </Button>
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    🏪 COLLECT
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold py-4 px-8 rounded-2xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                    <Link href="/menu" className="flex items-center gap-3">
                      🍗 VIEW FULL MENU
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Contact Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-6">Visit Our Restaurant</h2>
                  <div className="bg-orange-50 rounded-2xl p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-500 p-3 rounded-xl">
                            <MapPin className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Address</h3>
                            <p className="text-gray-600">24 Blackstock Rd<br/>Finsbury Park<br/>London N4 2DW</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-500 p-3 rounded-xl">
                            <Phone className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Call Us</h3>
                            <p className="text-gray-600">020 3441 6940</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-500 p-3 rounded-xl">
                            <Clock className="text-white" size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-2">Opening Hours</h3>
                            <p className="text-gray-600">Daily: 1:00 PM - 4:00 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-8 text-white">
                <div className="flex items-center space-x-3 mb-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <h3 className="text-2xl font-bold mb-4">Customer Favourite</h3>
                <p className="text-orange-100 mb-6">
                  "Amazing peri peri chicken! The spice levels are perfect and the flavours are authentic. Best takeaway in Finsbury Park!"
                </p>
                <p className="font-semibold">- Sarah M.</p>
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl text-lg">
                <Link href="/menu" className="flex items-center justify-center gap-2">
                  Order Now <ShoppingBag size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
          </div>
        </div>
      </div>
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