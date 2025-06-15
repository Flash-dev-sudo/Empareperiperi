import { Card, CardContent } from "@/components/ui/card";

const showcaseItems = [
  {
    image: "@assets/ChatGPT Image May 19, 2025, 09_40_38 PM_1750005435412.png",
    title: "Crispy Chicken Burger",
    description: "Golden crispy chicken with fresh salad and fries",
    price: "£5.50"
  },
  {
    image: "@assets/ChatGPT Image May 22, 2025, 09_38_22 PM_1750005435413.png",
    title: "Peri Peri Wrap",
    description: "Spicy chicken strips wrapped with fresh vegetables",
    price: "£4.50"
  },
  {
    image: "@assets/ChatGPT Image May 22, 2025, 09_20_56 PM_1750005435413.png",
    title: "Glazed Peri Wings",
    description: "Perfectly glazed wings with authentic peri peri sauce",
    price: "£4.20"
  },
  {
    image: "@assets/ChatGPT Image May 19, 2025, 12_34_06 PM_1750005435412.png",
    title: "Golden Fries",
    description: "Crispy golden fries with signature sauces",
    price: "£3.00"
  },
  {
    image: "@assets/ChatGPT Image May 22, 2025, 10_21_07 PM_1750005435414.png",
    title: "Chicken Strips",
    description: "Tender crispy chicken strips - perfectly seasoned",
    price: "£4.70"
  },
  {
    image: "@assets/ChatGPT Image May 22, 2025, 10_24_05 PM_1750005435414.png",
    title: "Chicken Nuggets",
    description: "Golden crispy nuggets - a family favorite",
    price: "£4.00"
  }
];

export default function MenuShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-emparo-cream to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-emparo-dark mb-4">
            Popular <span className="text-emparo-orange">Menu Items</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most loved dishes, made fresh daily with authentic flavors
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-4 right-4 bg-emparo-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {item.price}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-emparo-dark mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}