import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Phone, X } from "lucide-react";

export default function FloatingOrderButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMenu = () => {
    const element = document.getElementById("menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsExpanded(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isExpanded && (
        <div className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl p-4 min-w-[200px] animate-in slide-in-from-bottom-2">
          <div className="flex flex-col space-y-3">
            <Button
              onClick={scrollToMenu}
              className="bg-emparo-orange hover:bg-emparo-orange/90 text-white rounded-xl"
            >
              <ShoppingBag className="mr-2 w-4 h-4" />
              View Menu
            </Button>
            <Button
              asChild
              className="bg-emparo-dark hover:bg-emparo-dark/90 text-white rounded-xl"
            >
              <a href="tel:02034416940">
                <Phone className="mr-2 w-4 h-4" />
                Call Now
              </a>
            </Button>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`bg-emparo-orange hover:bg-emparo-orange/90 text-white w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isExpanded ? 'rotate-45' : ''
        }`}
      >
        {isExpanded ? <X className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6 animate-bounce" />}
      </Button>
    </div>
  );
}