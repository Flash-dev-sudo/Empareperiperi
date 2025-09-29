import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Flame, Plus, Minus } from "lucide-react";
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
  const [isMeal, setIsMeal] = useState(false);
  const [isPeriPeriChipsMeal, setIsPeriPeriChipsMeal] = useState(false);
  const [isSpicy, setIsSpicy] = useState(false);

  // Calculate dynamic pricing
  const calculatePrice = () => {
    let basePrice = item?.price || 0;
    let extraCost = 0;

    // Regular meal upgrade (chips + drink for £2.50)
    if (isMeal && item?.mealPrice) {
      extraCost += item.mealPrice;
    }

    // Peri Peri chips meal upgrade (peri peri chips + drink for £2.80)
    if (isPeriPeriChipsMeal) {
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
      isMeal,
      isPeriPeriChipsMeal,
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
    setIsMeal(false);
    setIsPeriPeriChipsMeal(false);
    setIsSpicy(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-emparo-orange">
            Customize {item.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Flavor Options */}
          {item.hasFlavorOptions && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <Label className="text-sm font-semibold text-gray-800 mb-2 block">🍗 Choose Flavor</Label>
              <Select onValueChange={setSelectedFlavor} value={selectedFlavor}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select flavor" />
                </SelectTrigger>
                <SelectContent>
                  {FLAVOR_OPTIONS.map((flavor) => (
                    <SelectItem key={flavor.value} value={flavor.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{flavor.label}</span>
                        {flavor.price > 0 && <span className="text-green-600">+{formatPrice(flavor.price)}</span>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Spice Level for Spicy Items */}
          {item.isSpicyOption && (
            <div className="bg-red-50 p-3 rounded-lg">
              <Label className="text-sm font-semibold text-gray-800 mb-2 block flex items-center">
                <Flame className="w-4 h-4 mr-1 text-red-500" />
                Heat Level
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {SPICE_LEVELS.map((level) => (
                  <Button
                    key={level.value}
                    variant={selectedSpiceLevel === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpiceLevel(level.value)}
                    className="text-xs"
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>
          )}


          {/* Toppings Selection */}
          {(item.name.toLowerCase().includes('burger') || item.name.toLowerCase().includes('wrap') || item.name.toLowerCase().includes('pizza')) && (
            <div className="bg-green-50 p-3 rounded-lg">
              <Label className="text-sm font-semibold text-gray-800 mb-2 block">🥬 Add Toppings</Label>
              <div className="grid grid-cols-2 gap-2">
                {TOPPINGS.map((topping) => (
                  <div key={topping.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={topping.value}
                      checked={selectedToppings.includes(topping.value)}
                      onCheckedChange={() => handleToppingToggle(topping.value)}
                    />
                    <Label htmlFor={topping.value} className="text-xs cursor-pointer flex-1">
                      {topping.label}
                      {topping.price > 0 && <span className="text-green-600 ml-1">+{formatPrice(topping.price)}</span>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sauces Selection */}
          <div className="bg-orange-50 p-3 rounded-lg">
            <Label className="text-sm font-semibold text-gray-800 mb-2 block">🧂 Choose Sauces</Label>
            <div className="grid grid-cols-2 gap-2">
              {SAUCES.map((sauce) => (
                <div key={sauce.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={sauce.value}
                    checked={selectedSauces.includes(sauce.value)}
                    onCheckedChange={() => handleSauceToggle(sauce.value)}
                  />
                  <Label htmlFor={sauce.value} className="text-xs cursor-pointer flex-1">
                    {sauce.label}
                    {sauce.price > 0 && <span className="text-green-600 ml-1">+{formatPrice(sauce.price)}</span>}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Options */}
          {item.hasMealOption && item.mealPrice && (
            <div className="space-y-3">
              {/* Regular Meal Deal */}
              <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="meal-option" className="text-sm font-semibold cursor-pointer text-blue-800">
                      🍽️ Regular Meal Deal
                    </Label>
                    <p className="text-xs text-blue-600 mt-1">
                      +{formatPrice(item.mealPrice)} - Includes chips + drink
                    </p>
                  </div>
                  <Switch
                    id="meal-option"
                    checked={isMeal}
                    onCheckedChange={(checked) => {
                      setIsMeal(checked);
                      if (checked) setIsPeriPeriChipsMeal(false);
                    }}
                  />
                </div>

                {/* Drink Selection for Regular Meals */}
                {isMeal && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <Label className="text-xs font-medium text-blue-700 mb-1 block">Choose Your Drink:</Label>
                    <Select onValueChange={setSelectedDrink} value={selectedDrink}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Select drink" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRINK_OPTIONS.map((drink) => (
                          <SelectItem key={drink.value} value={drink.value}>
                            <div className="flex justify-between items-center w-full">
                              <span>{drink.label}</span>
                              {drink.price > 0 && <span className="text-green-600">+{formatPrice(drink.price)}</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Peri Peri Chips Meal Deal */}
              <div className="bg-orange-50 p-3 rounded-lg border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="peri-meal-option" className="text-sm font-semibold cursor-pointer text-orange-800">
                      🌶️ Peri Peri Chips Meal Deal
                    </Label>
                    <p className="text-xs text-orange-600 mt-1">
                      +{formatPrice(280)} - Includes peri peri chips + drink
                    </p>
                  </div>
                  <Switch
                    id="peri-meal-option"
                    checked={isPeriPeriChipsMeal}
                    onCheckedChange={(checked) => {
                      setIsPeriPeriChipsMeal(checked);
                      if (checked) setIsMeal(false);
                    }}
                  />
                </div>

                {/* Drink Selection for Peri Peri Meals */}
                {isPeriPeriChipsMeal && (
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <Label className="text-xs font-medium text-orange-700 mb-1 block">Choose Your Drink:</Label>
                    <Select onValueChange={setSelectedDrink} value={selectedDrink}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Select drink" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRINK_OPTIONS.map((drink) => (
                          <SelectItem key={drink.value} value={drink.value}>
                            <div className="flex justify-between items-center w-full">
                              <span>{drink.label}</span>
                              {drink.price > 0 && <span className="text-green-600">+{formatPrice(drink.price)}</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              {isMeal && item?.mealPrice && (
                <div className="flex justify-between text-blue-600">
                  <span>Regular Meal Deal:</span>
                  <span>+{formatPrice(item.mealPrice)}</span>
                </div>
              )}
              {isPeriPeriChipsMeal && (
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

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="flex-1 border-gray-300 hover:bg-gray-50">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-emparo-orange hover:bg-emparo-orange/90 text-white font-medium">
            Add to Cart - {formatPrice(currentPrice)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}