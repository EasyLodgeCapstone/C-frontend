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
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="relative bg-black text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center">
            <div className="h-12 md:h-16 w-64 md:w-96 bg-white/20 rounded-lg animate-pulse mx-auto mb-4"></div>
            <div className="h-8 w-48 md:w-64 bg-white/20 rounded-lg animate-pulse mx-auto"></div>
            <div className="w-24 h-1 bg-white/20 mx-auto mt-4 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="relative h-64 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-300/60 to-transparent" />
                <div className="absolute top-4 left-4 w-20 h-6 bg-gray-300 rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-10 h-10 bg-gray-300 rounded-full"></div>
              </div>

              {/* Content Skeleton */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>

                <div className="flex gap-2 pt-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}