import { Flame } from "lucide-react";

export default function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-emparo-cream/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated logo */}
        <div className="mb-6">
          <div className="bg-emparo-orange p-6 rounded-2xl mx-auto w-20 h-20 flex items-center justify-center animate-pulse">
            <Flame className="w-10 h-10 text-white animate-bounce" />
          </div>
        </div>
        
        {/* Loading text */}
        <h2 className="text-2xl font-bold text-emparo-dark mb-4">
          <span className="text-emparo-orange">Emparo</span> Peri Peri
        </h2>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mb-6">
          <div className="w-2 h-2 bg-emparo-orange rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-emparo-orange rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-emparo-orange rounded-full animate-bounce"></div>
        </div>
        
        {/* Loading message */}
        <p className="text-emparo-dark/70 text-lg">
          Firing up the grill...
        </p>
      </div>
    </div>
  );
}