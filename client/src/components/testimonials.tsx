import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "J. Ahmed",
    rating: 5,
    review: "Best wings in Finsbury Park — the grilled ones are unreal! The peri peri sauce is perfectly spiced.",
    location: "Finsbury Park"
  },
  {
    name: "Sarah M.",
    rating: 5,
    review: "Amazing flame-grilled chicken! The quarter chicken with chips is my go-to meal. Always fresh and delicious.",
    location: "Holloway"
  },
  {
    name: "Marcus T.",
    rating: 5,
    review: "Authentic peri peri flavors. The staff are friendly and the food is consistently excellent. Highly recommend!",
    location: "Arsenal"
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-emparo-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-emparo-dark mb-4">
            What Our <span className="text-emparo-orange">Customers</span> Say
          </h2>
          <p className="text-xl text-emparo-dark max-w-2xl mx-auto font-semibold">
            Don't just take our word for it - hear from our happy customers!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-emparo-orange mb-3" />
                  <p className="text-emparo-dark text-base leading-relaxed">
                    "{testimonial.review}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-emparo-dark">{testimonial.name}</p>
                    <p className="text-emparo-dark/60 text-sm">{testimonial.location}</p>
                  </div>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emparo-yellow text-emparo-yellow" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}