import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, ShoppingCart, Search, Flame, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import OrderMenuItem from "@/components/order-menu-item";
import { getCatalogData, groupItemsByCategory, formatPrice, flavorOptions, type CatalogCategory, type CatalogMenuItem } from "@/services/catalog";

interface ItemCustomization {
  flavor?: string;
  isMeal?: boolean;
  isSpicy?: boolean;
}

export default function Order() {
  const [sessionId] = useState(() => localStorage.getItem("sessionId") || Math.random().toString(36).substr(2, 9));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [catalogData, setCatalogData] = useState<{ categories: CatalogCategory[], items: CatalogMenuItem[] }>({ categories: [], items: [] });
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
    window.scrollTo(0, 0);

    // Load catalog data
    async function loadCatalog() {
      try {
        const data = await getCatalogData();
        setCatalogData(data);
      } catch (error) {
        console.error('Failed to load catalog:', error);
        toast({
          title: "Error loading menu",
          description: "Please refresh the page to try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCatalog(false);
      }
    }

    loadCatalog();
  }, [sessionId, toast]);

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

  const addToCart = (item: CatalogMenuItem, customization: ItemCustomization) => {
    // Create notes from customization
    const notes = [];
    if (customization.flavor) notes.push(`Flavor: ${customization.flavor}`);
    if (customization.isMeal) notes.push('Meal option (+£' + ((item.mealPrice! - item.price) / 100).toFixed(2) + ')');
    if (customization.isSpicy) notes.push('Extra spicy');

    // Calculate price with meal option
    const finalPrice = customization.isMeal && item.mealPrice ? item.mealPrice : item.price;

    addToCartMutation.mutate({
      sessionId,
      menuItemId: item.id, // Use the local database ID for cart
      quantity: 1,
      notes: notes.length > 0 ? notes.join(', ') : undefined,
      // Note: The price calculation will be handled by the backend based on the menu item
      // but we can add pricing info to the notes for clarity
    });
  };

  // Get grouped categories for filtering
  const groupedCategories = groupItemsByCategory(catalogData.categories, catalogData.items);
  const categoryNames = ["All", ...groupedCategories.map(cat => cat.name)];

  // Filter items based on search and category
  const filteredItems = catalogData.items.filter(item => {
    if (item.deletedAt || !item.available) return false;

    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategory === "All") return matchesSearch;

    const category = catalogData.categories.find(cat => cat.id === item.categoryId);
    const matchesCategory = category?.name === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const cartItemCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  if (isLoadingCatalog) {
    return (
      <div className="min-h-screen bg-emparo-cream">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-emparo-orange border-t-transparent rounded-full" />
            <span className="ml-2 text-emparo-dark">Loading menu...</span>
          </div>
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
      <div className="mb-8 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories Section - Improved visibility */}
        <div className="bg-white rounded-xl shadow-md p-4 border-2 border-emparo-orange/20">
          <h3 className="text-lg font-semibold text-emparo-dark mb-3 flex items-center gap-2">
            <span>🍽️</span>
            <span>Menu Categories</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {categoryNames.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                  selectedCategory === category
                    ? 'bg-emparo-orange text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const category = catalogData.categories.find(cat => cat.id === item.categoryId);
          return (
            <OrderMenuItem
              key={item.id}
              item={item}
              category={category}
              onAddToCart={addToCart}
              isAddingToCart={addToCartMutation.isPending}
            />
          );
        })}
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