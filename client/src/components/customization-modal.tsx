import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Flame } from "lucide-react";
import { formatPrice } from "@/services/catalog";

interface ItemCustomization {
  flavor?: string;
  isMeal?: boolean;
  isSpicy?: boolean;
}

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customization: ItemCustomization) => void;
  item: any;
}

const FLAVOR_OPTIONS = [
  'Garlic & Hector',
  'Medium',
  'Hot',
  'Extra Hot',
  'BBQ'
];

export default function CustomizationModal({ isOpen, onClose, onConfirm, item }: CustomizationModalProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [isMeal, setIsMeal] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);

  const currentPrice = isMeal && item?.mealPrice ? item.mealPrice : item?.price || 0;

  const handleConfirm = () => {
    const customization: ItemCustomization = {
      flavor: selectedFlavor || undefined,
      isMeal,
      isSpicy
    };
    onConfirm(customization);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSelectedFlavor('');
    setIsMeal(false);
    setIsSpicy(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize {item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Flavor Options */}
          {item.hasFlavorOptions && (
            <div>
              <Label className="text-sm font-medium text-gray-700">Choose Flavor</Label>
              <Select onValueChange={setSelectedFlavor} value={selectedFlavor}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select flavor" />
                </SelectTrigger>
                <SelectContent>
                  {FLAVOR_OPTIONS.map((flavor) => (
                    <SelectItem key={flavor} value={flavor}>
                      {flavor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Meal Option */}
          {item.hasMealOption && item.mealPrice && (
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <Label htmlFor="meal-option" className="text-sm font-medium cursor-pointer">
                  Make it a meal
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  +{formatPrice(item.mealPrice - item.price)} - Includes chips and drink
                </p>
              </div>
              <Switch
                id="meal-option"
                checked={isMeal}
                onCheckedChange={setIsMeal}
              />
            </div>
          )}

          {/* Spicy Option */}
          {item.isSpicyOption && (
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <Label htmlFor="spicy-option" className="text-sm font-medium flex items-center cursor-pointer">
                <Flame className="w-4 h-4 mr-2 text-red-500" />
                Extra Spicy
              </Label>
              <Switch
                id="spicy-option"
                checked={isSpicy}
                onCheckedChange={setIsSpicy}
              />
            </div>
          )}

          {/* Price Display */}
          <div className="p-3 bg-gray-50 rounded border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Price:</span>
              <span className="text-lg font-bold text-emparo-orange">
                {formatPrice(currentPrice)}
              </span>
            </div>
            {isMeal && item.mealPrice && (
              <p className="text-xs text-gray-600 mt-1">
                Includes meal upgrade (+{formatPrice(item.mealPrice - item.price)})
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-emparo-orange hover:bg-emparo-orange/90">
            Add to Cart - {formatPrice(currentPrice)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}