import { Award } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-emparo-dark mb-6">
              About <span className="text-emparo-orange">Emparo</span>
            </h2>
            <div className="space-y-4 text-lg text-gray-600">
              <p>
                At Emparo Peri Peri, we're passionate about bringing you the authentic taste of flame-grilled peri peri cuisine. Our journey began with a simple mission: to serve fresh, flavorful food that ignites your senses.
              </p>
              <p>
                Every dish is crafted with premium ingredients, from our signature peri peri marinades to our fresh stone-baked pizzas. We believe in quality, authenticity, and the perfect balance of spice that makes every meal memorable.
              </p>
              <p>
                Our expert chefs use traditional grilling techniques combined with secret spice blends to create the perfect peri peri experience. Whether you're craving our famous grilled chicken or exploring our diverse menu, we promise fresh food made with love.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-emparo-cream rounded-lg">
                <div className="text-2xl font-bold text-emparo-orange mb-1">5+</div>
                <div className="text-sm text-gray-600">Years Serving</div>
              </div>
              <div className="text-center p-4 bg-emparo-cream rounded-lg">
                <div className="text-2xl font-bold text-emparo-orange mb-1">Fresh</div>
                <div className="text-sm text-gray-600">Daily Prep</div>
              </div>
              <div className="text-center p-4 bg-emparo-cream rounded-lg">
                <div className="text-2xl font-bold text-emparo-orange mb-1">100%</div>
                <div className="text-sm text-gray-600">Halal</div>
              </div>
              <div className="text-center p-4 bg-emparo-cream rounded-lg">
                <div className="text-2xl font-bold text-emparo-orange mb-1">Local</div>
                <div className="text-sm text-gray-600">Community</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Warm restaurant interior" 
              className="rounded-2xl shadow-xl w-full h-auto" 
            />
            
            {/* Overlay Card */}
            <div className="absolute -bottom-6 -left-6 bg-emparo-dark text-white p-6 rounded-xl shadow-lg max-w-sm">
              <div className="flex items-center space-x-3 mb-2">
                <Award className="text-emparo-yellow w-6 h-6" />
                <span className="font-bold text-emparo-yellow">Quality Promise</span>
              </div>
              <p className="text-sm">Fresh ingredients, authentic recipes, and exceptional service - that's our commitment to you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
