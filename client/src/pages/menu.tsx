import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, ShoppingCart, Flame, Star, Filter, X, Zap, Target, Crown, Lightning } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  category: string;
}

export default function MenuPage() {
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['/api/menu'],
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { toast } = useToast();

  const categories = ["All", ...Array.from(new Set(menuItems.map((item: any) => item.category)))];

  const filteredItems = selectedCategory === "All" 
    ? menuItems 
    : menuItems.filter((item: any) => item.category === selectedCategory);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({
      title: "ADDED TO CART!",
      description: `${item.name} is ready for takeoff!`,
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

  const getSpiceIndicator = (level: number) => {
    if (level === 0) return null;
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: level }, (_, i) => (
          <Flame key={i} size={16} className="text-red-500 fill-current animate-pulse" />
        ))}
        <span className="text-xs font-black text-red-600 uppercase tracking-wide">
          {level === 1 ? "MILD" : level === 2 ? "MEDIUM" : "VOLCANIC"}
        </span>
      </div>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Starters": "🚀",
      "Platters": "👑", 
      "Mains": "⚡",
      "Pizzas": "🔥",
      "Chicken": "💥",
      "Milkshakes": "🌟",
      "Peri Peri Specialties": "💎"
    };
    return icons[category] || "🎯";
  };

  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    orderType: "delivery",
    deliveryAddress: "",
    notes: "",
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...orderForm,
          orderItems: cart,
          totalAmount: getCartTotal(),
        }),
      });

      if (response.ok) {
        toast({
          title: "ORDER LAUNCHED!",
          description: "Your flavor journey begins now!",
        });
        setCart([]);
        setShowOrderForm(false);
        setOrderForm({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          orderType: "delivery",
          deliveryAddress: "",
          notes: "",
        });
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      toast({
        title: "Launch Failed",
        description: "Mission control needs you to try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-transparent border-t-red-500 border-r-orange-500 border-b-yellow-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-red-500 opacity-20"></div>
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent mb-2">
            LOADING FLAVORS
          </h2>
          <p className="text-gray-400 font-bold">Preparing your taste adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Explosive Hero Section */}
      <div className="relative min-h-[60vh] bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex items-center justify-center h-full py-20">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center bg-black/50 backdrop-blur-lg text-yellow-400 px-8 py-4 rounded-full font-black text-xl mb-8 animate-bounce">
              <Target className="mr-3" size={28} />
              FLAVOR COMMAND CENTER
            </div>
            
            <h1 className="text-7xl lg:text-9xl font-black mb-8 leading-tight">
              <span className="block text-white animate-textGlow">CHOOSE YOUR</span>
              <span className="block gradient-text animate-pulse-custom">WEAPON</span>
            </h1>
            
            <p className="text-3xl lg:text-4xl text-yellow-100 max-w-5xl mx-auto leading-relaxed font-bold">
              Every dish is a flavor explosion waiting to happen
            </p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 text-6xl animate-float">🔥</div>
        <div className="absolute top-40 right-32 text-6xl animate-float" style={{animationDelay: '1s'}}>⚡</div>
        <div className="absolute bottom-32 left-1/4 text-6xl animate-float" style={{animationDelay: '2s'}}>💥</div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          {/* Menu Content */}
          <div className="xl:col-span-3">
            {/* Revolutionary Category Filter */}
            <div className="mb-16">
              <div className="flex items-center gap-6 mb-10">
                <div className="relative">
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 p-4 rounded-3xl animate-glow">
                    <Filter className="text-white" size={36} />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl opacity-30 blur-lg animate-pulse"></div>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black gradient-text">MISSION CATEGORIES</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {categories.map((category, index) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className={`relative overflow-hidden rounded-2xl font-black text-base px-6 py-6 transition-all transform hover:scale-110 ${
                      selectedCategory === category 
                        ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-2xl shadow-red-500/50 scale-110" 
                        : "bg-gray-800 text-gray-300 hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 hover:text-white border-2 border-gray-700 hover:border-orange-500"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{category === "All" ? "🎯" : getCategoryIcon(category)}</span>
                      <span className="text-xs">{category}</span>
                    </div>
                    {selectedCategory === category && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 animate-pulse"></div>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dynamic Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item: any, index: number) => (
                <Card key={item.id} className="group relative bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-3xl overflow-hidden hover:border-orange-500 transition-all duration-500 hover:-translate-y-6 hover:shadow-2xl hover:shadow-orange-500/30 transform">
                  {/* Animated Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  <div className="absolute inset-[2px] bg-gradient-to-br from-gray-900 to-black rounded-3xl"></div>
                  
                  <div className="relative z-10">
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-red-100 relative">
                        {item.image ? (
                          <img 
                            src={`/attached_assets/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-200 to-red-200">
                            <div className="text-center">
                              <div className="text-8xl mb-4 opacity-60 animate-bounce">{getCategoryIcon(item.category)}</div>
                              <p className="text-gray-600 font-black text-lg">FLAVOR INCOMING</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Epic Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Status Badges */}
                      {item.isCustomerFavorite === 1 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-2xl animate-glow">
                          <Crown size={18} className="fill-current" />
                          LEGENDARY
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 glass-dark text-white px-4 py-2 rounded-full text-xl font-black backdrop-blur-lg">
                        £{item.price}
                      </div>
                      
                      <div className="absolute bottom-4 left-4 bg-gradient-to-r from-black/80 to-gray-800/80 backdrop-blur-lg text-white px-3 py-1 rounded-full text-sm font-black">
                        {item.category}
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <CardContent className="p-8 relative">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <Badge className={`font-black text-sm px-3 py-1 ${
                              index % 4 === 0 ? 'bg-red-500/20 text-red-400 border border-red-500' :
                              index % 4 === 1 ? 'bg-orange-500/20 text-orange-400 border border-orange-500' :
                              index % 4 === 2 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500' :
                              'bg-purple-500/20 text-purple-400 border border-purple-500'
                            }`}>
                              <Lightning className="mr-1" size={12} />
                              {item.category}
                            </Badge>
                            {getSpiceIndicator(item.spice_level)}
                          </div>
                          
                          <h3 className="font-black text-2xl text-white mb-4 line-clamp-2 group-hover:gradient-text transition-all duration-300 leading-tight">
                            {item.name}
                          </h3>
                          
                          {item.description && (
                            <p className="text-gray-400 leading-relaxed line-clamp-3 text-base">{item.description}</p>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-full btn-dynamic bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-400 hover:via-orange-400 hover:to-yellow-400 text-white font-black py-5 rounded-2xl transition-all hover:scale-105 shadow-2xl hover:shadow-orange-500/50 text-xl transform active:scale-95 relative overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-3">
                            <Zap size={24} />
                            LAUNCH ORDER
                          </span>
                        </button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission Control Cart */}
          <div className="xl:col-span-1">
            <Card className="sticky top-8 bg-gradient-to-br from-gray-900 to-black border-2 border-gray-700 rounded-3xl shadow-2xl">
              <CardHeader className="pb-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <CardTitle className="relative z-10 flex items-center gap-4 text-2xl font-black">
                  <div className="bg-white/20 p-3 rounded-2xl animate-pulse-custom">
                    <ShoppingCart size={32} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xl">MISSION CART</div>
                    <div className="text-sm font-bold opacity-90">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} ITEMS LOCKED
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 animate-pulse-custom">
                      <Target size={40} className="text-gray-500" />
                    </div>
                    <h3 className="text-xl font-black text-white mb-3">MISSION AWAITING</h3>
                    <p className="text-gray-400 font-medium">Select your flavor weapons to begin!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-white">SELECTED WEAPONS</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCart}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 font-bold"
                      >
                        <X size={16} className="mr-1" />
                        ABORT
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-700">
                          <div className="flex-1">
                            <h4 className="font-black text-white text-sm">{item.name}</h4>
                            <p className="text-gray-400 text-sm">£{item.price} each</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => removeFromCart(item.id)} 
                              className="h-8 w-8 p-0 rounded-full border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="font-black text-xl min-w-[2rem] text-center text-orange-400">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              onClick={() => addToCart(item)} 
                              className="h-8 w-8 p-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400"
                            >
                              <Plus size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-gray-700 pt-6 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-black text-white">TOTAL DAMAGE</span>
                        <span className="text-4xl font-black gradient-text">£{getCartTotal()}</span>
                      </div>
                      
                      <Button 
                        className="w-full py-6 btn-dynamic bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-400 hover:via-orange-400 hover:to-yellow-400 text-white font-black rounded-2xl text-xl shadow-2xl transform hover:scale-105 transition-all" 
                        onClick={() => setShowOrderForm(true)}
                        disabled={cart.length === 0}
                      >
                        <Lightning className="mr-3" size={24} />
                        EXECUTE ORDER
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Order Form Dialog */}
      <Dialog open={showOrderForm} onOpenChange={setShowOrderForm}>
        <DialogContent className="sm:max-w-[600px] bg-black border-2 border-orange-500 rounded-3xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-3xl font-black text-center gradient-text">MISSION BRIEFING</DialogTitle>
            <p className="text-gray-400 text-center text-lg">Provide coordinates for flavor delivery</p>
          </DialogHeader>
          
          <form onSubmit={handleOrderSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="customerName" className="font-black text-white">AGENT NAME *</Label>
                <Input
                  id="customerName"
                  value={orderForm.customerName}
                  onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                  required
                  className="bg-gray-800 border-2 border-gray-600 rounded-xl py-4 text-white font-bold focus:border-orange-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="customerPhone" className="font-black text-white">COMM FREQUENCY *</Label>
                <Input
                  id="customerPhone"
                  value={orderForm.customerPhone}
                  onChange={(e) => setOrderForm({...orderForm, customerPhone: e.target.value})}
                  required
                  className="bg-gray-800 border-2 border-gray-600 rounded-xl py-4 text-white font-bold focus:border-orange-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="customerEmail" className="font-black text-white">BACKUP CHANNEL</Label>
              <Input
                id="customerEmail"
                type="email"
                value={orderForm.customerEmail}
                onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
                className="bg-gray-800 border-2 border-gray-600 rounded-xl py-4 text-white font-bold focus:border-orange-500"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="orderType" className="font-black text-white">MISSION TYPE</Label>
              <Select value={orderForm.orderType} onValueChange={(value) => setOrderForm({...orderForm, orderType: value})}>
                <SelectTrigger className="bg-gray-800 border-2 border-gray-600 rounded-xl py-4 text-white font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-2 border-gray-600">
                  <SelectItem value="delivery">🚀 DELIVERY STRIKE</SelectItem>
                  <SelectItem value="collection">🏃 TACTICAL PICKUP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderForm.orderType === "delivery" && (
              <div className="space-y-3">
                <Label htmlFor="deliveryAddress" className="font-black text-white">TARGET COORDINATES *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                  required
                  className="bg-gray-800 border-2 border-gray-600 rounded-xl min-h-[100px] text-white font-bold focus:border-orange-500"
                  placeholder="Enter precise delivery coordinates..."
                />
              </div>
            )}

            <div className="space-y-3">
              <Label htmlFor="notes" className="font-black text-white">SPECIAL INTEL</Label>
              <Textarea
                id="notes"
                value={orderForm.notes}
                onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                className="bg-gray-800 border-2 border-gray-600 rounded-xl min-h-[100px] text-white font-bold focus:border-orange-500"
                placeholder="Any special mission requirements..."
              />
            </div>

            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border-2 border-gray-700">
              <div className="flex justify-between items-center text-2xl font-black mb-6">
                <span className="text-white">TOTAL INVESTMENT:</span>
                <span className="gradient-text text-3xl">£{getCartTotal()}</span>
              </div>
              <Button 
                type="submit" 
                className="w-full btn-dynamic bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-400 hover:via-orange-400 hover:to-yellow-400 text-white font-black py-6 rounded-2xl text-2xl transform hover:scale-105 transition-all"
              >
                <Zap className="mr-3" size={28} />
                LAUNCH MISSION
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}