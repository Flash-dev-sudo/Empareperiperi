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
    <section id="menu" className="py-20 bg-gradient-to-b from-white to-emparo-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-emparo-orange/10 border border-emparo-orange/20 px-6 py-3 rounded-full mb-6">
            <Utensils className="w-5 h-5 text-emparo-orange mr-2" />
            <span className="text-emparo-orange font-bold">Our Menu</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-emparo-dark mb-6">
            Authentic <span className="text-emparo-orange">Peri Peri</span> Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Fresh ingredients, authentic flavors, unbeatable taste delivered daily</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {menuData.map((category, index) => {
            const IconComponent = categoryIcons[category.category as keyof typeof categoryIcons] || Utensils;
            const colorClass = categoryColors[category.category as keyof typeof categoryColors] || "bg-emparo-orange";
            
            return (
              <Card key={index} className={`bg-white rounded-3xl shadow-xl border-2 border-gray-100 hover:border-emparo-orange/30 transition-all duration-300 p-8 ${category.category === "Platters" ? "lg:col-span-2" : ""} hover:shadow-2xl transform hover:-translate-y-1`}>
                <CardHeader className="p-0 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`${colorClass} p-4 rounded-2xl mr-4 shadow-lg`}>
                        <IconComponent className="text-white w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-black text-emparo-dark">{category.category}</CardTitle>
                        <p className="text-emparo-orange font-semibold">{category.icon} Authentic & Fresh</p>
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
                    <div className="mb-6 bg-emparo-orange/10 rounded-2xl p-4 border border-emparo-orange/20">
                      <p className="text-emparo-orange font-bold text-xl">All pizzas £8.50</p>
                      <p className="text-gray-600 text-sm mt-1">Fresh stone baked daily</p>
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
