import { useState } from "react";

const galleryImages = [
  {
    src: "/attached_assets/ChatGPT Image May 17, 2025, 05_58_52 PM_1750005342081.png",
    alt: "Emparo's signature grilled peri peri chicken strips with rice and fresh salad"
  },
  {
    src: "/attached_assets/ChatGPT Image May 19, 2025, 12_03_53 PM_1750005388240.png",
    alt: "Emparo's delicious peri peri chicken burger with crispy coating and fries"
  },
  {
    src: "/attached_assets/ChatGPT Image May 19, 2025, 12_29_07 PM_1750005388241.png",
    alt: "Emparo's glazed peri peri chicken wings with spiced rice and fresh salad"
  },
  {
    src: "/attached_assets/ChatGPT Image May 22, 2025, 06_51_58 PM_1750005388241.png",
    alt: "Emparo's crispy falafels in tortilla wrap with chips and sauces"
  },
  {
    src: "/attached_assets/ChatGPT Image May 22, 2025, 07_35_09 PM_1750005388242.png",
    alt: "Emparo's family feast - variety of burgers, grilled chicken and wraps"
  },
  {
    src: "/attached_assets/ChatGPT Image May 22, 2025, 07_44_19 PM_1750005388242.png",
    alt: "Emparo's crispy peri peri chicken wings with golden fries"
  },
  {
    src: "/attached_assets/ChatGPT Image May 22, 2025, 10_07_25 PM_1750005388243.png",
    alt: "Emparo's perfectly grilled quarter chicken pieces with fresh garnish"
  },
  {
    src: "/attached_assets/ChatGPT Image May 22, 2025, 10_36_30 PM_1750005451474.png",
    alt: "Emparo's golden fried chicken pieces - crispy and delicious"
  },
  {
    src: "/attached_assets/ChatGPT Image May 22, 2025, 10_32_14 PM_1750005451473.png",
    alt: "Emparo Peri Peri branded smoothie - refreshing and creamy"
  },
  {
    src: "/attached_assets/ChatGPT Image May 19, 2025, 12_34_06 PM_1750005435412.png",
    alt: "Emparo's golden fries with signature sauces"
  },
  {
    src: "/attached_assets/ChatGPT Image May 22, 2025, 09_20_56 PM_1750005435413.png",
    alt: "Emparo's glazed peri peri chicken wings - perfectly cooked"
  },
  {
    src: "/attached_assets/ChatGPT Image May 22, 2025, 10_24_05 PM_1750005435414.png",
    alt: "Emparo's crispy chicken nuggets - golden and crunchy"
  }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-16 bg-emparo-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-emparo-dark mb-4">
            Food <span className="text-emparo-orange">Gallery</span>
          </h2>
          <p className="text-xl text-gray-600">A visual feast of our delicious creations</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className="rounded-xl shadow-md hover:shadow-lg transition-shadow w-full h-48 object-cover cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage(image.src)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
