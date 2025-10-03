import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Flame, Plus, Minus, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/services/catalog";

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

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (customization: ItemCustomization) => void;
  item: any;
}

// Till-style comprehensive options
const FLAVOR_OPTIONS = [
  { value: 'plain', label: 'Plain', price: 0 },
  { value: 'garlic-herb', label: 'Garlic & Herb', price: 0 },
  { value: 'lemon-herb', label: 'Lemon & Herb', price: 0 },
  { value: 'medium', label: 'Medium Peri Peri', price: 0 },
  { value: 'hot', label: 'Hot Peri Peri', price: 0 },
  { value: 'extra-hot', label: 'Extra Hot Peri Peri', price: 0 },
  { value: 'bbq', label: 'BBQ', price: 0 },
  { value: 'buffalo', label: 'Buffalo', price: 0 }
];

// Removed chip types - meal deals are fixed as chips + drink

const TOPPINGS = [
  { value: 'cheese', label: 'Cheese', price: 50 },
  { value: 'jalapenos', label: 'Jalapeños', price: 30 },
  { value: 'bacon', label: 'Bacon', price: 100 },
  { value: 'mushrooms', label: 'Mushrooms', price: 40 },
  { value: 'lettuce', label: 'Lettuce', price: 0 },
  { value: 'tomato', label: 'Tomato', price: 0 },
  { value: 'onions', label: 'Red Onions', price: 0 },
  { value: 'pickles', label: 'Pickles', price: 0 }
];

const SAUCES = [
  { value: 'mayo', label: 'Mayonnaise', price: 0 },
  { value: 'ketchup', label: 'Ketchup', price: 0 },
  { value: 'garlic-mayo', label: 'Garlic Mayo', price: 20 },
  { value: 'peri-mayo', label: 'Peri Peri Mayo', price: 20 },
  { value: 'chili-sauce', label: 'Chili Sauce', price: 20 },
  { value: 'bbq-sauce', label: 'BBQ Sauce', price: 20 }
];

const DRINK_OPTIONS = [
  { value: 'coke', label: 'Coca Cola', price: 0 },
  { value: 'pepsi', label: 'Pepsi', price: 0 },
  { value: 'sprite', label: 'Sprite', price: 0 },
  { value: 'fanta', label: 'Fanta Orange', price: 0 },
  { value: 'water', label: 'Still Water', price: 0 },
  { value: 'sparkling', label: 'Sparkling Water', price: 20 }
];

const SPICE_LEVELS = [
  { value: 'mild', label: '🌶️ Mild', price: 0 },
  { value: 'medium', label: '🌶️🌶️ Medium', price: 0 },
  { value: 'hot', label: '🌶️🌶️🌶️ Hot', price: 0 },
  { value: 'extra-hot', label: '🌶️🌶️🌶️🌶️ Extra Hot', price: 0 }
];

export default function CustomizationModal({ isOpen, onClose, onConfirm, item }: CustomizationModalProps) {
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedSauces, setSelectedSauces] = useState<string[]>([]);
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState<string>('');
  const [selectedDrink, setSelectedDrink] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<string>('none');
  const [isSpicy, setIsSpicy] = useState(false);

  // Calculate dynamic pricing
  const calculatePrice = () => {
    let basePrice = item?.price || 0;
    let extraCost = 0;

    // Meal upgrade based on selected type
    if (selectedMealType === 'regular' && item?.mealPrice) {
      extraCost += item.mealPrice;
    } else if (selectedMealType === 'peri-peri') {
      extraCost += 280; // £2.80 in pence
    }

    // Toppings
    selectedToppings.forEach(topping => {
      const toppingOption = TOPPINGS.find(t => t.value === topping);
      if (toppingOption) extraCost += toppingOption.price;
    });

    // Sauces
    selectedSauces.forEach(sauce => {
      const sauceOption = SAUCES.find(s => s.value === sauce);
      if (sauceOption) extraCost += sauceOption.price;
    });

    // Drink upgrade (only for premium drinks)
    if (selectedDrink && selectedDrink !== 'coke') {
      const drinkOption = DRINK_OPTIONS.find(d => d.value === selectedDrink);
      if (drinkOption) extraCost += drinkOption.price;
    }

    return basePrice + extraCost;
  };

  const currentPrice = calculatePrice();

  const handleToppingToggle = (topping: string) => {
    setSelectedToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  const handleSauceToggle = (sauce: string) => {
    setSelectedSauces(prev =>
      prev.includes(sauce)
        ? prev.filter(s => s !== sauce)
        : [...prev, sauce]
    );
  };

  const handleConfirm = () => {
    const customization: ItemCustomization = {
      flavor: selectedFlavor || undefined,
      toppings: selectedToppings.length > 0 ? selectedToppings : undefined,
      sauces: selectedSauces.length > 0 ? selectedSauces : undefined,
      spiceLevel: selectedSpiceLevel || undefined,
      drinkChoice: selectedDrink || undefined,
      isMeal: selectedMealType === 'regular',
      isPeriPeriChipsMeal: selectedMealType === 'peri-peri',
      isSpicy
    };
    onConfirm(customization);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setSelectedFlavor('');
    setSelectedToppings([]);
    setSelectedSauces([]);
    setSelectedSpiceLevel('');
    setSelectedDrink('');
    setSelectedMealType('none');
    setIsSpicy(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-2xl">
              🍔
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Customize Your {item.name}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">Make it exactly how you like it!</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Flavor Options */}
          {item.hasFlavorOptions && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200 shadow-sm">
              <Label className="text-base font-bold text-gray-800 mb-3 block flex items-center gap-2">
                <span className="text-2xl">🍗</span>
                <span>Choose Your Flavor</span>
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {FLAVOR_OPTIONS.map((flavor) => (
                  <button
                    key={flavor.value}
                    onClick={() => setSelectedFlavor(flavor.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedFlavor === flavor.value
                        ? 'border-orange-500 bg-orange-100 shadow-md scale-105'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="font-medium text-sm text-gray-800">{flavor.label}</div>
                    {flavor.price > 0 && (
                      <div className="text-xs text-green-600 font-semibold mt-1">+{formatPrice(flavor.price)}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spice Level for Spicy Items */}
          {item.isSpicyOption && (
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl border border-red-200 shadow-sm">
              <Label className="text-base font-bold text-gray-800 mb-3 block flex items-center gap-2">
                <Flame className="w-6 h-6 text-red-500 animate-pulse" />
                <span>Heat Level</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {SPICE_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedSpiceLevel(level.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                      selectedSpiceLevel === level.value
                        ? 'border-red-500 bg-red-100 shadow-md scale-105'
                        : 'border-gray-200 bg-white hover:border-red-300 hover:shadow-sm'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* Toppings Selection - Always Available */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-sm">
            <Label className="text-base font-bold text-gray-800 mb-3 block flex items-center gap-2">
              <span className="text-2xl">🥬</span>
              <span>Add Toppings</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TOPPINGS.map((topping) => (
                <label
                  key={topping.value}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedToppings.includes(topping.value)
                      ? 'border-green-500 bg-green-100 shadow-md'
                      : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
                  }`}
                >
                  <Checkbox
                    id={topping.value}
                    checked={selectedToppings.includes(topping.value)}
                    onCheckedChange={() => handleToppingToggle(topping.value)}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{topping.label}</div>
                    {topping.price > 0 && (
                      <div className="text-xs text-green-600 font-semibold">+{formatPrice(topping.price)}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Meal Options - Dropdown */}
          {item.hasMealOption && item.mealPrice && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-sm">
              <Label className="text-base font-bold text-gray-800 mb-3 block flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <span>Make it a Meal Deal</span>
              </Label>

              <div className="space-y-3">
                {/* Meal Type Selection */}
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setSelectedMealType('none')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedMealType === 'none'
                        ? 'border-blue-500 bg-blue-100 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium text-sm">Just the Item</div>
                    <div className="text-xs text-gray-500">No meal deal</div>
                  </button>

                  <button
                    onClick={() => setSelectedMealType('regular')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedMealType === 'regular'
                        ? 'border-blue-500 bg-blue-100 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">🍟 Regular Meal</div>
                        <div className="text-xs text-gray-500">Chips + Drink</div>
                      </div>
                      <div className="text-green-600 font-bold text-sm">+{formatPrice(item.mealPrice)}</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setSelectedMealType('peri-peri')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedMealType === 'peri-peri'
                        ? 'border-orange-500 bg-orange-100 shadow-md'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">🌶️ Peri Peri Chips Meal</div>
                        <div className="text-xs text-gray-500">Peri Peri Chips + Drink</div>
                      </div>
                      <div className="text-green-600 font-bold text-sm">+{formatPrice(280)}</div>
                    </div>
                  </button>
                </div>

                {/* Drink Selection - shown when any meal is selected */}
                {selectedMealType !== 'none' && (
                  <div className="pt-3 border-t border-blue-200">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">🥤 Choose Your Drink</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {DRINK_OPTIONS.map((drink) => (
                        <button
                          key={drink.value}
                          onClick={() => setSelectedDrink(drink.value)}
                          className={`p-2 rounded-lg border-2 transition-all duration-200 text-left ${
                            selectedDrink === drink.value
                              ? 'border-blue-500 bg-blue-100 shadow-sm'
                              : 'border-gray-200 bg-white hover:border-blue-300'
                          }`}
                        >
                          <div className="text-sm font-medium">{drink.label}</div>
                          {drink.price > 0 && (
                            <div className="text-xs text-green-600 font-semibold">+{formatPrice(drink.price)}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price Display */}
          <div className="bg-emparo-orange/10 p-4 rounded-lg border-2 border-emparo-orange/30">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-800">Total Price:</span>
              <span className="text-xl font-bold text-emparo-orange">
                {formatPrice(currentPrice)}
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>{formatPrice(item?.price || 0)}</span>
              </div>
              {selectedMealType === 'regular' && item?.mealPrice && (
                <div className="flex justify-between text-blue-600">
                  <span>Regular Meal Deal:</span>
                  <span>+{formatPrice(item.mealPrice)}</span>
                </div>
              )}
              {selectedMealType === 'peri-peri' && (
                <div className="flex justify-between text-orange-600">
                  <span>Peri Peri Chips Meal:</span>
                  <span>+{formatPrice(280)}</span>
                </div>
              )}
              {selectedToppings.length > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Toppings:</span>
                  <span>+{formatPrice(selectedToppings.reduce((total, t) => total + (TOPPINGS.find(top => top.value === t)?.price || 0), 0))}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 font-semibold transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Add to Cart - {formatPrice(currentPrice)}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}