import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Star, Clock, MapPin, Phone, Flame, ArrowRight, ShoppingBag, ChevronRight, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  const { data: menuItems = [] } = useQuery({
    queryKey: ['/api/menu'],
  });

  const [currentHero, setCurrentHero] = useState(0);
  const heroMessages = [
    { title: "FLAME-GRILLED", subtitle: "PERI PERI", description: "Authentic Portuguese flavors in every bite" },
    { title: "FRESH", subtitle: "INGREDIENTS", description: "Made to order with the finest quality" },
    { title: "SPICE YOUR", subtitle: "LIFE", description: "Choose your heat level - mild to extra hot" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const featuredItems = menuItems.filter((item: any) => item.isCustomerFavorite === 1).slice(0, 4);
  const specialtyItems = menuItems.filter((item: any) => item.category === "Peri Peri Specialties").slice(0, 3);

  const getSpiceIndicator = (level: number) => {
    if (level === 0) return null;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: level }, (_, i) => (
          <Flame key={i} size={12} className="text-red-500 fill-current" />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <div className="relative h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-400/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center bg-yellow-400 text-black px-6 py-3 rounded-full font-bold text-sm animate-bounce">
                <Award className="mr-2" size={18} />
                LONDON'S #1 PERI PERI RESTAURANT
              </div>
              
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-black leading-tight">
                  {heroMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-1000 ${
                        index === currentHero ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 absolute'
                      }`}
                    >
                      {msg.title}<br />
                      <span className="text-yellow-300">{msg.subtitle}</span>
                    </div>
                  ))}
                </h1>
                <p className="text-2xl text-yellow-100 font-medium max-w-lg">
                  {heroMessages[currentHero].description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-xl px-10 py-6 rounded-full shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105 transition-all">
                  <Link href="/menu" className="flex items-center gap-3">
                    ORDER NOW <ShoppingBag size={24} />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-xl px-10 py-6 rounded-full backdrop-blur-sm">
                  <Phone className="mr-2" size={20} />
                  CALL: 020 3441 6940
                </Button>
              </div>

              <div className="flex items-center gap-8 text-yellow-100">
                <div className="flex items-center gap-2">
                  <Clock size={20} />
                  <span className="font-medium">Daily 1PM - 4AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={20} />
                  <span className="font-medium">Finsbury Park</span>
                </div>
              </div>
            </div>

            {/* Right Content - Featured Item */}
            <div className="hidden lg:block">
              {featuredItems.length > 0 && (
                <div className="relative">
                  <div className="absolute -inset-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl opacity-20 blur-2xl"></div>
                  <Card className="relative bg-white/95 backdrop-blur-sm border-0 rounded-3xl shadow-2xl p-8 hover:shadow-yellow-400/20 transition-all">
                    <div className="text-center space-y-6">
                      <Badge className="bg-red-500 text-white px-4 py-2 text-lg font-bold">
                        CUSTOMER FAVOURITE
                      </Badge>
                      <div className="aspect-square w-64 mx-auto bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl overflow-hidden">
                        {featuredItems[0].image && (
                          <img 
                            src={`/attached_assets/${featuredItems[0].image}`}
                            alt={featuredItems[0].name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">{featuredItems[0].name}</h3>
                        <p className="text-gray-600 mb-4">{featuredItems[0].description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-black text-red-600">£{featuredItems[0].price}</span>
                          {getSpiceIndicator(featuredItems[0].spice_level)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroMessages.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentHero ? 'bg-yellow-400 w-8' : 'bg-white/50'
              }`}
              onClick={() => setCurrentHero(index)}
            />
          ))}
        </div>
      </div>

      {/* Featured Products - McDonald's Style */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-red-100 text-red-600 px-6 py-3 text-lg font-bold mb-6">
              CUSTOMER FAVOURITES
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              MOST LOVED<br />
              <span className="text-red-600">DISHES</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover why thousands of customers keep coming back for these incredible flavors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map((item: any, index: number) => (
              <Card key={item.id} className="group border-0 rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                <div className="relative">
                  <div className={`h-2 ${index % 4 === 0 ? 'bg-red-500' : index % 4 === 1 ? 'bg-yellow-500' : index % 4 === 2 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                  <div className="p-6">
                    <div className="aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
                      {item.image ? (
                        <img 
                          src={`/attached_assets/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl opacity-30">🍗</div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={`${index % 4 === 0 ? 'bg-red-100 text-red-600' : index % 4 === 1 ? 'bg-yellow-100 text-yellow-600' : index % 4 === 2 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'} font-bold`}>
                          {item.category}
                        </Badge>
                        {getSpiceIndicator(item.spice_level)}
                      </div>
                      <h3 className="font-black text-xl text-gray-900 group-hover:text-red-600 transition-colors">{item.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-2xl font-black text-gray-900">£{item.price}</span>
                        <Button size="sm" className="bg-red-500 hover:bg-red-600 rounded-full font-bold">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-bold px-12 py-6 rounded-full text-xl shadow-xl">
              <Link href="/menu" className="flex items-center gap-3">
                VIEW FULL MENU <ChevronRight size={24} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Specialty Section - Subway Style */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-400 text-black px-6 py-3 text-lg font-bold mb-6">
              SIGNATURE COLLECTION
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-black mb-6">
              PERI PERI<br />
              <span className="text-yellow-400">SPECIALTIES</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Authentic Portuguese recipes passed down through generations, perfected for London
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {specialtyItems.map((item: any, index: number) => (
              <Card key={item.id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 transition-all duration-300 group">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto">
                      <span className="text-3xl">🌶️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-yellow-400 transition-colors">{item.name}</h3>
                      <p className="text-gray-300 mb-4">{item.description}</p>
                      <div className="flex items-center justify-center space-x-4">
                        <span className="text-3xl font-black text-yellow-400">£{item.price}</span>
                        {getSpiceIndicator(item.spice_level)}
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-bold py-4 rounded-2xl text-lg">
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Contact - Domino's Style */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="bg-yellow-400 text-black px-6 py-3 text-lg font-bold mb-6">
                  VISIT US TODAY
                </Badge>
                <h2 className="text-5xl font-black mb-6">
                  FIND US IN<br />
                  <span className="text-yellow-300">FINSBURY PARK</span>
                </h2>
                <p className="text-xl text-red-100 mb-8">
                  Experience authentic peri peri flavors in the heart of North London. We're open late for your convenience.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Address</h3>
                    <p className="text-red-100">24 Blackstock Rd, Finsbury Park<br />London N4 2DW</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone</h3>
                    <p className="text-red-100">020 3441 6940</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Hours</h3>
                    <p className="text-red-100">Daily: 1:00 PM - 4:00 AM</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-4 rounded-full">
                  Get Directions
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold px-8 py-4 rounded-full">
                  Call Now
                </Button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-2xl font-black mb-6 text-center">Order Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl">
                  <span className="font-bold">Minimum Order</span>
                  <span className="text-yellow-300">£15.00</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl">
                  <span className="font-bold">Delivery Fee</span>
                  <span className="text-yellow-300">£2.50</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl">
                  <span className="font-bold">Delivery Time</span>
                  <span className="text-yellow-300">30-45 mins</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-2xl">
                  <span className="font-bold">Collection Time</span>
                  <span className="text-yellow-300">15-20 mins</span>
                </div>
              </div>
              <Button className="w-full mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-bold py-4 rounded-2xl text-lg">
                <Link href="/menu">
                  START YOUR ORDER
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}