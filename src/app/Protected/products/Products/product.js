"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Playfair_Display,
  Dancing_Script,
  Raleway,
  Caveat,
} from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Products() {
  const products = [
    {
      id: 1,
      name: "Skincare",
      slug: "Skin Care",
      subtitle: "Elevate your glow",
      description:
        "Curated skincare essentials featuring potent natural actives for refined, luminous skin",
      emoji: "✨",
      overlay: "from-black/70 to-black/20",
      image:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop",
      badge: "Bestseller",
      category: "Essentials",
    },
    {
      id: 2,
      name: "Facecare",
      slug: "Face Care",
      subtitle: "Radiance redefined",
      description:
        "Precision-formulated facecare for every skin narrative, backed by clinical excellence",
      emoji: "🌹",
      overlay: "from-gray-900/70 to-gray-700/30",
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop",
      badge: "New Collection",
      category: "Advanced Care",
    },
    {
      id: 3,
      name: "Weight Management",
      slug: "Weight Management",
      subtitle: "Nourish & transform",
      description:
        "Holistic nutrition and premium supplements designed for sustainable wellness and vitality",
      emoji: "🌿",
      overlay: "from-black/70 to-black/20",
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
      badge: "Wellness",
      category: "Nutrition",
    },
    {
      id: 4,
      name: "Body Enhancement",
      slug: "Body Enhancement",
      subtitle: "Unlock your potential",
      description:
        "Premium supplements for muscle growth, peak performance, and accelerated recovery",
      emoji: "💪",
      overlay: "from-black/80 to-black/30",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      badge: "Performance",
      category: "Fitness",
    },
    {
      id: 5,
      name: "Aphrodisiacs",
      slug: "Aphrodisiacs",
      subtitle: "Ignite the passion",
      description:
        "Natural aphrodisiac blends to enhance intimacy, boost libido, and improve overall vitality",
      emoji: "❤️‍🔥",
      overlay: "from-black/80 to-black/30",
      image:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=600&fit=crop",
      badge: "Intimacy",
      category: "Vitality",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Minimal & Sophisticated */}
      <div className="relative bg-black text-white py-20 md:py-28">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center">
            <span className={`${raleway.className} text-xs tracking-[0.3em] uppercase text-gray-400 mb-4 block`}>
              Curated Collection
            </span>
            <h1
              className={`${playfair.className} text-4xl md:text-6xl font-light tracking-wide mb-4`}
            >
              OUR PRODUCTS
            </h1>
            <div className="w-12 h-0.5 bg-white/60 mx-auto mb-4"></div>
            <p
              className={`${raleway.className} text-sm md:text-base font-light text-gray-400 tracking-wider`}
            >
              WHERE SCIENCE MEETS NATURE
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid - Sophisticated Minimal */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/Protected/products/eachProduct/${product.slug}`}
              className="group relative overflow-hidden rounded-none cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-[500px] overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${product.overlay}`}
                />
              </div>

              {/* Content - Overlaid with refined typography */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl opacity-80">{product.emoji}</span>
                  <span className={`${raleway.className} text-[10px] uppercase tracking-[0.2em] text-white/60`}>
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="ml-2 px-3 py-0.5 border border-white/20 text-[10px] uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                </div>

                <h2
                  className={`${playfair.className} text-3xl font-light tracking-wide mb-1`}
                >
                  {product.name}
                </h2>

                <p
                  className={`${raleway.className} text-sm font-light text-white/80 mb-3 tracking-wide`}
                >
                  {product.subtitle}
                </p>

                <p className="text-sm font-light text-white/60 max-w-xs tracking-wide hidden md:block">
                  {product.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-light tracking-wider border-b border-white/30 pb-1 hover:border-white transition-colors duration-300">
                  Discover
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category Highlights Section */}
        {/* <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className={`${playfair.className} text-3xl md:text-4xl font-light text-black`}>
              Featured Categories
            </h2>
            <div className="w-12 h-0.5 bg-black/20 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "Body Enhancement",
                description: "Premium supplements for muscle growth, recovery, and peak physical performance",
                icon: "💪",
                slug: "body-enhancement",
                bg: "bg-black",
              },
              {
                name: "Aphrodisiacs",
                description: "Natural blends to enhance intimacy, boost libido, and improve overall vitality",
                icon: "❤️‍🔥",
                slug: "aphrodisiacs",
                bg: "bg-gray-800",
              },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/Protected/products/${category.slug}`}
                className={`${category.bg} text-white p-10 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className={`${playfair.className} text-2xl md:text-3xl font-light mb-3`}>
                    {category.name}
                  </h3>
                  <p className={`${raleway.className} text-sm font-light text-white/70 max-w-md`}>
                    {category.description}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-light tracking-wider border-b border-white/30 pb-1 hover:border-white transition-colors duration-300">
                    Explore Collection
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div> */}

        {/* Bottom Section - Refined */}
        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-0.5 bg-black/20 mx-auto mb-6"></div>
            <p className={`${raleway.className} text-xs uppercase tracking-[0.3em] text-gray-400`}>
              Conscious Beauty. Sustainable Wellness.
            </p>
            <p className={`${raleway.className} text-sm font-light text-gray-400 mt-2 tracking-wide`}>
              Every product is crafted with integrity, for you and the planet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}