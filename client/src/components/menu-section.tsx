import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { menuData } from "@/data/menu";
import { Drumstick, Flame, Pizza, Ham, Utensils, SquareDashedMousePointer } from "lucide-react";

const categoryIcons = {
  "Peri Peri Chicken": Drumstick,
  "Grilled Chicken": Flame,
  "Pizzas": Pizza,
  "Burgers & More": Ham,
  "Platters": Utensils,
  "Starters": SquareDashedMousePointer
};

const categoryColors = {
  "Peri Peri Chicken": "bg-emparo-orange",
  "Grilled Chicken": "bg-emparo-red",
  "Pizzas": "bg-emparo-yellow text-emparo-dark",
  "Burgers & More": "bg-emparo-red-light",
  "Platters": "bg-emparo-dark",
  "Starters": "bg-emparo-yellow text-emparo-dark"
};

export default function MenuSection() {
  return (
    <section id="menu" className="py-16 bg-emparo-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-emparo-dark mb-4">
            Our <span className="text-emparo-orange">Full Menu</span>
          </h2>
          <p className="text-xl text-gray-600">Fresh ingredients, authentic flavors, unbeatable taste</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {menuData.map((category, index) => {
            const IconComponent = categoryIcons[category.category as keyof typeof categoryIcons] || Utensils;
            const colorClass = categoryColors[category.category as keyof typeof categoryColors] || "bg-emparo-orange";
            
            return (
              <Card key={index} className={`bg-white rounded-2xl shadow-lg p-8 ${category.category === "Platters" ? "lg:col-span-2" : ""}`}>
                <CardHeader className="p-0 mb-6">
                  <div className="flex items-center">
                    <div className={`${colorClass} p-3 rounded-full mr-4`}>
                      <IconComponent className="text-white text-xl w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-emparo-dark">{category.icon} {category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {category.category === "Pizzas" && (
                    <div className="mb-4">
                      <p className="text-emparo-orange font-bold text-lg">All pizzas £8.50</p>
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
