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
import { Plus, Minus, ShoppingCart, Flame, Star, Filter, X } from "lucide-react";
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
      title: "Added to cart",
      description: `${item.name} added to your cart`,
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
          <Flame key={i} size={14} className="text-red-500 fill-current" />
        ))}
        <span className="text-xs text-gray-600 font-medium">
          {level === 1 ? "Mild" : level === 2 ? "Medium" : "Hot"}
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
          title: "Order submitted successfully!",
          description: "Your order has been received and is being processed.",
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
        title: "Order failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Hero Section */}
      <div className="relative bg-gradient-to-br from-red-600 via-orange-600 to-yellow-500 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <Badge className="bg-yellow-400 text-black mb-8 text-xl font-black px-8 py-4 animate-bounce">
            FULL MENU
          </Badge>
          <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-tight">
            CHOOSE YOUR<br />
            <span className="text-yellow-300">ADVENTURE</span>
          </h1>
          <p className="text-2xl lg:text-3xl text-yellow-100 max-w-4xl mx-auto leading-relaxed font-medium">
            From mild to fiery hot - discover authentic peri peri flavors crafted with passion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
          {/* Menu Content */}
          <div className="xl:col-span-3">
            {/* Category Filter */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-red-500 p-3 rounded-2xl">
                  <Filter className="text-white" size={28} />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Filter by Category</h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="lg"
                    className={`rounded-full font-bold text-lg px-8 py-4 transition-all transform hover:scale-105 ${
                      selectedCategory === category 
                        ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" 
                        : "border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-500"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "All" ? "🍽️" : getCategoryIcon(category)} {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item: any) => (
                <Card key={item.id} className="group border-0 rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative">
                    {/* Image */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden relative">
                      {item.image ? (
                        <img 
                          src={`/attached_assets/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 ${item.image ? 'hidden' : 'flex'}`}>
                        <div className="text-center">
                          <div className="text-8xl mb-4 opacity-40">{getCategoryIcon(item.category)}</div>
                          <p className="text-gray-500 font-bold text-lg">Photo Coming Soon</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    {item.isCustomerFavorite === 1 && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-black flex items-center gap-2 shadow-lg animate-pulse">
                        <Star size={16} className="fill-current" />
                        POPULAR
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-full text-xl font-black backdrop-blur-sm">
                      £{item.price}
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <Badge className="bg-gradient-to-r from-red-100 to-orange-100 text-red-700 font-black text-sm px-3 py-1">
                            {item.category}
                          </Badge>
                          {getSpiceIndicator(item.spice_level)}
                        </div>
                        <h3 className="font-black text-2xl text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 leading-relaxed line-clamp-3 text-base">{item.description}</p>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => addToCart(item)}
                        className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-black py-5 rounded-2xl transition-all hover:scale-105 shadow-lg hover:shadow-xl text-xl transform active:scale-95"
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="xl:col-span-1">
            <Card className="sticky top-8 border-0 rounded-3xl shadow-2xl bg-white">
              <CardHeader className="pb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-4 text-2xl font-black">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <ShoppingCart size={28} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xl">Your Order</div>
                    <div className="text-sm font-medium opacity-90">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500">Add some delicious items to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Cart Items</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearCart}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X size={16} className="mr-1" />
                        Clear
                      </Button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                            <p className="text-gray-600 text-sm">£{item.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => removeFromCart(item.id)} 
                              className="h-8 w-8 p-0 rounded-full border-2"
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="font-bold text-lg min-w-[2rem] text-center">{item.quantity}</span>
                            <Button 
                              size="sm" 
                              onClick={() => addToCart(item)} 
                              className="h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600"
                            >
                              <Plus size={12} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 pt-6 space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Total</span>
                        <span className="text-3xl font-black text-red-600">£{getCartTotal()}</span>
                      </div>
                      
                      <Button 
                        className="w-full py-6 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-black rounded-2xl text-xl shadow-xl transform hover:scale-105 transition-all" 
                        onClick={() => setShowOrderForm(true)}
                        disabled={cart.length === 0}
                      >
                        CHECKOUT NOW
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
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-black text-center">Complete Your Order</DialogTitle>
            <p className="text-gray-600 text-center">Just a few more details and you're done!</p>
          </DialogHeader>
          
          <form onSubmit={handleOrderSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="font-bold">Name *</Label>
                <Input
                  id="customerName"
                  value={orderForm.customerName}
                  onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                  required
                  className="rounded-xl border-2 py-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="font-bold">Phone *</Label>
                <Input
                  id="customerPhone"
                  value={orderForm.customerPhone}
                  onChange={(e) => setOrderForm({...orderForm, customerPhone: e.target.value})}
                  required
                  className="rounded-xl border-2 py-3"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail" className="font-bold">Email (Optional)</Label>
              <Input
                id="customerEmail"
                type="email"
                value={orderForm.customerEmail}
                onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
                className="rounded-xl border-2 py-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderType" className="font-bold">Order Type</Label>
              <Select value={orderForm.orderType} onValueChange={(value) => setOrderForm({...orderForm, orderType: value})}>
                <SelectTrigger className="rounded-xl border-2 py-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">🚚 Delivery</SelectItem>
                  <SelectItem value="collection">🏪 Collection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {orderForm.orderType === "delivery" && (
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress" className="font-bold">Delivery Address *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                  required
                  className="rounded-xl border-2 min-h-[80px]"
                  placeholder="Enter your full delivery address..."
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes" className="font-bold">Special Instructions</Label>
              <Textarea
                id="notes"
                value={orderForm.notes}
                onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                className="rounded-xl border-2 min-h-[80px]"
                placeholder="Any special requests or dietary requirements..."
              />
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span>Order Total:</span>
                <span className="text-red-600">£{getCartTotal()}</span>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-black py-4 rounded-2xl text-xl"
              >
                PLACE ORDER
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}