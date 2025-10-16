import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Flame } from "lucide-react";
import { formatPrice, getImageUrl, type CatalogMenuItem, type CatalogCategory } from "@/services/catalog";
import CustomizationModal from "./customization-modal";

interface ItemCustomization {
  flavor?: string;
  toppings?: string[];
  sauces?: string[];
  isMeal?: boolean;
  isPeriPeriChipsMeal?: boolean;
  isSpicy?: boolean;
  spiceLevel?: string;
  drinkChoice?: string;
}

interface OrderMenuItemProps {
  item: CatalogMenuItem;
  category?: CatalogCategory;
  onAddToCart: (item: CatalogMenuItem, customization: ItemCustomization) => void;
  isAddingToCart?: boolean;
}

export default function OrderMenuItem({ item, category, onAddToCart, isAddingToCart }: OrderMenuItemProps) {
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const handleAddToCart = (customization: ItemCustomization) => {
    onAddToCart(item, customization);
  };

  const handleButtonClick = () => {
    setIsCustomizationOpen(true);
  };

  return (
    <>
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-emparo-orange/30 overflow-hidden">
      {/* Food Image Placeholder */}
      {!item.image && (
        <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🍽️</div>
            <p className="text-sm text-gray-600 font-medium">{category?.name || 'Menu Item'}</p>
          </div>
        </div>
      )}

      {item.image && (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-emparo-dark leading-tight">
              {item.name}
            </CardTitle>
            {item.isSpicyOption && (
              <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200 mt-2">
                <Flame className="w-3 h-3 mr-1" />
                Spicy
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emparo-orange">{formatPrice(item.price)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {item.description && (
          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
        )}

        {/* Meal Options Info */}
        {item.hasMealOption && item.mealPrice && (
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
            <p>✓ Meal option available (+{formatPrice(item.mealPrice)})</p>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleButtonClick}
          disabled={isAddingToCart}
          className="w-full bg-emparo-orange hover:bg-emparo-orange/90 h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>

    <CustomizationModal
      isOpen={isCustomizationOpen}
      onClose={() => setIsCustomizationOpen(false)}
      onConfirm={handleAddToCart}
      item={item}
    />
  </>
  );
}