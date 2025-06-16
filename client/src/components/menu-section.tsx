import { Card } from "@/components/ui/card";
import { Utensils, Pizza, Drumstick, Beef, ShoppingBag } from "lucide-react";
import { menuData } from "@/data/menu";

const categoryIcons = {
  "Chicken": Drumstick,
  "Pizzas": Pizza,
  "Burgers": Beef,
  "Platters": ShoppingBag,
  "Sides & Add-ons": Utensils
};

export default function MenuSection() {
  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-emparo-dark mb-4">
            Our <span className="text-emparo-orange">Menu</span>
          </h2>
          <p className="text-xl text-emparo-dark max-w-3xl mx-auto font-medium">Fresh ingredients, authentic flavors, unbeatable taste</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuData.map((category, index) => {
            const IconComponent = categoryIcons[category.category as keyof typeof categoryIcons] || Utensils;
            
            return (
              <Card key={index} className="bg-emparo-cream rounded-3xl shadow-lg overflow-hidden border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-emparo-orange p-4 rounded-2xl mr-4 group-hover:bg-emparo-dark transition-colors group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-emparo-dark group-hover:text-emparo-orange transition-colors">{category.category}</h3>
                  </div>
                  
                  {category.category === "Pizzas" && (
                    <div className="mb-6 bg-emparo-orange rounded-2xl p-4">
                      <p className="text-white font-black text-xl">ALL PIZZAS £8.50</p>
                      <p className="text-white text-sm mt-1 font-medium">Fresh stone baked daily</p>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white rounded-2xl p-4 border border-emparo-orange/20 shadow-sm hover:shadow-md hover:border-emparo-orange/40 transition-all duration-200 cursor-pointer hover:scale-[1.02]">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-xl font-bold text-emparo-dark hover:text-emparo-orange transition-colors">{item.name}</h4>
                          <span className="text-2xl font-black text-emparo-orange hover:scale-110 transition-transform">{item.price}</span>
                        </div>
                        {item.description && (
                          <p className="text-emparo-dark/70 text-sm leading-relaxed">{item.description}</p>
                        )}
                      </div>
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