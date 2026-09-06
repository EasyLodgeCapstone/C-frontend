// components/LoadingSpinner.jsx
'use client';

import Image from 'next/image';
import { Raleway } from 'next/font/google';

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500'],
});

export function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50/30 to-white">
      <div className="text-center">
        {/* Logo with Glow */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-rose-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl">
            <Image
              src="/logo/WhatsApp Image 2026-09-05 at 9.10.32 AM.jpeg"
              alt="B&B BodyCare"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Brand Name */}
        <h2 className="text-2xl font-light tracking-wider text-gray-800 mb-2">
          B&B BodyCare
        </h2>
        
        {/* Animated Dots */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 bg-black rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
        
        <p className={`${raleway.className} text-sm text-gray-400 mt-4`}>
          {message}
        </p>
      </div>
    </div>
  );
}