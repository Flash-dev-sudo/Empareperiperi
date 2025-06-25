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
import { Plus, Minus, ShoppingCart, Flame, Star, Filter } from "lucide-react";
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
  const [showCart, setShowCart] = useState(false);
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

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
  };

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
          title: "Order submitted!",
          description: "Your order has been received and is being processed.",
        });
        setCart([]);
        setShowOrderForm(false);
        setShowCart(false);
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
            {"OUR DELICIOUS".split('').map((char, index) => (
              <span key={index} className="inline-block hover:scale-110 transition-transform cursor-default">
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}<br/>
            <span className="text-yellow-400">MENU</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Authentic Peri Peri flavors, flame-grilled to perfection. Choose your spice level and enjoy the taste of Portugal in London.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Menu Content */}
          <div className="flex-1">
            {/* Category Filter */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="text-orange-600" size={24} />
                <h2 className="text-2xl font-black text-gray-900">Filter by Category</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={`rounded-full font-semibold ${
                      selectedCategory === category 
                        ? "bg-orange-500 hover:bg-orange-600" 
                        : "border-orange-300 text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map((item: any) => (
                <Card key={item.id} className="group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 rounded-3xl overflow-hidden bg-white shadow-lg">
                  <div className="relative">
                    {/* Image */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden relative">
                      {item.image ? (
                        <img 
                          src={`/attached_assets/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                          <div className="text-6xl mb-2 opacity-30">{getCategoryIcon(item.category)}</div>
                          <p className="text-sm text-gray-500 font-medium">Photo Coming Soon</p>
                        </div>
                      </div>
                    </div>
                    {/* Favorite Badge */}
                    {item.isCustomerFavorite === 1 && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-2 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg animate-pulse">
                        <Star size={14} className="fill-current" />
                        Popular
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-lg font-bold backdrop-blur-sm">
                      £{item.price}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 font-bold">
                            {item.category}
                          </Badge>
                          {item.spice_level > 0 && (
                            <div className="flex items-center">
                              {getSpiceIndicator(item.spice_level)}
                            </div>
                          )}
                        </div>
                        <h3 className="font-black text-xl text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-2xl transition-all hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-24 border-0 rounded-3xl shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="bg-orange-500 p-2 rounded-xl">
                      <ShoppingCart size={20} className="text-white" />
                    </div>
                    Your Order ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                  </CardTitle>
                  {cart.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCart(true)}
                      className="rounded-full"
                    >
                      View All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Your cart is empty</p>
                    <p className="text-sm text-gray-400">Add some delicious items to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">£{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => removeFromCart(item.id)} className="h-8 w-8 p-0 rounded-full">
                            <Minus size={12} />
                          </Button>
                          <Button size="sm" onClick={() => addToCart(item)} className="h-8 w-8 p-0 rounded-full bg-orange-500 hover:bg-orange-600">
                            <Plus size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {cart.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">...and {cart.length - 3} more items</p>
                    )}
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-black text-orange-600">£{getCartTotal()}</span>
                      </div>
                      <Button 
                        className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl text-lg" 
                        onClick={() => setShowOrderForm(true)}
                        disabled={cart.length === 0}
                      >
                        Proceed to Checkout
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Name *</Label>
              <Input
                id="customerName"
                value={orderForm.customerName}
                onChange={(e) => setOrderForm({...orderForm, customerName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone *</Label>
              <Input
                id="customerPhone"
                value={orderForm.customerPhone}
                onChange={(e) => setOrderForm({...orderForm, customerPhone: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={orderForm.customerEmail}
                onChange={(e) => setOrderForm({...orderForm, customerEmail: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderType">Order Type</Label>
              <Select value={orderForm.orderType} onValueChange={(value) => setOrderForm({...orderForm, orderType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="collection">Collection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {orderForm.orderType === "delivery" && (
              <div className="space-y-2">
                <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                <Textarea
                  id="deliveryAddress"
                  value={orderForm.deliveryAddress}
                  onChange={(e) => setOrderForm({...orderForm, deliveryAddress: e.target.value})}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="notes">Special Instructions</Label>
              <Textarea
                id="notes"
                value={orderForm.notes}
                onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
              />
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-lg font-bold">Total: £{getCartTotal()}</span>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                Place Order
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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