import { useState, useEffect, useId } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Utensils, Pizza, Drumstick, Beef, ShoppingBag, Flame, Plus } from "lucide-react";
import { getCatalogData, groupItemsByCategory, formatPrice, flavorOptions, getImageUrl, type CatalogCategory, type CatalogMenuItem } from "@/services/catalog";

const categoryIcons = {
  "Chicken": Drumstick,
  "Pizzas": Pizza,
  "Burgers": Beef,
  "Platters": ShoppingBag,
  "Starters": Utensils,
  "Mains": Beef,
  "Milkshakes": ShoppingBag
};

interface ItemCustomization {
  flavor?: string;
  isMeal?: boolean;
  isSpicy?: boolean;
}

interface EnhancedMenuItemProps {
  item: CatalogMenuItem;
  category: CatalogCategory;
  onAddToCart: (item: CatalogMenuItem, customization: ItemCustomization) => void;
}

function EnhancedMenuItem({ item, category, onAddToCart }: EnhancedMenuItemProps) {
  const [customization, setCustomization] = useState<ItemCustomization>({});
  const [showCustomization, setShowCustomization] = useState(false);
  const uniqueId = useId(); // Generate unique ID for this component instance

  const hasCustomizations = item.hasFlavorOptions || item.hasMealOption || item.isSpicyOption;
  const currentPrice = customization.isMeal && item.mealPrice ? item.mealPrice : item.price;

  const handleAddToCart = () => {
    onAddToCart(item, customization);
    setCustomization({});
    setShowCustomization(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-emparo-orange/20 shadow-sm">
      {item.image && (
        <div className="w-full h-32 overflow-hidden rounded-xl mb-3">
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              // Hide image if it fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-xl font-bold text-emparo-dark">{item.name}</h4>
            {item.isSpicyOption && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200">
                <Flame className="w-3 h-3 mr-1" />
                Spicy
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-emparo-dark/70 text-sm leading-relaxed mb-2">{item.description}</p>
          )}
        </div>
        <span className="text-2xl font-black text-emparo-orange ml-4">{formatPrice(currentPrice)}</span>
      </div>

      {/* Meal price display */}
      {item.hasMealOption && item.mealPrice && (
        <div className="mb-3">
          <Badge variant="outline" className="border-emparo-orange text-emparo-orange">
            Meal option: {formatPrice(item.mealPrice)}
          </Badge>
        </div>
      )}

      {/* Customization options */}
      {hasCustomizations && (
        <div className="mt-3">
          {!showCustomization ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomization(true)}
              className="border-emparo-orange text-emparo-orange hover:bg-emparo-orange hover:text-white"
            >
              <Plus className="w-4 h-4 mr-1" />
              Customize
            </Button>
          ) : (
            <div className="space-y-3 p-3 bg-emparo-cream rounded-lg">
              {/* Flavor options */}
              {item.hasFlavorOptions && (
                <div>
                  <Label className="text-sm font-medium text-emparo-dark">Choose Flavor</Label>
                  <Select onValueChange={(value) => setCustomization({...customization, flavor: value})}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select flavor" />
                    </SelectTrigger>
                    <SelectContent>
                      {flavorOptions.map((flavor) => (
                        <SelectItem key={flavor} value={flavor}>
                          {flavor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Meal option */}
              {item.hasMealOption && item.mealPrice && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${uniqueId}-meal-option`}
                    checked={customization.isMeal || false}
                    onCheckedChange={(checked) => setCustomization({...customization, isMeal: checked})}
                  />
                  <Label htmlFor={`${uniqueId}-meal-option`} className="text-sm font-medium">
                    Make it a meal (+{formatPrice(item.mealPrice - item.price)})
                  </Label>
                </div>
              )}

              {/* Spicy option */}
              {item.isSpicyOption && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`${uniqueId}-spicy-option`}
                    checked={customization.isSpicy || false}
                    onCheckedChange={(checked) => setCustomization({...customization, isSpicy: checked})}
                  />
                  <Label htmlFor={`${uniqueId}-spicy-option`} className="text-sm font-medium flex items-center">
                    <Flame className="w-4 h-4 mr-1 text-red-500" />
                    Extra Spicy
                  </Label>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCustomization(false);
                    setCustomization({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="bg-emparo-orange hover:bg-emparo-orange/90"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simple add button for items without customizations */}
      {!hasCustomizations && (
        <div className="mt-3">
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="bg-emparo-orange hover:bg-emparo-orange/90"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
}

export default function EnhancedMenuSection() {
  const [catalogData, setCatalogData] = useState<{ categories: CatalogCategory[], items: CatalogMenuItem[] }>({ categories: [], items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await getCatalogData();
        setCatalogData(data);
      } catch (err) {
        setError('Failed to load menu. Please try again later.');
        console.error('Failed to load catalog:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  const handleAddToCart = (item: CatalogMenuItem, customization: ItemCustomization) => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', { item, customization });
    // This would typically call a cart service or update cart state
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="menu" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const groupedCategories = groupItemsByCategory(catalogData.categories, catalogData.items);

  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-emparo-dark mb-4">
            Our <span className="text-emparo-orange">Menu</span>
          </h2>
          <p className="text-xl text-emparo-dark max-w-3xl mx-auto font-medium">
            Fresh ingredients, authentic flavors, unbeatable taste
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groupedCategories.map((category) => {
            const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Utensils;

            return (
              <Card key={category.id} className="bg-emparo-cream rounded-3xl shadow-lg overflow-hidden border-0 transition-all duration-300 hover:shadow-xl">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-emparo-orange p-4 rounded-2xl mr-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-emparo-dark">{category.name}</h3>
                  </div>

                  {/* Special pricing info for pizzas */}
                  {category.name === "Pizzas" && (
                    <div className="mb-6 bg-emparo-orange rounded-2xl p-4">
                      <p className="text-white font-black text-xl">ALL PIZZAS £8.50</p>
                      <p className="text-white text-sm mt-1 font-medium">Fresh stone baked daily</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <EnhancedMenuItem
                        key={item.id}
                        item={item}
                        category={category}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}