import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { menuData } from "@/data/menu";
import { Drumstick, Flame, Pizza, Ham, Utensils, SquareDashedMousePointer } from "lucide-react";

const categoryIcons = {
  "Starters": SquareDashedMousePointer,
  "Buckets": Drumstick,
  "Desserts": Pizza,
  "Shakes": Utensils,
  "Peri Peri Chicken": Drumstick,
  "Grilled Chicken": Flame,
  "Pizzas": Pizza,
  "Burgers & More": Ham,
  "Platters": Utensils,
  "Sides & Add-ons": SquareDashedMousePointer
};

const categoryColors = {
  "Starters": "bg-emparo-yellow text-emparo-dark",
  "Buckets": "bg-emparo-orange",
  "Desserts": "bg-emparo-red-light",
  "Shakes": "bg-emparo-red",
  "Peri Peri Chicken": "bg-emparo-orange",
  "Grilled Chicken": "bg-emparo-red",
  "Pizzas": "bg-emparo-yellow text-emparo-dark",
  "Burgers & More": "bg-emparo-red-light",
  "Platters": "bg-emparo-dark",
  "Sides & Add-ons": "bg-emparo-orange"
};

export default function MenuSection() {
  return (
    <section id="menu" className="py-20 bg-emparo-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-emparo-orange px-8 py-4 rounded-full mb-8 shadow-2xl">
            <Utensils className="w-6 h-6 text-emparo-dark mr-3" />
            <span className="text-emparo-dark font-black text-xl">OUR MENU</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8">
            AUTHENTIC <span className="text-emparo-orange">PERI PERI</span>
          </h2>
          <p className="text-2xl text-emparo-yellow max-w-3xl mx-auto font-bold">FRESH INGREDIENTS • AUTHENTIC FLAVORS • UNBEATABLE TASTE</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {menuData.map((category, index) => {
            const IconComponent = categoryIcons[category.category as keyof typeof categoryIcons] || Utensils;
            const colorClass = categoryColors[category.category as keyof typeof categoryColors] || "bg-emparo-orange";
            
            return (
              <Card key={index} className={`bg-emparo-darker border-2 border-emparo-orange/30 rounded-3xl shadow-2xl hover:border-emparo-orange transition-all duration-300 p-6 ${category.category === "Platters" ? "lg:col-span-3" : ""} hover:shadow-emparo-orange/20 hover:shadow-2xl transform hover:-translate-y-2`}>
                <CardHeader className="p-0 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`${colorClass} p-4 rounded-2xl mr-4 shadow-lg`}>
                        <IconComponent className="text-white w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-white">{category.category}</CardTitle>
                        <p className="text-emparo-orange font-bold">{category.icon} AUTHENTIC & FRESH</p>
                      </div>
                    </div>
                    {category.category === "Pizzas" && (
                      <div className="bg-emparo-yellow/20 border border-emparo-yellow px-4 py-2 rounded-full">
                        <span className="text-emparo-dark font-bold text-sm">Stone Baked</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {category.category === "Pizzas" && (
                    <div className="mb-6 bg-emparo-orange rounded-2xl p-4 border border-emparo-yellow">
                      <p className="text-emparo-dark font-black text-xl">ALL PIZZAS £8.50</p>
                      <p className="text-emparo-dark text-sm mt-1 font-bold">FRESH STONE BAKED DAILY</p>
                    </div>
                  )}
                  
                  {category.category === "Platters" ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {category.items.slice(0, Math.ceil(category.items.length / 2)).map((item, itemIndex) => (
                          <div key={itemIndex} className="py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-emparo-dark">{item.name}</span>
                              <span className="text-emparo-orange font-bold">{item.price}</span>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        {category.items.slice(Math.ceil(category.items.length / 2)).map((item, itemIndex) => (
                          <div key={itemIndex} className="py-3 border-b border-gray-200 last:border-b-0">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-emparo-dark">{item.name}</span>
                              <span className="text-emparo-orange font-bold">{item.price}</span>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : category.category === "Pizzas" ? (
                    <div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="py-1">• {item.name}</div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Extra toppings: Veg (30p), Meat (50p), Cheese (50p)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <div>
                            <span className="font-semibold text-emparo-dark">{item.name}</span>
                            {item.description && (
                              <p className="text-xs text-gray-500">{item.description}</p>
                            )}
                          </div>
                          <span className="text-emparo-orange font-bold">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
