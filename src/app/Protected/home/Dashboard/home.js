"use client";

import {
  Playfair_Display,
  Dancing_Script,
  Roboto,
  Oswald,
  Pacifico,
  Abril_Fatface,
  Caveat,
  Raleway,
  Merriweather,
  Bebas_Neue,
} from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Font initializations
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
});

const abril = Abril_Fatface({
  subsets: ["latin"],
  weight: ["400"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const categories = [
    { skinCare: "Skin Care" },
    { faceCare: "Face Care" },
    { weightManagement: "Weight Management" },
    { bodyEnhancement: "Body Enhancement" },
    { aphrodisiacs: "Aphrodisiacs" },
  ];

  const slides = [
    {
      id: 1,
      title: "Skincare",
      subtitle: "Glow naturally",
      description:
        "Discover our premium skincare collection with natural ingredients for radiant skin",
      emoji: "✨",
      overlay: "from-black/80 to-black/40",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop",
      link: `/Protected/products/eachProduct/${categories[0].skinCare}`,
    },
    {
      id: 2,
      title: "Facecare",
      subtitle: "Radiant complexion",
      description:
        "Expertly crafted facecare solutions for every skin type and concern",
      emoji: "🌟",
      overlay: "from-gray-900/80 to-gray-700/40",
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop",
      link: `/Protected/products/eachProduct/${categories[1].faceCare}`,
    },
    {
      id: 3,
      title: "Weight Loss & Gain",
      subtitle: "Transform through nutrition",
      description:
        "Healthy meal plans and natural food supplements for sustainable weight management and muscle growth",
      emoji: "🥗",
      overlay: "from-black/80 to-black/30",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
      link: `/Protected/products/eachProduct/${categories[2].weightManagement}`,
    },
    {
      id: 4,
      title: "Body Enhancement",
      subtitle: "Unlock your potential",
      description:
        "Premium body enhancement supplements for muscle growth, recovery, and peak performance",
      emoji: "💪",
      overlay: "from-black/85 to-black/40",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      link: `/Protected/products/eachProduct/${categories[3].bodyEnhancement}`,
    },
    {
      id: 5,
      title: "Aphrodisiacs",
      subtitle: "Ignite the passion",
      description:
        "Natural aphrodisiac blends to enhance intimacy, boost libido, and improve overall vitality",
      emoji: "❤️‍🔥",
      overlay: "from-black/85 to-black/30",
      image:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop",
      link: `/Protected/products/eachProduct/${categories[4].aphrodisiacs}`,
    },
  ];

  useEffect(() => {
    let timer;
    if (!isHovered) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleShopNow = (link) => {
    router.push(link);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section - Black/White Theme */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Logo */}
            <header className="relative">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  <Image
                    src="/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg"
                    alt="Logo"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl capitalize font-bold animate-pulse">
                    <span className={`${dancing.className} text-black`}>
                      B&B BodyCare
                    </span>
                  </h2>
                </div>
              </div>
            </header>

            {/* Tagline - Black & White */}
            <p className="text-lg md:text-xl mt-0 md:mt-4">
              <span
                className={`${caveat.className} text-white bg-black px-4 py-2 rounded-full shadow-lg`}
              >
                🌿 All-Natural Beauty Products
              </span>
            </p>
          </div>
        </div>

        {/* Slider Section - Black/White Theme */}
        <div
          className="relative w-full overflow-hidden rounded-2xl shadow-2xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Slides Container */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="min-w-full h-[400px] md:h-[450px] relative overflow-hidden"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Black/White Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`}
                  />
                </div>

                {/* Background Pattern - Subtle */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-white max-w-2xl h-full flex flex-col justify-center p-8 md:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-5xl md:text-6xl animate-bounce">
                      {slide.emoji}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30">
                      New Collection
                    </span>
                  </div>

                  <h2
                    className={`${playfair.className} text-4xl md:text-6xl font-bold mb-2 text-white`}
                  >
                    {slide.title}
                  </h2>

                  <p
                    className={`${dancing.className} text-2xl md:text-4xl mt-2 opacity-90 text-white`}
                  >
                    {slide.subtitle}
                  </p>

                  <p className="text-base md:text-lg mt-4 opacity-80 max-w-md text-white">
                    {slide.description}
                  </p>

                  <button
                    onClick={() => handleShopNow(slide.link)}
                    className="mt-6 px-8 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    Shop Now →
                  </button>
                </div>

                {/* Decorative Element */}
                <div className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 z-10 text-9xl opacity-10 transform rotate-12">
                  {slide.emoji}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons - Black/White */}
          <button
            onClick={prevSlide}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 z-20 border border-white/20"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all duration-300 hover:scale-110 z-20 border border-white/20"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots Indicator - Black/White */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 md:w-10 h-2.5 bg-white rounded-full shadow-lg"
                    : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Slide Counter - Black/White */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs md:text-sm font-medium z-20 border border-white/20">
            {String(currentSlide + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
            <div
              className="h-full bg-white transition-all duration-1000 ease-linear"
              style={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Bottom Section - Thumbnail Navigation with Black/White Theme */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                currentSlide === index
                  ? "ring-4 ring-black shadow-2xl"
                  : "ring-1 ring-gray-200"
              }`}
              onClick={() => setCurrentSlide(index)}
            >
              <div className="relative h-24 md:h-32">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-2xl">{slide.emoji}</div>
                    <h3
                      className={`${raleway.className} font-semibold text-sm md:text-base`}
                    >
                      {slide.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Product Categories Section */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-6 gap-4">
          {[
            { name: "Face Cream", icon: "🧴", color: "bg-black" },
            { name: "Serum", icon: "💧", color: "bg-gray-800" },
            { name: "Moisturizer", icon: "✨", color: "bg-gray-600" },
            { name: "Cleanser", icon: "🧼", color: "bg-black" },
            { name: "Body Enhancement", icon: "💪", color: "bg-gray-700" },
            { name: "Aphrodisiacs", icon: "❤️‍🔥", color: "bg-black" },
          ].map((item, index) => (
            <div
              key={index}
              className={`${item.color} text-white p-6 rounded-xl text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h4 className={`${raleway.className} font-semibold text-sm`}>
                {item.name}
              </h4>
            </div>
          ))}
        </div>

        {/* Featured Products Section */}
        <div className="mt-12">
          <h2
            className={`${playfair.className} text-3xl md:text-4xl text-black text-center mb-8`}
          >
            Featured Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Body Enhancement",
                description:
                  "Premium supplements for muscle growth and recovery",
                icon: "💪",
                bg: "bg-black",
              },
              {
                name: "Aphrodisiacs",
                description: "Natural blends to enhance intimacy and vitality",
                icon: "❤️‍🔥",
                bg: "bg-gray-800",
              },
              {
                name: "Weight Management",
                description: "Healthy solutions for weight loss and gain",
                icon: "🥗",
                bg: "bg-gray-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.bg} text-white p-8 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className={`${playfair.className} text-2xl font-bold mb-2`}>
                  {item.name}
                </h3>
                <p className={`${raleway.className} text-sm opacity-80`}>
                  {item.description}
                </p>
                <button className="mt-4 px-6 py-2 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 text-sm font-semibold">
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
