"use client";

import { 
  Playfair_Display, 
  Raleway,
  Caveat 
} from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back Button Skeleton */}
        <div className="mb-8">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Product Summary Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Payment Instructions Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Accounts Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((account) => (
              <div
                key={account}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-9 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* After Payment Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          
          <div className="space-y-4">
            {/* Upload Receipt Skeleton */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse mx-auto mb-2"></div>
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mx-auto mt-4"></div>
            </div>

            {/* WhatsApp Button Skeleton */}
            <div className="w-full h-14 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="mt-6 text-center">
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>
      </div>
    </div>
  );
}