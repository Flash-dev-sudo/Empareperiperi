import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, MapPin, Clock, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrderForm() {
  const [orderType, setOrderType] = useState<string>("");
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderType || !customerDetails.name || !customerDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the order to your backend
    toast({
      title: "Order Submitted!",
      description: "We'll contact you shortly to confirm your order",
    });

    // Reset form
    setOrderType("");
    setCustomerDetails({ name: "", phone: "", email: "", address: "" });
    setNotes("");
  };

  return (
    <section className="py-16 bg-emparo-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Order <span className="text-emparo-orange">Online</span>
          </h2>
          <p className="text-xl text-emparo-yellow max-w-2xl mx-auto">
            Place your order now and enjoy authentic peri peri flavors delivered fresh to your door
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Order Form */}
          <Card className="bg-white shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-emparo-dark flex items-center">
                <ShoppingCart className="mr-3 text-emparo-orange" />
                Place Your Order
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="orderType" className="text-emparo-dark font-semibold">Order Type *</Label>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="collection">Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-emparo-dark font-semibold">Name *</Label>
                    <Input
                      id="name"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                      className="mt-2"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-emparo-dark font-semibold">Phone *</Label>
                    <Input
                      id="phone"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
                      className="mt-2"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-emparo-dark font-semibold">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                    className="mt-2"
                    placeholder="your.email@example.com"
                  />
                </div>

                {orderType === "delivery" && (
                  <div>
                    <Label htmlFor="address" className="text-emparo-dark font-semibold">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      value={customerDetails.address}
                      onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                      className="mt-2"
                      placeholder="Full delivery address including postcode"
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="notes" className="text-emparo-dark font-semibold">Special Instructions</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-2"
                    placeholder="Any special requests or dietary requirements"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-emparo-orange hover:bg-emparo-red text-white font-bold py-3 text-lg">
                  Submit Order Request
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  * We'll call you to confirm your order and provide the total amount
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="bg-emparo-orange text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">Call to Order</h3>
                    <p className="text-lg">020 3441 6940</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emparo-yellow text-emparo-dark">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">Opening Hours</h3>
                    <p className="text-lg">Daily: 1:00 PM - 4:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-emparo-red text-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 mr-3" />
                  <div>
                    <h3 className="text-xl font-bold">Location</h3>
                    <p className="text-lg">24 Blackstock Rd, Finsbury Park</p>
                    <p className="text-lg">London N4 2DW</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Items Preview */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-emparo-dark mb-4">Popular Items</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <img 
                    src="@assets/ChatGPT Image May 22, 2025, 10_18_07 PM_1750005435414.png" 
                    alt="Grilled Chicken Wings" 
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-semibold text-emparo-dark">Peri Wings</p>
                  <p className="text-xs text-emparo-orange">£4.20</p>
                </div>
                <div className="text-center">
                  <img 
                    src="@assets/ChatGPT Image May 19, 2025, 09_40_38 PM_1750005435412.png" 
                    alt="Crispy Burger" 
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-semibold text-emparo-dark">Peri Burger</p>
                  <p className="text-xs text-emparo-orange">£5.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}