import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import DeliveryChecker from "@/components/delivery-checker";

interface CartItem {
  id: number;
  sessionId: string;
  menuItemId: number;
  quantity: number;
  notes: string | null;
  menuItem: {
    id: number;
    name: string;
    price: string;
    description: string | null;
    category: string;
  };
}

export default function Cart() {
  const [sessionId] = useState(() => localStorage.getItem("sessionId") || Math.random().toString(36).substr(2, 9));
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    orderType: "pickup" as "pickup" | "delivery",
    address: "",
    notes: ""
  });
  const [deliveryInfo, setDeliveryInfo] = useState<{
    type: 'delivery' | 'collection';
    fee: number;
    message: string;
  } | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
  }, [sessionId]);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ["/api/cart", sessionId],
    queryFn: () => apiRequest("GET", `/api/cart/${sessionId}`).then(res => res.json()) as Promise<CartItem[]>
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      apiRequest("PUT", `/api/cart/${id}`, { quantity }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
    }
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/cart/${id}`).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({ title: "Item removed from cart" });
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: any) =>
      apiRequest("POST", "/api/orders", orderData).then(res => res.json()),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      localStorage.removeItem("sessionId");
      toast({ title: "Order placed successfully!", description: `Order #${order.id}` });
      setLocation("/order-confirmation/" + order.id);
    }
  });

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateCartMutation.mutate({ id, quantity: newQuantity });
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.menuItem.price) * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = deliveryInfo?.type === 'delivery' ? deliveryInfo.fee : 0;
    return (subtotal + deliveryFee).toFixed(2);
  };

  const handleDeliveryChange = (type: 'delivery' | 'collection', info?: any) => {
    setDeliveryInfo({
      type,
      fee: info?.fee || 0,
      message: info?.message || 'Collection selected'
    });
    
    setCustomerDetails(prev => ({
      ...prev,
      orderType: type === 'delivery' ? 'delivery' : 'pickup'
    }));
  };

  const handlePlaceOrder = () => {
    if (!customerDetails.name || !customerDetails.phone) {
      toast({ title: "Please fill in required details", variant: "destructive" });
      return;
    }

    if (!deliveryInfo) {
      toast({ title: "Please select delivery or collection option", variant: "destructive" });
      return;
    }

    if (customerDetails.orderType === "delivery" && !customerDetails.address) {
      toast({ title: "Please provide delivery address", variant: "destructive" });
      return;
    }

    const orderData = {
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerEmail: customerDetails.email || null,
      orderItems: JSON.stringify(cartItems.map(item => ({
        id: item.menuItemId,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        notes: item.notes
      }))),
      totalAmount: calculateTotal(),
      status: "pending",
      orderType: customerDetails.orderType,
      deliveryAddress: customerDetails.orderType === "delivery" ? customerDetails.address : null,
      deliveryFee: deliveryInfo.type === 'delivery' ? deliveryInfo.fee : 0,
      notes: customerDetails.notes || null
    };

    createOrderMutation.mutate(orderData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some delicious items to get started!</p>
          <Button onClick={() => setLocation("/")}>Browse Menu</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          {/* Delivery/Collection Options */}
          <DeliveryChecker 
            onDeliveryChange={handleDeliveryChange}
            cartTotal={calculateSubtotal()}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.menuItem.name}</h3>
                    <p className="text-sm text-gray-600">{item.menuItem.description}</p>
                    <p className="font-bold text-emparo-orange">£{item.menuItem.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeFromCartMutation.mutate(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span>£{calculateSubtotal().toFixed(2)}</span>
                </div>
                {deliveryInfo?.type === 'delivery' && deliveryInfo.fee > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Delivery Fee:</span>
                    <span>£{deliveryInfo.fee.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span>£{calculateTotal()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              
              {deliveryInfo && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Order Type:</p>
                  <p className="text-sm text-gray-600">
                    {deliveryInfo.type === 'delivery' ? 'Delivery' : 'Collection'} 
                    {deliveryInfo.type === 'delivery' && ` - £${deliveryInfo.fee.toFixed(2)}`}
                  </p>
                </div>
              )}
              
              {customerDetails.orderType === "delivery" && (
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    value={customerDetails.address}
                    onChange={(e) => setCustomerDetails(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Your delivery address"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Input
                  id="notes"
                  value={customerDetails.notes}
                  onChange={(e) => setCustomerDetails(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special requests..."
                />
              </div>
              
              <Button
                className="w-full bg-emparo-orange hover:bg-emparo-orange/90"
                onClick={handlePlaceOrder}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Placing Order..." : `Place Order - £${calculateTotal()}`}
              </Button>
              
              <p className="text-sm text-gray-600 text-center">
                * Payment will be processed at the restaurant
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}