import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, ShoppingCart, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: string;
  description: string | null;
  spiceLevel: number | null;
  isAvailable: number | null;
}

export default function Order() {
  const [sessionId] = useState(() => localStorage.getItem("sessionId") || Math.random().toString(36).substr(2, 9));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
    // Reset scroll position when component mounts
    window.scrollTo(0, 0);
  }, [sessionId]);

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ["/api/menu"],
    queryFn: () => apiRequest("GET", "/api/menu").then(res => res.json()) as Promise<MenuItem[]>
  });

  const { data: cartItems = [] } = useQuery({
    queryKey: ["/api/cart", sessionId],
    queryFn: () => apiRequest("GET", `/api/cart/${sessionId}`).then(res => res.json())
  });

  const addToCartMutation = useMutation({
    mutationFn: (item: { sessionId: string; menuItemId: number; quantity: number; notes?: string }) =>
      apiRequest("POST", "/api/cart", item).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", sessionId] });
      toast({ title: "Added to cart!" });
    }
  });

  const addToCart = (menuItemId: number) => {
    addToCartMutation.mutate({
      sessionId,
      menuItemId,
      quantity: 1
    });
  };

  const categories = ["All", ...new Set(menuItems.map(item => item.category))];
  
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.isAvailable;
  });

  const getSpiceIndicator = (level: number | null) => {
    if (!level || level === 0) return null;
    return "🌶️".repeat(level);
  };

  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emparo-cream">
      <Navigation />
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Online</h1>
          <Button 
            onClick={() => setLocation("/cart")}
            className="bg-emparo-orange hover:bg-emparo-orange/90"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart ({cartItemCount})
          </Button>
        </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">{item.category}</Badge>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emparo-orange">£{item.price}</div>
                  {item.spiceLevel && item.spiceLevel > 0 && (
                    <div className="text-sm">{getSpiceIndicator(item.spiceLevel)}</div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <Button
                onClick={() => addToCart(item.id)}
                disabled={addToCartMutation.isPending}
                className="w-full bg-emparo-orange hover:bg-emparo-orange/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No items found matching your search criteria.</p>
        </div>
      )}
      </div>
    </div>
  );
}