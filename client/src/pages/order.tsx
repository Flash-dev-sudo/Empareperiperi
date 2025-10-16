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
import CustomizationModal from "@/components/customization-modal";
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
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [catalogData, setCatalogData] = useState<{ categories: CatalogCategory[], items: CatalogMenuItem[] }>({ categories: [], items: [] });
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Floating Cart Button - More minimal */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={() => setLocation("/cart")}
            className="bg-emparo-orange hover:bg-emparo-orange/90 shadow-xl h-14 px-5 rounded-full flex items-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">{cartItemCount}</span>
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4 py-24 max-w-4xl">
        {/* Minimal Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Menu</h1>
        </div>

        {/* Clean Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 rounded-lg"
            />
          </div>
        </div>


        {/* Menu Items - Ultra Minimal Collapsible List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {categoriesWithItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            categoriesWithItems.map((category, idx) => (
              <div key={category.id} className={idx !== 0 ? "border-t border-gray-100" : ""}>
                {/* Minimal Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors text-left"
                >
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                    <span className="text-sm text-gray-400">{category.items.length}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedCategories.has(category.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded Items List */}
                {expandedCategories.has(category.id) && (
                  <div className="divide-y divide-gray-100">
                    {category.items.map((item) => (
                      <CompactMenuItem
                        key={item.id}
                        item={item}
                        onAddToCart={addToCart}
                        isAddingToCart={addToCartMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Ultra Minimal Menu Item Component
interface CompactMenuItemProps {
  item: CatalogMenuItem;
  onAddToCart: (item: CatalogMenuItem, customization: ItemCustomization) => void;
  isAddingToCart: boolean;
}

function CompactMenuItem({ item, onAddToCart, isAddingToCart }: CompactMenuItemProps) {
  const [showCustomization, setShowCustomization] = useState(false);

  const handleQuickAdd = () => {
    // Check if item needs customization
    if (item.hasFlavorOptions || item.hasMealOption || item.isSpicyOption || item.hasToppingsOption) {
      setShowCustomization(true);
    } else {
      // Quick add without customization
      onAddToCart(item, {});
    }
  };

  return (
    <>
      <div className="px-5 py-4 flex items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2.5">
            {/* Minimal Veg indicator */}
            <div className="flex-shrink-0 w-4 h-4 border border-green-600 rounded-sm flex items-center justify-center mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-base mb-0.5">{item.name}</h3>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price)}</span>
                {item.isSpicyOption && (
                  <span className="inline-flex items-center text-xs text-red-500">
                    <Flame className="w-3 h-3" />
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Minimal ADD Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isAddingToCart}
          className="flex-shrink-0 px-8 py-1.5 bg-white border border-green-600 text-green-600 text-sm font-semibold rounded hover:bg-green-50 transition-colors active:scale-95 disabled:opacity-50 uppercase tracking-wide"
        >
          Add
        </button>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <CustomizationModal
          isOpen={showCustomization}
          onClose={() => setShowCustomization(false)}
          onConfirm={(customization) => {
            onAddToCart(item, customization);
            setShowCustomization(false);
          }}
          item={item}
        />
      )}
    </>
  );
}