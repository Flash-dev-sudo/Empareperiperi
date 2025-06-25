import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Star, Clock, MapPin, Phone, Flame, ArrowRight, ShoppingBag, ChevronRight, Award, Zap, Heart, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  const { data: menuItems = [] } = useQuery({
    queryKey: ['/api/menu'],
  });

  const [currentHero, setCurrentHero] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  const heroMessages = [
    { 
      title: "FLAME-GRILLED", 
      subtitle: "PERFECTION", 
      description: "Authentic Portuguese peri peri flavors that ignite your senses",
      color: "from-red-600 to-orange-500"
    },
    { 
      title: "FRESH", 
      subtitle: "INGREDIENTS", 
      description: "Premium quality chicken and spices, prepared to order daily",
      color: "from-orange-500 to-yellow-500"
    },
    { 
      title: "SPICE YOUR", 
      subtitle: "ADVENTURE", 
      description: "From mild to volcanic - find your perfect heat level",
      color: "from-yellow-500 to-red-600"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroMessages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredItems = menuItems.filter((item: any) => item.isCustomerFavorite === 1).slice(0, 6);
  const specialtyItems = menuItems.filter((item: any) => item.category === "Peri Peri Specialties").slice(0, 3);

  const getSpiceIndicator = (level: number) => {
    if (level === 0) return null;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: level }, (_, i) => (
          <Flame key={i} size={14} className="text-red-500 fill-current animate-pulse" />
        ))}
        <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
          {level === 1 ? "Mild" : level === 2 ? "Medium" : "Hot"}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Revolutionary Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Dynamic Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${heroMessages[currentHero].color} opacity-90 transition-all duration-1000`}></div>
          
          {/* Animated Shapes */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-red-400/15 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          
          {/* Particle Effect */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'animate-slideInUp' : 'opacity-0'}`}>
            {/* Brand Badge */}
            <div className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-full font-black text-lg mb-8 animate-glow">
              <Award className="mr-3" size={24} />
              LONDON'S MOST EXPLOSIVE PERI PERI
            </div>
            
            {/* Dynamic Title */}
            <div className="mb-8 relative">
              <h1 className="text-7xl lg:text-9xl font-black leading-tight mb-4">
                {heroMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-1000 transform ${
                      index === currentHero 
                        ? 'opacity-100 scale-100 translate-y-0' 
                        : 'opacity-0 scale-90 translate-y-8 absolute inset-0'
                    }`}
                  >
                    <span className="block text-white animate-textGlow">{msg.title}</span>
                    <span className="block gradient-text animate-pulse-custom">{msg.subtitle}</span>
                  </div>
                ))}
              </h1>
              <p className="text-2xl lg:text-4xl text-yellow-100 font-medium max-w-4xl mx-auto leading-relaxed">
                {heroMessages[currentHero].description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link href="/menu">
                <Button className="btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black text-2xl px-12 py-6 rounded-full shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-110 transition-all duration-300">
                  <Zap className="mr-3" size={28} />
                  ORDER NOW
                </Button>
              </Link>
              <a href="tel:02034416940">
                <Button className="btn-dynamic glass border-2 border-white/30 text-white hover:bg-white/20 font-black text-2xl px-12 py-6 rounded-full backdrop-blur-sm transform hover:scale-110 transition-all duration-300">
                  <Phone className="mr-3" size={24} />
                  020 3441 6940
                </Button>
              </a>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass p-6 rounded-2xl animate-fadeInScale">
                <Clock className="mx-auto mb-3 text-yellow-400" size={32} />
                <p className="font-bold text-lg">Daily 1PM - 4AM</p>
                <p className="text-gray-300">Late Night Dining</p>
              </div>
              <div className="glass p-6 rounded-2xl animate-fadeInScale" style={{animationDelay: '0.2s'}}>
                <MapPin className="mx-auto mb-3 text-yellow-400" size={32} />
                <p className="font-bold text-lg">Finsbury Park</p>
                <p className="text-gray-300">24 Blackstock Rd</p>
              </div>
              <div className="glass p-6 rounded-2xl animate-fadeInScale" style={{animationDelay: '0.4s'}}>
                <Heart className="mx-auto mb-3 text-yellow-400" size={32} />
                <p className="font-bold text-lg">5000+ Happy</p>
                <p className="text-gray-300">Customers Served</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {heroMessages.map((_, index) => (
            <button
              key={index}
              className={`transition-all duration-300 rounded-full ${
                index === currentHero 
                  ? 'w-12 h-4 bg-yellow-400 shadow-lg shadow-yellow-400/50' 
                  : 'w-4 h-4 bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => setCurrentHero(index)}
            />
          ))}
        </div>
      </div>

      {/* Customer Favorites - Completely New Design */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-slideInUp">
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 text-xl font-black mb-8 animate-pulse-custom">
              <TrendingUp className="mr-2" size={24} />
              CUSTOMER OBSESSIONS
            </Badge>
            <h2 className="text-6xl lg:text-8xl font-black mb-8">
              <span className="gradient-text">MOST CRAVED</span><br />
              <span className="text-white">FLAVORS</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              These dishes have achieved legendary status among our customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item: any, index: number) => (
              <Card key={item.id} className="group bg-gradient-to-br from-gray-800 to-black border-2 border-gray-700 rounded-3xl overflow-hidden hover:border-orange-500 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-orange-500/20">
                <div className="relative">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${
                    index % 3 === 0 ? 'from-red-900/50 to-transparent' :
                    index % 3 === 1 ? 'from-orange-900/50 to-transparent' :
                    'from-yellow-900/50 to-transparent'
                  } z-10`}></div>
                  
                  {/* Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden relative">
                    {item.image ? (
                      <img 
                        src={`/attached_assets/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-200 to-red-200">
                        <div className="text-center">
                          <div className="text-8xl mb-4 opacity-50">🔥</div>
                          <p className="text-gray-600 font-bold text-lg">Flavor Loading...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Popular Badge */}
                  <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-lg animate-glow">
                    <Star size={16} className="fill-current" />
                    VIRAL
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 left-4 z-20 glass-dark text-white px-4 py-2 rounded-full text-xl font-black">
                    £{item.price}
                  </div>
                </div>
                
                <CardContent className="p-8 relative">
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Badge className={`font-black text-sm px-3 py-1 ${
                          index % 3 === 0 ? 'bg-red-500/20 text-red-400 border border-red-500' :
                          index % 3 === 1 ? 'bg-orange-500/20 text-orange-400 border border-orange-500' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                        }`}>
                          {item.category}
                        </Badge>
                        {getSpiceIndicator(item.spice_level)}
                      </div>
                      <h3 className="font-black text-2xl text-white mb-3 line-clamp-2 group-hover:gradient-text transition-all duration-300">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-gray-400 leading-relaxed line-clamp-3">{item.description}</p>
                      )}
                    </div>
                    
                    <Link href="/menu">
                      <button className="w-full btn-dynamic bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-black py-4 rounded-2xl transition-all hover:scale-105 shadow-lg hover:shadow-xl text-lg transform active:scale-95">
                        ORDER THIS LEGEND
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/menu">
              <Button className="btn-dynamic bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-black px-16 py-6 rounded-full text-2xl shadow-2xl hover:shadow-red-500/50 transform hover:scale-110 transition-all duration-300">
                EXPLORE ALL FLAVORS <ChevronRight size={28} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Peri Peri Specialties */}
      <section className="py-20 bg-gradient-to-br from-red-900 via-orange-800 to-yellow-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-400 text-black px-8 py-4 text-xl font-black mb-8 animate-bounce">
              🌶️ SIGNATURE COLLECTION
            </Badge>
            <h2 className="text-6xl lg:text-8xl font-black mb-8 text-white">
              AUTHENTIC<br />
              <span className="text-yellow-300 animate-textGlow">PERI PERI</span>
            </h2>
            <p className="text-2xl text-orange-100 max-w-3xl mx-auto">
              Portuguese secrets perfected for London's boldest taste buds
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {specialtyItems.map((item: any, index: number) => (
              <Card key={item.id} className="glass-dark border border-white/20 rounded-3xl overflow-hidden hover:bg-white/20 transition-all duration-500 group transform hover:scale-105">
                <CardContent className="p-10">
                  <div className="text-center space-y-8">
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-yellow-500 rounded-3xl flex items-center justify-center animate-pulse-custom">
                        <span className="text-4xl">🔥</span>
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-yellow-500 rounded-3xl opacity-20 blur-lg"></div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white mb-4 group-hover:text-yellow-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-300 text-lg mb-6 leading-relaxed">{item.description}</p>
                      <div className="flex items-center justify-center space-x-6 mb-8">
                        <span className="text-4xl font-black text-yellow-400">£{item.price}</span>
                        {getSpiceIndicator(item.spice_level)}
                      </div>
                    </div>
                    <Link href="/menu">
                      <Button className="w-full btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-black py-4 rounded-2xl text-xl transform hover:scale-105 transition-all">
                        EXPERIENCE NOW
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-20 bg-black relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slideInLeft">
              <div>
                <Badge className="bg-yellow-400 text-black px-6 py-3 text-lg font-black mb-6">
                  📍 FIND THE FIRE
                </Badge>
                <h2 className="text-6xl font-black mb-6 text-white">
                  VISIT OUR<br />
                  <span className="gradient-text">FLAME TEMPLE</span>
                </h2>
                <p className="text-2xl text-gray-300 leading-relaxed">
                  Experience the authentic peri peri revolution in the heart of North London
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-6 p-6 glass-dark rounded-2xl">
                  <div className="bg-orange-500 p-4 rounded-2xl">
                    <MapPin size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-white mb-2">Location</h3>
                    <p className="text-gray-300 text-lg">24 Blackstock Rd, Finsbury Park<br />London N4 2DW</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-6 glass-dark rounded-2xl">
                  <div className="bg-red-500 p-4 rounded-2xl">
                    <Phone size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-white mb-2">Order Hotline</h3>
                    <p className="text-gray-300 text-lg">020 3441 6940</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 p-6 glass-dark rounded-2xl">
                  <div className="bg-yellow-500 p-4 rounded-2xl">
                    <Clock size={32} className="text-black" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-white mb-2">Hours</h3>
                    <p className="text-gray-300 text-lg">Daily: 1:00 PM - 4:00 AM<br />Late Night Cravings Satisfied</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:02034416940">
                  <Button className="btn-dynamic bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-black px-8 py-4 rounded-full text-xl transform hover:scale-105 transition-all">
                    <Phone className="mr-2" size={20} />
                    CALL NOW
                  </Button>
                </a>
                <Button className="btn-dynamic glass-dark border-2 border-white/30 text-white hover:bg-white/20 font-black px-8 py-4 rounded-full text-xl">
                  GET DIRECTIONS
                </Button>
              </div>
            </div>

            <div className="animate-slideInRight">
              <div className="glass-dark rounded-3xl p-10 border border-white/20">
                <h3 className="text-3xl font-black mb-8 text-center text-white">Order Information</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30">
                    <span className="font-bold text-white text-lg">Minimum Order</span>
                    <span className="text-yellow-400 font-black text-xl">£15.00</span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl border border-orange-500/30">
                    <span className="font-bold text-white text-lg">Delivery Fee</span>
                    <span className="text-yellow-400 font-black text-xl">£2.50</span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-2xl border border-yellow-500/30">
                    <span className="font-bold text-white text-lg">Delivery Time</span>
                    <span className="text-yellow-400 font-black text-xl">30-45 mins</span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-500/30">
                    <span className="font-bold text-white text-lg">Collection Time</span>
                    <span className="text-yellow-400 font-black text-xl">15-20 mins</span>
                  </div>
                </div>
                <Link href="/menu">
                  <Button className="w-full mt-8 btn-dynamic bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-black font-black py-6 rounded-2xl text-2xl transform hover:scale-105 transition-all">
                    🔥 START ORDERING 🔥
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}