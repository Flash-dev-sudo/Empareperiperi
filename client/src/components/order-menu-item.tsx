import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Flame, Settings } from "lucide-react";
import { formatPrice, getImageUrl, type CatalogMenuItem, type CatalogCategory } from "@/services/catalog";
import CustomizationModal from "./customization-modal";

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
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);

  const hasCustomizations = item.hasFlavorOptions || item.hasMealOption || item.isSpicyOption;

  const handleAddToCart = (customization: ItemCustomization) => {
    onAddToCart(item, customization);
  };

  const handleSimpleAddToCart = () => {
    onAddToCart(item, {});
  };

  return (
    <>
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
            <div className="text-xl font-bold text-emparo-orange">{formatPrice(item.price)}</div>
            {item.hasMealOption && item.mealPrice && (
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

        {/* Add to Cart Button */}
        {hasCustomizations ? (
          <Button
            onClick={() => setIsCustomizationOpen(true)}
            disabled={isAddingToCart}
            className="w-full bg-emparo-orange hover:bg-emparo-orange/90"
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize & Add to Cart
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

    <CustomizationModal
      isOpen={isCustomizationOpen}
      onClose={() => setIsCustomizationOpen(false)}
      onConfirm={handleAddToCart}
      item={item}
    />
  </>
  );
}