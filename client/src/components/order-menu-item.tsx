import { useState, useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Flame, Settings, X } from "lucide-react";
import { formatPrice, flavorOptions, getImageUrl, type CatalogMenuItem, type CatalogCategory } from "@/services/catalog";

interface ItemCustomization {
  flavor?: string;
  isMeal?: boolean;
  isSpicy?: boolean;
}

interface OrderMenuItemProps {
  item: CatalogMenuItem;
  category?: CatalogCategory;
  onAddToCart: (item: CatalogMenuItem, customization: ItemCustomization) => void;
  isAddingToCart?: boolean;
}

export default function OrderMenuItem({ item, category, onAddToCart, isAddingToCart }: OrderMenuItemProps) {
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

  const handleSimpleAddToCart = () => {
    onAddToCart(item, {});
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              {item.isSpicyOption && (
                <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200">
                  <Flame className="w-3 h-3 mr-1" />
                  Spicy
                </Badge>
              )}
            </div>
            {category && (
              <Badge variant="secondary" className="mt-1">{category.name}</Badge>
            )}
          </div>
          <div className="text-right ml-4">
            <div className="text-xl font-bold text-emparo-orange">{formatPrice(currentPrice)}</div>
            {item.hasMealOption && item.mealPrice && !customization.isMeal && (
              <div className="text-sm text-gray-500">Meal: {formatPrice(item.mealPrice)}</div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {item.image && (
          <div className="w-full h-48 overflow-hidden rounded-lg">
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
        {item.description && (
          <p className="text-gray-600">{item.description}</p>
        )}

        {/* Customization Panel */}
        {hasCustomizations && (
          <div>
            {!showCustomization ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomization(true)}
                className="border-emparo-orange text-emparo-orange hover:bg-emparo-orange hover:text-white mb-2"
              >
                <Settings className="w-4 h-4 mr-1" />
                Customize
              </Button>
            ) : (
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">Customize Your Order</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCustomization(false);
                      setCustomization({});
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Flavor options */}
                {item.hasFlavorOptions && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Choose Flavor</Label>
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
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <Label htmlFor={`${uniqueId}-meal-option`} className="text-sm font-medium cursor-pointer">
                        Make it a meal
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        +{formatPrice(item.mealPrice - item.price)} - Includes chips and drink
                      </p>
                    </div>
                    <Switch
                      id={`${uniqueId}-meal-option`}
                      checked={customization.isMeal || false}
                      onCheckedChange={(checked) => setCustomization({...customization, isMeal: checked})}
                    />
                  </div>
                )}

                {/* Spicy option */}
                {item.isSpicyOption && (
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <Label htmlFor={`${uniqueId}-spicy-option`} className="text-sm font-medium flex items-center cursor-pointer">
                      <Flame className="w-4 h-4 mr-2 text-red-500" />
                      Extra Spicy
                    </Label>
                    <Switch
                      id={`${uniqueId}-spicy-option`}
                      checked={customization.isSpicy || false}
                      onCheckedChange={(checked) => setCustomization({...customization, isSpicy: checked})}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        {showCustomization ? (
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-emparo-orange hover:bg-emparo-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Cart - {formatPrice(currentPrice)}
          </Button>
        ) : (
          <Button
            onClick={handleSimpleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-emparo-orange hover:bg-emparo-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </CardContent>
    </Card>
  );
}