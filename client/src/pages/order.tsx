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


        {/* Menu Items - Collapsible Swiggy-style List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {categoriesWithItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600 mb-2">No items found</p>
              <p className="text-gray-500">Try adjusting your search or browse our categories</p>
            </div>
          ) : (
            categoriesWithItems.map((category, idx) => (
              <div key={category.id} className={idx !== 0 ? "border-t-2 border-gray-100" : ""}>
                {/* Collapsible Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-emparo-dark">{category.name}</h2>
                    <span className="text-sm text-gray-500">({category.items.length})</span>
                  </div>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform ${
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
                  <div className="bg-gray-50/50">
                    {category.items.map((item, itemIdx) => (
                      <CompactMenuItem
                        key={item.id}
                        item={item}
                        onAddToCart={addToCart}
                        isAddingToCart={addToCartMutation.isPending}
                        isLast={itemIdx === category.items.length - 1}
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

// Compact Menu Item Component (Swiggy-style)
interface CompactMenuItemProps {
  item: CatalogMenuItem;
  onAddToCart: (item: CatalogMenuItem, customization: ItemCustomization) => void;
  isAddingToCart: boolean;
  isLast: boolean;
}

function CompactMenuItem({ item, onAddToCart, isAddingToCart, isLast }: CompactMenuItemProps) {
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
      <div className={`px-6 py-4 flex items-start justify-between gap-4 hover:bg-white transition-colors ${!isLast ? 'border-b border-gray-200' : ''}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            {/* Veg/Non-veg indicator */}
            <div className="flex-shrink-0 w-5 h-5 border-2 border-green-600 flex items-center justify-center mt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base mb-1">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
              )}
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-gray-900">{formatPrice(item.price)}</span>
                {item.isSpicyOption && (
                  <span className="inline-flex items-center text-xs text-red-600">
                    <Flame className="w-3 h-3 mr-1" />
                    Spicy
                  </span>
                )}
              </div>
              {item.hasMealOption && item.mealPrice && (
                <p className="text-xs text-gray-500 mt-1">
                  Meal available at {formatPrice(item.mealPrice)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleQuickAdd}
          disabled={isAddingToCart}
          className="flex-shrink-0 px-6 py-2 bg-white border-2 border-emparo-orange text-emparo-orange font-semibold rounded-lg hover:bg-emparo-orange hover:text-white transition-all active:scale-95 disabled:opacity-50"
        >
          ADD
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