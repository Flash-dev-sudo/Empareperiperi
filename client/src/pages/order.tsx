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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Filter items based on search and category
  const getFilteredItemsByCategory = () => {
    const availableItems = catalogData.items.filter(item => !item.deletedAt && item.available);

    // If searching, show all matching items grouped by category
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      return groupedCategories
        .map(cat => ({
          ...cat,
          items: cat.items.filter(item =>
            item.name.toLowerCase().includes(searchLower) ||
            item.description?.toLowerCase().includes(searchLower)
          )
        }))
        .filter(cat => cat.items.length > 0);
    }

    // If a category is selected, show only that category
    if (selectedCategory) {
      const category = groupedCategories.find(cat => cat.name === selectedCategory);
      return category ? [category] : [];
    }

    // Default: show all categories with their items
    return groupedCategories;
  };

  const categoriesWithItems = getFilteredItemsByCategory();
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

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setLocation("/cart")}
          className="bg-emparo-orange hover:bg-emparo-orange/90 shadow-2xl h-16 px-6 text-lg rounded-full"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Cart ({cartItemCount})
        </Button>
      </div>

      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-emparo-dark mb-2">Order Online</h1>
          <p className="text-gray-600">Choose your favorite dishes and enjoy!</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for your favorite dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Category Tabs - Sticky */}
        <div className="sticky top-20 z-30 bg-emparo-cream/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4">
          <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-emparo-orange/20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍽️</span>
              <h3 className="text-lg font-semibold text-emparo-dark">Browse by Category</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                  selectedCategory === null
                    ? 'bg-emparo-orange text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                View All Menu
              </button>
              {groupedCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 ${
                    selectedCategory === cat.name
                      ? 'bg-emparo-orange text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  {cat.icon || '🍽️'} {cat.name}
                  <span className="ml-2 text-xs opacity-70">({cat.items.length})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items - Grouped by Category */}
        <div className="space-y-12">
          {categoriesWithItems.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600 mb-2">No items found</p>
              <p className="text-gray-500">Try adjusting your search or browse our categories</p>
            </div>
          ) : (
            categoriesWithItems.map(category => (
              <div key={category.id} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-3 pb-3 border-b-2 border-emparo-orange/30">
                  <span className="text-3xl">{category.icon || '🍽️'}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-emparo-dark">{category.name}</h2>
                    <p className="text-sm text-gray-600">{category.items.length} items available</p>
                  </div>
                </div>

                {/* Items Grid - 2 columns max for better focus */}
                <div className="grid md:grid-cols-2 gap-6">
                  {category.items.map((item) => (
                    <OrderMenuItem
                      key={item.id}
                      item={item}
                      category={category}
                      onAddToCart={addToCart}
                      isAddingToCart={addToCartMutation.isPending}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}