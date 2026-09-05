"use client";

import { 
  Playfair_Display, 
  Dancing_Script, 
  Raleway,
  Caveat 
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
  weight: ["400", "500", "600"], 
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2">
            <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-gray-300">/</span>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
            <span className="text-gray-300">/</span>
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Product Details Skeleton */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images Skeleton */}
          <div>
            {/* Main Image */}
            <div className="relative h-[500px] bg-gray-100 rounded-none animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-200/50 to-transparent" />
              <div className="absolute top-4 left-4 w-20 h-6 bg-gray-200 rounded"></div>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="relative h-20 bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Category */}
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
            
            {/* Title */}
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            
            {/* Subtitle */}
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            
            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Price */}
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className="h-6 w-16 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* How to Use */}
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200">
                <div className="px-4 py-2 h-10 w-10 bg-gray-200 animate-pulse"></div>
                <div className="w-12 h-10 bg-gray-200 animate-pulse"></div>
                <div className="px-4 py-2 h-10 w-10 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="flex-1 h-10 bg-gray-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}