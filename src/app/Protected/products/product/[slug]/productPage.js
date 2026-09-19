"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Playfair_Display,
  Dancing_Script,
  Raleway,
  Caveat,
} from "next/font/google";
import Loading from "./Comp/Loading";
import { useAuthGuard } from "../../../../../../Commponets/AuthGuard/AuthGuard";

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
  weight: ["400", "500", "600"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id || params.slug || params._id;
  
  const { user, isAuthenticated, loading: authLoading, isGuest } = useAuthGuard();
  
  const isLoggedIn = isAuthenticated && !isGuest;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonMessage, setComingSoonMessage] = useState("");

  const getDummyProducts = () => {
    return [
      {
        _id: "1",
        productName: "Gentle Hydrating Cleanser",
        productDescription:
          "A mild, soap-free cleanser that removes impurities while maintaining skin's natural moisture balance.",
        productPrice: 24.99,
        discountPrice: 19.99,
        productFeatures:
          "Deeply cleanses without stripping, pH-balanced, non-comedogenic, suitable for all skin types",
        texture: "Gel",
        scent: "Unscented",
        color: "Clear",
        packaging: "Pump Bottle",
        images: [
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop",
        ],
        thumbnailImage:
          "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop",
        videoUrl: "https://example.com/cleanser-demo.mp4",
        averageRating: 4.8,
        totalReviews: 245,
        stockQuantity: 150,
        isInStock: true,
        category: "Skin Care",
        subCategory: "Cleansers",
        slug: "gentle-hydrating-cleanser",
        emoji: "🧴",
        badge: "Best Seller",
        shortDescription: "Gentle, soap-free daily cleanser",
      },
      {
        _id: "2",
        productName: "Vitamin C Brightening Serum",
        productDescription:
          "Powerful antioxidant serum that brightens skin tone and reduces dark spots for a radiant complexion.",
        productPrice: 59.99,
        discountPrice: 49.99,
        productFeatures:
          "Brightens skin, reduces dark spots, antioxidant-rich, improves skin texture",
        texture: "Serum",
        scent: "Citrus",
        color: "Light Orange",
        packaging: "Dropper Bottle",
        images: [
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop",
        ],
        thumbnailImage:
          "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop",
        videoUrl: "https://example.com/serum-demo.mp4",
        averageRating: 4.7,
        totalReviews: 189,
        stockQuantity: 85,
        isInStock: true,
        category: "Skin Care",
        subCategory: "Serums",
        slug: "vitamin-c-brightening-serum",
        emoji: "🍊",
        badge: "New Arrival",
        shortDescription: "Brightening vitamin C serum",
      },
      {
        _id: "3",
        productName: "Retinol Night Cream",
        productDescription:
          "Advanced retinol formula that reduces fine lines and wrinkles while you sleep for younger-looking skin.",
        productPrice: 69.99,
        discountPrice: 59.99,
        productFeatures:
          "Reduces fine lines, improves elasticity, promotes cell renewal, hydrating",
        texture: "Cream",
        scent: "Light Floral",
        color: "White",
        packaging: "Jar",
        images: [
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop",
        ],
        thumbnailImage:
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop",
        videoUrl: "https://example.com/nightcream-demo.mp4",
        averageRating: 4.9,
        totalReviews: 312,
        stockQuantity: 60,
        isInStock: true,
        category: "Skin Care",
        subCategory: "Moisturizers",
        slug: "retinol-night-cream",
        emoji: "🌙",
        badge: "Top Rated",
        shortDescription: "Anti-aging retinol cream",
      },
    ];
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        const response = await fetch(
          `/api/products/product/eachProduct?id=${productId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProduct(data.product || data);
        } else {
          const dummyProducts = getDummyProducts();
          const foundProduct = dummyProducts.find(
            (p) => p._id === productId || p.slug === productId,
          );

          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            throw new Error("Product not found");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleComingSoon = (type) => {
    if (type === "login") {
      setComingSoonMessage("Login feature is coming soon! 🚀");
    } else {
      setComingSoonMessage("Sign up feature is coming soon! 🌟");
    }
    setShowComingSoon(true);
    setTimeout(() => {
      setShowComingSoon(false);
    }, 3000);
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 3000);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
        credentials: "include",
      });

      if (response.ok) {
        alert(`${product.productName} added to cart!`);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const handleBuyNow = () => {
    router.push(`/Protected/checkout?product=${product._id}`);
  };

  if (loading || authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2
            className={`${playfair.className} text-2xl font-light text-black dark:text-white mb-2`}
          >
            Product Not Found
          </h2>
          <p className={`${raleway.className} text-gray-500 dark:text-gray-400`}>
            The product you`re looking for doesn`t exist.
          </p>
          <Link
            href="/Protected/products"
            className="inline-block mt-6 px-8 py-3 bg-black dark:bg-white text-white dark:text-gray-900 text-xs uppercase tracking-wider hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.discountPrice || product.productPrice;
  const originalPrice = product.discountPrice ? product.productPrice : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 py-3 sm:py-4 overflow-x-auto transition-colors">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs uppercase tracking-wider whitespace-nowrap min-w-max">
            <Link
              href="/Protected/home"
              className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <Link
              href="/Protected/products"
              className="text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              Products
            </Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <button
              onClick={() => router.back()}
              className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 sm:gap-2 cursor-pointer"
            >
              <span className="truncate max-w-[60px] sm:max-w-none">
                {product?.category || "Products"}
              </span>
            </button>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-black dark:text-white truncate max-w-[80px] sm:max-w-none">
              {product?.productName || "Product"}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative h-[500px] overflow-hidden bg-gray-50 dark:bg-gray-800 transition-colors">
              <Image
                src={
                  product.images?.[selectedImage] ||
                  product.thumbnailImage ||
                  "/images/placeholder.jpg"
                }
                alt={product.productName}
                fill
                className="object-cover"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 border border-white/30 text-white text-[10px] uppercase tracking-wider px-3 py-1 bg-black/50">
                  {product.badge}
                </span>
              )}
              {product.discountPrice && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] uppercase tracking-wider px-3 py-1">
                  Sale
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 overflow-hidden border transition-all ${
                      selectedImage === index
                        ? "border-black dark:border-white"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.productName} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <p
                  className={`${raleway.className} text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500`}
                >
                  {product.category} / {product.subCategory}
                </p>
                {product.isInStock ? (
                  <span className="text-[10px] uppercase tracking-wider text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 px-2 py-0.5">
                    In Stock
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2 py-0.5">
                    Out of Stock
                  </span>
                )}
              </div>
              <h1
                className={`${playfair.className} text-3xl md:text-4xl font-light text-black dark:text-white mb-2`}
              >
                {product.productName}
              </h1>

              {product.averageRating && (
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span
                      className={`${raleway.className} text-sm font-light text-gray-700 dark:text-gray-300 ml-1`}
                    >
                      {product.averageRating}
                    </span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span
                    className={`${raleway.className} text-sm text-gray-500 dark:text-gray-400`}
                  >
                    {product.totalReviews} reviews
                  </span>
                  {product.stockQuantity && (
                    <>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <span
                        className={`${raleway.className} text-sm ${
                          product.stockQuantity > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {product.stockQuantity} units available
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span
                  className={`${playfair.className} text-3xl font-light text-black dark:text-white`}
                >
                  ₦{currentPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span
                    className={`${raleway.className} text-lg text-gray-400 dark:text-gray-500 line-through`}
                  >
                    ₦{originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.discountPrice && (
                <p
                  className={`${raleway.className} text-xs text-green-600 dark:text-green-400 mt-1`}
                >
                  Save ₦{(originalPrice - currentPrice).toFixed(2)}!
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3
                className={`${raleway.className} text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2`}
              >
                Description
              </h3>
              <p
                className={`${raleway.className} text-sm font-light text-gray-600 dark:text-gray-300 leading-relaxed`}
              >
                {product.productDescription}
              </p>
            </div>

            {/* Product Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.texture && (
                <div>
                  <h4
                    className={`${raleway.className} text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500`}
                  >
                    Texture
                  </h4>
                  <p className={`${raleway.className} text-sm text-gray-600 dark:text-gray-300`}>
                    {product.texture}
                  </p>
                </div>
              )}
              {product.scent && (
                <div>
                  <h4
                    className={`${raleway.className} text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500`}
                  >
                    Scent
                  </h4>
                  <p className={`${raleway.className} text-sm text-gray-600 dark:text-gray-300`}>
                    {product.scent}
                  </p>
                </div>
              )}
              {product.color && (
                <div>
                  <h4
                    className={`${raleway.className} text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500`}
                  >
                    Color
                  </h4>
                  <p className={`${raleway.className} text-sm text-gray-600 dark:text-gray-300`}>
                    {product.color}
                  </p>
                </div>
              )}
              {product.packaging && (
                <div>
                  <h4
                    className={`${raleway.className} text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500`}
                  >
                    Packaging
                  </h4>
                  <p className={`${raleway.className} text-sm text-gray-600 dark:text-gray-300`}>
                    {product.packaging}
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            {product.productFeatures && (
              <div className="mb-6">
                <h3
                  className={`${raleway.className} text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-2`}
                >
                  Key Features
                </h3>
                <ul className="space-y-1">
                  {product.productFeatures.split(",").map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-black dark:text-white text-xs">✓</span>
                      <span
                        className={`${raleway.className} text-sm font-light text-gray-600 dark:text-gray-300`}
                      >
                        {feature.trim()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Video Link */}
            {product.videoUrl && (
              <div className="mb-6">
                <a
                  href={product.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${raleway.className} text-xs uppercase tracking-wider text-black dark:text-white hover:underline transition-colors flex items-center gap-2`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Watch Product Video
                </a>
              </div>
            )}

            {/* Add to Cart / Buy Now */}
            <div className="flex items-center gap-4 mb-4">
              {isLoggedIn && product.isInStock && (
                <div className="flex items-center border border-gray-200 dark:border-gray-700 transition-colors">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span
                    className={`${raleway.className} w-12 text-center text-sm font-light text-black dark:text-white`}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(product.stockQuantity || 10, quantity + 1),
                      )
                    }
                    className="px-4 py-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              )}

              {isLoggedIn ? (
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isInStock}
                  className={`flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-gray-900 text-xs uppercase tracking-wider transition-colors ${
                    product.isInStock
                      ? "hover:bg-gray-800 dark:hover:bg-gray-200"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  {product.isInStock ? "Add to Cart" : "Out of Stock"}
                </button>
              ) : (
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-gray-900 text-xs uppercase tracking-wider hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Buy Now
                </button>
              )}
            </div>

            {/* Auth Status Messages */}
            {!isLoggedIn && (
              <div className="space-y-2">
                {isGuest && isAuthenticated ? (
                  <p
                    className={`${raleway.className} text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center`}
                  >
                    Sign in as a registered user to add to cart
                  </p>
                ) : (
                  <p
                    className={`${raleway.className} text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center`}
                  >
                    Sign in to add to cart
                  </p>
                )}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => handleComingSoon("login")}
                    className="text-xs text-black dark:text-white hover:underline transition-colors"
                  >
                    Login
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <button
                    onClick={() => handleComingSoon("signup")}
                    className="text-xs text-black dark:text-white hover:underline transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {/* Login Prompt Toast */}
            {showLoginPrompt && (
              <div className="fixed bottom-4 right-4 bg-black dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
                <p className={`${raleway.className} text-sm`}>
                  Please sign in to add items to your cart
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Popup */}
      {showComingSoon && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowComingSoon(false)}
          />

          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-scale-up transition-colors">
            <button
              onClick={() => setShowComingSoon(false)}
              className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce">🚀</div>
              <h3
                className={`${playfair.className} text-3xl font-light text-black dark:text-white mb-2`}
              >
                Coming Soon!
              </h3>
              <p className={`${raleway.className} text-gray-600 dark:text-gray-300 text-lg mb-4`}>
                {comingSoonMessage}
              </p>
              <p className={`${caveat.className} text-gray-400 dark:text-gray-500 text-sm`}>
                We`re working hard to bring you this feature ✨
              </p>
              <div className="w-16 h-0.5 bg-black dark:bg-white mx-auto mt-4" />
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}