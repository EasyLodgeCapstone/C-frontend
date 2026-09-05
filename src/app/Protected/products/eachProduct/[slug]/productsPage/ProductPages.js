"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Playfair_Display,
  Dancing_Script,
  Raleway,
  Caveat,
} from "next/font/google";
import Loading from "../Comp/Loading";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Dummy facecare products with correct structure
const dummyProducts = [
  {
    _id: "1",
    productName: "Hydrating Face Cream",
    productDescription:
      "Deeply hydrating face cream for all skin types. Formulated with natural ingredients to provide deep, lasting moisture.",
    productPrice: 49.99,
    discountPrice: 29.99,
    productFeatures: "Hydrating, Anti-Aging, SPF 30, Non-Comedogenic",
    texture: "Cream",
    scent: "Light Floral",
    color: "White",
    packaging: "Jar",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
    ],
    thumbnailImage:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop",
    videoUrl: null,
    averageRating: 4.9,
    totalReviews: 128,
    stockQuantity: 45,
    isInStock: true,
    category: "Facecare",
    subCategory: "Moisturizers",
    slug: "hydrating-face-cream",
    emoji: "💧",
    badge: "Best Seller",
    shortDescription: "Intense hydration for glowing skin",
    ingredients: ["Aloe Vera", "Vitamin C", "Hyaluronic Acid", "Shea Butter"],
    howToUse: ["Apply to clean face", "Massage gently", "Use twice daily"],
  },
  {
    _id: "2",
    productName: "Vitamin C Serum",
    productDescription:
      "Brightening vitamin C serum for radiant skin. Formulated to brighten, even skin tone, and protect against environmental damage.",
    productPrice: 59.99,
    discountPrice: 49.99,
    productFeatures: "Brightening, Antioxidant Rich, Fights Aging, Even Tone",
    texture: "Serum",
    scent: "Citrus",
    color: "Light Orange",
    packaging: "Dropper Bottle",
    images: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
    ],
    thumbnailImage:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=400&fit=crop",
    videoUrl: null,
    averageRating: 4.8,
    totalReviews: 96,
    stockQuantity: 32,
    isInStock: true,
    category: "Facecare",
    subCategory: "Serums",
    slug: "vitamin-c-serum",
    emoji: "🍊",
    badge: "New Arrival",
    shortDescription: "Brighten and even skin tone",
    ingredients: ["Vitamin C", "Vitamin E", "Ferulic Acid", "Hyaluronic Acid"],
    howToUse: ["Apply 2-3 drops", "Massage into skin", "Use in the morning"],
  },
  {
    _id: "3",
    productName: "Anti-Aging Night Cream",
    productDescription:
      "Luxurious night cream for anti-aging benefits. Formulated with potent anti-aging ingredients that work while you sleep.",
    productPrice: 69.99,
    discountPrice: null,
    productFeatures: "Anti-Aging, Deep Hydration, Cell Renewal, Firms Skin",
    texture: "Rich Cream",
    scent: "Lavender",
    color: "White",
    packaging: "Jar",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
    ],
    thumbnailImage:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop",
    videoUrl: null,
    averageRating: 4.7,
    totalReviews: 85,
    stockQuantity: 28,
    isInStock: true,
    category: "Facecare",
    subCategory: "Moisturizers",
    slug: "anti-aging-night-cream",
    emoji: "🌙",
    badge: "Top Rated",
    shortDescription: "Rejuvenate skin while you sleep",
    ingredients: ["Retinol", "Peptides", "Hyaluronic Acid", "Niacinamide"],
    howToUse: ["Apply before bed", "Massage onto face", "Use nightly"],
  },
  {
    _id: "4",
    productName: "Gentle Face Wash",
    productDescription:
      "Gentle face wash for sensitive skin. A mild, soap-free cleanser that removes impurities while maintaining skin's natural balance.",
    productPrice: 29.99,
    discountPrice: 19.99,
    productFeatures: "Gentle, Hypoallergenic, Fragrance Free, Balances pH",
    texture: "Gel",
    scent: "Unscented",
    color: "Clear",
    packaging: "Pump Bottle",
    images: [
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
    ],
    thumbnailImage:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&h=400&fit=crop",
    videoUrl: null,
    averageRating: 4.6,
    totalReviews: 72,
    stockQuantity: 50,
    isInStock: true,
    category: "Facecare",
    subCategory: "Cleansers",
    slug: "gentle-face-wash",
    emoji: "🧼",
    badge: "Sensitive Skin",
    shortDescription: "Cleanse without stripping",
    ingredients: ["Chamomile", "Green Tea", "Aloe Vera", "Glycerin"],
    howToUse: ["Wet face", "Apply to skin", "Rinse thoroughly"],
  },
  {
    _id: "5",
    productName: "Exfoliating Scrub",
    productDescription:
      "Gentle exfoliating scrub for smooth skin. Natural ingredients help remove dead skin cells and reveal radiant skin.",
    productPrice: 39.99,
    discountPrice: null,
    productFeatures: "Exfoliating, Smooths Skin, Unclogs Pores, Natural",
    texture: "Scrub",
    scent: "Fresh",
    color: "Beige",
    packaging: "Tube",
    images: [
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
    ],
    thumbnailImage:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop",
    videoUrl: null,
    averageRating: 4.5,
    totalReviews: 64,
    stockQuantity: 35,
    isInStock: true,
    category: "Facecare",
    subCategory: "Exfoliators",
    slug: "exfoliating-scrub",
    emoji: "✨",
    badge: "Exfoliating",
    shortDescription: "Reveal radiant skin",
    ingredients: ["Sugar", "Coconut Oil", "Essential Oils", "Vitamin E"],
    howToUse: ["Apply to damp skin", "Massage gently", "Rinse off"],
  },
  {
    _id: "6",
    productName: "Eye Cream",
    productDescription:
      "Targeted eye cream for dark circles and puffiness. Formulated to brighten, firm, and hydrate the delicate eye area.",
    productPrice: 44.99,
    discountPrice: 34.99,
    productFeatures:
      "Reduces Dark Circles, Firms Skin, Hydrates, Anti-Puffiness",
    texture: "Gel",
    scent: "Unscented",
    color: "Clear",
    packaging: "Tube",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=400&fit=crop",
    ],
    thumbnailImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
    videoUrl: null,
    averageRating: 4.4,
    totalReviews: 58,
    stockQuantity: 40,
    isInStock: true,
    category: "Facecare",
    subCategory: "Eye Care",
    slug: "eye-cream",
    emoji: "👁️",
    badge: "Eye Care",
    shortDescription: "Brighten and firm eye area",
    ingredients: ["Caffeine", "Vitamin C", "Peptides", "Hyaluronic Acid"],
    howToUse: ["Apply around eyes", "Gently tap in", "Use morning and night"],
  },
];

export default function EachProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDummyData, setUseDummyData] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const category = params.slug ? decodeURIComponent(params.slug) : "";

  console.log(category);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [limit, setLimit] = useState(10);

  // useEffect(() => {
  //   if (!category) {
  //     router.push("/Protected/products");
  //   }
  // }, [category, router]);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch products with pagination
  const fetchProducts = async (page = 1, category) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/products/product/product?page=${page}&category=${category}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.log("API failed, using dummy data");
        // For dummy data, we'll simulate pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedDummy = dummyProducts.slice(startIndex, endIndex);
        setProducts(paginatedDummy);
        setTotalPages(Math.ceil(dummyProducts.length / limit));
        setTotalProducts(dummyProducts.length);
        setHasNext(endIndex < dummyProducts.length);
        setHasPrevious(page > 1);
        setUseDummyData(true);
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Handle different response structures
      let productsData = [];
      let paginationData = {};

      if (data.product && Array.isArray(data.product)) {
        productsData = data.product;
        paginationData = data.pagination || data;
      } else if (data.faceCare && Array.isArray(data.faceCare)) {
        productsData = data.faceCare;
        paginationData = data.pagination || data;
      } else if (Array.isArray(data)) {
        productsData = data;
        // If array, assume no pagination info from API
        setTotalPages(1);
        setTotalProducts(productsData.length);
        setHasNext(false);
        setHasPrevious(false);
      } else {
        productsData = [];
        paginationData = data;
      }

      // Set pagination data if available
      if (paginationData.totalPages !== undefined) {
        setTotalPages(paginationData.totalPages);
        setTotalProducts(paginationData.total);
        setHasNext(paginationData.hasNext || false);
        setHasPrevious(paginationData.hasPrevious || false);
        setCurrentPage(paginationData.page || page);
      } else {
        // If no pagination info, calculate based on data
        setTotalPages(Math.ceil(productsData.length / limit) || 1);
        setTotalProducts(productsData.length);
        setHasNext(false);
        setHasPrevious(page > 1);
      }

      if (productsData.length === 0) {
        // Use dummy data as fallback
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedDummy = dummyProducts.slice(startIndex, endIndex);
        setProducts(paginatedDummy);
        setTotalPages(Math.ceil(dummyProducts.length / limit));
        setTotalProducts(dummyProducts.length);
        setHasNext(endIndex < dummyProducts.length);
        setHasPrevious(page > 1);
        setUseDummyData(true);
      } else {
        setProducts(productsData);
        setUseDummyData(false);
      }
    } catch (err) {
      console.error("Error fetching facecare products:", err);
      // Fallback to dummy data with pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedDummy = dummyProducts.slice(startIndex, endIndex);
      setProducts(paginatedDummy);
      setTotalPages(Math.ceil(dummyProducts.length / limit));
      setTotalProducts(dummyProducts.length);
      setHasNext(endIndex < dummyProducts.length);
      setHasPrevious(page > 1);
      setUseDummyData(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and page change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(currentPage, category);
    }, 0);

    return () => clearTimeout(timer);
  }, [currentPage, category]);

  // Page change handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      // Scroll to top of products section
      document.getElementById("products-grid")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handlePrevPage = () => {
    if (hasPrevious) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }

      if (startPage > 2) {
        pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      router.push("/Auth/login");
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
          quantity: 1,
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

  const handleBuyNow = (product) => {
    router.push(`/Protected/products/product/${product._id}`);
  };

  if (loading || authLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error && !useDummyData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2
            className={`${playfair.className} text-2xl font-bold text-black mb-2`}
          >
            Failed to load products
          </h2>
          <p className={`${raleway.className} text-gray-600`}>{error}</p>
          <button
            onClick={() => fetchProducts(currentPage)}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center">
            <h1
              className={`${playfair.className} text-4xl md:text-6xl font-bold mb-4`}
            >
              {`${category} Collection`}
            </h1>
            <p
              className={`${caveat.className} text-xl md:text-2xl text-gray-300`}
            >
              {`Glow naturally with our premium ${category} products. `}
            </p>
            <div className="w-24 h-1 bg-white mx-auto mt-4"></div>
            {useDummyData && (
              <p className={`${raleway.className} text-xs text-gray-400 mt-4`}>
                (Showing sample products)
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div
        className="container mx-auto px-4 py-16 max-w-7xl"
        id="products-grid"
      >
        {/* Products count and page info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <p className={`${raleway.className} text-sm text-gray-500`}>
            Showing {products.length > 0 ? (currentPage - 1) * limit + 1 : 0} -{" "}
            {Math.min(currentPage * limit, totalProducts)} of {totalProducts}{" "}
            products
          </p>
          {totalPages > 1 && (
            <p className={`${raleway.className} text-sm text-gray-400`}>
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className={`${raleway.className} text-gray-500 text-lg`}>
              {`No ${category} products available at the moment.`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const hasDiscount =
                  product.discountPrice &&
                  product.discountPrice < product.productPrice;
                const currentPrice = hasDiscount
                  ? product.discountPrice
                  : product.productPrice;

                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer block border border-gray-100"
                  >
                    {/* Product Image - Clickable to product details */}
                    <Link
                      href={`/Protected/products/product/${product._id}`}
                      className="block"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={
                            product.images?.[0] ||
                            product.thumbnailImage ||
                            "/images/placeholder.jpg"
                          }
                          alt={product.productName}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {product.badge && (
                          <span className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {product.badge}
                          </span>
                        )}

                        {hasDiscount && (
                          <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Sale
                          </span>
                        )}

                        {product.emoji && (
                          <div className="absolute bottom-4 right-4 text-3xl opacity-80">
                            {product.emoji}
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-6">
                      <Link
                        href={`/Protected/products/product/${product._id}`}
                        className="block"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3
                              className={`${playfair.className} text-xl font-bold text-black hover:text-gray-700 transition-colors`}
                            >
                              {product.productName}
                            </h3>
                            <p
                              className={`${caveat.className} text-gray-500 text-sm`}
                            >
                              {product.category || `${category}`}
                            </p>
                          </div>
                          <div className="text-right">
                            {hasDiscount ? (
                              <>
                                <span
                                  className={`${playfair.className} text-xl font-bold text-red-600 block`}
                                >
                                  ${currentPrice.toFixed(2)}
                                </span>
                                <span
                                  className={`${raleway.className} text-sm text-gray-400 line-through block`}
                                >
                                  ${product.productPrice.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span
                                className={`${playfair.className} text-xl font-bold text-black`}
                              >
                                ${product.productPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        <p
                          className={`${raleway.className} text-gray-600 text-sm mb-4 line-clamp-2`}
                        >
                          {product.shortDescription ||
                            product.productDescription}
                        </p>

                        <div className="flex items-center gap-2 mb-4">
                          {product.averageRating && (
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span
                                className={`${raleway.className} text-sm font-medium text-gray-700 ml-1`}
                              >
                                {product.averageRating}
                              </span>
                            </div>
                          )}
                          {product.totalReviews && (
                            <>
                              <span className="text-gray-300">|</span>
                              <span
                                className={`${raleway.className} text-sm text-gray-500`}
                              >
                                {product.totalReviews} reviews
                              </span>
                            </>
                          )}
                        </div>
                      </Link>

                      {/* Buttons - Conditional Rendering based on Auth */}
                      <div className="flex gap-2">
                        {isAuthenticated ? (
                          <>
                            <Link
                              href={`/Protected/products/product/${product._id}`}
                              className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors text-center"
                            >
                              View Details
                            </Link>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              Add to Cart
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleBuyNow(product)}
                            className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                          >
                            Buy Now
                          </button>
                        )}
                      </div>

                      {/* Auth status indicator */}
                      {!isAuthenticated && (
                        <p
                          className={`${raleway.className} text-xs text-gray-400 mt-2 text-center`}
                        >
                          Sign in to add to cart
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={!hasPrevious}
                    className={`px-3 py-2 border border-gray-200 text-xs transition-colors rounded-lg ${
                      !hasPrevious
                        ? "opacity-50 cursor-not-allowed text-gray-400"
                        : "hover:bg-black hover:text-white hover:border-black text-gray-600"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
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

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-gray-400 text-sm"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm transition-colors rounded-lg min-w-[40px] ${
                          currentPage === page
                            ? "bg-black text-white"
                            : "border border-gray-200 text-gray-600 hover:bg-black hover:text-white hover:border-black"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={!hasNext}
                    className={`px-3 py-2 border border-gray-200 text-xs transition-colors rounded-lg ${
                      !hasNext
                        ? "opacity-50 cursor-not-allowed text-gray-400"
                        : "hover:bg-black hover:text-white hover:border-black text-gray-600"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
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
                </div>

                {/* Page Info with totals */}
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>
                    Showing {(currentPage - 1) * limit + 1} -{" "}
                    {Math.min(currentPage * limit, totalProducts)} of{" "}
                    {totalProducts} products
                  </span>
                  <span className="text-gray-300">|</span>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                {/* Quick jump to page */}
                <div className="flex items-center gap-2">
                  <span
                    className={`${raleway.className} text-xs text-gray-400`}
                  >
                    Go to page:
                  </span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        handlePageChange(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:border-black"
                  />
                  <span
                    className={`${raleway.className} text-xs text-gray-400`}
                  >
                    of {totalPages}
                  </span>
                </div>
              </div>
            )}

            {/* Show dummy data indicator */}
            {useDummyData && products.length > 0 && (
              <div className="text-center mt-8">
                <p className={`${raleway.className} text-xs text-gray-400`}>
                  💡 These are sample products. Connect your backend to see real
                  products.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
